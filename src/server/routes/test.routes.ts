import { Router } from 'express';
import { prisma } from '../utils/prisma.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import type { Request, Response } from 'express';

const router = Router();

router.get('/templates', async (_req, res) => {
  const templates = await prisma.template.findMany({
    include: {
      _count: { select: { questions: true } },
    },
  });
  res.json({
    success: true,
    data: templates.map((t) => ({
      ...t,
      questionCount: t._count.questions,
    })),
  });
});

router.get('/templates/:id/questions', async (req, res) => {
  const templateQuestions = await prisma.templateQuestion.findMany({
    where: { templateId: req.params.id },
    orderBy: { order: 'asc' },
    include: { question: true },
  });

  const questions = templateQuestions.map((tq) => ({
    ...tq.question,
    options: JSON.parse(tq.question.options),
  }));

  res.json({ success: true, data: questions });
});

router.post('/submit', authMiddleware, async (req: Request, res: Response) => {
  const { templateId, answers } = req.body;
  if (!templateId || !Array.isArray(answers)) {
    res.status(400).json({ success: false, error: '参数错误' });
    return;
  }

  const templateQuestions = await prisma.templateQuestion.findMany({
    where: { templateId },
    include: { question: true },
  });

  const questionMap = new Map(
    templateQuestions.map((tq) => [tq.question.id, JSON.parse(tq.question.options) as Array<{ scores: Record<string, number> }>])
  );

  const scores: Record<string, number> = {};
  answers.forEach((a: { questionId: string; optionIndex: number }) => {
    const opts = questionMap.get(a.questionId);
    if (opts && opts[a.optionIndex]) {
      Object.entries(opts[a.optionIndex].scores).forEach(([pid, val]) => {
        scores[pid] = (scores[pid] || 0) + (val as number);
      });
    }
  });

  const personalityId = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0];
  if (!personalityId) {
    res.status(400).json({ success: false, error: '无法计算结果' });
    return;
  }

  const result = await prisma.testResult.create({
    data: {
      userId: req.user!.id,
      templateId,
      personalityId,
      scores: JSON.stringify(scores),
      answers: JSON.stringify(answers),
    },
    include: { personality: true, template: true },
  });

  res.json({
    success: true,
    data: {
      ...result,
      scores,
      answers,
      personality: result.personality
        ? {
            ...result.personality,
            traits: JSON.parse(result.personality.traits),
          }
        : null,
    },
  });
});

router.get('/results/:id', authMiddleware, async (req, res) => {
  const result = await prisma.testResult.findUnique({
    where: { id: req.params.id },
    include: { personality: true, template: true },
  });

  if (!result) {
    res.status(404).json({ success: false, error: '结果不存在' });
    return;
  }

  if (result.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
    res.status(403).json({ success: false, error: '无权访问' });
    return;
  }

  res.json({
    success: true,
    data: {
      ...result,
      scores: JSON.parse(result.scores),
      answers: JSON.parse(result.answers),
      personality: result.personality
        ? {
            ...result.personality,
            traits: JSON.parse(result.personality.traits),
          }
        : null,
    },
  });
});

export default router;

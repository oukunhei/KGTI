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

  // 固定抽取全部题目，仅打乱顺序
  const shuffled = templateQuestions.sort(() => Math.random() - 0.5);

  const questions = shuffled.map((tq) => ({
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

  // 累加维度分数
  const dimScores: Record<string, number> = {};
  answers.forEach((a: { questionId: string; optionIndex: number }) => {
    const opts = questionMap.get(a.questionId);
    if (opts && opts[a.optionIndex]) {
      Object.entries(opts[a.optionIndex].scores).forEach(([dim, val]) => {
        dimScores[dim] = (dimScores[dim] || 0) + (val as number);
      });
    }
  });

  // 判定每个维度的倾向
  const getDim = (left: string, right: string) =>
    (dimScores[left] || 0) >= (dimScores[right] || 0) ? left : right;

  const ei = getDim('E', 'I');
  const sn = getDim('S', 'N');
  const jp = getDim('J', 'P');
  const ah = getDim('A', 'H');
  const personalityId = ei + sn + jp + ah;

  // 查询人格是否存在
  const personality = await prisma.personality.findUnique({
    where: { id: personalityId },
  });

  if (!personality) {
    res.status(400).json({ success: false, error: '无法计算结果' });
    return;
  }

  const result = await prisma.testResult.create({
    data: {
      userId: req.user!.id,
      templateId,
      personalityId,
      scores: JSON.stringify(dimScores),
      answers: JSON.stringify(answers),
    },
    include: { personality: true, template: true },
  });

  res.json({
    success: true,
    data: {
      ...result,
      scores: dimScores,
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
            pixelArt: result.personality.pixelArt ? JSON.parse(result.personality.pixelArt) : null,
          }
        : null,
    },
  });
});

// 查询当前用户的测试历史
router.get('/history', authMiddleware, async (req, res) => {
  const results = await prisma.testResult.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
    include: { personality: true, template: true },
  });

  res.json({
    success: true,
    data: results.map((r) => ({
      ...r,
      scores: JSON.parse(r.scores),
      answers: JSON.parse(r.answers),
      personality: r.personality
        ? {
            ...r.personality,
            traits: JSON.parse(r.personality.traits),
            pixelArt: r.personality.pixelArt ? JSON.parse(r.personality.pixelArt) : null,
          }
        : null,
    })),
  });
});

export default router;

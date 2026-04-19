import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create default admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: '平台管理员',
      role: 'ADMIN',
    },
  });
  console.log('Admin:', admin.email);

  // Create default creator
  const creatorPassword = await bcrypt.hash('creator123', 10);
  const creator = await prisma.user.upsert({
    where: { email: 'creator@example.com' },
    update: {},
    create: {
      email: 'creator@example.com',
      password: creatorPassword,
      name: '内容运营者',
      role: 'CREATOR',
    },
  });
  console.log('Creator:', creator.email);

  // Create sample personalities
  const personalities = await Promise.all([
    prisma.personality.upsert({
      where: { id: 'p1' },
      update: {},
      create: {
        id: 'p1',
        name: '冒险家',
        title: '无畏的探索者',
        description: '你充满好奇心和探索欲，喜欢尝试新事物，不惧挑战。在团队中，你常常是那个率先迈出第一步的人。你渴望自由，讨厌被规则束缚，总是追随内心的声音去冒险。',
        traits: JSON.stringify([
          { name: '好奇心', value: 92 },
          { name: '勇气', value: 88 },
          { name: '创造力', value: 75 },
          { name: '独立性', value: 85 },
        ]),
        icon: '🏔️',
        color: '#f59e0b',
        status: 'APPROVED',
      },
    }),
    prisma.personality.upsert({
      where: { id: 'p2' },
      update: {},
      create: {
        id: 'p2',
        name: '治愈者',
        title: '温暖的守护者',
        description: '你拥有敏锐的同理心和温柔的力量，善于倾听和关怀他人。在朋友眼中，你是那个永远可以依靠的港湾。你的存在让周围的人都感到安心和温暖。',
        traits: JSON.stringify([
          { name: '同理心', value: 95 },
          { name: '耐心', value: 88 },
          { name: '包容', value: 90 },
          { name: '洞察力', value: 78 },
        ]),
        icon: '🌸',
        color: '#ec4899',
        status: 'APPROVED',
      },
    }),
    prisma.personality.upsert({
      where: { id: 'p3' },
      update: {},
      create: {
        id: 'p3',
        name: '智囊',
        title: '冷静的谋略家',
        description: '你逻辑清晰、思维缜密，擅长分析复杂问题并找到最优解。在团队中，你是那个在关键时刻提出关键建议的人。你追求知识和真理，享受思考的乐趣。',
        traits: JSON.stringify([
          { name: '逻辑思维', value: 94 },
          { name: '专注力', value: 87 },
          { name: '求知欲', value: 90 },
          { name: '冷静', value: 82 },
        ]),
        icon: '📚',
        color: '#3b82f6',
        status: 'APPROVED',
      },
    }),
    prisma.personality.upsert({
      where: { id: 'p4' },
      update: {},
      create: {
        id: 'p4',
        name: '社交家',
        title: '人群中的光芒',
        description: '你天生具有感染力和领导力，善于连接不同的人，让团队充满活力。在任何场合你都能迅速成为焦点，用你的热情和幽默带动气氛。',
        traits: JSON.stringify([
          { name: '领导力', value: 88 },
          { name: '感染力', value: 92 },
          { name: '沟通力', value: 90 },
          { name: '活力', value: 85 },
        ]),
        icon: '🔥',
        color: '#ef4444',
        status: 'APPROVED',
      },
    }),
    prisma.personality.upsert({
      where: { id: 'p5' },
      update: {},
      create: {
        id: 'p5',
        name: '艺术家',
        title: '灵感的追随者',
        description: '你拥有独特的审美和丰富的想象力，善于用创意表达内心世界。你对美的事物有敏锐的感知，常常能从平凡中发现不平凡。',
        traits: JSON.stringify([
          { name: '想象力', value: 95 },
          { name: '审美', value: 90 },
          { name: '敏感', value: 82 },
          { name: '独创性', value: 88 },
        ]),
        icon: '🎨',
        color: '#8b5cf6',
        status: 'APPROVED',
      },
    }),
    prisma.personality.upsert({
      where: { id: 'p6' },
      update: {},
      create: {
        id: 'p6',
        name: '实干家',
        title: '可靠的执行者',
        description: '你脚踏实地、执行力强，一旦确定目标就会坚定不移地前进。你相信行动胜于言语，用实际成果证明自己。在团队中，你是那个让计划落地的人。',
        traits: JSON.stringify([
          { name: '执行力', value: 94 },
          { name: '责任心', value: 92 },
          { name: '坚韧', value: 88 },
          { name: '务实', value: 85 },
        ]),
        icon: '⚙️',
        color: '#10b981',
        status: 'APPROVED',
      },
    }),
  ]);
  console.log(`Created ${personalities.length} personalities`);

  // Create sample questions
  const questionsData = [
    {
      id: 'q1',
      content: '当朋友邀请你参加一个从未尝试过的活动时，你的第一反应是？',
      options: [
        { label: 'A', text: '立刻答应，太有趣了！', scores: { p1: 3, p4: 2 } },
        { label: 'B', text: '先了解一下再决定', scores: { p3: 3, p6: 2 } },
        { label: 'C', text: '委婉拒绝，有点不确定', scores: { p2: 2, p5: 1 } },
        { label: 'D', text: '推荐另一个自己熟悉的计划', scores: { p6: 3, p3: 1 } },
      ],
    },
    {
      id: 'q2',
      content: '在团队合作中，你通常扮演什么角色？',
      options: [
        { label: 'A', text: '发起者和领导者', scores: { p4: 3, p1: 2 } },
        { label: 'B', text: '策划者和分析者', scores: { p3: 3, p6: 2 } },
        { label: 'C', text: '协调者和倾听者', scores: { p2: 3, p5: 1 } },
        { label: 'D', text: '执行者和落实者', scores: { p6: 3, p4: 1 } },
      ],
    },
    {
      id: 'q3',
      content: '周末空闲时，你更倾向于怎样度过？',
      options: [
        { label: 'A', text: '去探索新的地方或尝试新事物', scores: { p1: 3, p5: 2 } },
        { label: 'B', text: '安静地看书或学习新技能', scores: { p3: 3, p5: 2 } },
        { label: 'C', text: '和朋友聚会聊天', scores: { p4: 3, p2: 2 } },
        { label: 'D', text: '整理房间或完成待办事项', scores: { p6: 3, p3: 1 } },
      ],
    },
    {
      id: 'q4',
      content: '面对他人的情绪波动，你的反应通常是？',
      options: [
        { label: 'A', text: '感同身受，主动安慰对方', scores: { p2: 3, p5: 2 } },
        { label: 'B', text: '分析原因，提供解决方案', scores: { p3: 3, p6: 2 } },
        { label: 'C', text: '讲个笑话，转移注意力', scores: { p4: 3, p1: 1 } },
        { label: 'D', text: '给予空间，等对方平复', scores: { p5: 2, p3: 2 } },
      ],
    },
    {
      id: 'q5',
      content: '你更喜欢哪种学习环境？',
      options: [
        { label: 'A', text: '充满讨论和互动的活跃氛围', scores: { p4: 3, p1: 2 } },
        { label: 'B', text: '安静独立，可以专注思考', scores: { p3: 3, p5: 2 } },
        { label: 'C', text: '小组合作，互相帮助', scores: { p2: 3, p4: 2 } },
        { label: 'D', text: '有明确任务清单和目标', scores: { p6: 3, p3: 2 } },
      ],
    },
    {
      id: 'q6',
      content: '遇到困难时，你的第一反应是？',
      options: [
        { label: 'A', text: '把它当作挑战，迎难而上', scores: { p1: 3, p6: 2 } },
        { label: 'B', text: '冷静分析，寻找最佳方案', scores: { p3: 3, p6: 2 } },
        { label: 'C', text: '向信任的人寻求支持和建议', scores: { p2: 3, p4: 1 } },
        { label: 'D', text: '换个角度，也许有新灵感', scores: { p5: 3, p1: 1 } },
      ],
    },
    {
      id: 'q7',
      content: '你如何看待规则和惯例？',
      options: [
        { label: 'A', text: '规则是用来打破的', scores: { p1: 3, p5: 2 } },
        { label: 'B', text: '理解规则背后的逻辑很重要', scores: { p3: 3, p6: 1 } },
        { label: 'C', text: '规则能保障每个人的感受', scores: { p2: 3, p6: 2 } },
        { label: 'D', text: '规则让事情更高效有序', scores: { p6: 3, p3: 2 } },
      ],
    },
    {
      id: 'q8',
      content: '你最喜欢的赞美方式是？',
      options: [
        { label: 'A', text: '你真有勇气和魄力！', scores: { p1: 3, p4: 2 } },
        { label: 'B', text: '你的想法真有创意！', scores: { p5: 3, p1: 2 } },
        { label: 'C', text: '和你相处感觉很舒服', scores: { p2: 3, p4: 2 } },
        { label: 'D', text: '你做事真靠谱！', scores: { p6: 3, p3: 2 } },
      ],
    },
    {
      id: 'q9',
      content: '描述一下你理想的房间布置？',
      options: [
        { label: 'A', text: '充满旅行纪念品和独特收藏', scores: { p1: 3, p5: 2 } },
        { label: 'B', text: '简洁有序，每样东西都有固定位置', scores: { p6: 3, p3: 2 } },
        { label: 'C', text: '温馨舒适，适合和朋友聊天', scores: { p2: 3, p4: 2 } },
        { label: 'D', text: '有书架、白板，充满学习氛围', scores: { p3: 3, p5: 1 } },
      ],
    },
    {
      id: 'q10',
      content: '在集体活动中，你通常会？',
      options: [
        { label: 'A', text: '积极组织，带动气氛', scores: { p4: 3, p1: 2 } },
        { label: 'B', text: '观察全局，默默配合', scores: { p3: 2, p6: 3 } },
        { label: 'C', text: '关心每个人的感受', scores: { p2: 3, p4: 1 } },
        { label: 'D', text: '提出新颖有趣的点子', scores: { p5: 3, p1: 2 } },
      ],
    },
  ];

  const questions = await Promise.all(
    questionsData.map((q) =>
      prisma.question.upsert({
        where: { id: q.id },
        update: {},
        create: {
          id: q.id,
          content: q.content,
          options: JSON.stringify(q.options),
          status: 'APPROVED',
        },
      })
    )
  );
  console.log(`Created ${questions.length} questions`);

  // Create default template
  const template = await prisma.template.upsert({
    where: { id: 't1' },
    update: {},
    create: {
      id: 't1',
      name: '校园人格大测试',
      description: '通过10道趣味题目，发现你隐藏的人格特质',
      isDefault: true,
    },
  });
  console.log('Template:', template.name);

  // Link questions to template
  await prisma.templateQuestion.deleteMany({ where: { templateId: 't1' } });
  await prisma.templateQuestion.createMany({
    data: questions.map((q, i) => ({
      templateId: 't1',
      questionId: q.id,
      order: i + 1,
    })),
  });
  console.log('Linked questions to template');

  console.log('\n✅ Seed completed!');
  console.log('Login credentials:');
  console.log('  Admin: admin@example.com / admin123');
  console.log('  Creator: creator@example.com / creator123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

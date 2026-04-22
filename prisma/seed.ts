import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

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

  // ─────────────────────────────────────────────
  // 从 JSON 文件读取人格与题库数据
  // 你可以直接编辑 data/personalities.json 和 data/questions.json
  // ─────────────────────────────────────────────

  const personalitiesData = JSON.parse(
    fs.readFileSync(path.join(rootDir, 'data/personalities.json'), 'utf-8')
  ).personalities as Array<{
    id: string;
    name: string;
    title: string;
    description: string;
    traits: Array<{ name: string; value: number }>;
    icon: string;
    color: string;
    pixelArt?: string[];
  }>;

  const questionsData = JSON.parse(
    fs.readFileSync(path.join(rootDir, 'data/questions.json'), 'utf-8')
  ).questions as Array<{
    id: string;
    content: string;
    category: string;
    options: Array<{ label: string; text: string; scores: Record<string, number> }>;
  }>;

  const personalities = await Promise.all(
    personalitiesData.map((p) =>
      prisma.personality.upsert({
        where: { id: p.id },
        update: {
          name: p.name,
          title: p.title,
          description: p.description,
          traits: JSON.stringify(p.traits),
          icon: p.icon,
          color: p.color,
          pixelArt: p.pixelArt ? JSON.stringify(p.pixelArt) : null,
          status: 'APPROVED',
        },
        create: {
          id: p.id,
          name: p.name,
          title: p.title,
          description: p.description,
          traits: JSON.stringify(p.traits),
          icon: p.icon,
          color: p.color,
          pixelArt: p.pixelArt ? JSON.stringify(p.pixelArt) : null,
          status: 'APPROVED',
        },
      })
    )
  );
  console.log(`Created ${personalities.length} personalities`);

  // Clear old data
  await prisma.question.deleteMany({});
  await prisma.personality.deleteMany({
    where: { id: { notIn: personalitiesData.map((p) => p.id) } },
  });

  const questions = await Promise.all(
    questionsData.map((q) =>
      prisma.question.create({
        data: {
          id: q.id,
          content: q.content,
          options: JSON.stringify(q.options),
          category: q.category,
          status: 'APPROVED',
        },
      })
    )
  );
  console.log(`Created ${questions.length} questions`);

  // Create default template
  const template = await prisma.template.upsert({
    where: { id: 't1' },
    update: {
      name: '超级AI大学人格测试',
      description: '31道校园情境题，测出你的4维人格光谱',
      isDefault: true,
    },
    create: {
      id: 't1',
      name: '超级AI大学人格测试',
      description: '31道校园情境题，测出你的4维人格光谱',
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

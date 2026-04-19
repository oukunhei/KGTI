import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Brain, BookOpen, Users, ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { Template } from '@shared/types';

export default function HomePage() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    api.get<Template[]>('/test/templates').then(setTemplates).catch(() => {});
  }, []);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-purple-50 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur px-4 py-1.5 rounded-full text-sm text-primary-700 mb-6 border border-primary-100">
            <Sparkles className="w-4 h-4" />
            校园人气最高的人格测试平台
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">
            发现<span className="text-primary-600">真实</span>的自己
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            通过科学的趣味测试，探索你的人格特质，解锁属于你的独特标签。
            已有数千名同学完成了测试！
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {templates[0] ? (
              <Link
                to={`/test/${templates[0].id}`}
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3.5 rounded-full text-lg font-medium hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300"
              >
                开始测试 <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <div className="inline-flex items-center gap-2 bg-gray-200 text-gray-400 px-8 py-3.5 rounded-full text-lg font-medium cursor-not-allowed">
                题库准备中...
              </div>
            )}
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 bg-white text-gray-700 px-8 py-3.5 rounded-full text-lg font-medium border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              浏览图鉴 <BookOpen className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-gray-50">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">科学有趣</h3>
              <p className="text-sm text-gray-500">精心设计的题目体系，兼具趣味性与科学性</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gray-50">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">多元人格</h3>
              <p className="text-sm text-gray-500">丰富的人格类型库，每个人都能找到专属标签</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gray-50">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">持续更新</h3>
              <p className="text-sm text-gray-500">内容运营者不断创作新题目与新的人格类型</p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates */}
      {templates.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">热门测试</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((t) => (
                <Link
                  key={t.id}
                  to={`/test/${t.id}`}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-primary-200 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 group-hover:bg-primary-100 transition-colors">
                      <Brain className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-gray-400">{t.questionCount || 0} 题</span>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">{t.name}</h3>
                  <p className="text-sm text-gray-500">{t.description || '探索你的人格特质'}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import PersonalityCard from '../components/result/PersonalityCard';
import type { TestResult } from '@shared/types';
import { ArrowLeft, Share2, RotateCcw } from 'lucide-react';

export default function ResultPage() {
  const { resultId } = useParams<{ resultId: string }>();
  const { user } = useAuth();
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!resultId) return;
    api
      .get<TestResult>(`/test/results/${resultId}`)
      .then((res) => {
        setResult(res);
        setLoading(false);
      })
      .catch((err: unknown) => {
        setError((err as Error).message || '加载结果失败');
        setLoading(false);
      });
  }, [resultId]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">分析结果中...</p>
        </div>
      </div>
    );
  }

  if (error || !result?.personality) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || '结果不存在'}</p>
          <Link to="/" className="text-primary-600 hover:underline">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const personality = result.personality;
  const sortedScores = Object.entries(result.scores || {}).sort((a, b) => b[1] - a[1]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-primary-50 via-white to-purple-50 py-8 md:py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <PersonalityCard personality={personality} />

        {/* Score Breakdown */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4">维度得分</h3>
          <div className="space-y-3">
            {sortedScores.map(([pid, score]) => (
              <div key={pid} className="flex items-center gap-3">
                <div className="w-20 text-xs text-gray-500 truncate">
                  {pid === personality.id ? personality.name : '其他'}
                </div>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((score as number) * 5, 100)}%`,
                      backgroundColor: pid === personality.id ? personality.color : '#cbd5e1',
                    }}
                  />
                </div>
                <div className="w-8 text-right text-xs font-medium text-gray-600">{score as number}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> 返回首页
          </Link>
          <Link
            to="/gallery"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors font-medium"
          >
            <Share2 className="w-4 h-4" /> 浏览图鉴
          </Link>
          {user && (
            <Link
              to={`/test/${result.templateId}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors font-medium"
            >
              <RotateCcw className="w-4 h-4" /> 再测一次
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

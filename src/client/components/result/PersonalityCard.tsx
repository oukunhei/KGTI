import type { Personality } from '@shared/types';
import { Sparkles } from 'lucide-react';

interface PersonalityCardProps {
  personality: Personality;
  compact?: boolean;
}

export default function PersonalityCard({ personality, compact }: PersonalityCardProps) {
  if (compact) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
          style={{ backgroundColor: `${personality.color}15` }}
        >
          <span className="text-2xl">{personality.icon}</span>
        </div>
        <h3 className="font-bold text-gray-800 text-sm">{personality.name}</h3>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{personality.title}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div
          className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center mb-6 animate-pulse-slow"
          style={{ backgroundColor: `${personality.color}20` }}
        >
          <span className="text-5xl md:text-6xl">{personality.icon}</span>
        </div>
        <div className="inline-flex items-center gap-1.5 text-sm text-gray-500 mb-2">
          <Sparkles className="w-4 h-4" />
          你的人格类型
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{personality.name}</h1>
        <p className="text-lg text-gray-500 mb-6">{personality.title}</p>
        <div
          className="w-full h-1 rounded-full mb-6"
          style={{ backgroundColor: `${personality.color}30` }}
        >
          <div className="h-full rounded-full" style={{ width: '60%', backgroundColor: personality.color }} />
        </div>
        <p className="text-gray-600 leading-relaxed max-w-lg">{personality.description}</p>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3">
        {personality.traits.map((trait) => (
          <div key={trait.name} className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-xs text-gray-400 mb-1">{trait.name}</div>
            <div className="text-lg font-bold" style={{ color: personality.color }}>
              {trait.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

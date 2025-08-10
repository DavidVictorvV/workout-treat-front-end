import React, { useState } from 'react';
import Button from '@/components/Button';

interface FitnessLevelSelectorProps {
  onComplete: (fitnessLevel: number) => void;
  onSkip?: () => void;
}

const FitnessLevelSelector: React.FC<FitnessLevelSelectorProps> = ({ 
  onComplete, 
  onSkip 
}) => {
  const [selectedLevel, setSelectedLevel] = useState<number>(1);

  const fitnessLevels = [
    { level: 1, title: "Beginner", description: "New to fitness, prefer easy exercises" },
    { level: 2, title: "Light Activity", description: "Occasional walks or light activity" },
    { level: 3, title: "Getting Started", description: "Some exercise, building consistency" },
    { level: 4, title: "Regular Beginner", description: "Exercise 1-2 times per week" },
    { level: 5, title: "Intermediate", description: "Exercise 3+ times per week" },
    { level: 6, title: "Active", description: "Regular workouts, comfortable with challenges" },
    { level: 7, title: "Fit", description: "Strong fitness base, enjoy harder workouts" },
    { level: 8, title: "Very Fit", description: "High fitness level, seek difficult challenges" },
    { level: 9, title: "Athletic", description: "Excellent fitness, competitive level" },
    { level: 10, title: "Elite", description: "Peak fitness, elite athlete level" }
  ];

  const handleSubmit = () => {
    onComplete(selectedLevel);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          What's your current fitness level?
        </h2>
        <p className="text-slate-400">
          This helps us customize your workouts and point rewards
        </p>
      </div>

      <div className="grid gap-3 mb-6 max-h-80 overflow-y-auto">
        {fitnessLevels.map((item) => (
          <button
            key={item.level}
            onClick={() => setSelectedLevel(item.level)}
            className={`p-4 rounded-lg border text-left transition-all ${
              selectedLevel === item.level
                ? 'border-amber-500 bg-amber-500/10 shadow-lg'
                : 'border-slate-600 bg-slate-700/30 hover:border-slate-500 hover:bg-slate-700/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    selectedLevel === item.level
                      ? 'bg-amber-500 text-black'
                      : 'bg-slate-600 text-slate-300'
                  }`}>
                    {item.level}
                  </span>
                  <h3 className="text-white font-medium">{item.title}</h3>
                </div>
                <p className="text-slate-400 text-sm mt-1">{item.description}</p>
              </div>
              {selectedLevel === item.level && (
                <div className="text-amber-500">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        {onSkip && (
          <Button
            onClick={onSkip}
            variant="secondary"
            size="lg"
            className="flex-1"
          >
            Skip for now
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          variant="primary"
          size="lg"
          className="flex-1"
        >
          Continue with Level {selectedLevel}
        </Button>
      </div>

      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div className="text-blue-400 text-sm">
          <strong>Don't worry!</strong> You can change this anytime in your profile settings.
          This affects your starting workout difficulty and point rewards.
        </div>
      </div>
    </div>
  );
};

export default FitnessLevelSelector;
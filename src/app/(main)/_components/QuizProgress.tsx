'use client';

interface QuizProgressProps {
  currentIndex: number;
  totalQuestions: number;
}

export const QuizProgress = ({ currentIndex, totalQuestions }: QuizProgressProps) => {
  const currentNum = Math.min(currentIndex + 1, totalQuestions);
  const percentage = Math.round((currentNum / Math.max(totalQuestions, 1)) * 100);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-muted-foreground uppercase tracking-wider">
          Question <span className="text-primary font-bold">{currentNum}</span> of {totalQuestions}
        </span>
        <span className="text-primary font-bold">{percentage}%</span>
      </div>

      {/* Progress Bar Container */}
      <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

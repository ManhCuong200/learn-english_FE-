'use client';

import { useState } from 'react';

import { QuizAiConfigForm } from '@/app/moderator/_components/quiz-ai/QuizAiConfigForm';
import { QuizAiQuestionList } from '@/app/moderator/_components/quiz-ai/QuizAiQuestionList';
import type { AiGeneratedQuestion, DraftAiQuestion } from '@/types/quiz-ai';
import type { QuestionDraft } from '@/app/moderator/_components/quizzes/QuizQuestionCard';

export interface QuizAiGeneratorProps {
  quizId?: string;
  onQuestionsAdded?: () => void;
  onImportToQuizForm?: (questions: QuestionDraft[]) => void;
}

export const QuizAiGenerator = ({
  quizId,
  onQuestionsAdded,
  onImportToQuizForm,
}: QuizAiGeneratorProps) => {
  const [draftQuestions, setDraftQuestions] = useState<DraftAiQuestion[]>([]);

  const handleQuestionsGenerated = (generated: AiGeneratedQuestion[]) => {
    const formattedDrafts: DraftAiQuestion[] = generated.map((q, idx) => ({
      ...q,
      id: `ai-draft-${Date.now()}-${idx}-${Math.random()}`,
      selected: true,
    }));
    setDraftQuestions(formattedDrafts);
  };

  const handleClearAll = () => {
    setDraftQuestions([]);
  };

  return (
    <div className="space-y-8">
      {/* Step 1: Configuration Form */}
      <QuizAiConfigForm
        hasExistingDrafts={draftQuestions.length > 0}
        onQuestionsGenerated={handleQuestionsGenerated}
      />

      {/* Step 2: Generated Questions List & Preview */}
      {draftQuestions.length > 0 && (
        <QuizAiQuestionList
          questions={draftQuestions}
          quizId={quizId}
          onQuestionsChange={setDraftQuestions}
          onClearAll={handleClearAll}
          onQuestionsAddedSuccess={onQuestionsAdded}
          onImportToQuizForm={onImportToQuizForm}
        />
      )}
    </div>
  );
};

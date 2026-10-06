'use client';

import { use, useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  ChevronLeft,
  Clock,
  Flag,
  Headphones,
  RotateCcw,
  Send,
  Volume2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  getToeicExamQuestions,
  startToeicExam,
  submitToeicExam,
} from '@/app/(main)/_api/toeic';
import {
  ToeicExamQuestionsResponse,
  ToeicPart,
  ToeicPassage,
  ToeicQuestion,
} from '@/types/toeic';

const PART_LABELS: Record<ToeicPart, string> = {
  PART_1: 'Part 1: Photographs',
  PART_2: 'Part 2: Question - Response',
  PART_3: 'Part 3: Short Conversations',
  PART_4: 'Part 4: Short Talks',
  PART_5: 'Part 5: Incomplete Sentences',
  PART_6: 'Part 6: Text Completion',
  PART_7: 'Part 7: Reading Comprehension',
};

interface ExamRoomProps {
  params: Promise<{ slug: string }>;
}

export default function ToeicExamRoomPage({ params }: ExamRoomProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { slug } = use(params);
  const targetPart = (searchParams.get('part') as ToeicPart) || null;

  // Data states
  const [examData, setExamData] = useState<ToeicExamQuestionsResponse | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // User responses state: { [questionId]: "A" | "B" | "C" | "D" }
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());

  // Timer state
  const [secondsRemaining, setSecondsRemaining] = useState<number>(120 * 60);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [isConfirmSubmitOpen, setIsConfirmSubmitOpen] = useState(false);

  // Audio Playback
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Active question scroll
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // 1. Load exam questions and start attempt
  useEffect(() => {
    let isMounted = true;
    async function initExam() {
      try {
        setIsLoading(true);
        const data = await getToeicExamQuestions(slug, targetPart);
        if (!isMounted) return;

        setExamData(data);
        const durationSec = (data.exam.duration || 120) * 60;
        setSecondsRemaining(durationSec);

        // Start attempt session on backend
        const attempt = await startToeicExam(data.exam.id, targetPart);
        if (isMounted) {
          setAttemptId(attempt.attemptId);
        }
      } catch (err) {
        console.error('Failed to initialize exam:', err);
        alert('Không thể tải bài thi. Vui lòng thử lại.');
        router.push('/learning/toeic');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initExam();
    return () => {
      isMounted = false;
    };
  }, [slug, targetPart, router]);

  // Submit test
  const handleSubmitTest = useCallback(async () => {
    if (!attemptId || !examData) return;

    try {
      setIsSubmitting(true);
      const answersPayload = examData.questions.map((q) => ({
        questionId: q.id,
        selectedAnswer: userAnswers[q.id] || null,
      }));

      const res = await submitToeicExam(attemptId, {
        timeSpent,
        answers: answersPayload,
      });

      router.push(`/learning/toeic/result/${res.attemptId}`);
    } catch (err) {
      console.error('Submit exam failed:', err);
      alert('Không thể nộp bài thi. Vui lòng thử lại.');
      setIsSubmitting(false);
    }
  }, [attemptId, examData, userAnswers, timeSpent, router]);

  const handleForceSubmit = useCallback(() => {
    setIsConfirmSubmitOpen(false);
    void handleSubmitTest();
  }, [handleSubmitTest]);

  // 2. Countdown Timer
  useEffect(() => {
    if (isLoading || !attemptId) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleForceSubmit();
          return 0;
        }
        return prev - 1;
      });
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, attemptId, handleForceSubmit]);

  // Select Answer Handler
  const handleSelectAnswer = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  // Toggle Flag Question
  const handleToggleFlag = (questionId: string) => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  // Scroll to question
  const scrollToQuestion = (questionId: string) => {
    const el = questionRefs.current[questionId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (isLoading || !examData) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <RotateCcw className="size-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">
          Đang chuẩn bị phòng thi và nạp dữ liệu bài làm...
        </p>
      </div>
    );
  }

  const answeredCount = Object.keys(userAnswers).length;
  const totalQuestions = examData.questions.length;
  const isTimeCritical = secondsRemaining <= 300; // Under 5 mins

  // Group questions by passage or standalone
  const passageMap = new Map(examData.passages.map((p) => [p.id, p]));

  // Find unique parts in this test
  const uniqueParts = Array.from(
    new Set(examData.questions.map((q) => q.part)),
  );

  return (
    <div className="relative min-h-screen bg-slate-50 pb-20 dark:bg-slate-950">
      {/* STICKY TOP APP BAR */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Title & Part */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (confirm('Bạn có chắc chắn muốn rời phòng thi? Tiến trình hiện tại sẽ bị hủy.')) {
                  router.push('/learning/toeic');
                }
              }}
              className="size-9 rounded-full"
            >
              <ChevronLeft className="size-5" />
            </Button>
            <div>
              <h2 className="line-clamp-1 text-sm font-bold sm:text-base">
                {examData.exam.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                  {targetPart ? targetPart.replace('_', ' ') : 'FULL TEST'}
                </Badge>
                <span>
                  Đã làm {answeredCount}/{totalQuestions} câu
                </span>
              </div>
            </div>
          </div>

          {/* Right: Audio Player Controls + Timer + Submit Button */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Audio Speed (if listening parts present) */}
            {examData.exam.audioFullUrl && (
              <div className="hidden items-center gap-2 sm:flex">
                <audio
                  ref={audioRef}
                  src={examData.exam.audioFullUrl}
                  controls
                  className="h-8 w-44 rounded-md"
                />
              </div>
            )}

            {/* Countdown Timer */}
            <div
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-sm font-bold transition ${
                isTimeCritical
                  ? 'border-red-500 bg-red-500/10 text-red-600 animate-pulse'
                  : 'border-border bg-muted text-foreground'
              }`}
            >
              <Clock className="size-4 text-primary" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>

            {/* Submit Button */}
            <Button
              onClick={() => setIsConfirmSubmitOpen(true)}
              className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-white shadow-md hover:from-blue-700 hover:to-indigo-700"
            >
              <Send className="size-4" />
              <span className="hidden sm:inline">Nộp Bài</span>
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN TEST CONTAINER */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* LEFT 3 COLUMNS: QUESTIONS LIST */}
          <div className="space-y-8 lg:col-span-3">
            {uniqueParts.map((part) => {
              const partQuestions = examData.questions.filter((q) => q.part === part);
              const isListening = ['PART_1', 'PART_2', 'PART_3', 'PART_4'].includes(part);

              return (
                <div key={part} className="space-y-6">
                  {/* Part Header */}
                  <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 p-4 text-white shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="grid size-9 place-items-center rounded-lg bg-blue-500 text-white font-bold">
                        {part.split('_')[1]}
                      </div>
                      <div>
                        <h3 className="text-base font-bold">{PART_LABELS[part]}</h3>
                        <p className="text-xs text-slate-300">
                          {isListening ? 'Kỹ năng Listening (Nghe hiểu)' : 'Kỹ năng Reading (Đọc hiểu)'} • {partQuestions.length} câu hỏi
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Render questions inside Part */}
                  {/* Group questions that share a passage */}
                  {renderPartContent(
                    part,
                    partQuestions,
                    passageMap,
                    userAnswers,
                    flaggedQuestions,
                    handleSelectAnswer,
                    handleToggleFlag,
                    questionRefs,
                  )}
                </div>
              );
            })}
          </div>

          {/* RIGHT 1 COLUMN: QUESTION PALETTE SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground">Bảng Câu Hỏi</h4>
                <span className="text-xs font-semibold text-primary">
                  {answeredCount}/{totalQuestions}
                </span>
              </div>

              {/* Legend */}
              <div className="mb-4 grid grid-cols-2 gap-2 border-b border-border pb-3 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-emerald-500" />
                  <span>Đã trả lời</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                  <span>Chưa làm</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-amber-400" />
                  <span>Đã đặt cờ</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full border border-primary bg-primary/20" />
                  <span>Đang chọn</span>
                </div>
              </div>

              {/* Number Matrix */}
              <div className="max-h-[60vh] overflow-y-auto pr-1">
                {uniqueParts.map((part) => {
                  const partQuestions = examData.questions.filter((q) => q.part === part);
                  return (
                    <div key={part} className="mb-3">
                      <div className="mb-1 text-[11px] font-semibold text-muted-foreground">
                        {part.replace('_', ' ')}
                      </div>
                      <div className="grid grid-cols-5 gap-1.5">
                        {partQuestions.map((q) => {
                          const isAnswered = !!userAnswers[q.id];
                          const isFlagged = flaggedQuestions.has(q.id);

                          return (
                            <button
                              key={q.id}
                              type="button"
                              onClick={() => scrollToQuestion(q.id)}
                              className={`relative flex h-8 items-center justify-center rounded-lg text-xs font-semibold transition ${
                                isAnswered
                                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                              } ${isFlagged ? 'ring-2 ring-amber-400 ring-offset-1' : ''}`}
                            >
                              {q.questionNumber}
                              {isFlagged && (
                                <span className="absolute -top-1 -right-1 size-2 rounded-full bg-amber-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit CTA */}
              <div className="mt-4 border-t border-border pt-3">
                <Button
                  onClick={() => setIsConfirmSubmitOpen(true)}
                  className="w-full gap-2 font-semibold"
                >
                  <Send className="size-4" />
                  Nộp Bài Thi
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRM SUBMIT MODAL */}
      <Dialog open={isConfirmSubmitOpen} onOpenChange={setIsConfirmSubmitOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Xác Nhận Nộp Bài Thi</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn nộp bài thi TOEIC này không?
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl bg-muted/60 p-4 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Số câu đã làm:</span>
              <span className="font-bold text-emerald-600">
                {answeredCount} / {totalQuestions}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Số câu chưa làm:</span>
              <span className="font-bold text-amber-600">
                {totalQuestions - answeredCount} câu
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Thời gian đã làm:</span>
              <span className="font-bold text-foreground">
                {Math.floor(timeSpent / 60)} phút {timeSpent % 60}s
              </span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsConfirmSubmitOpen(false)}
              disabled={isSubmitting}
            >
              Tiếp tục làm bài
            </Button>
            <Button
              onClick={handleSubmitTest}
              disabled={isSubmitting}
              className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <RotateCcw className="size-4 animate-spin" />
                  Đang chấm điểm...
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" />
                  Nộp Bài Ngay
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ----------------------------------------------------
// HELPER COMPONENT TO RENDER PART CONTENT
// ----------------------------------------------------
function renderPartContent(
  part: ToeicPart,
  questions: ToeicQuestion[],
  passageMap: Map<string, ToeicPassage>,
  userAnswers: Record<string, string>,
  flaggedQuestions: Set<string>,
  onSelectAnswer: (qId: string, ans: string) => void,
  onToggleFlag: (qId: string) => void,
  questionRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>,
) {
  // Check if questions are grouped by passage (Part 3, 4, 6, 7)
  const isPassageBased = ['PART_3', 'PART_4', 'PART_6', 'PART_7'].includes(part);

  if (isPassageBased) {
    // Group questions by passageId
    const groups: { passageId: string | null; questions: ToeicQuestion[] }[] = [];
    const seenPassages = new Set<string>();

    for (const q of questions) {
      const pid = q.passageId || 'standalone';
      if (!seenPassages.has(pid)) {
        seenPassages.add(pid);
        groups.push({
          passageId: q.passageId || null,
          questions: questions.filter((item) => (item.passageId || null) === (q.passageId || null)),
        });
      }
    }

    return (
      <div className="space-y-6">
        {groups.map((group, idx) => {
          const passage = group.passageId ? passageMap.get(group.passageId) : null;
          const isReadingPassage = ['PART_6', 'PART_7'].includes(part);

          return (
            <Card key={group.passageId || idx} className="overflow-hidden border-border bg-card">
              <div className={`grid grid-cols-1 ${isReadingPassage ? 'lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border' : ''}`}>
                {/* Passage Column (Left) */}
                {passage && (
                  <div className="bg-slate-50/50 p-5 dark:bg-slate-900/50">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        {passage.title || 'Đoạn văn thông tin'}
                      </span>
                    </div>

                    {/* Audio if Part 3 or 4 */}
                    {passage.audioUrl && (
                      <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50/70 p-3 dark:border-blue-900/40 dark:bg-blue-950/30">
                        <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-300">
                          <Headphones className="size-4" />
                          Audio Bài Nghe ({part.replace('_', ' ')})
                        </div>
                        <audio src={passage.audioUrl} controls className="h-8 w-full" />
                      </div>
                    )}

                    {/* Passage Content if Part 6 or 7 */}
                    {passage.content && (
                      <div className="prose prose-sm max-w-none rounded-xl border border-border bg-background p-4 text-xs font-serif leading-relaxed text-foreground shadow-inner dark:prose-invert">
                        <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                          {passage.content}
                        </pre>
                      </div>
                    )}

                    {/* Image if any */}
                    {passage.imageUrl && (
                      <div className="mt-3 overflow-hidden rounded-xl border border-border">
                        <img
                          src={passage.imageUrl}
                          alt="Passage graphic"
                          className="max-h-80 w-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Questions Column (Right) */}
                <div className="space-y-6 p-5">
                  {group.questions.map((q) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      selectedAnswer={userAnswers[q.id]}
                      isFlagged={flaggedQuestions.has(q.id)}
                      onSelectAnswer={onSelectAnswer}
                      onToggleFlag={onToggleFlag}
                      refCallback={(el) => {
                        questionRefs.current[q.id] = el;
                      }}
                    />
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  }

  // Standalone Questions (Part 1, Part 2, Part 5)
  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <Card key={q.id} className="border-border bg-card">
          <CardContent className="p-5">
            <QuestionCard
              question={q}
              selectedAnswer={userAnswers[q.id]}
              isFlagged={flaggedQuestions.has(q.id)}
              onSelectAnswer={onSelectAnswer}
              onToggleFlag={onToggleFlag}
              refCallback={(el) => {
                questionRefs.current[q.id] = el;
              }}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ----------------------------------------------------
// INDIVIDUAL QUESTION CARD
// ----------------------------------------------------
function QuestionCard({
  question,
  selectedAnswer,
  isFlagged,
  onSelectAnswer,
  onToggleFlag,
  refCallback,
}: {
  question: ToeicQuestion;
  selectedAnswer?: string;
  isFlagged: boolean;
  onSelectAnswer: (qId: string, ans: string) => void;
  onToggleFlag: (qId: string) => void;
  refCallback: (el: HTMLDivElement | null) => void;
}) {
  const optionsEntries = Object.entries(question.options || {});

  return (
    <div ref={refCallback} className="space-y-3 scroll-mt-24">
      {/* Question Header & Question Text */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
            {question.questionNumber}
          </span>
          <p className="text-sm font-semibold text-foreground sm:text-base">
            {question.questionText || `Question ${question.questionNumber}`}
          </p>
        </div>

        {/* Flag button */}
        <button
          type="button"
          onClick={() => onToggleFlag(question.id)}
          title="Đánh dấu câu cần xem lại"
          className={`shrink-0 rounded-lg p-1.5 transition ${
            isFlagged
              ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <Flag className={`size-4 ${isFlagged ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Part 1 Photo */}
      {question.imageUrl && (
        <div className="overflow-hidden rounded-xl border border-border bg-muted/40">
          <img
            src={question.imageUrl}
            alt={`Question ${question.questionNumber}`}
            className="max-h-72 w-full object-contain"
          />
        </div>
      )}

      {/* Audio for Question if present */}
      {question.audioUrl && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-2 text-xs">
          <Volume2 className="size-4 text-primary" />
          <audio src={question.audioUrl} controls className="h-7 w-full" />
        </div>
      )}

      {/* Options List (A, B, C, D) */}
      <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
        {optionsEntries.map(([key, text]) => {
          const isSelected = selectedAnswer === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectAnswer(question.id, key)}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                isSelected
                  ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary'
                  : 'border-border bg-card hover:border-slate-300 hover:bg-muted/50 dark:hover:border-slate-700'
              }`}
            >
              <span
                className={`grid size-7 shrink-0 place-items-center rounded-lg text-xs font-bold transition ${
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {key}
              </span>
              <span
                className={`text-xs font-medium leading-relaxed sm:text-sm ${
                  isSelected ? 'text-foreground font-semibold' : 'text-foreground/90'
                }`}
              >
                {text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

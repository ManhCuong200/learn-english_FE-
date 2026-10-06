'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Headphones,
  HelpCircle,
  Languages,
  RotateCcw,
  Trophy,
  Volume2,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getToeicAttemptDetail } from '@/app/(main)/_api/toeic';
import { ToeicAttemptReview, ToeicPart } from '@/types/toeic';

const PART_NAMES: Record<ToeicPart, string> = {
  PART_1: 'Part 1: Photographs',
  PART_2: 'Part 2: Question - Response',
  PART_3: 'Part 3: Short Conversations',
  PART_4: 'Part 4: Short Talks',
  PART_5: 'Part 5: Incomplete Sentences',
  PART_6: 'Part 6: Text Completion',
  PART_7: 'Part 7: Reading Comprehension',
};

interface ResultPageProps {
  params: Promise<{ attemptId: string }>;
}

export default function ToeicResultPage({ params }: ResultPageProps) {
  const router = useRouter();
  const { attemptId } = use(params);

  const [reviewData, setReviewData] = useState<ToeicAttemptReview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [filterType, setFilterType] = useState<'ALL' | 'INCORRECT' | 'CORRECT' | 'SKIPPED'>('ALL');
  const [selectedPartFilter, setSelectedPartFilter] = useState<ToeicPart | 'ALL'>('ALL');

  useEffect(() => {
    let isMounted = true;
    async function loadResult() {
      try {
        setIsLoading(true);
        const data = await getToeicAttemptDetail(attemptId);
        if (isMounted) setReviewData(data);
      } catch (err) {
        console.error('Failed to load review data:', err);
        alert('Không tìm thấy kết quả bài thi.');
        router.push('/learning/toeic');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadResult();
    return () => {
      isMounted = false;
    };
  }, [attemptId, router]);

  if (isLoading || !reviewData) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <RotateCcw className="size-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Đang tổng hợp kết quả và phân tích chi tiết...</p>
      </div>
    );
  }

  // Filtered answers
  const filteredAnswers = reviewData.answers.filter((ans) => {
    // Filter by Part
    if (selectedPartFilter !== 'ALL' && ans.part !== selectedPartFilter) {
      return false;
    }
    // Filter by Type
    if (filterType === 'CORRECT') return ans.isCorrect;
    if (filterType === 'INCORRECT') return !ans.isCorrect && ans.selectedAnswer !== null;
    if (filterType === 'SKIPPED') return !ans.selectedAnswer;
    return true;
  });

  const getProficiencyTitle = (score: number) => {
    if (score >= 905) return 'C1/C2 - International Professional';
    if (score >= 785) return 'B2+ - Working Proficiency Plus';
    if (score >= 605) return 'B1/B2 - Limited Working Proficiency';
    if (score >= 405) return 'A2+ - Elementary Proficiency Plus';
    if (score >= 255) return 'A2 - Elementary Proficiency';
    return 'A1 - Novice / Beginner';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Back Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/learning/toeic"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Quay lại Kho Đề Thi
        </Link>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push(`/learning/toeic`)}
            variant="outline"
            size="sm"
          >
            Làm Bài Khác
          </Button>
        </div>
      </div>

      {/* HERO SCORE BANNER */}
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 p-8 text-white shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Total Score */}
          <div className="flex flex-col justify-between border-b border-white/10 pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300">
                <Trophy className="size-3.5" />
                Kết Quả Thi Chuẩn ETS
              </div>
              <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
                {reviewData.exam.title}
              </h2>
              <p className="mt-1 text-xs text-slate-300">
                {getProficiencyTitle(reviewData.scores.totalScore)}
              </p>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-6xl font-black tracking-tight text-white sm:text-7xl">
                {reviewData.scores.totalScore}
              </span>
              <span className="text-xl font-bold text-slate-400">/ 990</span>
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-400" />
                Đúng: {reviewData.correctAnswers} / {reviewData.totalQuestions} ({reviewData.accuracy}%)
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-4 text-blue-400" />
                {Math.floor(reviewData.timeSpent / 60)} phút {reviewData.timeSpent % 60}s
              </span>
            </div>
          </div>

          {/* Section Score Cards */}
          <div className="grid grid-cols-2 gap-4 lg:col-span-2">
            {/* Listening Score */}
            <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                  Listening (LC)
                </span>
                <Headphones className="size-5 text-blue-400" />
              </div>
              <div className="my-4">
                <div className="text-4xl font-extrabold text-white">
                  {reviewData.scores.scoreListening}
                  <span className="text-xs font-normal text-slate-400"> / 495</span>
                </div>
                <p className="mt-1 text-xs text-slate-300">
                  Đúng {reviewData.scores.listeningCorrect} câu nghe
                </p>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-indigo-400"
                  style={{
                    width: `${Math.round((reviewData.scores.scoreListening / 495) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Reading Score */}
            <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                  Reading (RC)
                </span>
                <BookOpen className="size-5 text-teal-400" />
              </div>
              <div className="my-4">
                <div className="text-4xl font-extrabold text-white">
                  {reviewData.scores.scoreReading}
                  <span className="text-xs font-normal text-slate-400"> / 495</span>
                </div>
                <p className="mt-1 text-xs text-slate-300">
                  Đúng {reviewData.scores.readingCorrect} câu đọc
                </p>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-gradient-to-r from-teal-400 to-emerald-400"
                  style={{
                    width: `${Math.round((reviewData.scores.scoreReading / 495) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Part Accuracy Breakdown Bar Overview */}
            <div className="col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>Phân Tích Độ Chính Xác Theo Part (Part 1 - Part 7):</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5 text-center text-[10px]">
                {(
                  [
                    'PART_1',
                    'PART_2',
                    'PART_3',
                    'PART_4',
                    'PART_5',
                    'PART_6',
                    'PART_7',
                  ] as ToeicPart[]
                ).map((part) => {
                  const stat = reviewData.partStats[part] || { total: 0, correct: 0 };
                  const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
                  const color =
                    pct >= 80
                      ? 'bg-emerald-500'
                      : pct >= 50
                        ? 'bg-amber-400'
                        : 'bg-red-400';

                  return (
                    <div key={part} className="space-y-1">
                      <div className="font-bold text-slate-300">P{part.split('_')[1]}</div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
                      </div>
                      <div className="text-slate-400">{stat.correct}/{stat.total}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background blur */}
        <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      {/* FILTER CONTROLS */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={filterType === 'ALL' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('ALL')}
            className="text-xs"
          >
            Tất cả ({reviewData.answers.length})
          </Button>
          <Button
            variant={filterType === 'INCORRECT' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('INCORRECT')}
            className="text-xs text-red-600 hover:text-red-700"
          >
            <XCircle className="mr-1 size-3.5" />
            Làm sai ({reviewData.answers.filter((a) => !a.isCorrect && a.selectedAnswer !== null).length})
          </Button>
          <Button
            variant={filterType === 'CORRECT' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('CORRECT')}
            className="text-xs text-emerald-600 hover:text-emerald-700"
          >
            <CheckCircle2 className="mr-1 size-3.5" />
            Làm đúng ({reviewData.correctAnswers})
          </Button>
          <Button
            variant={filterType === 'SKIPPED' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType('SKIPPED')}
            className="text-xs"
          >
            Bỏ trống ({reviewData.answers.filter((a) => !a.selectedAnswer).length})
          </Button>
        </div>

        {/* Part Selector Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">Lọc theo Part:</span>
          <select
            value={selectedPartFilter}
            onChange={(e) => setSelectedPartFilter(e.target.value as ToeicPart | 'ALL')}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium"
          >
            <option value="ALL">Tất cả các Part</option>
            <option value="PART_1">Part 1 (Photographs)</option>
            <option value="PART_2">Part 2 (Question - Response)</option>
            <option value="PART_3">Part 3 (Conversations)</option>
            <option value="PART_4">Part 4 (Short Talks)</option>
            <option value="PART_5">Part 5 (Incomplete Sentences)</option>
            <option value="PART_6">Part 6 (Text Completion)</option>
            <option value="PART_7">Part 7 (Reading Comprehension)</option>
          </select>
        </div>
      </div>

      {/* DETAILED QUESTION REVIEWS */}
      <div className="space-y-6">
        {filteredAnswers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center">
            <CheckCircle2 className="mx-auto size-12 text-emerald-500" />
            <h3 className="mt-4 text-base font-semibold">Không có câu hỏi nào theo bộ lọc này</h3>
          </div>
        ) : (
          filteredAnswers.map((ans) => (
            <Card
              key={ans.id}
              className={`overflow-hidden border transition-all ${
                ans.isCorrect
                  ? 'border-emerald-200/80 bg-card dark:border-emerald-900/40'
                  : 'border-red-200/80 bg-card dark:border-red-900/40'
              }`}
            >
              <CardContent className="p-6">
                {/* Passage (if part 3, 4, 6, 7) */}
                {ans.passage && (
                  <div className="mb-6 rounded-2xl border border-border bg-muted/30 p-4">
                    <div className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                      {ans.passage.title || 'Đoạn văn / Bài nghe'}
                    </div>

                    {/* Audio Player if Listening */}
                    {ans.passage.audioUrl && (
                      <div className="mb-3 flex items-center gap-2 rounded-lg bg-background p-2 text-xs">
                        <Volume2 className="size-4 text-primary" />
                        <audio src={ans.passage.audioUrl} controls className="h-7 w-full" />
                      </div>
                    )}

                    {/* Passage Content if Reading */}
                    {ans.passage.content && (
                      <div className="mb-3 whitespace-pre-wrap rounded-xl border border-border bg-background p-4 text-xs font-serif leading-relaxed text-foreground">
                        {ans.passage.content}
                      </div>
                    )}

                    {/* Transcript Accordion / Box */}
                    {ans.passage.transcript && (
                      <div className="mt-2 rounded-lg bg-blue-50/80 p-3 text-xs text-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
                        <span className="font-bold flex items-center gap-1.5 mb-1 text-blue-800 dark:text-blue-300">
                          <Headphones className="size-3.5" />
                          Transcript Lời Thoại:
                        </span>
                        <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                          {ans.passage.transcript}
                        </pre>
                      </div>
                    )}

                    {/* Vietnamese Translation */}
                    {ans.passage.translation && (
                      <div className="mt-2 rounded-lg bg-emerald-50/80 p-3 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                        <span className="font-bold flex items-center gap-1.5 mb-1 text-emerald-800 dark:text-emerald-300">
                          <Languages className="size-3.5" />
                          Bản Dịch Tiếng Việt:
                        </span>
                        <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                          {ans.passage.translation}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Question Info Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span
                      className={`grid size-8 shrink-0 place-items-center rounded-xl text-xs font-bold text-white ${
                        ans.isCorrect ? 'bg-emerald-600' : 'bg-red-600'
                      }`}
                    >
                      {ans.questionNumber}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">
                          {PART_NAMES[ans.part]}
                        </span>
                        {ans.isCorrect ? (
                          <Badge className="bg-emerald-600 text-[10px]">Đúng</Badge>
                        ) : ans.selectedAnswer ? (
                          <Badge variant="destructive" className="text-[10px]">Sai</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">Chưa làm</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm font-semibold text-foreground sm:text-base">
                        {ans.questionText || `Question ${ans.questionNumber}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Part 1 Photo if present */}
                {ans.imageUrl && (
                  <div className="my-4 overflow-hidden rounded-xl border border-border bg-muted/30">
                    <img
                      src={ans.imageUrl}
                      alt={`Question ${ans.questionNumber}`}
                      className="max-h-72 w-full object-contain"
                    />
                  </div>
                )}

                {/* Question Transcript (for Part 1 & 2) */}
                {ans.transcript && (
                  <div className="my-3 rounded-lg border border-blue-200/60 bg-blue-50/50 p-3 text-xs text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-200">
                    <span className="font-bold flex items-center gap-1 text-blue-700 dark:text-blue-300 mb-1">
                      <Headphones className="size-3.5" />
                      Transcript câu hỏi & lựa chọn:
                    </span>
                    <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                      {ans.transcript}
                    </pre>
                  </div>
                )}

                {/* 4 Choices Grid */}
                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {Object.entries(ans.options || {}).map(([key, text]) => {
                    const isCorrectChoice = key === ans.correctAnswer;
                    const isUserChoice = key === ans.selectedAnswer;

                    let cardStyle = 'border-border bg-card';
                    if (isCorrectChoice) {
                      cardStyle =
                        'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500 font-semibold';
                    } else if (isUserChoice && !ans.isCorrect) {
                      cardStyle =
                        'border-red-500 bg-red-50/80 dark:bg-red-950/30 text-red-900 dark:text-red-200 line-through';
                    }

                    return (
                      <div
                        key={key}
                        className={`flex items-center justify-between rounded-xl border p-3 text-xs sm:text-sm ${cardStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`grid size-6 shrink-0 place-items-center rounded-md font-bold text-xs ${
                              isCorrectChoice
                                ? 'bg-emerald-600 text-white'
                                : isUserChoice
                                  ? 'bg-red-600 text-white'
                                  : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {key}
                          </span>
                          <span>{text}</span>
                        </div>

                        {/* Badges for answer state */}
                        {isCorrectChoice && (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            Đáp án đúng
                          </span>
                        )}
                        {isUserChoice && !isCorrectChoice && (
                          <span className="text-xs font-bold text-red-600 dark:text-red-400">
                            Bạn đã chọn
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Detailed Vietnamese Explanation */}
                {ans.explanation && (
                  <div className="mt-4 rounded-xl border border-amber-200/80 bg-amber-50/60 p-4 text-xs leading-relaxed text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
                    <div className="mb-1 flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-400">
                      <HelpCircle className="size-4" />
                      Giải Thích Ngữ Pháp & Từ Vựng Chi Tiết:
                    </div>
                    <p className="whitespace-pre-wrap">{ans.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

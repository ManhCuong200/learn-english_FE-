'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Headphones,
  History,
  Layers,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  generateToeicExamAi,
  getToeicExams,
  getToeicUserHistory,
} from '@/app/(main)/_api/toeic';
import { ToeicPart } from '@/types/toeic';

const PART_NAMES: Record<ToeicPart, string> = {
  PART_1: 'Part 1: Mô tả tranh (Photographs)',
  PART_2: 'Part 2: Hỏi & Đáp (Question-Response)',
  PART_3: 'Part 3: Hội thoại ngắn (Conversations)',
  PART_4: 'Part 4: Bài nói ngắn (Short Talks)',
  PART_5: 'Part 5: Điền câu đơn (Incomplete Sentences)',
  PART_6: 'Part 6: Điền đoạn văn (Text Completion)',
  PART_7: 'Part 7: Đọc hiểu văn bản (Reading Comprehension)',
};

export default function ToeicHubPage() {
  const router = useRouter();

  // State
  const [activeTab, setActiveTab] = useState<'exams' | 'history'>('exams');
  const [selectedYear, setSelectedYear] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // AI Modal State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiTopic, setAiTopic] = useState('Office Communication, Business Logistics, Finance');
  const [aiDifficulty, setAiDifficulty] = useState('INTERMEDIATE');
  const [aiYear, setAiYear] = useState(2024);
  const [aiSelectedParts, setAiSelectedParts] = useState<ToeicPart[]>([
    'PART_5',
    'PART_7',
  ]);

  // Queries
  const {
    data: examsData,
    isLoading: isExamsLoading,
    refetch: refetchExams,
  } = useQuery({
    queryKey: ['toeic-exams', selectedYear, searchQuery],
    queryFn: () =>
      getToeicExams({
        year: selectedYear === 'ALL' ? undefined : selectedYear,
        search: searchQuery || undefined,
      }),
    enabled: activeTab === 'exams',
  });

  const { data: historyData, isLoading: isHistoryLoading } = useQuery({
    queryKey: ['toeic-history'],
    queryFn: () => getToeicUserHistory(),
    enabled: activeTab === 'history',
  });

  const exams = examsData?.items || [];
  const history = historyData || [];
  const isLoading = activeTab === 'exams' ? isExamsLoading : isHistoryLoading;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    void refetchExams();
  };

  const handleGenerateAi = async () => {
    try {
      setIsGeneratingAi(true);
      await generateToeicExamAi({
        title: `ETS TOEIC ${aiYear} AI - ${aiTopic.slice(0, 30)}`,
        year: aiYear,
        difficulty: aiDifficulty,
        topic: aiTopic,
        parts: aiSelectedParts.length > 0 ? aiSelectedParts : undefined,
        saveToDatabase: true,
      });
      setIsAiModalOpen(false);
      await refetchExams();
    } catch (err) {
      console.error('Error generating AI exam:', err);
      const msg = err instanceof Error ? err.message : 'Vui lòng thử lại sau.';
      alert(`Không thể tạo đề bằng AI: ${msg}`);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const toggleAiPart = (part: ToeicPart) => {
    setAiSelectedParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part],
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-200 backdrop-blur-sm">
            <Sparkles className="size-3.5 text-blue-300" />
            Luyện thi TOEIC ETS Chuẩn Quốc Tế
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Kho Đề Thi TOEIC ETS <span className="bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">Part 1 - Part 7</span>
          </h1>
          <p className="mt-3 text-base text-slate-300 sm:text-lg">
            Bộ đề thi thật ETS qua các năm kèm audio bản xứ, giao diện 2 cột chuẩn thi thật, bảng quy đổi điểm 10-990 và lời giải thích ngữ pháp chi tiết.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              onClick={() => {
                setActiveTab('exams');
                const firstExam = exams[0];
                if (firstExam) router.push(`/learning/toeic/${firstExam.slug}`);
              }}
              size="lg"
              className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:from-blue-600 hover:to-indigo-700"
            >
              <Play className="size-4 fill-white" />
              Thi Thử Ngay
            </Button>

            {/* AI Generator Button */}
            <Dialog open={isAiModalOpen} onOpenChange={setIsAiModalOpen}>
              <DialogTrigger render={
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-white/20 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
                >
                  <Sparkles className="size-4 text-amber-300" />
                  Tạo Đề Mới Bằng AI
                </Button>
              } />
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                    <Sparkles className="size-5 text-amber-500" />
                    Tạo Đề Thi TOEIC Tự Động Bằng AI
                  </DialogTitle>
                  <DialogDescription>
                    Gemini AI sẽ tự động sinh câu hỏi chuẩn format ETS với đầy đủ đáp án, transcript audio và lời giải thích tiếng Việt.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-3">
                  <div>
                    <label className="text-sm font-semibold text-foreground">
                      Chủ đề bài thi (Topic)
                    </label>
                    <Input
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      placeholder="Ví dụ: Logistics, Human Resources, Contracts..."
                      className="mt-1.5"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-semibold text-foreground">
                        Năm phát hành
                      </label>
                      <select
                        value={aiYear}
                        onChange={(e) => setAiYear(Number(e.target.value))}
                        className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value={2024}>ETS 2024</option>
                        <option value={2023}>ETS 2023</option>
                        <option value={2022}>ETS 2022</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-foreground">
                        Mức độ thử thách
                      </label>
                      <select
                        value={aiDifficulty}
                        onChange={(e) => setAiDifficulty(e.target.value)}
                        className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="BEGINNER">Cơ bản (450 - 600)</option>
                        <option value="INTERMEDIATE">Trung cấp (650 - 800)</option>
                        <option value="ADVANCED">Nâng cao (800 - 990)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                      Chọn các Part muốn sinh câu hỏi:
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
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
                        const selected = aiSelectedParts.includes(part);
                        return (
                          <button
                            key={part}
                            type="button"
                            onClick={() => toggleAiPart(part)}
                            className={`flex items-center gap-2 rounded-lg border p-2 text-left transition ${
                              selected
                                ? 'border-primary bg-primary/10 text-primary font-medium'
                                : 'border-border hover:bg-muted text-muted-foreground'
                            }`}
                          >
                            <span
                              className={`size-2 rounded-full ${
                                selected ? 'bg-primary' : 'bg-muted-foreground/40'
                              }`}
                            />
                            {part.replace('_', ' ')}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAiModalOpen(false)}
                    disabled={isGeneratingAi}
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleGenerateAi}
                    disabled={isGeneratingAi}
                    className="gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700"
                  >
                    {isGeneratingAi ? (
                      <>
                        <RotateCcw className="size-4 animate-spin" />
                        AI đang soạn đề thi...
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4" />
                        Tạo Đề Ngay
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Decorative background glows */}
        <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-40 size-80 rounded-full bg-teal-500/10 blur-3xl" />
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 flex border-b border-border">
        <button
          onClick={() => setActiveTab('exams')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition ${
            activeTab === 'exams'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <BookOpen className="size-4" />
          Kho Đề Thi ({exams.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition ${
            activeTab === 'history'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <History className="size-4" />
          Lịch Sử Làm Bài
        </button>
      </div>

      {/* EXAMS TAB */}
      {activeTab === 'exams' && (
        <div>
          {/* Filters Bar */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Year Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Năm thi:
              </span>
              {[
                { label: 'Tất cả năm', value: 'ALL' as const },
                { label: 'ETS 2024', value: 2024 },
                { label: 'ETS 2023', value: 2023 },
                { label: 'ETS 2022', value: 2022 },
                { label: 'ETS 2021', value: 2021 },
              ].map((item) => (
                <Button
                  key={String(item.value)}
                  variant={selectedYear === item.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedYear(item.value)}
                  className="rounded-full text-xs font-medium"
                >
                  {item.label}
                </Button>
              ))}
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearch} className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm tên đề thi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs"
              />
            </form>
          </div>

          {/* Exams Grid */}
          {isLoading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <RotateCcw className="size-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Đang tải danh sách đề thi...</p>
              </div>
            </div>
          ) : exams.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-16 text-center">
              <BookOpen className="mx-auto size-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-base font-semibold">Chưa có đề thi nào</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Hãy thử chọn bộ lọc khác hoặc bấm &quot;Tạo Đề Mới Bằng AI&quot; ở góc trên.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {exams.map((exam) => (
                <Card
                  key={exam.id}
                  className="group relative flex flex-col justify-between overflow-hidden border-border transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <Badge className="bg-blue-600 font-semibold hover:bg-blue-700">
                        {exam.series} {exam.year}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {exam.difficulty || 'INTERMEDIATE'}
                      </Badge>
                    </div>
                    <CardTitle className="mt-2 line-clamp-1 text-lg font-bold group-hover:text-primary">
                      {exam.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-xs">
                      {exam.description || 'Đề thi chuẩn cấu trúc ETS có lời giải chi tiết.'}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 py-2">
                    <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted/50 p-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Clock className="size-4 text-blue-500" />
                        <span>{exam.duration} phút</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Layers className="size-4 text-emerald-500" />
                        <span>{exam.totalQuestions} câu hỏi</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Headphones className="size-4 text-purple-500" />
                        <span>Part 1 - Part 4</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="size-4 text-amber-500" />
                        <span>Part 5 - Part 7</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center gap-2 pt-2">
                    {/* Full Test Button */}
                    <Button
                      onClick={() => router.push(`/learning/toeic/${exam.slug}`)}
                      className="flex-1 gap-2 font-medium"
                    >
                      <Play className="size-4 fill-white" />
                      Làm Full Test
                    </Button>

                    {/* Practice by Part Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                        <Button variant="outline" size="icon" title="Luyện riêng từng Part">
                          <Filter className="size-4 text-muted-foreground" />
                        </Button>
                      } />
                      <DropdownMenuContent align="end" className="w-64">
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                          Luyện tập riêng theo Part:
                        </div>
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
                        ).map((part) => (
                          <DropdownMenuItem
                            key={part}
                            onClick={() =>
                              router.push(`/learning/toeic/${exam.slug}?part=${part}`)
                            }
                            className="text-xs"
                          >
                            {PART_NAMES[part]}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-16 text-center">
              <Trophy className="mx-auto size-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-base font-semibold">Chưa có lượt thi nào</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Hãy chọn một đề thi và bắt đầu thử sức ngay hôm nay!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">
                        {item.exam.title}
                      </span>
                      {item.targetPart && (
                        <Badge variant="secondary" className="text-xs">
                          {item.targetPart.replace('_', ' ')}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        {new Date(item.startedAt).toLocaleDateString('vi-VN')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {Math.floor(item.timeSpent / 60)} phút {item.timeSpent % 60}s
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="size-3.5 text-emerald-500" />
                        Đúng: {item.correctAnswers} / {item.totalQuestions}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-2xl font-black text-primary">
                        {item.totalScore}
                        <span className="text-xs font-normal text-muted-foreground">/990</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        LC: {item.scoreListening} | RC: {item.scoreReading}
                      </div>
                    </div>

                    <Button
                      onClick={() => router.push(`/learning/toeic/result/${item.id}`)}
                      variant="outline"
                      size="sm"
                    >
                      Xem Lời Giải
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

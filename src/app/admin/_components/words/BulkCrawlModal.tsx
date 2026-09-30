'use client';

import { useState } from 'react';
import { Sparkles, Loader2, CheckCircle2, DownloadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { bulkCrawlWords } from '@/app/admin/_api/words';
import type { AdminCategory } from '@/types/admin';

type BulkCrawlModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: AdminCategory[];
  onSuccess: () => void;
};

const PRESET_TOPICS = [
  {
    name: '🌟 50 Từ vựng Giao tiếp Thông dụng (A1-A2)',
    words: [
      'apple', 'banana', 'orange', 'family', 'friend', 'house', 'happy', 'journey',
      'beautiful', 'success', 'future', 'freedom', 'freedom', 'nature', 'weather',
      'morning', 'evening', 'window', 'kitchen', 'library', 'station', 'airport',
      'hospital', 'mountain', 'river', 'ocean', 'sunshine', 'rainbow', 'shadow',
      'courage', 'patient', 'curious', 'creative', 'honest', 'friendly', 'gentle',
      'generous', 'polite', 'silent', 'wisdom', 'wonder', 'miracle', 'passion',
      'memory', 'treasure', 'whisper', 'melody', 'harmony', 'sparkle', 'adventure'
    ],
  },
  {
    name: '🎓 50 Từ vựng IELTS / Academic (B2-C1)',
    words: [
      'resilient', 'persistent', 'eloquent', 'ambivalent', 'meticulous', 'pragmatic',
      'ubiquitous', 'ephemeral', 'scrutinize', 'mitigate', 'disparate', 'coherent',
      'substantive', 'empirical', 'phenomenon', 'predominant', 'comprehensive',
      'hypothesis', 'paradigm', 'unprecedented', 'inevitable', 'compelling',
      'pivotal', 'profound', 'facilitate', 'instigate', 'advocate', 'consolidate',
      'elucidate', 'substantiate', 'delineate', 'concur', 'contradict', 'augment',
      'curtail', 'fluctuate', 'alleviate', 'exacerbate', 'bolster', 'undermine',
      'pervasive', 'tangible', 'intrinsic', 'extrinsic', 'lucid', 'obscure',
      'versatile', 'plausible', 'redundant', 'feasible'
    ],
  },
  {
    name: '💼 50 Từ vựng Công sở & Kinh doanh (Business)',
    words: [
      'negotiate', 'strategy', 'deadline', 'collaborate', 'revenue', 'proposal',
      'benchmark', 'optimize', 'efficiency', 'productivity', 'investment',
      'portfolio', 'stakeholder', 'acquisition', 'merger', 'incentive', 'liability',
      'asset', 'prospective', 'entrepreneur', 'implementation', 'feasibility',
      'compliance', 'delegation', 'competence', 'evaluation', 'synergy',
      'scalability', 'logistics', 'contingency', 'accountability', 'initiative',
      'milestone', 'infrastructure', 'turnover', 'compensation', 'franchise',
      'outsource', 'reimburse', 'monopolize', 'subsidy', 'recession', 'inflation',
      'solvency', 'bankruptcy', 'mortgage', 'dividend', 'shareholder', 'auditing', 'liquidity'
    ],
  },
];

export const BulkCrawlModal = ({ isOpen, onClose, categories, onSuccess }: BulkCrawlModalProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[0]?.id ?? '');
  const [rawWordsInput, setRawWordsInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (words: string[]) => {
    setRawWordsInput(words.join(', '));
  };

  const handleStartCrawl = async () => {
    if (!selectedCategoryId) {
      alert('Vui lòng chọn danh mục (Category) trước khi cào từ!');
      return;
    }

    const wordList = rawWordsInput
      .split(/[\n,]+/)
      .map((w) => w.trim())
      .filter(Boolean);

    if (wordList.length === 0) {
      alert('Vui lòng nhập hoặc chọn ít nhất 1 từ vựng!');
      return;
    }

    setIsLoading(true);
    setResultMessage(null);

    try {
      const res = await bulkCrawlWords({
        words: wordList,
        categoryId: selectedCategoryId,
      });

      setResultMessage(`🎉 ${res.message}! Đã tự động lấy phiên âm IPA và nghĩa tiếng Việt.`);
      onSuccess();
    } catch (err: unknown) {
      const errorObj = err as Error;
      setResultMessage(`❌ Lỗi khi cào từ vựng: ${errorObj?.message || 'Không thể cào từ'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#dfe4dc] bg-white p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-5 top-5 rounded-lg p-1.5 text-[#657477] hover:bg-[#f4f5f1] transition-colors"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-[#d9eee4] text-[#286052]">
            <DownloadCloud className="size-6" />
          </div>
          <div>
            <h2 className="font-display text-2xl text-[#203238]">🚀 Cào từ vựng tự động</h2>
            <p className="text-xs text-[#657477]">Tự động lấy phiên âm IPA, âm thanh và dịch nghĩa tiếng Việt cho hàng loạt từ.</p>
          </div>
        </div>

        {/* Preset selections */}
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-[#657477]">Chọn bộ từ vựng mẫu có sẵn:</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PRESET_TOPICS.map((topic, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectPreset(topic.words)}
                className="flex flex-col items-start p-3 text-left rounded-xl border border-[#dfe4dc] bg-[#fdfdfb] hover:bg-[#e9f5ee] hover:border-[#286052] transition-colors"
              >
                <span className="text-xs font-bold text-[#203238] line-clamp-2">{topic.name}</span>
                <span className="mt-1 text-[11px] font-medium text-[#c56b4e]">{topic.words.length} từ</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input category */}
        <div className="space-y-2">
          <Label htmlFor="crawl-category">Chọn danh mục (Category) lưu từ:</Label>
          <select
            id="crawl-category"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-[#286052]"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                📁 {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Input word list */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="crawl-words">Danh sách từ vựng tiếng Anh (cách nhau bởi dấu phẩy hoặc xuống dòng):</Label>
            <span className="text-xs text-[#657477]">
              {rawWordsInput.split(/[\n,]+/).filter((w) => w.trim()).length} từ
            </span>
          </div>
          <textarea
            id="crawl-words"
            rows={5}
            value={rawWordsInput}
            onChange={(e) => setRawWordsInput(e.target.value)}
            placeholder="Ví dụ: apple, resilient, persistent, eloquent..."
            className="w-full rounded-xl border border-input p-3 text-sm font-mono outline-none focus:ring-2 focus:ring-[#286052]"
          />
        </div>

        {/* Result Message */}
        {resultMessage && (
          <div className="flex items-center gap-2 rounded-xl bg-[#e9f5ee] p-3 text-xs font-semibold text-[#286052]">
            <CheckCircle2 className="size-4 shrink-0" />
            {resultMessage}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            onClick={handleStartCrawl}
            disabled={isLoading || !rawWordsInput.trim()}
            className="bg-[#286052] hover:bg-[#1d473d] text-white font-bold gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Đang cào & dịch dữ liệu...
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Bắt đầu cào từ vựng
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

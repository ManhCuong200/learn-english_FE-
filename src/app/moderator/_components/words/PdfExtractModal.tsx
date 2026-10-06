'use client';

import { useState, useRef, useMemo } from 'react';
import {
  FileText,
  UploadCloud,
  Sparkles,
  Loader2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Trash2,
  FolderPlus,
  BookOpen,
  X,
  RefreshCw,
  Edit2,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { extractWordsFromPdf, importExtractedWords } from '@/app/moderator/_api/words';
import type {
  ExtractedCategoryItem,
  ExtractedWordItem,
  ImportExtractedResponse,
} from '@/types/word-ai';

interface PdfExtractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PdfExtractModal = ({
  isOpen,
  onClose,
  onSuccess,
}: PdfExtractModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState(false);

  // Extracted data state
  const [categories, setCategories] = useState<ExtractedCategoryItem[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState<string>('');

  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<ImportExtractedResponse | null>(null);

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      toast.error('Vui lòng chọn file có định dạng PDF (.pdf)');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error('Kích thước file PDF không được vượt quá 15MB');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFileBase64(result);
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      toast.error('Vui lòng chọn file có định dạng PDF (.pdf)');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error('Kích thước file PDF không được vượt quá 15MB');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFileBase64(result);
    };
    reader.readAsDataURL(file);
  };

  // Trigger AI extraction
  const handleExtractPdf = async () => {
    if (!fileBase64 || !selectedFile) {
      toast.error('Vui lòng tải lên một file PDF trước khi phân tích');
      return;
    }

    setIsExtracting(true);
    try {
      const res = await extractWordsFromPdf(selectedFile);

      if (!res.categories || res.categories.length === 0) {
        toast.error('Không tìm thấy danh mục hoặc từ vựng nào trong file PDF');
        return;
      }

      // Mark all categories & words as selected by default
      const initialized = res.categories.map((cat) => ({
        ...cat,
        selected: true,
        words: (cat.words || []).map((w) => ({
          ...w,
          selected: true,
        })),
      }));

      setCategories(initialized);

      // Expand first 2 categories
      const initialExpanded: Record<number, boolean> = {};
      initialized.forEach((_, idx) => {
        initialExpanded[idx] = idx < 2;
      });
      setExpandedCategories(initialExpanded);

      toast.success(
        `AI đã trích xuất thành công ${res.totalCategories} danh mục và ${res.totalWords} từ vựng!`,
      );
    } catch (err: unknown) {
      const errorObj = err as Error;
      toast.error(errorObj.message || 'Lỗi khi trích xuất dữ liệu từ PDF');
    } finally {
      setIsExtracting(false);
    }
  };

  // Toggle Category Expand/Collapse
  const toggleExpandCategory = (index: number) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Toggle Category selection
  const handleToggleCategory = (catIndex: number, checked: boolean) => {
    setCategories((prev) => {
      const next = [...prev];
      const cat = { ...next[catIndex] };
      cat.selected = checked;
      cat.words = cat.words.map((w) => ({ ...w, selected: checked }));
      next[catIndex] = cat;
      return next;
    });
  };

  // Toggle Word selection
  const handleToggleWord = (catIndex: number, wordIndex: number, checked: boolean) => {
    setCategories((prev) => {
      const next = [...prev];
      const cat = { ...next[catIndex] };
      const words = [...cat.words];
      words[wordIndex] = { ...words[wordIndex], selected: checked };
      cat.words = words;
      cat.selected = words.some((w) => w.selected);
      next[catIndex] = cat;
      return next;
    });
  };

  // Remove Word
  const handleRemoveWord = (catIndex: number, wordIndex: number) => {
    setCategories((prev) => {
      const next = [...prev];
      const cat = { ...next[catIndex] };
      cat.words = cat.words.filter((_, i) => i !== wordIndex);
      if (cat.words.length === 0) {
        return next.filter((_, i) => i !== catIndex);
      }
      next[catIndex] = cat;
      return next;
    });
  };

  // Rename Category
  const handleStartEditCategory = (index: number, currentName: string) => {
    setEditingCategoryIndex(index);
    setEditedCategoryName(currentName);
  };

  const handleSaveCategoryName = (index: number) => {
    if (!editedCategoryName.trim()) {
      toast.error('Tên danh mục không được để trống');
      return;
    }
    setCategories((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], name: editedCategoryName.trim() };
      return next;
    });
    setEditingCategoryIndex(null);
  };

  // Select all / Deselect all
  const handleToggleAll = (select: boolean) => {
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        selected: select,
        words: cat.words.map((w) => ({ ...w, selected: select })),
      })),
    );
  };

  // Metrics
  const totalExtractedCategories = categories.length;
  const totalExtractedWords = useMemo(
    () => categories.reduce((sum, c) => sum + c.words.length, 0),
    [categories],
  );
  const selectedWordsCount = useMemo(
    () =>
      categories.reduce(
        (sum, c) => sum + c.words.filter((w) => w.selected).length,
        0,
      ),
    [categories],
  );
  const selectedCategoriesCount = useMemo(
    () => categories.filter((c) => c.words.some((w) => w.selected)).length,
    [categories],
  );

  // Save / Import to system
  const handleSaveToDatabase = async () => {
    // Filter and sanitize selected categories and words
    const payloadCategories = categories
      .map((cat) => ({
        name: cat.name.trim(),
        description: cat.description ? cat.description.trim() : undefined,
        words: cat.words
          .filter((w) => w.selected)
          .map((w) => ({
            word: w.word.trim(),
            meaning: w.meaning.trim(),
            ipa: w.ipa ? w.ipa.trim() : undefined,
            level: w.level ? w.level.trim() : undefined,
            partOfSpeech: w.partOfSpeech ? w.partOfSpeech.trim() : undefined,
            example: w.example ? w.example.trim() : undefined,
            exampleMeaning: w.exampleMeaning ? w.exampleMeaning.trim() : undefined,
          })),
      }))
      .filter((cat) => cat.words.length > 0);

    if (payloadCategories.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 từ vựng để lưu vào hệ thống.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await importExtractedWords({
        categories: payloadCategories,
      });

      setSaveResult(res);
      toast.success(res.message);
      onSuccess();
    } catch (err: unknown) {
      const errorObj = err as Error;
      toast.error(errorObj.message || 'Lỗi khi lưu từ vựng vào hệ thống');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset modal state
  const handleReset = () => {
    setSelectedFile(null);
    setFileBase64('');
    setCategories([]);
    setSaveResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-card border border-border shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-muted/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground tracking-tight font-display flex items-center gap-2">
                Trích xuất Danh mục & Từ vựng từ PDF bằng AI
              </h2>
              <p className="text-xs text-muted-foreground">
                Tự động nhận diện các chủ đề tương ứng và danh sách từ vựng chi tiết từ tài liệu.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="size-8 rounded-full text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 3: SUCCESS RESULT SCREEN */}
          {saveResult ? (
            <div className="py-8 text-center space-y-5 animate-in fade-in duration-300">
              <div className="mx-auto size-16 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center ring-8 ring-emerald-500/10">
                <CheckCircle2 className="size-8" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 font-semibold">
                  NHẬP DỮ LIỆU THÀNH CÔNG
                </Badge>
                <h3 className="text-2xl font-bold text-foreground">
                  Đã Lưu Dữ Liệu Vào Hệ Thống!
                </h3>
                <p className="text-sm text-muted-foreground">
                  {saveResult.message}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-2">
                <div className="p-3.5 rounded-xl border border-border/70 bg-card text-center">
                  <span className="text-2xl font-black text-primary block">
                    {saveResult.createdCategories}
                  </span>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                    Danh mục mới
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-border/70 bg-card text-center">
                  <span className="text-2xl font-black text-emerald-600 block">
                    {saveResult.createdWords}
                  </span>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                    Từ vựng mới
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-border/70 bg-card text-center">
                  <span className="text-2xl font-black text-blue-600 block">
                    {saveResult.updatedWords}
                  </span>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                    Từ cập nhật
                  </span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <Button
                  onClick={onClose}
                  className="rounded-xl font-bold shadow-md"
                >
                  Xong & Xem Danh sách Từ vựng
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="rounded-xl gap-2 font-semibold"
                >
                  <RefreshCw className="size-4" /> Trích xuất file PDF khác
                </Button>
              </div>
            </div>
          ) : categories.length === 0 ? (
            /* STEP 1: UPLOAD PDF FILE */
            <div className="space-y-6">
              {/* Dropzone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                  selectedFile
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-border/80 hover:border-primary/40 hover:bg-muted/30 bg-muted/10'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="space-y-3">
                    <div className="size-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center shadow-inner">
                      <FileText className="size-8" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-foreground">
                        {selectedFile.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; Sẵn sàng phân tích
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReset();
                      }}
                      className="text-xs text-destructive hover:bg-destructive/10"
                    >
                      Chọn file khác
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="size-16 rounded-2xl bg-muted text-muted-foreground mx-auto flex items-center justify-center">
                      <UploadCloud className="size-8" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-foreground">
                        Kéo thả file PDF vào đây hoặc bấm để chọn
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Hỗ trợ file PDF tài liệu học tập, giáo trình, danh sách từ vựng theo chủ đề (tối đa 15MB)
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-xl font-semibold gap-1.5"
                    >
                      <FileText className="size-3.5" /> Chọn file PDF
                    </Button>
                  </div>
                )}
              </div>

              {/* Explanatory Callout */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex gap-3 text-xs text-muted-foreground leading-relaxed">
                <Sparkles className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block font-semibold mb-1">
                    Cơ chế hoạt động của Gemini AI:
                  </strong>
                  AI sẽ đọc toàn bộ nội dung trong file PDF, tự động phân nhóm các từ vựng theo từng chủ đề/danh mục (Category). Với mỗi từ vựng, hệ thống sẽ tự động trích xuất định nghĩa tiếng Việt, phiên âm quốc tế (IPA), cấp độ CEFR (A1-C2) và câu ví dụ minh họa kèm dịch nghĩa.
                </div>
              </div>

              {/* Trigger Button */}
              <div className="flex justify-end pt-2">
                <Button
                  size="lg"
                  disabled={!selectedFile || isExtracting}
                  onClick={handleExtractPdf}
                  className="rounded-xl gap-2 font-bold px-7 shadow-md bg-gradient-to-r from-primary to-primary/90 text-primary-foreground"
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Đang đọc và phân tích PDF...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" /> Bắt đầu Phân tích PDF
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            /* STEP 2: PREVIEW & SELECTION SCREEN */
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Summary Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border/80 bg-muted/30">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="gap-1.5 font-bold py-1 px-2.5">
                    <FolderPlus className="size-3.5 text-primary" /> {totalExtractedCategories} Danh mục
                  </Badge>
                  <Badge variant="outline" className="gap-1.5 font-bold py-1 px-2.5">
                    <BookOpen className="size-3.5 text-emerald-600" /> {totalExtractedWords} Từ vựng
                  </Badge>
                  <Badge className="bg-primary text-primary-foreground font-bold py-1 px-2.5">
                    Đã chọn: {selectedWordsCount} từ ({selectedCategoriesCount} danh mục)
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleAll(true)}
                    className="h-8 text-xs font-semibold rounded-lg"
                  >
                    Chọn tất cả
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleAll(false)}
                    className="h-8 text-xs font-semibold rounded-lg"
                  >
                    Bỏ chọn hết
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="h-8 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Đổi file
                  </Button>
                </div>
              </div>

              {/* Categories & Words List */}
              <div className="space-y-4">
                {categories.map((cat, catIdx) => {
                  const isExpanded = !!expandedCategories[catIdx];
                  const isEditingName = editingCategoryIndex === catIdx;
                  const selectedCatWords = cat.words.filter((w) => w.selected).length;

                  return (
                    <Card
                      key={catIdx}
                      className={`border transition-all overflow-hidden ${
                        cat.selected
                          ? 'border-primary/40 bg-card shadow-xs'
                          : 'border-border/60 bg-muted/20 opacity-80'
                      }`}
                    >
                      {/* Category Header */}
                      <div className="p-4 flex items-center justify-between gap-3 bg-muted/40 border-b border-border/50">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <Checkbox
                            checked={cat.selected}
                            onCheckedChange={(checked) =>
                              handleToggleCategory(catIdx, !!checked)
                            }
                          />

                          <div className="min-w-0 flex-1">
                            {isEditingName ? (
                              <div className="flex items-center gap-2 max-w-sm">
                                <Input
                                  value={editedCategoryName}
                                  onChange={(e) => setEditedCategoryName(e.target.value)}
                                  className="h-8 text-xs"
                                  autoFocus
                                />
                                <Button
                                  size="sm"
                                  className="h-8 px-2.5 text-xs"
                                  onClick={() => handleSaveCategoryName(catIdx)}
                                >
                                  <Check className="size-3.5" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-sm text-foreground truncate">
                                  {cat.name}
                                </h3>
                                <button
                                  type="button"
                                  onClick={() => handleStartEditCategory(catIdx, cat.name)}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <Edit2 className="size-3" />
                                </button>
                                <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-semibold">
                                  {selectedCatWords}/{cat.words.length} từ
                                </Badge>
                              </div>
                            )}

                            {cat.description && (
                              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                {cat.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpandCategory(catIdx)}
                          className="h-8 px-2 text-xs font-semibold gap-1 text-muted-foreground hover:text-foreground"
                        >
                          {isExpanded ? (
                            <>
                              Thu gọn <ChevronDown className="size-3.5" />
                            </>
                          ) : (
                            <>
                              Xem {cat.words.length} từ <ChevronRight className="size-3.5" />
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Words list under category */}
                      {isExpanded && (
                        <CardContent className="p-3 space-y-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            {cat.words.map((w: ExtractedWordItem, wordIdx: number) => (
                              <div
                                key={wordIdx}
                                className={`p-3 rounded-xl border text-xs transition-all flex items-start gap-2.5 ${
                                  w.selected
                                    ? 'border-border/80 bg-card'
                                    : 'border-border/40 bg-muted/30 opacity-60'
                                }`}
                              >
                                <Checkbox
                                  checked={w.selected}
                                  onCheckedChange={(checked) =>
                                    handleToggleWord(catIdx, wordIdx, !!checked)
                                  }
                                  className="mt-0.5"
                                />

                                <div className="min-w-0 flex-1 space-y-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="font-bold text-sm text-foreground">
                                        {w.word}
                                      </span>
                                      {w.ipa && (
                                        <span className="font-mono text-muted-foreground text-[11px]">
                                          {w.ipa}
                                        </span>
                                      )}
                                      {w.level && (
                                        <Badge variant="outline" className="text-[10px] px-1 py-0">
                                          {w.level}
                                        </Badge>
                                      )}
                                    </div>

                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleRemoveWord(catIdx, wordIdx)}
                                      className="size-6 text-muted-foreground hover:text-destructive shrink-0"
                                    >
                                      <Trash2 className="size-3" />
                                    </Button>
                                  </div>

                                  <p className="text-foreground font-medium">
                                    {w.meaning}
                                  </p>

                                  {w.example && (
                                    <div className="pt-1 text-[11px] text-muted-foreground border-t border-border/40 space-y-0.5">
                                      <p className="italic">&ldquo;{w.example}&rdquo;</p>
                                      {w.exampleMeaning && (
                                        <p className="text-muted-foreground/80">
                                          {w.exampleMeaning}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {categories.length > 0 && !saveResult && (
          <div className="px-6 py-4 border-t border-border/80 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <div className="text-xs text-muted-foreground">
              Đã chọn <strong className="text-foreground">{selectedWordsCount} từ vựng</strong> trong{' '}
              <strong className="text-foreground">{selectedCategoriesCount} danh mục</strong> để lưu.
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSaving}
                className="rounded-xl font-semibold"
              >
                Hủy
              </Button>
              <Button
                disabled={selectedWordsCount === 0 || isSaving}
                onClick={handleSaveToDatabase}
                className="rounded-xl gap-2 font-bold px-6 shadow-md bg-gradient-to-r from-primary to-primary/90 text-primary-foreground"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Đang lưu dữ liệu...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4" /> Lưu vào Hệ Thống ({selectedWordsCount} từ)
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

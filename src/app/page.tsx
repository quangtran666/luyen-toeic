'use client';

import { PracticeInput } from '@/features/practice/components/practice-input';
import { AnalysisRenderer } from '@/features/practice/components/analysis-renderer';
import { usePractice } from '@/features/practice/hooks/use-practice';
import { BookOpen } from 'lucide-react';

export default function Home() {
  const { analysis, isProcessing, submitQuestionAsync, error } = usePractice();

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm transition-shadow dark:bg-zinc-950/80">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105 sm:size-12">
              <BookOpen className="size-5 sm:size-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl">
                Luyện tập TOEIC Reading
              </h1>
              <p className="truncate text-xs text-muted-foreground sm:text-sm">
                Parts 5, 6, 7 - Giải thích chi tiết bằng tiếng Việt
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
          {/* Input Section */}
          <section 
            className="animate-in fade-in slide-in-from-top-4 rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-zinc-950 sm:p-6"
            role="region"
            aria-label="Khu vực nhập câu hỏi"
          >
            <PracticeInput
              onSubmit={submitQuestionAsync}
              isProcessing={isProcessing}
            />
          </section>

          {/* Analysis Section - Shows structured TOEIC analysis */}
          {(analysis || isProcessing || error) && (
            <section 
              className="animate-in fade-in slide-in-from-bottom-4 space-y-4"
              role="region"
              aria-label="Kết quả phân tích"
            >
              <AnalysisRenderer 
                analysis={analysis} 
                isLoading={isProcessing}
                error={error}
              />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

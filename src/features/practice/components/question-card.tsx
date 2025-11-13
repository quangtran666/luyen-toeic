import type { QuestionExplanation } from '../types/practice.types';
import type { DeepPartial } from '../lib/schema';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface QuestionCardProps {
  explanation: DeepPartial<QuestionExplanation> | undefined;
  index?: number;
}

export function QuestionCard({ explanation, index = 0 }: QuestionCardProps) {
  if (!explanation) return null;
  
  const { questionNumber, part, questionText, options, correctAnswer, explanation: details } = explanation;

  return (
    <Card 
      className="animate-in fade-in slide-in-from-bottom-4 transition-all hover:shadow-lg"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardHeader className="space-y-2 pb-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base sm:text-lg">
            Câu {questionNumber || '...'}
          </CardTitle>
          {part && (
            <Badge variant="outline" className="shrink-0">
              Part {part}
            </Badge>
          )}
        </div>
        {questionText && (
          <CardDescription className="text-sm leading-relaxed sm:text-base">
            {questionText}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-5">
        {/* Options */}
        {options && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Các lựa chọn:</p>
            <div className="space-y-2 text-sm">
              {(['A', 'B', 'C', 'D'] as const).map((letter) => (
                <div 
                  key={letter}
                  className={`flex items-start gap-2 rounded-md p-2 transition-colors ${
                    letter === correctAnswer 
                      ? 'bg-primary/5 ring-1 ring-primary/20' 
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <span className="font-semibold text-foreground">{letter}.</span>
                  <span className="flex-1">{options[letter] || '...'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Correct Answer */}
        {correctAnswer && (
          <div className="flex items-center gap-2 rounded-lg bg-primary/5 p-3">
            <span className="text-sm font-medium">Đáp án đúng:</span>
            <Badge variant="default" className="text-base font-bold">
              {correctAnswer}
            </Badge>
          </div>
        )}

        {/* Explanation Sections */}
        {details && (
          <div className="space-y-4 border-t pt-4">
            {/* Meaning */}
            {details.meaning && (
              <div className="space-y-1.5">
                <h4 className="text-sm font-semibold">Ý nghĩa:</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">{details.meaning}</p>
              </div>
            )}

            {/* Grammar Analysis */}
            {details.grammarAnalysis && (
              <div className="space-y-1.5">
                <h4 className="text-sm font-semibold">Phân tích ngữ pháp:</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">{details.grammarAnalysis}</p>
              </div>
            )}

            {/* Vocabulary Notes */}
            {details.vocabularyNotes && (
              <div className="space-y-1.5">
                <h4 className="text-sm font-semibold">Từ vựng quan trọng:</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">{details.vocabularyNotes}</p>
              </div>
            )}

            {/* Why Correct */}
            {details.whyCorrect && (
              <div className="space-y-1.5">
                <h4 className="text-sm font-semibold">Tại sao đáp án đúng:</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">{details.whyCorrect}</p>
              </div>
            )}

            {/* Why Others Wrong (optional) */}
            {details.whyOthersWrong && (
              <div className="space-y-1.5">
                <h4 className="text-sm font-semibold">Tại sao các đáp án khác sai:</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">{details.whyOthersWrong}</p>
              </div>
            )}

            {/* Grammar Point (optional) */}
            {details.grammarPoint && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">Điểm ngữ pháp:</span>
                <Badge variant="secondary" className="font-normal">
                  {details.grammarPoint}
                </Badge>
              </div>
            )}

            {/* TOEIC Tip (optional) */}
            {details.toeicTip && (
              <div className="rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted/70">
                <h4 className="mb-1.5 text-sm font-semibold">💡 Mẹo TOEIC:</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">{details.toeicTip}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

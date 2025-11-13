'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader } from '@/components/ai-elements/loader';
import { cn } from '@/lib/utils';
import { AlertCircle, Sparkles } from 'lucide-react';
import type { PracticePart, InputMode, QuestionInput } from '../types/practice.types';
import { TextInput } from './text-input';
import { ImageInput } from './image-input';

interface PracticeInputProps {
  onSubmit: (input: QuestionInput) => Promise<void>;
  isProcessing: boolean;
}

const PART_OPTIONS: { value: PracticePart; label: string }[] = [
  { value: '5', label: 'Part 5' },
  { value: '6', label: 'Part 6' },
  { value: '7', label: 'Part 7' },
  { value: 'auto', label: 'Auto' },
];

export function PracticeInput({ onSubmit, isProcessing }: PracticeInputProps) {
  // State for part selection
  const [selectedPart, setSelectedPart] = useState<PracticePart>('5');
  
  // State for mode selection
  const [selectedMode, setSelectedMode] = useState<InputMode>('text');
  
  // State for text input
  const [textContent, setTextContent] = useState('');
  
  // State for image input
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string>('');
  
  // State for validation errors
  const [validationError, setValidationError] = useState<string | null>(null);

  // Handle image selection
  const handleImageSelect = (file: File, base64: string) => {
    setImageFile(file);
    setImageBase64(base64);
    setValidationError(null);
  };

  // Handle image error
  const handleImageError = (error: string) => {
    setValidationError(error);
  };

  // Validate input before submission
  const validateInput = (): boolean => {
    if (selectedMode === 'text') {
      if (!textContent.trim()) {
        setValidationError('Vui lòng nhập nội dung câu hỏi');
        return false;
      }
    } else {
      if (!imageFile || !imageBase64) {
        setValidationError('Vui lòng chọn một hình ảnh');
        return false;
      }
    }
    setValidationError(null);
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateInput()) {
      return;
    }

    const input: QuestionInput = {
      mode: selectedMode,
      part: selectedPart,
      content: selectedMode === 'text' ? textContent : imageBase64,
      imageFile: selectedMode === 'image' ? imageFile || undefined : undefined,
    };

    await onSubmit(input);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Part Selector */}
      <div className="space-y-3">
        <label className="text-sm font-medium" id="part-selector-label">
          Chọn phần luyện tập
        </label>
        <div 
          className="flex flex-wrap gap-2"
          role="group"
          aria-labelledby="part-selector-label"
        >
          {PART_OPTIONS.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={selectedPart === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPart(option.value)}
              disabled={isProcessing}
              className={cn(
                'transition-all duration-200 hover:scale-105',
                selectedPart === option.value && 'ring-2 ring-ring ring-offset-2 shadow-sm',
              )}
              aria-pressed={selectedPart === option.value}
              aria-label={`Chọn ${option.label}`}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Mode Tabs */}
      <Tabs value={selectedMode} onValueChange={(value) => setSelectedMode(value as InputMode)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger 
            value="text" 
            disabled={isProcessing}
            className="transition-all duration-200"
          >
            Văn bản
          </TabsTrigger>
          <TabsTrigger 
            value="image" 
            disabled={isProcessing}
            className="transition-all duration-200"
          >
            Hình ảnh
          </TabsTrigger>
        </TabsList>

        <TabsContent 
          value="text" 
          className="mt-4 animate-in fade-in slide-in-from-top-2"
        >
          <TextInput
            value={textContent}
            onChange={setTextContent}
            disabled={isProcessing}
          />
        </TabsContent>

        <TabsContent 
          value="image" 
          className="mt-4 animate-in fade-in slide-in-from-top-2"
        >
          <ImageInput
            onImageSelect={handleImageSelect}
            onError={handleImageError}
            disabled={isProcessing}
          />
        </TabsContent>
      </Tabs>

      {/* Error Display */}
      {validationError && (
        <Alert 
          variant="destructive" 
          className="animate-in fade-in slide-in-from-top-2"
          role="alert"
        >
          <AlertCircle className="size-4" />
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={isProcessing}
        className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        size="lg"
        aria-label="Gửi câu hỏi để nhận giải thích"
      >
        {isProcessing ? (
          <>
            <Loader className="mr-2 size-5" />
            <span>Đang xử lý...</span>
          </>
        ) : (
          <>
            <Sparkles className="mr-2 size-5" />
            <span>Giải thích</span>
          </>
        )}
      </Button>
    </div>
  );
}

'use client';

import { experimental_useObject as useObject } from '@ai-sdk/react';
import type { QuestionInput } from '../types/practice.types';
import { toeicAnalysisSchema } from '../lib/schema';

export function usePractice() {
  const { object, submit, isLoading, error, stop } = useObject({
    api: '/api/practice',
    schema: toeicAnalysisSchema,
    onFinish({ object, error }) {
      if (error) {
        console.error('Schema validation error:', error);
      } else {
        console.log('Analysis completed:', object);
      }
    },
    onError(error) {
      console.error('API error:', error);
    },
  });

  const submitQuestionAsync = async (input: QuestionInput): Promise<void> => {
    await submit({
      mode: input.mode,
      part: input.part,
      content: input.content,
    });
  };

  const reset = (): void => {
    stop();
    window.location.reload();
  };

  return {
    isProcessing: isLoading,
    submitQuestionAsync,
    reset,
    stop,
    analysis: object,
    error,
  };
}

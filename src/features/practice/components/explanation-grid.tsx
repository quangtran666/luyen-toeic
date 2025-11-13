import type { QuestionExplanation } from '../types/practice.types';
import type { DeepPartial } from '../lib/schema';
import { QuestionCard } from './question-card';

interface ExplanationGridProps {
  explanations: DeepPartial<QuestionExplanation>[] | undefined;
}

export function ExplanationGrid({ explanations }: ExplanationGridProps) {
  // Handle empty state
  if (!explanations || explanations.length === 0) {
    return null;
  }

  // Single card takes full width, multiple cards use grid
  const isSingleCard = explanations.length === 1;

  return (
    <div 
      className={
        isSingleCard 
          ? "w-full" 
          : "grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:gap-6"
      }
    >
      {explanations.map((explanation, index) => (
        <QuestionCard 
          key={`${explanation?.questionNumber || index}`} 
          explanation={explanation}
          index={index}
        />
      ))}
    </div>
  );
}

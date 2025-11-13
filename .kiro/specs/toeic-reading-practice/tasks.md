# Implementation Plan

- [x] 1. Set up core types and project structure
  - Create `src/features/practice/types/practice.types.ts` with all TypeScript interfaces: PracticePart, InputMode, QuestionInput, QuestionExplanation, PracticeState
  - Define type unions and ensure strict typing for all data structures
  - _Requirements: 1.1, 2.1, 3.1, 4.2, 5.5_

- [x] 2. Implement AI service integration
  - [x] 2.1 Create AI service with OpenRouter configuration
    - Write `src/features/practice/services/ai-service.ts` with `generateExplanationsAsync` function
    - Configure Vercel AI SDK with @openrouter/ai-sdk-provider
    - Set up nvidia/nemotron-nano-12b-v2-vl model with thinking enabled
    - Implement Vietnamese system prompt for question analysis
    - Handle both text and image (base64) inputs
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 2.2 Create question parser service
    - Write `src/features/practice/services/question-parser.ts` with `parseAIResponseToExplanations` function
    - Parse JSON array responses from AI into QuestionExplanation objects
    - Handle missing fields with sensible defaults
    - Validate structure and ensure all required fields are present
    - _Requirements: 2.3, 2.4, 2.5, 4.2, 5.5_

  - [x] 2.3 Create API route for server-side AI processing
    - Write `src/app/api/practice/route.ts` with POST handler
    - Accept QuestionInput from request body
    - Call AI service and return explanations
    - Handle errors and return appropriate status codes
    - _Requirements: 4.1, 4.2, 8.1, 8.2, 8.3_

- [x] 3. Build practice hook for state management
  - Write `src/features/practice/hooks/use-practice.ts` with usePractice hook
  - Implement PracticeState with input, explanations, isProcessing, and error
  - Create `submitQuestionAsync` function that calls API route
  - Create `reset` function to clear state
  - Handle loading and error states
  - _Requirements: 2.1, 3.1, 4.1, 7.3, 7.4_

- [x] 4. Create image input component
  - [x] 4.1 Implement image upload and preview
    - Write `src/features/practice/components/image-input.tsx`
    - Add file input for selecting JPEG/PNG images
    - Implement clipboard paste listener for images
    - Display image preview after selection
    - Convert image to base64 for AI processing
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 4.2 Add image validation
    - Validate file format (JPEG, PNG only)
    - Validate file size (max 5MB)
    - Display Vietnamese error messages for invalid inputs
    - _Requirements: 3.3, 6.5_

- [x] 5. Create text input component
  - Write `src/features/practice/components/text-input.tsx`
  - Implement textarea with proper styling using shadcn/ui
  - Handle multi-line text input for questions
  - Disable input during processing
  - _Requirements: 2.1, 2.2, 6.2_

- [x] 6. Build practice input panel
  - [x] 6.1 Create part selector
    - Write `src/features/practice/components/practice-input.tsx`
    - Implement buttons for Part 5, 6, 7, and Auto selection
    - Highlight selected part with visual feedback
    - Store selected part in component state
    - _Requirements: 1.1, 1.2, 1.4, 6.1, 6.2_

  - [x] 6.2 Implement mode tabs
    - Add Tabs component from shadcn/ui for Text and Image modes
    - Switch between TextInput and ImageInput based on selected mode
    - Maintain mode selection state
    - _Requirements: 2.1, 3.1, 6.3_

  - [x] 6.3 Add submit button and form handling
    - Create "Giải thích" button using shadcn/ui Button
    - Validate input before submission (non-empty text or image selected)
    - Call `submitQuestionAsync` from usePractice hook
    - Show loading state during processing
    - Display error messages in Vietnamese using Alert component
    - _Requirements: 2.1, 3.1, 4.1, 6.4, 6.5_

- [x] 7. Create question card component
  - Write `src/features/practice/components/question-card.tsx`
  - Display question number and part in card header
  - Render question text and options A/B/C/D
  - Show correct answer with Badge component
  - Display all explanation sections: meaning, grammar analysis, vocabulary, why correct, why others wrong
  - Show optional grammar point and TOEIC tip if present
  - Style with shadcn/ui Card component
  - _Requirements: 4.3, 4.4, 4.5, 5.5, 6.2, 6.5_

- [x] 8. Build explanation grid layout
  - Write `src/features/practice/components/explanation-grid.tsx`
  - Implement responsive grid: single column on mobile, two columns on desktop
  - Map explanations array to QuestionCard components
  - Handle empty state when no explanations exist
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.2_

- [x] 9. Integrate components in main page
  - Update `src/app/page.tsx` to use practice feature
  - Add app header with Vietnamese title for TOEIC Reading Parts 5-7
  - Render PracticeInput component with usePractice hook
  - Render ExplanationGrid component with explanations from state
  - Apply responsive layout and styling
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 6.5_

- [x] 10. Configure environment and dependencies
  - Add OPENROUTER_API_KEY to `.env.local`
  - Verify all required packages are installed: @ai-sdk/react, @openrouter/ai-sdk-provider, ai
  - Ensure shadcn/ui components are available: Button, Tabs, Card, Badge, Alert, Textarea, Field
  - _Requirements: 4.1, 6.2_

- [x] 11. Add Vietnamese language content
  - Create Vietnamese labels for all UI elements: part buttons, mode tabs, submit button
  - Write Vietnamese placeholder text for inputs
  - Define Vietnamese error messages for validation and API errors
  - Ensure AI system prompt requests Vietnamese explanations
  - _Requirements: 4.1, 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 12. Implement auto part detection
  - Enhance AI system prompt to detect part type when "Auto" is selected
  - Parse detected part from AI response
  - Update QuestionExplanation with detected part
  - _Requirements: 1.3_

- [x] 13. Polish UI and responsive design
  - Apply Tailwind CSS for consistent spacing and typography
  - Ensure mobile-first responsive design
  - Test grid layout on different screen sizes
  - Add smooth transitions and loading states
  - Verify accessibility of form inputs and buttons
  - _Requirements: 5.2, 5.3, 5.4, 6.5_

- [ ]* 14. Manual testing and validation
  - Test text input with single and multiple questions
  - Test image input via clipboard paste and file selection
  - Test all four part selections (5, 6, 7, Auto)
  - Verify Vietnamese explanations are generated correctly
  - Test responsive grid layout on mobile and desktop
  - Verify error handling for empty inputs and API failures
  - Confirm session-based state (data clears on refresh)
  - _Requirements: 1.1, 2.1, 2.2, 2.3, 3.1, 3.2, 3.4, 4.1, 5.2, 5.3, 7.4_

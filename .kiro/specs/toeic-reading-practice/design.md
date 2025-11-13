# Design Document

## Overview

The TOEIC Reading Practice App is a client-side web application built with Next.js 15, React 19, TypeScript, and Tailwind CSS and AI Element Shadcn. It uses the Vercel AI SDK with OpenRouter to provide AI-powered explanations for TOEIC Reading questions (Parts 5, 6, and 7). The application follows a vertical slice architecture where each feature is self-contained with its UI, logic, and services.

The app operates entirely in-memory without persistent storage, providing a lightweight, session-based practice experience. Users can input questions via text or image, and receive detailed Vietnamese explanations displayed in a responsive card grid layout.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Browser (Client)                   │
│                                                       │
│  ┌────────────────────────────────────────────────┐ │
│  │           Next.js App Router Page              │ │
│  │                                                 │ │
│  │  ┌──────────────┐      ┌──────────────────┐  │ │
│  │  │ Input Panel  │      │ Explanation Grid │  │ │
│  │  │ - Part Select│      │ - Question Cards │  │ │
│  │  │ - Mode Tabs  │      │ - 2-col layout   │  │ │
│  │  │ - Text/Image │      │                  │  │ │
│  │  └──────────────┘      └──────────────────┘  │ │
│  │                                                 │ │
│  │  ┌──────────────────────────────────────────┐ │ │
│  │  │        Practice Service Hook             │ │ │
│  │  │  - Question detection                    │ │ │
│  │  │  - AI explanation generation             │ │ │
│  │  └──────────────────────────────────────────┘ │ │
│  │                                                 │ │
│  │  ┌──────────────────────────────────────────┐ │ │
│  │  │         AI Service (Vercel SDK)          │ │ │
│  │  │  - OpenRouter integration                │ │ │
│  │  │  - Image vision support                  │ │ │
│  │  └──────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   OpenRouter API     │
              │  (nvidia/nemotron)   │
              └──────────────────────┘
```

### Technology Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + AI Elements
- **AI SDK**: Vercel AI SDK (@ai-sdk/react)
- **AI Provider**: @openrouter/ai-sdk-provider
- **Model**: nvidia/nemotron-nano-12b-v2-vl:free (with vision and thinking enabled)
- **Package Manager**: Bun

### Vertical Slice Structure

```
src/
├── app/
│   ├── page.tsx                    # Main practice page
│   └── api/
│       └── practice/
│           └── route.ts            # API route for AI processing
├── features/
│   └── practice/
│       ├── components/
│       │   ├── practice-input.tsx      # Input panel with part/mode selection
│       │   ├── text-input.tsx          # Text input area
│       │   ├── image-input.tsx         # Image upload/paste handler
│       │   ├── explanation-grid.tsx    # Grid layout for cards
│       │   └── question-card.tsx       # Individual explanation card
│       ├── hooks/
│       │   └── use-practice.ts         # Main practice logic hook
│       ├── services/
│       │   ├── ai-service.ts           # AI SDK integration
│       │   └── question-parser.ts      # Question detection logic
│       └── types/
│           └── practice.types.ts       # TypeScript types
└── lib/
    └── utils.ts                        # Shared utilities
```

## Components and Interfaces

### Core Types

```typescript
// src/features/practice/types/practice.types.ts

export type PracticePart = '5' | '6' | '7' | 'auto';

export type InputMode = 'text' | 'image';

export interface QuestionInput {
  mode: InputMode;
  part: PracticePart;
  content: string;              // Text content or base64 image
  imageFile?: File;             // Original file if image mode
}

export interface QuestionExplanation {
  questionNumber: string;       // e.g., "101" or "1"
  part: PracticePart;
  questionText: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: {
    meaning: string;            // Sentence/passage meaning
    grammarAnalysis: string;    // Grammar explanation
    vocabularyNotes: string;    // Key vocabulary
    whyCorrect: string;         // Why the answer is correct
    whyOthersWrong?: string;    // Why other options are wrong
    grammarPoint?: string;      // Grammar concept name
    toeicTip?: string;          // Optional TOEIC tip
  };
}

export interface PracticeState {
  input: QuestionInput | null;
  explanations: QuestionExplanation[];
  isProcessing: boolean;
  error: string | null;
}
```

### Component Interfaces

#### PracticeInput Component

Handles part selection, mode switching, and input collection.

**Props:**
```typescript
interface PracticeInputProps {
  onSubmit: (input: QuestionInput) => Promise<void>;
  isProcessing: boolean;
}
```

**Behavior:**
- Renders part selector buttons (Part 5, 6, 7, Auto)
- Renders mode tabs (Text, Image)
- Conditionally renders TextInput or ImageInput based on mode
- Provides "Giải thích" button to submit

#### TextInput Component

Text area for pasting questions.

**Props:**
```typescript
interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}
```

#### ImageInput Component

Handles image upload via paste, file selection, or URL.

**Props:**
```typescript
interface ImageInputProps {
  onImageSelect: (file: File) => void;
  disabled: boolean;
}
```

**Behavior:**
- Listens for paste events to capture clipboard images
- Provides file input for selecting images
- Optionally provides URL input field
- Displays image preview after selection

#### ExplanationGrid Component

Responsive grid layout for question cards.

**Props:**
```typescript
interface ExplanationGridProps {
  explanations: QuestionExplanation[];
}
```

**Behavior:**
- Single column on mobile
- Two columns on desktop (md breakpoint)
- Maps explanations to QuestionCard components

#### QuestionCard Component

Displays a single question's explanation.

**Props:**
```typescript
interface QuestionCardProps {
  explanation: QuestionExplanation;
}
```

**Structure:**
- Card header: Question number and part
- Question text and options (A/B/C/D)
- Correct answer badge
- Explanation sections:
  - Meaning
  - Grammar analysis
  - Vocabulary notes
  - Why correct
  - Why others wrong (if present)
  - Grammar point badge (if present)
  - TOEIC tip (if present)

### Service Interfaces

#### AI Service

```typescript
// src/features/practice/services/ai-service.ts

export interface AIServiceConfig {
  apiKey: string;
  model: string;
}

export async function generateExplanationsAsync(
  input: QuestionInput
): Promise<QuestionExplanation[]>
```

**Behavior:**
- Constructs system prompt in Vietnamese
- Includes instructions for detecting multiple questions
- For text mode: sends text content
- For image mode: sends base64 image with vision
- Parses AI response into structured QuestionExplanation array
- Handles errors and returns empty array on failure

#### Question Parser

```typescript
// src/features/practice/services/question-parser.ts

export function parseAIResponseToExplanations(
  aiResponse: string,
  detectedPart: PracticePart
): QuestionExplanation[]
```

**Behavior:**
- Parses AI-generated JSON or structured text
- Extracts question number, text, options, answer, and explanation
- Validates structure and fills in defaults where needed
- Returns array of QuestionExplanation objects

### Hook Interface

#### usePractice Hook

```typescript
// src/features/practice/hooks/use-practice.ts

export function usePractice() {
  const [state, setState] = useState<PracticeState>({
    input: null,
    explanations: [],
    isProcessing: false,
    error: null,
  });

  const submitQuestionAsync = async (input: QuestionInput): Promise<void> => {
    // Set processing state
    // Call AI service
    // Update explanations
    // Handle errors
  };

  const reset = (): void => {
    // Clear state
  };

  return {
    ...state,
    submitQuestionAsync,
    reset,
  };
}
```

## Data Models

### In-Memory State Management

Since the app requires no persistent storage, all state is managed in React component state via the `usePractice` hook. State is lost on page refresh.

**State Flow:**
1. User selects part and mode
2. User provides input (text or image)
3. User clicks "Giải thích"
4. `submitQuestionAsync` is called
5. AI service processes input
6. Explanations are stored in `state.explanations`
7. ExplanationGrid renders cards
8. User can reset and start over

### AI Prompt Structure

The AI service constructs prompts with the following structure:

**System Prompt (Vietnamese):**
```
Bạn là một trợ lý TOEIC chuyên nghiệp. Nhiệm vụ của bạn là phân tích câu hỏi TOEIC Reading và cung cấp giải thích chi tiết bằng tiếng Việt.

Đầu vào có thể chứa một hoặc nhiều câu hỏi. Hãy phát hiện tất cả các câu hỏi và trả lời từng câu.

Với mỗi câu hỏi, hãy cung cấp:
1. Số câu hỏi (nếu có)
2. Phần (Part 5, 6, hoặc 7)
3. Nội dung câu hỏi và các lựa chọn A/B/C/D
4. Đáp án đúng
5. Giải thích chi tiết bao gồm:
   - Ý nghĩa của câu/đoạn văn
   - Phân tích ngữ pháp
   - Từ vựng quan trọng
   - Tại sao đáp án đúng
   - Tại sao các đáp án khác sai (nếu hữu ích)
   - Điểm ngữ pháp (nếu có)
   - Mẹo TOEIC (nếu có)

Trả về kết quả dưới dạng JSON array với cấu trúc sau:
[
  {
    "questionNumber": "101",
    "part": "5",
    "questionText": "...",
    "options": {"A": "...", "B": "...", "C": "...", "D": "..."},
    "correctAnswer": "B",
    "explanation": {
      "meaning": "...",
      "grammarAnalysis": "...",
      "vocabularyNotes": "...",
      "whyCorrect": "...",
      "whyOthersWrong": "...",
      "grammarPoint": "...",
      "toeicTip": "..."
    }
  }
]
```

**User Prompt:**
- For text: The pasted text content
- For image: "Hãy phân tích các câu hỏi TOEIC trong hình ảnh này" + base64 image

## Error Handling

### Error Categories

1. **Input Validation Errors**
   - Empty text input
   - Invalid image format
   - No image selected

2. **AI Service Errors**
   - API key missing
   - Network failure
   - Rate limiting
   - Invalid response format

3. **Parsing Errors**
   - Unable to detect questions
   - Malformed AI response
   - Missing required fields

### Error Handling Strategy

- All errors are caught and stored in `state.error`
- Error messages are displayed in Vietnamese above the input area
- Users can dismiss errors and retry
- Errors are cleared on new submission attempts

**Example Error Messages (Vietnamese):**
- "Vui lòng nhập nội dung câu hỏi"
- "Vui lòng chọn một hình ảnh"
- "Không thể xử lý yêu cầu. Vui lòng thử lại"
- "Không tìm thấy câu hỏi trong nội dung đã nhập"

### Error Recovery

- Network errors: Display retry button
- Parsing errors: Log details to console, show generic message to user
- Validation errors: Highlight invalid fields

## Testing Strategy

### Unit Testing Focus

Given the MVP nature and testing guidelines, focus on core logic:

1. **Question Parser Tests**
   - Test parsing valid AI responses
   - Test handling malformed responses
   - Test default value assignment

2. **Type Safety**
   - Ensure TypeScript strict mode
   - Validate all interfaces are properly typed
   - Use utility types to reduce redundancy

### Manual Testing Checklist

1. **Part Selection**
   - Verify all four parts can be selected
   - Verify Auto mode works

2. **Text Input**
   - Test single question
   - Test multiple questions
   - Test questions with and without numbering

3. **Image Input**
   - Test clipboard paste
   - Test file selection
   - Test JPEG and PNG formats
   - Test image with single question
   - Test image with multiple questions

4. **Explanation Display**
   - Verify single card layout
   - Verify two-column grid on desktop
   - Verify single column on mobile
   - Verify all explanation fields render correctly

5. **Vietnamese Language**
   - Verify all UI text is in Vietnamese
   - Verify all explanations are in Vietnamese
   - Verify error messages are in Vietnamese

6. **Error Handling**
   - Test empty input submission
   - Test invalid image format
   - Test network failure scenarios

### Integration Testing

- Test full flow: input → AI processing → display
- Verify AI SDK integration with OpenRouter
- Verify vision model processes images correctly
- Verify thinking mode provides detailed explanations

### Performance Considerations

- Image files should be compressed before base64 encoding
- Limit image size to 5MB
- Show loading state during AI processing
- Debounce rapid submissions

## Implementation Notes

### React 19 Specific

- Use `<Context>` directly instead of `<Context.Provider>`
- Avoid `useMemo` and `useCallback` (compiler optimizations)
- Use `use()` hook for promises where applicable

### shadcn/ui Components to Use

- `Button` - for part selection and submit
- `Tabs` - for Text/Image mode switching
- `Textarea` - for text input
- `Card` - for question explanation cards
- `Badge` - for correct answer and grammar points
- `Alert` - for error messages
- `Field` - for form inputs with labels

### AI Elements to Use

- `<Loader>` - for processing state
- `<Message>` - for displaying AI responses if needed
- Consider using `<Artifact>` for displaying explanations

### Styling Guidelines

- Use Tailwind utility classes
- Follow shadcn/ui design tokens
- Responsive breakpoints: sm, md, lg
- Grid: `grid-cols-1 md:grid-cols-2`
- Spacing: consistent padding and margins
- Typography: clear hierarchy for explanations

### Environment Variables

```env
OPENROUTER_API_KEY=your_api_key_here
```

### API Route Structure

```typescript
// src/app/api/practice/route.ts

export async function POST(request: Request) {
  const { input } = await request.json();
  
  // Call AI service
  const explanations = await generateExplanationsAsync(input);
  
  return Response.json({ explanations });
}
```

This keeps the AI logic server-side while maintaining a clean client-side architecture.

## Summary

This design provides a clean, minimal MVP architecture for the TOEIC Reading practice app. It leverages modern React patterns, vertical slice architecture, and the Vercel AI SDK to deliver a focused learning experience. The in-memory state management keeps the app lightweight, while the responsive card grid and Vietnamese explanations ensure an excellent user experience for TOEIC learners.

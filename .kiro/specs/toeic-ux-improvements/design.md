# Design Document

## Overview

Thiết kế cải tiến UX cho ứng dụng luyện tập TOEIC Reading tập trung vào việc tối ưu hóa layout, đơn giản hóa input, và nâng cao chất lượng giải thích. Giải pháp sử dụng fixed input section với scrollable chat container, unified input component, và model qwen3-vl-8b-thinking với reasoning capabilities.

## Architecture

### Layout Structure

```
┌─────────────────────────────────────────┐
│           Header (Sticky)               │
├─────────────────────────────────────────┤
│                                         │
│   Chat Container (Scrollable)           │
│   - Max width: 1400px                   │
│   - Flex-grow to fill space             │
│   - Independent scroll                  │
│                                         │
├─────────────────────────────────────────┤
│   Input Section (Fixed Bottom)          │
│   - Part Selector (inline)              │
│   - Unified Input (text/image)          │
│   - Submit Button                       │
└─────────────────────────────────────────┘
```

### Component Hierarchy

- `page.tsx` - Main layout với fixed input
- `ConversationContainer` - Scrollable chat area
- `PracticeInput` - Unified input component
  - Part selector (inline)
  - Unified input field (text/image toggle)
  - Submit button

## Components and Interfaces

### 1. Page Layout (`src/app/page.tsx`)

**Changes:**
- Thay đổi max-width từ `max-w-5xl` (1024px) sang `max-w-7xl` (1280px) hoặc custom `max-w-[1400px]`
- Sử dụng `flex` layout với `flex-col` và `h-screen` để control viewport height
- Chat container: `flex-1 overflow-y-auto` để scroll độc lập
- Input section: Không còn trong scroll area, fixed ở bottom

```typescript
// Layout structure
<div className="flex h-screen flex-col">
  <header>...</header>
  <main className="flex-1 overflow-hidden">
    <div className="flex h-full flex-col max-w-[1400px] mx-auto">
      {/* Scrollable chat */}
      <div className="flex-1 overflow-y-auto">
        <ConversationContainer>...</ConversationContainer>
      </div>
      
      {/* Fixed input */}
      <div className="shrink-0 border-t bg-background">
        <PracticeInput />
      </div>
    </div>
  </main>
</div>
```

### 2. Unified Input Component (`src/features/practice/components/practice-input.tsx`)

**Changes:**
- Di chuyển Part Selector lên đầu component (trước input area)
- Loại bỏ mode toggle buttons hoàn toàn
- Single unified input field với:
  - Textarea cho text input
  - Paste handler cho clipboard images
  - Image preview khi paste image
  - Clear button để xóa image và quay về text mode
- Loại bỏ helper text "💡 Có thể dán một hoặc nhiều câu hỏi cùng lúc"
- Compact layout để giảm chiều cao

```typescript
interface UnifiedInputProps {
  textValue: string;
  onTextChange: (value: string) => void;
  imageFile: File | null;
  imagePreview: string | null;
  onImagePaste: (file: File, base64: string) => void;
  onImageClear: () => void;
  disabled: boolean;
}

// Component structure
<div className="space-y-3">
  {/* Part Selector - Inline */}
  <div className="flex items-center gap-2">
    <span className="text-sm font-medium">Part:</span>
    {PART_OPTIONS.map(...)}
  </div>
  
  {/* Unified Input Area */}
  <div className="min-h-[120px] relative">
    {imagePreview ? (
      <div className="relative">
        <img src={imagePreview} alt="Pasted question" />
        <Button onClick={onImageClear}>Clear</Button>
      </div>
    ) : (
      <Textarea 
        onPaste={handlePaste}
        placeholder="Nhập hoặc dán câu hỏi TOEIC..."
      />
    )}
  </div>
  
  {/* Submit Button */}
  <Button>Giải thích</Button>
</div>
```

### 3. API Route (`src/app/api/practice/route.ts`)

**Changes:**
- Thay đổi model từ `nvidia/nemotron-nano-12b-v2-vl:free` sang `qwen/qwen3-vl-8b-thinking`
- Cập nhật system prompt để nhấn mạnh giải thích chi tiết
- Thêm instructions cho reasoning steps

```typescript
const model = openrouter("qwen/qwen3-vl-8b-thinking");

const systemPrompt = `Bạn là một trợ lý TOEIC chuyên nghiệp. Nhiệm vụ của bạn là phân tích câu hỏi TOEIC Reading và cung cấp giải thích CỰC KỲ CHI TIẾT bằng tiếng Việt đơn giản, dễ hiểu.

QUAN TRỌNG - Cấu trúc giải thích:

1. PHÂN TÍCH CÂU HỎI:
   - Xác định loại câu hỏi (ngữ pháp, từ vựng, đọc hiểu)
   - Xác định điểm kiến thức cần kiểm tra

2. GIẢI THÍCH ĐÁP ÁN ĐÚNG:
   - Giải thích TẠI SAO đáp án này đúng
   - Phân tích ngữ pháp chi tiết (nếu có)
   - Giải thích nghĩa của từ vựng với ví dụ cụ thể
   - Dịch câu hoàn chỉnh sang tiếng Việt

3. PHÂN TÍCH CÁC ĐÁP ÁN SAI:
   - Với MỖI đáp án sai, giải thích TẠI SAO nó sai
   - Chỉ ra lỗi ngữ pháp hoặc nghĩa không phù hợp
   - So sánh với đáp án đúng

4. KIẾN THỨC NGỮ PHÁP:
   - Giải thích quy tắc ngữ pháp liên quan
   - Đưa ra công thức hoặc cấu trúc
   - Cho ví dụ minh họa bằng tiếng Việt

5. MẸO TOEIC:
   - Cách nhận biết nhanh loại câu hỏi này
   - Chiến lược làm bài
   - Những lỗi thường gặp cần tránh

Sử dụng ngôn ngữ đơn giản, tránh thuật ngữ phức tạp. Mục tiêu là giúp người học HIỂU SÂU, không chỉ biết đáp án.`;
```

## Data Models

### QuestionInput (No changes)

```typescript
interface QuestionInput {
  mode: 'text' | 'image';
  part: '5' | '6' | '7' | 'auto';
  content: string; // text or base64 image
  imageFile?: File;
}
```

### ToeicAnalysis (Potential enhancement)

```typescript
interface ToeicAnalysis {
  questions: Array<{
    questionNumber: number;
    part: string;
    questionText: string;
    options: Record<string, string>;
    correctAnswer: string;
    explanation: {
      summary: string;
      questionAnalysis: string;      // NEW: Phân tích câu hỏi
      correctAnswerReason: string;   // ENHANCED: Chi tiết hơn
      incorrectAnswersAnalysis: Record<string, string>; // NEW: Phân tích từng đáp án sai
      grammarPoints: string[];       // ENHANCED: Điểm ngữ pháp chi tiết
      vocabulary: Array<{            // NEW: Từ vựng với ví dụ
        word: string;
        meaning: string;
        example: string;
      }>;
      toeicTips: string[];          // ENHANCED: Mẹo cụ thể hơn
      reasoning?: string;            // NEW: Reasoning từ model
    };
  }>;
}
```

## Error Handling

### Layout Errors
- Fallback cho browsers không support `h-screen` hoặc `flex`
- Graceful degradation cho mobile devices với viewport height issues

### Model Errors
- Retry logic nếu qwen model không available
- Fallback message nếu reasoning không được trả về
- Validation cho model response structure

### Input Validation
- Maintain existing validation logic
- Add validation cho unified input (check mode before validating content)

## Testing Strategy

### Visual Regression Testing
- Test layout ở các breakpoints: 320px, 768px, 1024px, 1400px, 1920px
- Verify input section luôn visible on load
- Verify chat scrolls independently

### Component Testing
- Test unified input component với cả text và image modes
- Test part selector positioning và functionality
- Test mode switching không làm mất data

### Integration Testing
- Test API với qwen model
- Verify reasoning output được hiển thị đúng
- Test error handling khi model fails

### User Acceptance Testing
- Verify không cần scroll để access input on load
- Verify chat width improvement
- Verify explanation quality improvement

## Implementation Notes

### CSS Considerations
- Sử dụng Tailwind's `h-screen` với fallback `min-h-screen`
- Consider `dvh` (dynamic viewport height) cho mobile browsers
- Use `sticky` positioning cho input section nếu fixed gây issues
- Chat container: Use `overflow-y-auto` nhưng chỉ show scrollbar khi có content overflow

### Clipboard Image Handling
- Listen to `paste` event trên textarea
- Extract image từ `clipboardData.items`
- Convert image to base64 cho preview và submission
- Validate image type (chỉ accept image/*)
- Handle paste errors gracefully

### Performance
- Lazy load images trong chat history
- Virtualize long conversation lists nếu cần
- Debounce textarea input để tránh re-renders

### Accessibility
- Maintain keyboard navigation
- Ensure input section có proper focus management
- Announce image paste success/failure to screen readers

### Mobile Optimization
- Touch-friendly button sizes (min 44x44px)
- Prevent zoom on input focus
- Handle virtual keyboard appearance
- Test clipboard paste on mobile browsers (may have limitations)

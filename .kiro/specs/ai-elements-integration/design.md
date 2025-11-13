# Design Document

## Overview

This design document outlines the integration of AI elements components into the TOEIC Reading Practice application. The goal is to enhance the user experience by providing modern AI interaction patterns including reasoning visualization, conversation flow, message streaming, and improved loading states while maintaining the existing functionality and following Next.js 15 and React 19 best practices.

## Architecture

### Current Architecture
The application follows a vertical slice architecture with:
- **App Router**: Next.js 15 app directory structure
- **Feature-based organization**: `/src/features/practice` contains all practice-related code
- **AI SDK Integration**: Uses Vercel AI SDK with `experimental_useObject` for structured streaming
- **Component Library**: Shadcn/ui components with custom AI elements

### Proposed Changes
1. **Conversation-based UI**: Transform the current single-response UI into a conversation flow
2. **Reasoning Display**: Add reasoning component to show AI thinking process
3. **Enhanced Loading States**: Replace basic loaders with shimmer effects and proper loading UI
4. **Next.js Structure**: Add missing Next.js files (loading.tsx, error.tsx, not-found.tsx)
5. **Message Components**: Use AI elements message components for better chat UX

## Components and Interfaces

### 1. Conversation Container Component

**Purpose**: Wrap the entire interaction in a conversation-style interface

**Location**: `src/features/practice/components/conversation-container.tsx`

**Interface**:
```typescript
interface ConversationContainerProps {
  children: React.ReactNode;
}
```

**Implementation Details**:
- Uses `Conversation` and `ConversationContent` from ai-elements
- Includes `ConversationScrollButton` for auto-scroll functionality
- Handles empty state with `ConversationEmptyState`
- Maintains scroll position and auto-scrolls to new messages

### 2. Enhanced Analysis Renderer

**Purpose**: Display analysis results as assistant messages in the conversation

**Location**: `src/features/practice/components/analysis-renderer.tsx` (update existing)

**Interface**:
```typescript
interface AnalysisRendererProps {
  analysis: DeepPartial<ToeicAnalysis> | undefined;
  isLoading: boolean;
  error: Error | undefined;
  showReasoning?: boolean;
}
```

**Implementation Details**:
- Wraps content in `Message` component with `from="assistant"`
- Uses `MessageContent` for the analysis display
- Integrates `Reasoning`, `ReasoningTrigger`, and `ReasoningContent` for thinking process
- Maintains existing `ExplanationGrid` for structured display
- Shows shimmer during initial loading
- Handles streaming state with progressive rendering

### 3. User Input Message Component

**Purpose**: Display user's question as a message in the conversation

**Location**: `src/features/practice/components/user-message.tsx` (new)

**Interface**:
```typescript
interface UserMessageProps {
  input: QuestionInput;
}
```

**Implementation Details**:
- Uses `Message` component with `from="user"`
- Displays text content or image preview based on mode
- Uses `MessageAttachment` for image display
- Styled to align right (user side)

### 4. Enhanced Practice Input

**Purpose**: Update existing input component to work with conversation flow

**Location**: `src/features/practice/components/practice-input.tsx` (update existing)

**Changes**:
- Add callback to notify parent when message is sent
- Clear input after successful submission
- Maintain existing validation and error handling
- Keep existing part selection and mode switching

### 5. Reasoning Component Integration

**Purpose**: Show AI thinking process during analysis

**Implementation Details**:
- Use `Reasoning` component from ai-elements
- Display "Thinking..." with shimmer during streaming
- Show duration after completion
- Auto-collapse after 1 second
- Allow manual expand/collapse

### 6. Loading States

**Purpose**: Provide proper loading UI at different levels

**Files to Create**:
- `src/app/loading.tsx`: Route-level loading
- `src/app/error.tsx`: Route-level error handling
- `src/app/not-found.tsx`: 404 page

**Implementation Details**:
- Use `Shimmer` component for text placeholders
- Use `Loader` component for spinners
- Provide skeleton UI that matches the actual content layout
- Include retry mechanisms in error states

### 7. Updated Practice Hook

**Purpose**: Manage conversation state and message history

**Location**: `src/features/practice/hooks/use-practice.ts` (update existing)

**Interface**:
```typescript
interface UsePracticeReturn {
  messages: ConversationMessage[];
  analysis: DeepPartial<ToeicAnalysis> | undefined;
  isProcessing: boolean;
  error: Error | undefined;
  submitQuestionAsync: (input: QuestionInput) => Promise<void>;
  reset: () => void;
  stop: () => void;
}

interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: QuestionInput | DeepPartial<ToeicAnalysis>;
  timestamp: Date;
}
```

**Changes**:
- Add message history state
- Track user inputs and AI responses
- Maintain conversation context
- Support clearing conversation

## Data Models

### Conversation Message Model

```typescript
interface ConversationMessage {
  id: string;                                    // Unique message ID
  role: 'user' | 'assistant';                    // Message sender
  content: QuestionInput | DeepPartial<ToeicAnalysis>;  // Message content
  timestamp: Date;                               // When message was created
  isStreaming?: boolean;                         // Whether content is still streaming
}
```

### Reasoning State Model

```typescript
interface ReasoningState {
  isStreaming: boolean;                          // Whether AI is thinking
  content: string;                               // Reasoning text
  duration?: number;                             // Thinking duration in seconds
  isOpen: boolean;                               // Whether reasoning is expanded
}
```

## Error Handling

### Client-Side Errors

1. **Validation Errors**
   - Display inline in `PracticeInput` component
   - Use `Alert` component with destructive variant
   - Prevent submission until resolved

2. **API Errors**
   - Catch in `use-practice` hook
   - Display in `AnalysisRenderer` with error state
   - Provide retry button

3. **Streaming Errors**
   - Handle in AI SDK error callbacks
   - Show error message in conversation
   - Allow user to retry or continue

### Server-Side Errors

1. **API Route Errors**
   - Return proper HTTP status codes
   - Include user-friendly error messages
   - Log detailed errors for debugging

2. **Model Errors**
   - Handle API key issues
   - Handle rate limiting
   - Handle timeout errors

### Route-Level Errors

1. **Error Boundary** (`error.tsx`)
   - Catch unhandled errors
   - Display friendly error page
   - Provide reset/retry options

2. **Not Found** (`not-found.tsx`)
   - Handle 404 errors
   - Provide navigation back to home

## Testing Strategy

### Unit Testing

1. **Component Tests**
   - Test `ConversationContainer` rendering and scroll behavior
   - Test `UserMessage` with different input types
   - Test `AnalysisRenderer` with various states (loading, error, success)
   - Test `Reasoning` component expand/collapse behavior

2. **Hook Tests**
   - Test `use-practice` message management
   - Test state transitions (idle → loading → success/error)
   - Test conversation history management

### Integration Testing

1. **User Flow Tests**
   - Test complete question submission flow
   - Test conversation history accumulation
   - Test error recovery flows
   - Test image upload and display

2. **API Integration Tests**
   - Test API route with valid inputs
   - Test error responses
   - Test streaming behavior

### Visual Testing

1. **Component States**
   - Test loading states with shimmer
   - Test error states with proper styling
   - Test responsive design on mobile/desktop
   - Test dark mode compatibility

## Implementation Plan

### Phase 1: Core Conversation Structure
1. Create `ConversationContainer` component
2. Create `UserMessage` component
3. Update `use-practice` hook to manage message history
4. Update main page to use conversation layout

### Phase 2: Reasoning Integration
1. Add reasoning state to practice hook
2. Integrate `Reasoning` component in `AnalysisRenderer`
3. Connect reasoning to streaming state
4. Test auto-collapse behavior

### Phase 3: Enhanced Loading States
1. Create `loading.tsx` with skeleton UI
2. Create `error.tsx` with error boundary
3. Create `not-found.tsx` for 404 handling
4. Update components to use `Shimmer` consistently

### Phase 4: Polish and Optimization
1. Add smooth transitions between states
2. Optimize re-renders with React.memo where needed
3. Test accessibility (keyboard navigation, screen readers)
4. Test performance with multiple messages

## Design Decisions and Rationales

### 1. Conversation-Based UI
**Decision**: Transform single-response UI into conversation flow  
**Rationale**: 
- Better matches user mental model of AI interaction
- Allows users to see history of their practice sessions
- Enables future features like follow-up questions
- Aligns with modern AI chat interfaces

### 2. Keep Existing ExplanationGrid
**Decision**: Maintain current grid layout for analysis display  
**Rationale**:
- Current layout is well-designed for TOEIC content
- Users are familiar with the format
- Grid provides good information hierarchy
- Only wrap it in message components, don't rebuild

### 3. Client-Side Message Management
**Decision**: Store conversation history in client state, not database  
**Rationale**:
- Simpler implementation for MVP
- No authentication/user system yet
- Reduces server complexity
- Can add persistence later if needed

### 4. Reasoning Component Integration
**Decision**: Use built-in Reasoning component from ai-elements  
**Rationale**:
- Provides professional thinking visualization
- Handles timing and auto-collapse automatically
- Consistent with other AI applications
- Reduces custom code

### 5. Minimal Hook Changes
**Decision**: Extend existing `use-practice` hook rather than rewrite  
**Rationale**:
- Preserves existing functionality
- Reduces risk of breaking changes
- Easier to review and test
- Maintains backward compatibility

### 6. No Tool Component (Initially)
**Decision**: Skip Tool component integration in first version  
**Rationale**:
- Current API doesn't use tool calling
- Adds complexity without immediate value
- Can be added later if needed
- Focus on core conversation experience

## Accessibility Considerations

1. **Keyboard Navigation**
   - Ensure all interactive elements are keyboard accessible
   - Proper tab order through conversation
   - Keyboard shortcuts for common actions

2. **Screen Readers**
   - Proper ARIA labels on all components
   - Announce new messages as they arrive
   - Describe loading and error states

3. **Visual Accessibility**
   - Maintain sufficient color contrast
   - Support dark mode
   - Scalable text sizes
   - Clear focus indicators

## Performance Considerations

1. **Rendering Optimization**
   - Use React.memo for message components
   - Virtualize long conversation lists if needed
   - Debounce scroll events

2. **Bundle Size**
   - AI elements components are already in the project
   - No additional dependencies needed
   - Tree-shake unused components

3. **Streaming Performance**
   - Handle partial updates efficiently
   - Avoid unnecessary re-renders during streaming
   - Use proper React keys for list items

## Future Enhancements

1. **Conversation Persistence**
   - Save conversation history to local storage
   - Add export/share functionality
   - Implement conversation search

2. **Advanced Features**
   - Follow-up questions on specific explanations
   - Comparison between multiple questions
   - Practice session analytics

3. **Tool Integration**
   - Add dictionary lookup tool
   - Add grammar reference tool
   - Visualize tool usage with Tool component

4. **Multi-Modal Improvements**
   - Better image preview in conversation
   - Support for audio questions (listening practice)
   - PDF upload support

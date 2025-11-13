# Implementation Plan

- [-] 1. Create Next.js infrastructure files
  - Create loading.tsx with skeleton UI using Shimmer components
  - Create error.tsx with error boundary and retry functionality
  - Create not-found.tsx for 404 handling
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 2. Create conversation message types and utilities
  - Define ConversationMessage interface in practice.types.ts
  - Define ReasoningState interface in practice.types.ts
  - Add message ID generation utility function
  - _Requirements: 2.1, 2.2, 1.1_

- [ ] 3. Create ConversationContainer component
  - Implement ConversationContainer using Conversation and ConversationContent from ai-elements
  - Add ConversationScrollButton for auto-scroll functionality
  - Add ConversationEmptyState for initial empty state
  - Style component to match application theme
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 4. Create UserMessage component
  - Implement UserMessage using Message component with from="user"
  - Add support for text content display
  - Add support for image preview using MessageAttachment
  - Style component to align right (user side)
  - _Requirements: 2.4, 2.5_

- [ ] 5. Update use-practice hook for conversation management
  - Add messages state array to track conversation history
  - Add addUserMessage function to append user messages
  - Add addAssistantMessage function to append AI responses
  - Update submitQuestionAsync to add user message before API call
  - Update AI SDK callbacks to create assistant message
  - Add reset function to clear conversation
  - _Requirements: 2.1, 2.2, 6.3, 6.5_

- [ ] 6. Integrate Reasoning component into AnalysisRenderer
  - Add reasoning state tracking (isStreaming, content, duration)
  - Wrap analysis content with Reasoning component
  - Add ReasoningTrigger with "Thinking..." shimmer text
  - Add ReasoningContent to display reasoning text
  - Configure auto-close after 1 second when streaming completes
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 7. Update AnalysisRenderer to use Message components
  - Wrap entire analysis in Message component with from="assistant"
  - Use MessageContent for the analysis display
  - Maintain existing ExplanationGrid integration
  - Update shimmer loading state to use Shimmer component
  - Update error display to use proper error styling
  - _Requirements: 2.4, 2.5, 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 8. Update main page to use conversation layout
  - Import and use ConversationContainer component
  - Render conversation messages using map over messages array
  - Render UserMessage components for user messages
  - Render AnalysisRenderer for assistant messages
  - Move PracticeInput to bottom of conversation (sticky or fixed)
  - Update layout to support conversation flow
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 6.1, 6.2_

- [ ] 9. Update PracticeInput component for conversation flow
  - Add onMessageSent callback prop
  - Clear text input after successful submission
  - Clear image input after successful submission
  - Maintain existing validation logic
  - Maintain existing part selection and mode switching
  - Update loading state to use Shimmer in button
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 10. Add loading states throughout the application
  - Update button loading state in PracticeInput to use Loader and Shimmer
  - Add skeleton UI in loading.tsx using Shimmer components
  - Add loading indicators during streaming in AnalysisRenderer
  - Ensure all loading states are visually consistent
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 5.4_

- [ ] 11. Implement error handling and recovery
  - Update error.tsx with user-friendly error messages
  - Add retry button in error states
  - Add error display in AnalysisRenderer with recovery options
  - Test error scenarios (API errors, validation errors, network errors)
  - _Requirements: 4.5, 5.5_

- [ ] 12. Polish and accessibility improvements
  - Add proper ARIA labels to all interactive elements
  - Ensure keyboard navigation works throughout conversation
  - Test screen reader compatibility
  - Add focus management for new messages
  - Test responsive design on mobile and desktop
  - Test dark mode compatibility
  - _Requirements: 6.1, 6.2, 6.4, 6.5_

- [ ] 13. Run type checking and linting
  - Run `bun run typecheck` to ensure no TypeScript errors
  - Run `bun run biome:fix` to format and lint code
  - Fix any type errors or linting issues
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

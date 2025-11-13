# Implementation Plan

- [x] 1. Update page layout for wider chat and fixed input
- [x] 1.1 Modify page.tsx to use h-screen flex layout with max-w-[1400px]
  - Change container max-width from max-w-5xl to max-w-[1400px]
  - Implement flex h-screen layout structure
  - Make chat container scrollable with flex-1 overflow-y-auto
  - Position input section as fixed at bottom with shrink-0
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 2. Refactor PracticeInput to unified input component
- [x] 2.1 Move part selector to inline position above input area
  - Restructure component layout to place part selector first
  - Change part selector styling to compact inline format
  - Update spacing and alignment for better visual hierarchy
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 2.2 Replace Tabs with simple mode toggle buttons
  - Remove Tabs, TabsList, TabsTrigger, TabsContent components
  - Implement two toggle buttons for text/image mode selection
  - Add conditional rendering for text textarea vs image upload area
  - Ensure smooth transitions between modes without layout shift
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 2.3 Optimize input section height and spacing
  - Reduce vertical spacing between elements
  - Set appropriate min-height for input area
  - Ensure input section fits in viewport without scrolling
  - _Requirements: 4.1, 4.5_

- [ ] 6. Implement true unified input with clipboard paste support
- [ ] 6.1 Remove mode toggle buttons and create single input field
  - Remove text/image mode toggle buttons completely
  - Keep only textarea as the primary input
  - Remove helper text "💡 Có thể dán một hoặc nhiều câu hỏi cùng lúc"
  - _Requirements: 3.5, 3.6_

- [ ] 6.2 Add clipboard paste handler for images
  - Implement onPaste event handler on textarea
  - Extract image from clipboard data
  - Convert image to File and base64 for preview
  - Validate image type and size
  - Handle paste errors with user feedback
  - _Requirements: 3.1, 3.2_

- [ ] 6.3 Implement image preview with clear functionality
  - Show image preview when image is pasted
  - Add clear/remove button to delete pasted image
  - Return to text input mode when image is cleared
  - Maintain textarea visibility when no image
  - _Requirements: 3.3, 3.4_

- [ ] 7. Fix conversation container scroll behavior
- [ ] 7.1 Update ConversationContainer to hide scrollbar when empty
  - Modify overflow behavior to only show scrollbar when content overflows
  - Remove min-height that forces scrollbar appearance
  - Ensure smooth transition when content is added
  - Test scrollbar appearance/disappearance
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 3. Update API route to use qwen model with enhanced prompts
- [x] 3.1 Change model from nvidia/nemotron to qwen/qwen3-vl-8b-thinking
  - Update model identifier in API route
  - Configure appropriate parameters for qwen model
  - Test model availability and response format
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 3.2 Enhance system prompt for detailed explanations
  - Rewrite system prompt with structured explanation format
  - Add instructions for step-by-step reasoning
  - Include requirements for vocabulary examples and grammar explanations
  - Add instructions for comparing correct vs incorrect answers
  - Emphasize simple Vietnamese language for learners
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [x] 4. Update responsive styles and mobile optimization
- [x] 4.1 Add responsive breakpoints for new max-width
  - Test layout at 320px, 768px, 1024px, 1400px, 1920px
  - Ensure proper padding and margins at all breakpoints
  - Verify no horizontal scrolling occurs
  - _Requirements: 1.3, 1.4_

- [x] 4.2 Optimize for mobile viewport height handling
  - Implement dvh fallback for mobile browsers
  - Handle virtual keyboard appearance
  - Ensure input remains accessible when keyboard is visible
  - _Requirements: 4.1, 4.3, 4.5_

- [x] 5. Test and validate all changes
- [x] 5.1 Verify layout improvements
  - Confirm chat width increased to 1400px
  - Verify input section visible on page load without scrolling
  - Test independent scrolling of chat container
  - Validate part selector positioning above input
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.4, 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 5.2 Verify unified input functionality
  - Test text mode input and submission
  - Test image mode upload and submission
  - Verify mode switching preserves appropriate state
  - Confirm no layout shifts during mode changes
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 5.3 Validate model and explanation quality
  - Test API with qwen model responds correctly
  - Verify explanations are more detailed and understandable
  - Check reasoning output is included in responses
  - Confirm Vietnamese language quality
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

# Requirements Document

## Introduction

This feature addresses two critical issues in the TOEIC practice image input functionality:
1. Type validation error when sending images to OpenRouter API (receiving undefined instead of expected object)
2. Inability to submit immediately after pasting an image (Enter key not working)

## Glossary

- **Image Input Component**: The React component that handles image file selection and paste functionality
- **Practice Input Component**: The parent component that manages both text and image input modes
- **OpenRouter API**: The external AI service that processes TOEIC questions from images
- **Base64 Encoding**: The method used to convert image files to text format for API transmission

## Requirements

### Requirement 1

**User Story:** As a user, I want to paste an image and have it successfully processed by the AI, so that I can receive analysis of TOEIC questions from images

#### Acceptance Criteria

1. WHEN the user pastes an image, THE Image Input Component SHALL convert the image to base64 format and include it in the API request payload
2. WHEN the API request is sent with an image, THE Practice API Route SHALL construct a valid message object with type "image" and the base64 content
3. IF the image data is missing or invalid, THEN THE Practice API Route SHALL return a descriptive error message to the user
4. WHEN the OpenRouter API receives the request, THE Practice API Route SHALL ensure the message format matches the expected schema with proper image URL structure

### Requirement 2

**User Story:** As a user, I want to press Enter immediately after pasting an image to submit it, so that I can quickly get analysis without additional clicks

#### Acceptance Criteria

1. WHEN the user pastes an image into the textarea, THE Practice Input Component SHALL detect the paste event and update the input state
2. WHEN an image is successfully pasted, THE Practice Input Component SHALL enable the submit button immediately
3. WHEN the user presses Enter key after pasting an image, THE Practice Input Component SHALL trigger the submit action
4. WHILE an image is displayed in the preview, THE Practice Input Component SHALL allow keyboard submission via Enter key

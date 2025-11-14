# Requirements Document

## Introduction

This feature enhances the TOEIC practice application to support multiple image uploads in a single submission and changes the default part detection mode to "auto". Currently, users can only upload one image at a time and the system defaults to Part 5. This limitation makes it difficult for users to practice TOEIC parts that span multiple pages or require multiple images (such as Part 6 and Part 7 reading comprehension passages).

## Glossary

- **Image Input Component**: The React component responsible for handling image file selection, preview, and validation
- **Practice API**: The backend API endpoint (`/api/practice`) that processes TOEIC questions and returns analysis
- **Part Detection Mode**: The system's ability to automatically identify which TOEIC part (5, 6, or 7) a question belongs to
- **Base64 Encoding**: The method used to convert image files into text strings for API transmission
- **Multi-Image Upload**: The capability to select and submit multiple image files simultaneously

## Requirements

### Requirement 1

**User Story:** As a TOEIC learner, I want to upload multiple images at once, so that I can practice questions that span across multiple pages or screenshots

#### Acceptance Criteria

1. WHEN the user selects multiple image files through the file picker, THE Image Input Component SHALL accept and display all selected images
2. WHEN the user pastes an image while other images are already selected, THE Image Input Component SHALL add the pasted image to the existing collection
3. WHEN the user drags and drops multiple image files, THE Image Input Component SHALL accept and display all dropped images
4. THE Image Input Component SHALL display a preview grid showing all selected images with their filenames and sizes
5. WHEN the user clicks a remove button on any image preview, THE Image Input Component SHALL remove only that specific image from the collection

### Requirement 2

**User Story:** As a TOEIC learner, I want the system to automatically detect which part my questions belong to, so that I don't have to manually specify the part type

#### Acceptance Criteria

1. THE Practice API SHALL default to "auto" mode for part detection instead of Part 5
2. WHEN the Practice API receives a request with mode set to "auto", THE Practice API SHALL analyze the content and automatically determine whether questions are from Part 5, 6, or 7
3. THE Practice API SHALL include the detected part number in the analysis response

### Requirement 3

**User Story:** As a TOEIC learner, I want to see clear validation feedback when uploading images, so that I understand any limitations or errors

#### Acceptance Criteria

1. WHEN the user selects an image file that exceeds 5MB, THE Image Input Component SHALL display an error message indicating the size limit
2. WHEN the user selects a file that is not JPEG or PNG format, THE Image Input Component SHALL display an error message indicating supported formats
3. WHEN the total number of selected images exceeds 5, THE Image Input Component SHALL display an error message indicating the maximum limit
4. THE Image Input Component SHALL validate each image individually and display specific error messages for each invalid file

### Requirement 4

**User Story:** As a TOEIC learner, I want to submit all my selected images together, so that the AI can analyze questions across multiple pages in context

#### Acceptance Criteria

1. WHEN the user submits the form with multiple images, THE Practice API SHALL receive all images as an array of base64-encoded strings
2. THE Practice API SHALL process all images in the order they were selected
3. WHEN the Practice API analyzes multiple images, THE Practice API SHALL maintain question numbering continuity across images
4. THE Practice API SHALL return a single unified analysis covering all questions from all submitted images

### Requirement 5

**User Story:** As a TOEIC learner, I want a smooth and responsive interface when managing multiple images, so that I can efficiently prepare my practice session

#### Acceptance Criteria

1. WHEN images are being loaded or processed, THE Image Input Component SHALL display loading indicators for each image
2. THE Image Input Component SHALL allow reordering of images through drag-and-drop within the preview grid
3. WHEN the user clears all images, THE Image Input Component SHALL reset to the initial empty state
4. THE Image Input Component SHALL maintain responsive layout on mobile devices with appropriate grid sizing

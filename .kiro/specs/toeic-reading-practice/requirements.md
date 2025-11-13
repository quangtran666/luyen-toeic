# Requirements Document

## Introduction

This document specifies the requirements for a minimal viable product (MVP) web application designed to help users practice TOEIC Reading comprehension for Parts 5, 6, and 7. The application provides an interactive interface where users can input questions via text or image, select the practice part, and receive detailed explanations in Vietnamese for each question. The system focuses on delivering clear, educational feedback without requiring persistent data storage.

## Glossary

- **TOEIC Practice App**: The web application system being specified
- **User**: An individual preparing for the TOEIC exam who interacts with the application
- **Practice Part**: One of three TOEIC Reading sections (Part 5: Incomplete Sentences, Part 6: Text Completion, Part 7: Reading Comprehension)
- **Input Mode**: The method by which users provide questions (Text or Image)
- **Question Block**: A single pasted or uploaded input that may contain one or multiple TOEIC questions
- **Explanation Card**: A UI component displaying the analysis and answer for a single detected question
- **AI Service**: The backend service using OpenRouter with nvidia/nemotron-nano-12b-v2-vl model
- **Vietnamese Response**: All user-facing text, explanations, and messages displayed in Vietnamese language

## Requirements

### Requirement 1

**User Story:** As a TOEIC learner, I want to select which reading part I am practicing, so that the system can provide context-appropriate explanations.

#### Acceptance Criteria

1. THE TOEIC Practice App SHALL provide selection options for Part 5, Part 6, Part 7, and Auto
2. WHEN the User selects a Practice Part, THE TOEIC Practice App SHALL display the selected part as the active choice
3. WHERE the User selects Auto mode, THE TOEIC Practice App SHALL automatically detect the Practice Part from the question content
4. THE TOEIC Practice App SHALL maintain the selected Practice Part throughout the current session until changed by the User

### Requirement 2

**User Story:** As a TOEIC learner, I want to input questions as text, so that I can quickly practice with questions I have typed or copied.

#### Acceptance Criteria

1. THE TOEIC Practice App SHALL provide a text input area for pasting question content
2. THE TOEIC Practice App SHALL accept Question Blocks containing single or multiple questions in the text input
3. WHEN the User submits a text Question Block, THE TOEIC Practice App SHALL detect all individual questions within the block
4. THE TOEIC Practice App SHALL preserve the original question numbering when present in the text input
5. WHERE question numbering is absent, THE TOEIC Practice App SHALL assign sequential numbers starting from 1

### Requirement 3

**User Story:** As a TOEIC learner, I want to input questions from images, so that I can practice with screenshots or photos of TOEIC materials.

#### Acceptance Criteria

1. THE TOEIC Practice App SHALL support image input through clipboard paste operations
2. THE TOEIC Practice App SHALL support image input through file system selection
3. THE TOEIC Practice App SHALL accept JPEG and PNG image formats
4. WHEN the User submits an image Question Block, THE TOEIC Practice App SHALL extract all visible questions from the image
5. THE TOEIC Practice App SHALL detect question text and answer options (A, B, C, D) from the uploaded image

### Requirement 4

**User Story:** As a TOEIC learner, I want to receive detailed explanations in Vietnamese, so that I can understand the reasoning behind correct answers in my native language.

#### Acceptance Criteria

1. THE TOEIC Practice App SHALL generate Vietnamese Response text for all explanations, labels, and messages
2. FOR each detected question, THE TOEIC Practice App SHALL identify the correct answer option (A, B, C, or D)
3. FOR each detected question, THE TOEIC Practice App SHALL provide an explanation that includes sentence meaning, grammar analysis, and vocabulary clarification
4. THE TOEIC Practice App SHALL explain why the correct answer is appropriate
5. WHERE helpful for understanding, THE TOEIC Practice App SHALL explain why incorrect options are not suitable

### Requirement 5

**User Story:** As a TOEIC learner, I want to see each question's explanation in a separate card, so that I can easily read and compare multiple explanations.

#### Acceptance Criteria

1. THE TOEIC Practice App SHALL display each question explanation in a distinct Explanation Card
2. WHERE a single question is detected, THE TOEIC Practice App SHALL display one Explanation Card at full width
3. WHERE multiple questions are detected, THE TOEIC Practice App SHALL arrange Explanation Cards in a two-column grid layout on desktop screens
4. WHERE multiple questions are detected, THE TOEIC Practice App SHALL arrange Explanation Cards in a single-column layout on mobile screens
5. EACH Explanation Card SHALL display the question number, question text, answer options, correct answer, and detailed explanation

### Requirement 6

**User Story:** As a TOEIC learner, I want a simple and clean interface, so that I can focus on learning without distractions.

#### Acceptance Criteria

1. THE TOEIC Practice App SHALL display a header indicating the application purpose for TOEIC Reading Parts 5-7
2. THE TOEIC Practice App SHALL use shadcn/ui components for buttons, inputs, and structural elements
3. THE TOEIC Practice App SHALL provide clear visual distinction between Text and Image Input Modes
4. THE TOEIC Practice App SHALL provide a single action button to request explanations after input is provided
5. THE TOEIC Practice App SHALL present a modern and friendly visual design

### Requirement 7

**User Story:** As a TOEIC learner, I want the app to work without requiring account creation or data storage, so that I can practice quickly without setup overhead.

#### Acceptance Criteria

1. THE TOEIC Practice App SHALL operate without requiring user authentication
2. THE TOEIC Practice App SHALL operate without persistent database storage
3. THE TOEIC Practice App SHALL maintain question inputs and explanations in memory during the current browser session
4. WHEN the User refreshes the browser, THE TOEIC Practice App SHALL clear all previous inputs and explanations

### Requirement 8

**User Story:** As a TOEIC learner, I want the AI to analyze grammar, vocabulary, and logic, so that I can understand the linguistic principles behind each question.

#### Acceptance Criteria

1. FOR each question, THE AI Service SHALL analyze the grammatical structure relevant to the correct answer
2. FOR each question, THE AI Service SHALL identify key vocabulary terms and their meanings
3. FOR Part 7 questions, THE AI Service SHALL explain the logical reasoning required for reading comprehension
4. WHERE applicable, THE AI Service SHALL include grammar point names in the explanation
5. WHERE applicable, THE AI Service SHALL include TOEIC-specific tips in the Vietnamese Response

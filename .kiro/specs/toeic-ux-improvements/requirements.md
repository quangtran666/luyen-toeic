# Requirements Document

## Introduction

Cải thiện trải nghiệm người dùng (UX) cho ứng dụng luyện tập TOEIC Reading bằng cách tối ưu hóa layout, đơn giản hóa input, và nâng cao chất lượng giải thích. Các cải tiến tập trung vào việc giảm thiểu thao tác cuộn, tối ưu không gian hiển thị, và cải thiện khả năng hiểu của người học.

## Glossary

- **Chat Container**: Vùng hiển thị cuộc hội thoại giữa người dùng và hệ thống
- **Input Section**: Khu vực nhập liệu cho câu hỏi TOEIC
- **Practice Part Selector**: Bộ chọn phần luyện tập (Part 5, 6, 7, Auto)
- **Input Mode**: Chế độ nhập liệu (văn bản hoặc hình ảnh)
- **Viewport**: Vùng hiển thị có thể nhìn thấy trên màn hình
- **LLM Model**: Mô hình ngôn ngữ lớn được sử dụng để phân tích câu hỏi

## Requirements

### Requirement 1

**User Story:** Là người học TOEIC, tôi muốn khung chat rộng hơn để có thể đọc câu hỏi và giải thích dễ dàng hơn mà không bị giới hạn bởi chiều ngang quá hẹp

#### Acceptance Criteria

1. THE Chat Container SHALL expand to utilize maximum available width up to 1400px
2. WHEN viewport width exceeds 1400px, THE Chat Container SHALL center horizontally with equal margins
3. THE Chat Container SHALL maintain responsive behavior on mobile devices with minimum 16px padding
4. THE Chat Container SHALL display content without horizontal scrolling at all viewport sizes

### Requirement 2

**User Story:** Là người học TOEIC, tôi muốn chọn phần luyện tập ngay trên khu vực nhập liệu để giảm khoảng cách di chuyển và tăng tốc độ thao tác

#### Acceptance Criteria

1. THE Practice Part Selector SHALL be positioned directly above the input field within the Input Section
2. THE Practice Part Selector SHALL remain visible when Input Section is in viewport
3. THE Practice Part Selector SHALL maintain current selection state during input mode changes
4. THE Practice Part Selector SHALL be accessible without scrolling when Input Section is visible

### Requirement 3

**User Story:** Là người học TOEIC, tôi muốn một input thống nhất có thể xử lý cả văn bản và hình ảnh để giảm sự phức tạp trong giao diện

#### Acceptance Criteria

1. THE Input Section SHALL provide a single unified input field that accepts both text typing and image paste from clipboard
2. WHEN user pastes image from clipboard, THE Input Section SHALL display the pasted image as preview
3. WHEN user types text, THE Input Section SHALL display the text content
4. THE Input Section SHALL allow users to clear pasted images and return to text input
5. THE Input Section SHALL not display mode toggle buttons for text/image selection
6. THE Input Section SHALL not display helper text about pasting multiple questions

### Requirement 4

**User Story:** Là người học TOEIC, tôi muốn khu vực nhập liệu luôn hiển thị trong viewport khi tải trang để có thể bắt đầu ngay mà không cần cuộn

#### Acceptance Criteria

1. WHEN page loads, THE Input Section SHALL be visible within the initial viewport
2. THE Chat Container SHALL be scrollable independently from the Input Section
3. THE Input Section SHALL remain fixed at the bottom of the viewport
4. WHEN new messages are added, THE Chat Container SHALL scroll automatically while Input Section remains visible
5. THE page layout SHALL not require vertical scrolling to access the Input Section on initial load

### Requirement 5

**User Story:** Là người học TOEIC, tôi muốn sử dụng model qwen/qwen3-vl-8b-thinking để có khả năng phân tích tốt hơn với reasoning

#### Acceptance Criteria

1. THE system SHALL use qwen/qwen3-vl-8b-thinking model for all analysis requests
2. THE system SHALL configure the model with appropriate parameters for TOEIC analysis
3. THE system SHALL handle model responses including reasoning steps
4. THE system SHALL maintain backward compatibility with existing analysis schema

### Requirement 6

**User Story:** Là người học TOEIC, tôi muốn nhận được giải thích chi tiết và dễ hiểu hơn để nắm vững kiến thức ngữ pháp và từ vựng

#### Acceptance Criteria

1. THE system prompt SHALL emphasize detailed explanations in Vietnamese
2. THE system prompt SHALL request step-by-step reasoning for grammar points
3. THE system prompt SHALL request vocabulary explanations with examples
4. THE system prompt SHALL request comparison between correct and incorrect answers
5. THE system prompt SHALL request practical TOEIC tips for each question type
6. THE analysis output SHALL include detailed reasoning visible to users
7. THE explanation SHALL use simple Vietnamese language suitable for learners

### Requirement 7

**User Story:** Là người học TOEIC, tôi muốn vùng chat không có scroll bar khi chưa có nội dung để giao diện trông gọn gàng hơn

#### Acceptance Criteria

1. WHEN conversation is empty, THE Chat Container SHALL not display scrollbar
2. WHEN conversation is empty, THE Chat Container SHALL not be scrollable
3. WHEN messages are added, THE Chat Container SHALL become scrollable only if content exceeds viewport height
4. THE Chat Container SHALL display scrollbar only when content requires scrolling

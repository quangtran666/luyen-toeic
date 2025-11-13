# Requirements Document

## Introduction

Hệ thống cần cho phép người dùng cấu hình model AI và API key của riêng họ (BYOK - Bring Your Own Key) trước khi có thể sử dụng các tính năng tương tác trong ứng dụng. Tính năng này đảm bảo rằng người dùng có quyền kiểm soát hoàn toàn việc sử dụng API key và lựa chọn model phù hợp với nhu cầu của họ.

## Glossary

- **System**: Ứng dụng TOEIC Practice
- **User**: Người dùng cuối sử dụng ứng dụng
- **BYOK**: Bring Your Own Key - tính năng cho phép người dùng sử dụng API key của riêng họ
- **Model**: Model AI được sử dụng để phân tích và tương tác (ví dụ: GPT-4, Claude, v.v.)
- **Settings Dialog**: Dialog cấu hình xuất hiện khi người dùng click vào icon settings
- **Configuration State**: Trạng thái lưu trữ thông tin cấu hình của người dùng
- **Practice Interface**: Giao diện chính để người dùng tương tác với các bài tập

## Requirements

### Requirement 1

**User Story:** As a User, I want to configure my AI model and API key through a settings dialog, so that I can use my own resources for the application

#### Acceptance Criteria

1. WHEN the User clicks the settings icon at the top right corner, THE System SHALL display a Settings Dialog
2. THE Settings Dialog SHALL contain input fields for model selection and API key entry
3. THE Settings Dialog SHALL provide a save button to persist the configuration
4. WHEN the User submits valid configuration data, THE System SHALL store the configuration in local storage
5. WHEN the User submits valid configuration data, THE System SHALL close the Settings Dialog

### Requirement 2

**User Story:** As a User, I want the application to prevent interaction until I configure my settings, so that I don't encounter errors from missing configuration

#### Acceptance Criteria

1. WHEN the User has not configured model and API key, THE System SHALL disable all practice input interactions
2. WHEN the User has not configured model and API key, THE System SHALL display a message prompting configuration
3. WHEN the User completes configuration, THE System SHALL enable all practice input interactions
4. THE System SHALL check for existing configuration on application load

### Requirement 3

**User Story:** As a User, I want to update my configuration at any time, so that I can change my model or API key when needed

#### Acceptance Criteria

1. WHEN the User clicks the settings icon, THE System SHALL display the Settings Dialog with current configuration values pre-filled
2. WHEN the User updates configuration values, THE System SHALL validate the new values before saving
3. WHEN the User saves updated configuration, THE System SHALL apply the changes immediately to subsequent API calls
4. THE System SHALL maintain the configuration across browser sessions

### Requirement 4

**User Story:** As a User, I want clear visual feedback about my configuration status, so that I know whether the application is ready to use

#### Acceptance Criteria

1. WHEN configuration is incomplete, THE System SHALL display the settings icon with a visual indicator (e.g., badge or color)
2. WHEN configuration is complete, THE System SHALL display the settings icon in normal state
3. THE System SHALL provide validation feedback for invalid API key format
4. THE System SHALL provide validation feedback for missing required fields

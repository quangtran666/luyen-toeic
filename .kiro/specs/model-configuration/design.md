# Design Document

## Overview

Tính năng Model Configuration cho phép người dùng cấu hình model AI và API key của riêng họ (BYOK) trước khi sử dụng ứng dụng. Thiết kế này tập trung vào việc tạo một trải nghiệm người dùng mượt mà với validation rõ ràng và quản lý state hiệu quả.

### Key Design Decisions

1. **Local Storage**: Sử dụng localStorage để lưu trữ cấu hình, cho phép persistence giữa các sessions
2. **Context API**: Sử dụng React Context để quản lý configuration state toàn cục
3. **Dialog Component**: Sử dụng shadcn/ui Dialog component để hiển thị settings UI
4. **Validation**: Client-side validation cho API key format và required fields
5. **Visual Feedback**: Badge indicator trên settings icon để hiển thị configuration status

## Architecture

### Component Hierarchy

```
App Root
├── ConfigurationProvider (Context)
│   └── Home Page
│       ├── Settings Button (with badge indicator)
│       ├── Settings Dialog
│       │   ├── Model Selector
│       │   ├── API Key Input
│       │   └── Save Button
│       └── Practice Interface (disabled if not configured)
```

### Data Flow

```
User Action → Settings Dialog → Validation → Context Update → localStorage → UI Update
                                                    ↓
                                            Enable/Disable Practice Interface
```

## Components and Interfaces

### 1. Configuration Context

**Location**: `src/features/configuration/context/configuration-context.tsx`

**Purpose**: Quản lý configuration state toàn cục và cung cấp methods để update configuration

**Interface**:
```typescript
interface ModelConfiguration {
  model: string;
  apiKey: string;
}

interface ConfigurationContextValue {
  configuration: ModelConfiguration | null;
  isConfigured: boolean;
  updateConfiguration: (config: ModelConfiguration) => void;
  clearConfiguration: () => void;
}
```

**Key Features**:
- Load configuration từ localStorage khi mount
- Provide methods để update và clear configuration
- Expose `isConfigured` flag để check configuration status

### 2. Settings Dialog Component

**Location**: `src/features/configuration/components/settings-dialog.tsx`

**Purpose**: UI component để người dùng nhập và lưu configuration

**Props**:
```typescript
interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

**Features**:
- Form với model selector và API key input
- Client-side validation
- Pre-fill với current configuration values
- Save button để persist configuration
- Error messages cho validation failures

**Form Fields**:
1. **Model Selector**: Dropdown/Select với các model options
   - OpenRouter models (qwen/qwen3-vl-8b-instruct, etc.)
   - Option "Custom" để cho phép nhập tên model tùy chỉnh
   - Có thể mở rộng để support thêm providers

2. **Custom Model Input**: Text input (conditional)
   - Hiển thị khi user chọn "Custom" option
   - Validation: required khi visible, không được để trống
   - Placeholder: "Nhập tên model (ví dụ: gpt-4-vision-preview)"

3. **API Key Input**: Text input với type="password"
   - Validation: required, minimum length
   - Show/hide password toggle (optional)

### 3. Settings Button Component

**Location**: `src/features/configuration/components/settings-button.tsx`

**Purpose**: Button để mở settings dialog với visual indicator

**Features**:
- Fixed position ở top-right corner
- Badge indicator khi chưa configured
- Icon: Settings/Cog icon từ lucide-react
- Trigger settings dialog khi click

**Visual States**:
- Not configured: Badge với warning color
- Configured: Normal state

### 4. Configuration Guard

**Location**: `src/features/configuration/components/configuration-guard.tsx`

**Purpose**: Wrapper component để disable practice interface khi chưa configured

**Props**:
```typescript
interface ConfigurationGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
```

**Behavior**:
- Render children nếu `isConfigured === true`
- Render fallback message nếu `isConfigured === false`
- Fallback message: "Vui lòng cấu hình model và API key để bắt đầu"

## Data Models

### Configuration Storage

**localStorage key**: `toeic-practice-config`

**Structure**:
```typescript
{
  model: string;      // e.g., "qwen/qwen3-vl-8b-instruct"
  apiKey: string;     // User's API key
  updatedAt: string;  // ISO timestamp
}
```

### Model Options

```typescript
const MODEL_OPTIONS = [
  {
    value: "qwen/qwen3-vl-8b-instruct",
    label: "Qwen 3 VL 8B (Recommended)",
    provider: "OpenRouter"
  },
  {
    value: "custom",
    label: "Custom Model",
    provider: "Custom"
  },
  // Có thể thêm models khác
] as const;
```

**Custom Model Handling**:
- Khi user chọn "custom", hiển thị text input để nhập tên model
- Lưu tên model thực tế vào localStorage, không lưu "custom"
- Khi load configuration với custom model, set selector về "custom" và hiển thị tên model trong text input

## Error Handling

### Validation Errors

1. **Empty API Key**
   - Message: "API key là bắt buộc"
   - Display: Below API key input field

2. **Invalid API Key Format**
   - Message: "API key không hợp lệ"
   - Display: Below API key input field

3. **Empty Model Selection**
   - Message: "Vui lòng chọn model"
   - Display: Below model selector

4. **Empty Custom Model Name**
   - Message: "Vui lòng nhập tên model"
   - Display: Below custom model input field
   - Condition: Only when "Custom" option is selected

### Runtime Errors

1. **localStorage Not Available**
   - Fallback: Use in-memory state
   - Warning: "Cấu hình sẽ không được lưu giữa các sessions"

2. **API Call Failures**
   - Current error handling trong `/api/practice` route sẽ được giữ nguyên
   - Thêm check cho missing configuration trước khi call API

## Testing Strategy

### Unit Tests

1. **Configuration Context**
   - Test load configuration từ localStorage
   - Test update configuration
   - Test clear configuration
   - Test isConfigured flag

2. **Settings Dialog**
   - Test form validation
   - Test save functionality
   - Test pre-fill với existing configuration

3. **Configuration Guard**
   - Test render children khi configured
   - Test render fallback khi not configured

### Integration Tests

1. **End-to-End Flow**
   - User opens settings dialog
   - User enters configuration
   - User saves configuration
   - Practice interface becomes enabled
   - Configuration persists after page reload

2. **Error Scenarios**
   - Invalid API key format
   - Missing required fields
   - localStorage unavailable

## Implementation Notes

### API Route Updates

**File**: `src/app/api/practice/route.ts`

**Changes**:
- Remove hardcoded `OPENROUTER_API_KEY` từ environment variables
- Accept API key từ request body
- Validate API key presence trước khi call OpenRouter

**Updated Request Body**:
```typescript
{
  mode: "text" | "image";
  part: "5" | "6" | "7" | "auto";
  content: string;
  apiKey: string;  // NEW
  model: string;   // NEW
}
```

### Hook Updates

**File**: `src/features/practice/hooks/use-practice.ts`

**Changes**:
- Access configuration từ ConfigurationContext
- Include apiKey và model trong API request
- Show error nếu configuration missing

### Page Updates

**File**: `src/app/page.tsx`

**Changes**:
- Wrap với ConfigurationProvider
- Add SettingsButton ở top-right corner
- Wrap PracticeInput với ConfigurationGuard

## UI/UX Considerations

### Positioning

- Settings button: Fixed top-right corner (similar to new message button ở top-left)
- Z-index: Ensure settings button is above other content
- Mobile responsive: Adjust positioning cho mobile screens

### Visual Design

- Settings icon: Cog/Settings icon từ lucide-react
- Badge: Small red dot hoặc warning badge khi not configured
- Dialog: Standard shadcn/ui dialog với `sm:max-w-md`
- Form layout: Vertical stack với clear labels

### Accessibility

- Settings button: Proper aria-label
- Form fields: Associated labels với htmlFor
- Error messages: role="alert" cho screen readers
- Keyboard navigation: Tab order logical

### User Flow

1. **First Time User**:
   - Sees settings button với warning badge
   - Cannot interact với practice interface
   - Sees message: "Vui lòng cấu hình model và API key để bắt đầu"
   - Clicks settings button
   - Fills in configuration
   - Saves
   - Practice interface becomes enabled

2. **Returning User**:
   - Configuration loaded từ localStorage
   - Practice interface enabled immediately
   - Can update configuration anytime via settings button

3. **Update Configuration**:
   - Clicks settings button
   - Sees current configuration pre-filled
   - Updates values
   - Saves
   - Changes apply immediately

## Security Considerations

1. **API Key Storage**:
   - Store trong localStorage (client-side only)
   - Never send to server except trong API requests
   - Consider encryption (optional enhancement)

2. **API Key Transmission**:
   - Send qua HTTPS only
   - Include trong request body, not URL params
   - Server không log API keys

3. **Validation**:
   - Client-side validation cho UX
   - Server-side validation cho security
   - Rate limiting trên API endpoint

## Future Enhancements

1. **Multiple Providers**:
   - Support OpenAI, Anthropic, etc.
   - Provider-specific configuration

2. **Configuration Profiles**:
   - Save multiple configurations
   - Switch between profiles

3. **API Key Encryption**:
   - Encrypt API key trong localStorage
   - Use Web Crypto API

4. **Usage Tracking**:
   - Track API usage
   - Display cost estimates

5. **Configuration Export/Import**:
   - Export configuration to file
   - Import configuration từ file

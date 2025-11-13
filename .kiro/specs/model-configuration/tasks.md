# Implementation Plan

- [x] 1. Create configuration types and constants
  - Define TypeScript types for ModelConfiguration, ConfigurationContextValue
  - Create MODEL_OPTIONS constant với available models
  - Define localStorage key constant
  - _Requirements: 1.1, 1.2, 3.1_

- [x] 2. Implement Configuration Context
  - [x] 2.1 Create ConfigurationContext và ConfigurationProvider
    - Implement context với configuration state management
    - Add methods: updateConfiguration, clearConfiguration
    - Implement localStorage persistence logic
    - Handle localStorage unavailable scenario
    - _Requirements: 1.4, 3.3, 4.1_
  
  - [x] 2.2 Add configuration loading on mount
    - Load configuration từ localStorage khi provider mounts
    - Parse và validate stored configuration
    - Set isConfigured flag based on configuration presence
    - _Requirements: 2.4, 4.1_

- [x] 3. Build Settings Dialog component
  - [x] 3.1 Create SettingsDialog component structure
    - Implement Dialog component từ shadcn/ui
    - Add form với model selector và API key input fields
    - Use Field component từ shadcn/ui cho form layout
    - Set dialog max-width to `sm:max-w-md`
    - _Requirements: 1.1, 1.2_
  
  - [x] 3.2 Implement form validation
    - Add validation cho required fields
    - Validate API key format (non-empty, minimum length)
    - Display error messages using FieldError component
    - Prevent save khi validation fails
    - _Requirements: 3.2, 4.3, 4.4_
  
  - [x] 3.3 Add save functionality
    - Call updateConfiguration từ context khi user saves
    - Close dialog after successful save
    - Pre-fill form với current configuration values
    - _Requirements: 1.3, 1.4, 3.1_

  - [ ] 3.4 Add custom model input support
    - Add "Custom Model" option to MODEL_OPTIONS constant
    - Add conditional custom model text input field
    - Show custom model input when "custom" is selected
    - Add validation for custom model name (required when visible)
    - Handle saving custom model name to configuration
    - Handle loading custom model configuration (set selector to "custom" and populate input)
    - _Requirements: 1.3, 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 4. Create Settings Button component
  - [x] 4.1 Implement SettingsButton với icon và positioning
    - Add Settings/Cog icon từ lucide-react
    - Position fixed ở top-right corner
    - Style similar to new message button
    - Make responsive cho mobile screens
    - _Requirements: 1.1, 4.1_
  
  - [x] 4.2 Add configuration status indicator
    - Display badge/indicator khi not configured
    - Use warning color cho badge
    - Remove indicator khi configured
    - Add proper aria-label cho accessibility
    - _Requirements: 4.1, 4.2_

- [x] 5. Implement Configuration Guard component
  - Create ConfigurationGuard wrapper component
  - Check isConfigured flag từ context
  - Render children khi configured
  - Render fallback message khi not configured: "Vui lòng cấu hình model và API key để bắt đầu"
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 6. Update API route to accept configuration
  - [x] 6.1 Modify request body interface
    - Add apiKey và model fields to request body type
    - Update request validation
    - _Requirements: 1.4, 3.3_
  
  - [x] 6.2 Replace hardcoded API key với user-provided key
    - Remove OPENROUTER_API_KEY từ environment variables usage
    - Use apiKey từ request body
    - Validate API key presence trước khi call OpenRouter
    - Use model từ request body thay vì hardcoded model
    - _Requirements: 1.4, 3.3_

- [x] 7. Update practice hook to use configuration
  - Access configuration từ ConfigurationContext trong usePractice hook
  - Include apiKey và model trong API request body
  - Handle missing configuration scenario
  - _Requirements: 1.4, 2.3, 3.3_

- [x] 8. Integrate components into main page
  - [x] 8.1 Wrap app với ConfigurationProvider
    - Add ConfigurationProvider ở root level trong page.tsx
    - Ensure context is available to all components
    - _Requirements: 1.4, 2.4_
  
  - [x] 8.2 Add SettingsButton to page layout
    - Position SettingsButton ở top-right corner
    - Ensure proper z-index stacking
    - Add SettingsDialog component
    - _Requirements: 1.1, 4.1_
  
  - [x] 8.3 Wrap PracticeInput với ConfigurationGuard
    - Disable practice input khi not configured
    - Show configuration prompt message
    - Enable practice input khi configured
    - _Requirements: 2.1, 2.2, 2.3_

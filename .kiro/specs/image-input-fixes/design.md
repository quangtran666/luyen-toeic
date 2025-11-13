# Design Document

## Overview

This design addresses two critical bugs in the image input functionality:
1. **API Validation Error**: The OpenRouter API expects image content in a specific format (URL string), but we're sending base64 data incorrectly
2. **Enter Key Not Working**: After pasting an image, the Enter key doesn't trigger submission because the textarea is cleared but keyboard event handlers aren't properly set up

## Architecture

The fix involves two main components:
- **API Route** (`src/app/api/practice/route.ts`): Fix the image message format to match OpenRouter's expected schema
- **Practice Input Component** (`src/features/practice/components/practice-input.tsx`): Add keyboard event handling for image submission

## Root Cause Analysis

### Issue 1: API Validation Error

The current code sends:
```typescript
{
  type: "image" as const,
  image: content  // base64 string
}
```

But OpenRouter expects:
```typescript
{
  type: "image" as const,
  image: new URL(content)  // URL object or properly formatted URL string
}
```

The base64 string needs to be in data URL format that can be parsed as a URL.

### Issue 2: Enter Key Not Working

After pasting an image:
1. The textarea is cleared (`setTextContent("")`)
2. Image preview is shown
3. But there's no keyboard event listener on the image preview container
4. The textarea is hidden/replaced, so Enter key has no effect

## Components and Interfaces

### 1. API Route Changes

**File**: `src/app/api/practice/route.ts`

**Changes**:
- Ensure base64 image data is in proper data URL format
- Validate image content format before sending to OpenRouter
- Add error handling for malformed image data

```typescript
// Current problematic code:
{ type: "image" as const, image: content }

// Fixed code:
{ 
  type: "image" as const, 
  image: content.startsWith('data:') ? content : `data:image/jpeg;base64,${content}`
}
```

### 2. Practice Input Component Changes

**File**: `src/features/practice/components/practice-input.tsx`

**Changes**:
- Add `useEffect` to set up global keyboard event listener
- Listen for Enter key press when image is present
- Trigger submit when Enter is pressed (without Shift)
- Clean up event listener on unmount

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && imageFile && imageBase64) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (imageFile && imageBase64) {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }
}, [imageFile, imageBase64]);
```

## Data Models

No changes to data models required. The existing types are sufficient:

```typescript
interface QuestionInput {
  mode: "text" | "image";
  part: PracticePart;
  content: string;  // base64 for images, text for text mode
  imageFile?: File;
}
```

## Error Handling

### API Route Error Handling

1. **Invalid Image Format**: Return 400 error if image data is not valid base64
2. **Missing Image Data**: Return 400 error if mode is "image" but content is empty
3. **OpenRouter API Error**: Catch and log the specific validation error, return user-friendly message

### Component Error Handling

1. **Paste Event Failure**: Show validation error if image paste fails
2. **Keyboard Event Conflicts**: Ensure Enter key doesn't conflict with other inputs when image is shown

## Testing Strategy

### Manual Testing

1. **Image Paste and Submit**:
   - Paste an image with Ctrl+V
   - Verify image preview appears
   - Press Enter key
   - Verify request is sent and analysis is received

2. **Image Upload and Submit**:
   - Click to upload an image
   - Verify image preview appears
   - Press Enter key
   - Verify request is sent and analysis is received

3. **Error Cases**:
   - Paste invalid image format
   - Verify error message is shown
   - Paste image larger than 10MB
   - Verify size error is shown

### API Testing

1. Test with valid base64 image data
2. Test with data URL format
3. Test with malformed image data
4. Verify OpenRouter receives correct format

## Implementation Notes

- The Enter key listener should only be active when an image is present
- Clean up event listeners properly to avoid memory leaks
- Ensure the fix doesn't break text input mode
- Maintain existing validation logic for image size and format

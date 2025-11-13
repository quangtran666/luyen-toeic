# Implementation Plan

- [x] 1. Fix OpenRouter API image format validation error
  - Modify the API route to ensure base64 image data is in proper data URL format
  - Add validation to check if image content starts with 'data:' prefix
  - If not, prepend the appropriate data URL prefix (data:image/jpeg;base64,)
  - Add error handling for malformed image data before sending to OpenRouter
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Add keyboard event handling for image submission
  - Add useEffect hook to Practice Input Component to listen for Enter key press
  - Implement keyboard event handler that triggers submit when Enter is pressed (without Shift key)
  - Ensure the event listener is only active when an image is present (imageFile && imageBase64)
  - Add proper cleanup of event listener on component unmount or when image is cleared
  - Prevent default Enter key behavior to avoid conflicts
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ]* 3. Test the fixes
  - Manually test pasting an image and pressing Enter to verify submission works
  - Test uploading an image via file picker and pressing Enter
  - Verify API receives correct image format and returns analysis
  - Test error cases (invalid format, large files)
  - Ensure text input mode still works correctly
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4_

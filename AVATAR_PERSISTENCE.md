# Avatar Persistence Implementation

## Overview
User avatar is now persisted across app restarts and logout using Zustand with persist middleware backed by AsyncStorage.

## Implementation Details

### 1. Zustand Store (`src/state/userStore.ts`)
- **Location**: `src/state/userStore.ts`
- **Persistence**: Uses Zustand persist middleware with AsyncStorage
- **Key**: `user_profile`
- **State**:
  - `name`: User's display name (nullable)
  - `avatarUri`: Local file URI pointing to avatar in documentDirectory
  
- **Actions**:
  - `setName(name)`: Update user's display name
  - `setAvatar(uri)`: Update avatar URI
  - `resetAuth()`: Clears auth data (name) but **keeps avatar**
  - `hardReset()`: Clears everything including avatar (for profile reset)

### 2. Auth Context Integration (`contexts/auth.tsx`)
- Avatar now managed by Zustand store instead of local state
- `loadSession()`: Loads avatar from file system and syncs to store
- `setModelAvatar()`: Saves avatar to file system and updates store
- `logout()`: Calls `resetAuth()` which preserves avatar

### 3. ProfileAvatar Component (`components/ProfileAvatar.tsx`)
- Reads avatar from Zustand store via `useUserStore()`
- Shows Plus icon when no avatar is set
- On tap:
  1. Requests media library permissions
  2. Opens image picker with square crop (aspect 1:1)
  3. Saves picked image via `saveAvatar()` utility
  4. Updates Zustand store with saved URI
- Loading state with spinner
- Error handling with alerts

### 4. Avatar Storage (`utils/avatarStorage.ts`)
- Uses `expo-file-system` to store avatar permanently
- Location: `FileSystem.documentDirectory + 'avatars/model-avatar.jpg'`
- Features:
  - Automatic directory creation
  - Image resizing (max width 512px, 0.8 JPEG quality)
  - Cache busting with timestamp
  - Cleanup on file not found

## User Flow

### Setting Avatar (First Time)
1. User taps on avatar placeholder (Plus icon)
2. System requests photo library permission
3. User selects image from library
4. Image is:
   - Resized to 512px max width
   - Saved to documentDirectory as `avatars/model-avatar.jpg`
   - URI stored in Zustand + AsyncStorage
5. Avatar displays immediately

### Changing Avatar
1. User taps existing avatar
2. Same flow as above
3. Old avatar file is replaced
4. New URI stored with cache-bust timestamp

### After Logout
1. `logout()` is called
2. Auth tokens cleared from AsyncStorage
3. `resetAuth()` called (NOT `hardReset()`)
4. Avatar URI remains in Zustand store
5. On next login, avatar is still visible

### After App Restart
1. Zustand rehydrates from AsyncStorage
2. Avatar URI is restored automatically
3. `loadAvatar()` verifies file exists
4. If file missing, storage is cleaned up
5. Otherwise, avatar displays with cache-bust timestamp

## Dependencies
- `zustand@5.0.2` - State management with persist
- `@react-native-async-storage/async-storage@2.2.0` - Persistence storage
- `expo-file-system@~19.0.17` - File system operations
- `expo-image-picker@~17.0.8` - Image selection
- `expo-image-manipulator@~14.0.7` - Image resizing

## Testing Checklist
- [x] Tap avatar → Opens picker
- [x] Select image → Avatar updates
- [x] Logout → Avatar persists
- [x] Login again → Avatar still visible
- [x] Close app → Restart → Avatar visible
- [x] Change avatar → Old avatar replaced
- [x] Error handling → Alerts shown
- [x] Web compatibility → No crashes

## Future Enhancements (Optional)
- Add `hardReset()` button in settings for "Reset Profile"
- Support multiple user profiles with different avatars
- Add avatar upload to remote server
- Implement avatar cropping UI in-app

# KTG PMS - Mobile Application

React Native mobile application for KTG PMS system built with Expo.

## 📱 Tech Stack

- **Framework**: React Native with Expo SDK 52
- **Language**: TypeScript
- **State Management**: React Query (TanStack Query)
- **Navigation**: React Navigation
- **UI Components**: React Native Elements, Bottom Sheet
- **Forms**: React Hook Form + Yup validation
- **Backend**: NestJS API
- **Authentication**: OAuth2 with SSO

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and Yarn
- Expo CLI
- iOS Simulator (macOS) or Android Emulator
- EAS CLI for building: `npm install -g eas-cli`

### Installation

```bash
# Install dependencies
yarn install

# Setup environment files
cp .env.example .env
cp .env.example .env.development
cp .env.example .env.production
```

### Environment Variables

Create `.env`, `.env.development`, and `.env.production` files with:

```env
# API Configuration
API_URL=https://your-api-url.com

# App Information
APP_NAME=KTG PMS
APP_SLUG=ktg-pms
APP_VERSION=1.0.0
APP_RUNTIME_VERSION=1.0.0

# iOS Configuration
IOS_BUNDLE_IDENTIFIER=com.ktg.pms.prod
IOS_BUILD_NUMBER=1

# Android Configuration
ANDROID_PACKAGE=com.ktg.pms.prod
ANDROID_VERSION_CODE=1

# Build Configuration
BUILD_NUMBER=1

# SSO Configuration
SSO_CLIENT_ID=your-client-id
SSO_CLIENT_SECRET=your-client-secret
SSO_REDIRECT_URI=your-redirect-uri

# Firebase Configuration Files (base64 encoded)
GOOGLE_SERVICES_FILE_ANDROID=base64-encoded-google-services.json
GOOGLE_SERVICES_FILE_IOS=base64-encoded-GoogleService-Info.plist
```

## 🛠️ Development

### Run Development Server

```bash
# Start Expo dev server (development environment)
yarn start:dev

# Start Expo dev server (production environment)
yarn start:pro
```

### Run on Device/Emulator

```bash
# Android (development)
yarn run:android:dev

# Android (production)
yarn run:android:pro

# iOS (development)
yarn run:ios:dev

# iOS (production)
yarn run:ios:pro
```

### Prebuild Native Projects

```bash
# Android (development)
yarn pre:android:dev

# Android (production)
yarn pre:android:pro

# iOS (development)
yarn pre:ios:dev

# iOS (production)
yarn pre:ios:pro
```

## 📦 Building

### Build with EAS

#### Android

```bash
# Development APK (local build)
yarn eas:android:dev

# Production AAB for Play Store (cloud build)
yarn eas:android:pro

# Production APK for testing (local build)
yarn eas:android:pro:apk
```

#### iOS

```bash
# Development build
yarn eas:ios:dev

# Production build for App Store
yarn eas:ios:pro

# Simulator builds
yarn eas:ios:dev:simulator
yarn eas:ios:prod:simulator
```

### Submit to Stores

```bash
# Submit to App Store
yarn submit:ios:dev
yarn submit:ios:pro

# Note: Android submission is done through Google Play Console
```

## 🔄 OTA Updates

```bash
# Development update
yarn update:dev

# Production update
yarn update:pro
```

## 📋 Project Structure

```
src/
├── app.type.ts           # Global TypeScript types
├── assets/               # Images, fonts, icons
├── common/               # Reusable components (Button, Input, etc.)
├── components/           # Shared components (Header, Container, etc.)
├── constants/            # App constants and configurations
├── contexts/             # React contexts (Auth, Modal, etc.)
├── enums/                # TypeScript enums
├── features/             # Feature modules
│   ├── Login/
│   ├── UserInfo/
│   ├── TimeSheet/
│   ├── Overtime/
│   ├── LeaveRequest/
│   └── Payroll/
├── hooks/                # Custom React hooks
├── navigation/           # Navigation configuration
├── services/             # API services
├── styles/               # Global styles
└── utils/                # Utility functions
```

## 🎨 Key Features

- ✅ OAuth2 SSO Authentication
- ✅ User Profile Management
- ✅ Timesheet Tracking
- ✅ Overtime Management
- ✅ Leave Request System
- ✅ Payroll Information
- ✅ Push Notifications (Firebase)
- ✅ Offline Support
- ✅ OTA Updates

## 🔧 Configuration Files

- `app.json` / `app.config.js` - Expo app configuration
- `eas.json` - EAS Build configuration
- `tsconfig.json` - TypeScript configuration
- `babel.config.js` - Babel configuration
- `.env*` - Environment variables (not committed)

## 📱 Supported Platforms

- iOS 13.4+
- Android 6.0+ (API 23+)
- **16KB Page Size Support**: Configured for Google Play Console requirements

## 🐛 Troubleshooting

### Android Build Issues

If you encounter build issues:

```bash
# Clean Android build
cd android && ./gradlew clean && cd ..

# Clear Metro cache
yarn start --clear
```

### iOS Build Issues

```bash
# Clean iOS build
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..
```

## 📚 Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [React Query Documentation](https://tanstack.com/query/latest)

## 🔐 Security Notes

- Never commit `.env.development` or `.env.production` files
- Keep Firebase configuration files secure
- Rotate SSO credentials regularly
- Use EAS Secrets for sensitive build-time variables

## 📄 License

Private - KTG Technologies

## 👥 Team

Developed by KTG Technologies Development Team

---

For more information, contact: ktgpms.dev@gmail.com

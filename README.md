# ShopKwetu Mobile

React Native (Expo) mobile companion app for [ShopKwetu](https://github.com/barakadanny/shopkwetu) — a bilingual multi-vendor SaaS marketplace.

## About

ShopKwetu Mobile brings the full ShopKwetu marketplace experience to iOS and Android. It connects to the same backend API and MongoDB database as the web platform, providing a native mobile experience for buyers, sellers, and administrators.

## Web Platform

The backend and web frontend live at: **[barakadanny/shopkwetu](https://github.com/barakadanny/shopkwetu)**

### Web Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Database:** MongoDB / Mongoose
- **Auth:** NextAuth v5 (Google OAuth + Credentials)
- **Real-time:** Socket.io
- **Media:** Cloudinary
- **i18n:** next-intl (FR primary, EN secondary)

## Mobile Tech Stack (Planned)
- **Framework:** React Native with Expo SDK 52+
- **Navigation:** Expo Router (file-based, mirrors web)
- **State:** Zustand (lightweight, React-friendly)
- **API Client:** Axios + React Query (TanStack Query)
- **Real-time:** socket.io-client
- **Auth:** expo-auth-session (Google OAuth) + secure token storage
- **i18n:** i18next + react-i18next (reuses web JSON message files)
- **Media:** expo-image (Cloudinary URLs)
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **Forms:** React Hook Form + Zod (shared validation schemas)

## Features (Roadmap)
- [ ] Marketplace browsing with search, filters, and promotions
- [ ] Google OAuth + email/password authentication
- [ ] Shopping cart with multi-shop checkout
- [ ] Real-time chat (buyer-seller, admin support)
- [ ] Push notifications (orders, messages, promotions)
- [ ] Order tracking with status timeline
- [ ] Seller dashboard (products, orders, credits, promos)
- [ ] Ambassador program (promo codes, commissions)
- [ ] Property listings and booking
- [ ] Bilingual support (FR/EN)

## Getting Started

```bash
# Prerequisites: Node.js 18+, Expo CLI
npx create-expo-app@latest shopkwetu-mobile

# Install dependencies
cd shopkwetu-mobile
npm install

# Start development
npx expo start
```

## Environment Variables

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_WS_URL=ws://localhost:3000
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

## Project Structure (Planned)

```
src/
  app/                  # Expo Router file-based routes
    (tabs)/             # Tab navigator (Home, Search, Cart, Messages, Profile)
    (auth)/             # Auth screens
    (dashboard)/        # Seller dashboard stack
    (admin)/            # Admin stack
  components/           # Reusable UI components
  lib/                  # API client, socket, auth helpers
  stores/               # Zustand state stores
  i18n/                 # Translations (fr.json, en.json from web)
  types/                # Shared TypeScript interfaces
  hooks/                # Custom React hooks
  constants/            # Colors, config, roles
```

## License

Private — All rights reserved.

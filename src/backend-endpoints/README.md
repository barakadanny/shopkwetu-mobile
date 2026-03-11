# Backend Endpoints for Mobile Auth

These files need to be added to the **shopkwetu web repo** (Citrana/shopkwetu)
to support mobile authentication.

## Files to copy

Copy these files into your web repo's `src/app/api/auth/mobile/` directory:

- `login/route.ts` → `src/app/api/auth/mobile/login/route.ts`
- `google/route.ts` → `src/app/api/auth/mobile/google/route.ts`
- `session/route.ts` → `src/app/api/auth/mobile/session/route.ts`

## Required: Install `jsonwebtoken`

```bash
npm install jsonwebtoken @types/jsonwebtoken
```

## Required: Add environment variable

Add to your `.env`:

```
MOBILE_JWT_SECRET=your-strong-random-secret-here
```

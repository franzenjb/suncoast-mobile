# Suncoast Mobile Hurricane Tracker - Complete Setup Guide

## Project Structure
```
suncoast-mobile/
├── README.md
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
└── components/
    └── HurricaneTracker.tsx
```

## Setup Instructions

### 1. Create Local Directory
```bash
mkdir suncoast-mobile
cd suncoast-mobile
```

### 2. Copy Configuration Files
Copy each file from the Google Drive documents created:
- README.md (from "Suncoast Mobile - README")
- package.json (from "Suncoast Mobile - package.json")
- tailwind.config.js (from "Suncoast Mobile - tailwind.config.js")
- tsconfig.json (from "Suncoast Mobile - tsconfig.json")

### 3. Create Additional Required Files

#### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {}
module.exports = nextConfig
```

#### app/globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### app/layout.tsx
```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hurricane Elena Tracker',
  description: 'Real-time hurricane tracking for Suncoast Credit Union branches',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

#### app/page.tsx
```tsx
import HurricaneTracker from '@/components/HurricaneTracker'

export default function Home() {
  return <HurricaneTracker />
}
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Run Development Server
```bash
npm run dev
```

### 6. Deploy to Vercel
```bash
npm run build
# Then deploy using Vercel CLI or GitHub integration
```

## GitHub Integration
1. Initialize Git: `git init`
2. Add remote: `git remote add origin https://github.com/franzenjb/suncoast-mobile.git`
3. Commit: `git add . && git commit -m "Initial Hurricane Elena Mobile Tracker"`
4. Push: `git push -u origin main`

## Complete HurricaneTracker.tsx
The full component file with all 78 branch records and complete functionality is available in the earlier artifact. Copy the complete TypeScript component code for full functionality.

## Features Included
- Mobile-responsive design
- Real-time search and filtering
- Risk-based color coding
- Evacuation zone indicators
- County, region, and risk level filters
- Interactive branch cards with detailed information

## Data Sources
- National Hurricane Center predictions
- Suncoast Credit Union branch network
- Emergency management evacuation zones

This setup provides a complete, deployable hurricane tracking application optimized for mobile devices and ready for production use.
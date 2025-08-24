# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production-ready static site (outputs to /out directory)
- `npm run lint` - Run ESLint checks
- `npm run deploy` - Build and deploy to GitHub Pages (builds, adds out/ to git, commits, and pushes to gh-pages branch)

### Deployment
The site is deployed to GitHub Pages at https://franzenjb.github.io/suncoast-mobile/
- Production builds use `/suncoast-mobile` as basePath and assetPrefix (configured in next.config.js)
- Static export is configured with `output: 'export'` for GitHub Pages compatibility

## Architecture

### Core Stack
- **Next.js 14** with App Router (static export mode)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Leaflet** for interactive hurricane tracking maps
- **Lucide React** for icons

### Component Architecture

The application uses a hierarchical component structure centered around hurricane tracking:

1. **Main Entry**: `app/page.tsx` renders `HurricaneTrackerEnhanced`

2. **Primary Component**: `HurricaneTrackerEnhanced` manages the entire application state:
   - Toggles between Map and Dashboard views (defaults to Map view)
   - Manages filtering, search, and branch selection
   - Contains all 64 Suncoast Credit Union branch data with hurricane impact predictions

3. **Map Components**:
   - `HurricaneMapViewFixed` - Primary map component with corrected Florida centering and hurricane physics
   - `HurricaneMapView` - Original map implementation (deprecated, use Fixed version)
   - Uses dynamic imports to avoid SSR issues with Leaflet
   - Displays storm position, forecast cone, wind arrival contours, and branch risk markers

4. **Dashboard Components**:
   - `DashboardStats` - Overview statistics (critical risk counts, evacuation zones, etc.)
   - `Timeline` - Temporal visualization of wind arrivals at branches
   - `RiskHeatmap` - County-level risk assessment visualization

### Hurricane Physics Implementation

The application correctly models hurricane meteorology:
- **Front-right quadrant** (NE from storm center) shows highest risk due to additive wind speeds
- Crystal River and nearby branches have highest probabilities (88-92%)
- Risk decreases with distance and position relative to storm track
- Storm positioned at [26.8, -83.2], 120 miles SW of Crystal River

### Key Data Structure

Branch data includes:
```typescript
interface Branch {
  branchNumber: number
  locationName: string
  address: string
  city: string
  county: string
  region: number
  evacuationZone: string
  earliestArrival: string
  mostLikelyArrival: string
  latestArrival: string
  probability: number  // Wind probability (39+ mph)
  duration: string
  coordinates: [number, number]  // [lat, lng]
}
```

### Leaflet Integration Notes

- Leaflet CSS must be imported in globals.css: `@import 'leaflet/dist/leaflet.css';`
- Map components use dynamic imports with `ssr: false` to prevent server-side rendering issues
- Default Leaflet markers require icon path fixes in the component initialization
- Map centers at [27.5, -82.5] with zoom level 7 for optimal Florida visibility

### GitHub Pages Configuration

The project is configured for GitHub Pages deployment:
- Static files are exported to `/out` directory
- `.nojekyll` file prevents Jekyll processing
- Deployment uses gh-pages branch via git subtree
- Base path and asset prefix adjust automatically for production vs development

## Important Files

- `components/HurricaneTrackerEnhanced.tsx` - Main application component with all branch data
- `components/HurricaneMapViewFixed.tsx` - Corrected map implementation with proper risk calculations
- `next.config.js` - Contains GitHub Pages deployment configuration
- `app/globals.css` - Includes critical Leaflet CSS imports
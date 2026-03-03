# LocalWell

## Vision

LocalWell is a "healthy Yelp" — a platform for discovering restaurants, gyms, and wellness centers that support a healthy lifestyle. Deployed at localwell.app. Will become an iOS app.

## Tech Stack

- **Frontend:** React 19 with Vite
- **Backend:** Supabase (auth, database, storage)
- **Maps:** Leaflet / React-Leaflet
- **Deployment:** Vercel (GitHub connected)
- **Domain:** localwell.app
- **Linting:** ESLint 9

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — run ESLint
- `npm run preview` — preview production build

## Automation

- **SessionStart hook** — `.claude/hooks/session-start.sh` auto-installs npm dependencies on every Claude Code web session
- **GitHub Issues** — Feature roadmap is tracked as labeled GitHub issues. Use `auto` label for issues Claude Code should pick up automatically.
- Always run `npm run build` and `npm run lint` before committing to verify changes.

## Roadmap

### Phase 1: iOS App Readiness (DONE)
- [x] Mobile-responsive layout with bottom nav
- [x] Touch-friendly targets (44px min)
- [x] Modal sheet UI on mobile
- [x] SessionStart hook for Claude Code automation

### Phase 2: PWA & Offline (DONE)
- [x] Add `manifest.json` with app name, icons, theme color
- [x] Add iOS meta tags (`apple-mobile-web-app-capable`, status bar, splash screens)
- [x] Service worker for offline caching of shell + visited pages
- [x] "Add to Home Screen" prompt

### Phase 3: Search & Filters (DONE)
- [x] Full-text search across business names, tags, descriptions
- [x] Health filter system (dietary: vegan, gluten-free, keto; fitness: yoga, HIIT, climbing; wellness: massage, acupuncture, meditation)
- [x] Filter persistence in URL params
- [x] Search results page with map view

### Phase 4: Geolocation
- [ ] Browser Geolocation API integration
- [ ] Sort businesses by distance from user
- [ ] "Near me" filter toggle
- [ ] Distance display on cards and listings

### Phase 5: Backend Integration
- [ ] Replace mock data with Supabase queries
- [ ] Real business CRUD operations
- [ ] Persistent reviews and ratings in database
- [ ] User favorites stored in Supabase

### Phase 6: User Profiles
- [ ] Editable profile page (name, bio, avatar)
- [ ] Review history on profile
- [ ] Saved/favorited spots list
- [ ] User preferences (dietary, fitness interests)

### Phase 7: Social Features
- [ ] Follow/unfollow users
- [ ] Activity feed with real data
- [ ] Share spots to feed with comments
- [ ] Like and comment on posts

### Phase 8: iOS App
- [ ] Capacitor or React Native wrapper
- [ ] Push notifications
- [ ] App Store submission

## Design Goals

Clean, modern wellness aesthetic. The UI should feel fresh, approachable, and health-oriented. Mobile-first — every feature should work great on a phone.

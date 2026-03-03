#!/bin/bash
# Run this locally after `gh auth login` to create all roadmap issues.
# Usage: bash scripts/create-roadmap-issues.sh

set -euo pipefail

REPO="willvone23/localwell"

echo "Creating LocalWell roadmap issues..."

# Phase 2: PWA & Offline
gh issue create --repo "$REPO" --label "auto,enhancement" \
  --title "Add PWA manifest.json and iOS meta tags" \
  --body "$(cat <<'EOF'
## Description
Make LocalWell installable as a PWA on iOS and Android.

## Requirements
- Add `manifest.json` with app name ("LocalWell"), icons (192px, 512px), theme color (#16a34a), background color (#f8fafc), display: standalone
- Generate app icons from the existing logo gradient
- Add iOS meta tags to `index.html`:
  - `apple-mobile-web-app-capable`
  - `apple-mobile-web-app-status-bar-style`
  - `apple-touch-icon`
- Add "Add to Home Screen" prompt component

## Acceptance Criteria
- Lighthouse PWA audit passes installability check
- App can be added to home screen on iOS Safari
- App opens in standalone mode (no browser chrome)
- `npm run build` and `npm run lint` pass
EOF
)"
echo "✓ Issue: PWA manifest"

gh issue create --repo "$REPO" --label "auto,enhancement" \
  --title "Add service worker for offline caching" \
  --body "$(cat <<'EOF'
## Description
Add a service worker so the app shell loads offline and previously visited pages are cached.

## Requirements
- Use Vite PWA plugin (`vite-plugin-pwa`) or a custom service worker
- Cache the app shell (HTML, CSS, JS)
- Cache visited pages and API responses
- Show an offline indicator when network is unavailable
- Handle service worker updates gracefully

## Acceptance Criteria
- App shell loads when offline
- Previously visited business listings appear offline
- `npm run build` and `npm run lint` pass
EOF
)"
echo "✓ Issue: Service worker"

# Phase 3: Search & Filters
gh issue create --repo "$REPO" --label "auto,enhancement" \
  --title "Add full-text search across businesses" \
  --body "$(cat <<'EOF'
## Description
Add a search bar that filters businesses by name, tags, description, and address.

## Requirements
- Search input in the header or explore page hero
- Client-side fuzzy search across: name, tags, description, address, type
- Debounced input (300ms)
- Show search results count
- Clear search button
- Search term preserved in URL query param (?q=...)
- Mobile: search should be accessible from the header

## Acceptance Criteria
- Typing "yoga" shows all yoga-related businesses
- Typing "vegan" shows restaurants with vegan tags
- Search works on mobile
- `npm run build` and `npm run lint` pass
EOF
)"
echo "✓ Issue: Full-text search"

gh issue create --repo "$REPO" --label "auto,enhancement" \
  --title "Add health filter system with dietary, fitness, and wellness categories" \
  --body "$(cat <<'EOF'
## Description
Build a structured health filter system so users can find businesses by specific health criteria.

## Requirements
- Filter categories:
  - **Dietary**: Vegan, Vegetarian, Gluten-Free, Keto, Organic, Halal
  - **Fitness**: Yoga, HIIT, CrossFit, Swimming, Climbing, Pilates
  - **Wellness**: Massage, Acupuncture, Meditation, Spa, Sauna, Physical Therapy
- Multi-select within categories
- Filter state persisted in URL params
- Filter count badge
- "Clear all filters" button
- Works with the existing FiltersBar component pattern

## Acceptance Criteria
- Users can combine multiple filters
- Filters update the business listing grid in real time
- URL reflects active filters (shareable)
- `npm run build` and `npm run lint` pass
EOF
)"
echo "✓ Issue: Health filters"

# Phase 4: Geolocation
gh issue create --repo "$REPO" --label "auto,enhancement" \
  --title "Add geolocation and distance-based sorting" \
  --body "$(cat <<'EOF'
## Description
Use the browser Geolocation API to show nearby businesses and sort by distance.

## Requirements
- Request user location permission on explore page
- Calculate distance from user to each business using Haversine formula
- "Near me" toggle button in the filter bar
- Distance displayed on SpotCard (e.g., "0.3 mi" or "1.2 km")
- Sort businesses by distance when "Near me" is active
- Graceful fallback if permission denied

## Acceptance Criteria
- Tapping "Near me" sorts businesses by proximity
- Distance shows on each card
- Works without location permission (just hides distance)
- `npm run build` and `npm run lint` pass
EOF
)"
echo "✓ Issue: Geolocation"

# Phase 5: Backend
gh issue create --repo "$REPO" --label "auto,enhancement" \
  --title "Replace mock data with Supabase backend queries" \
  --body "$(cat <<'EOF'
## Description
Wire up the existing Supabase client to fetch real business data instead of mock data.

## Requirements
- Create Supabase tables: businesses, reviews, favorites
- Migrate mock data (src/data/spots.js) to seed SQL
- Replace static imports with Supabase queries in pages
- Reviews and ratings saved to database
- Favorites persisted per user in Supabase
- Loading states while data fetches
- Error handling for failed queries

## Acceptance Criteria
- Business listings load from Supabase
- New reviews persist across page reloads
- Favorites persist across sessions
- `npm run build` and `npm run lint` pass
EOF
)"
echo "✓ Issue: Supabase backend"

# Phase 6: User Profiles
gh issue create --repo "$REPO" --label "auto,enhancement" \
  --title "Build editable user profile with review history and saved spots" \
  --body "$(cat <<'EOF'
## Description
Make the profile page functional with real user data, editable fields, and history.

## Requirements
- Edit profile: name, bio, avatar upload
- Profile data stored in Supabase profiles table
- Review history tab showing all user reviews
- Saved/favorited spots tab
- User preferences section (dietary restrictions, fitness interests)
- Profile avatar shown in header and mobile nav

## Acceptance Criteria
- Users can update their name and bio
- Reviews and favorites appear on profile
- Profile changes persist across sessions
- `npm run build` and `npm run lint` pass
EOF
)"
echo "✓ Issue: User profiles"

# Phase 7: Social
gh issue create --repo "$REPO" --label "auto,enhancement" \
  --title "Add social features: follow users, activity feed, sharing" \
  --body "$(cat <<'EOF'
## Description
Build the social layer — following users, real activity feed, and sharing spots.

## Requirements
- Follow/unfollow users from their profile
- Activity feed showing posts from followed users
- Share a spot to your feed with a comment
- Like and comment on feed posts
- Feed data stored in Supabase
- Notification count for new activity

## Acceptance Criteria
- Users can follow/unfollow others
- Feed shows activity from followed users
- Sharing a spot creates a feed post
- `npm run build` and `npm run lint` pass
EOF
)"
echo "✓ Issue: Social features"

echo ""
echo "All roadmap issues created! View them at:"
echo "  https://github.com/$REPO/issues"

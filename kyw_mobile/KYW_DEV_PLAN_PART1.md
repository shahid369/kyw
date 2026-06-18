# KYW — Full Development Plan & Feature Prompts
## Part 1: Revenue Foundation (Phase 1)

### Design Rules (apply to ALL features)
- Font: Space Grotesk (headings) + DM Sans (body)
- Colors: primary=#ED4187, secondary=#249EE0, accent=#9761DE
- Phase colors: Menstrual=#EF4B4B, Follicular=#2B9EE0, Ovulation=#F7BD11, Luteal=#9761DE
- Dark bg=#0D0E14, surface=#1A1C27; Light bg=#F4F5F8, surface=#FFFFFF
- Borders: radius 16–24px, no elevation, use border lines
- Animations: flutter_animate, 300–500ms, slideY+fadeIn pattern
- State: Riverpod (ConsumerWidget/ConsumerStatefulWidget)
- Navigation: go_router
- All Pro features gated behind `isPro` check

---

## FEATURE P1-1: RevenueCat SDK Integration

### Spec
Set up RevenueCat as the subscription backend for KYW Pro.

### Acceptance Criteria
- `purchases_flutter` added to pubspec.yaml
- RevenueCat initialized in main.dart with Android API key
- `isProProvider` (Riverpod provider) returns bool
- `ProEntitlementService` class with `checkPro()` and `restorePurchases()` methods
- No UI changes yet — foundation only

### Files to create/modify
- `pubspec.yaml` — add dependency
- `lib/main.dart` — initialize SDK
- `lib/services/pro_service.dart` — new file
- `lib/core/providers.dart` — add `isProProvider`

### Prompt
```
You are implementing RevenueCat subscription management in the KYW Flutter app (Android-first).

TECH STACK: Flutter 3.x, Dart 3.x, Riverpod 2.x (flutter_riverpod ^3.3.1), Supabase backend, go_router.

TASK: Integrate the `purchases_flutter` package for RevenueCat.

1. Add `purchases_flutter: ^8.0.0` to pubspec.yaml dependencies.

2. Create `lib/services/pro_service.dart`:
   - Class `ProService` with static methods
   - `static Future<void> initialize(String apiKey)` — calls Purchases.configure
   - `static Future<bool> checkIsPro()` — checks 'pro' entitlement, returns bool
   - `static Future<void> restorePurchases()` — calls Purchases.restorePurchases
   - `static Future<List<Package>> getOfferings()` — returns available packages
   - Handle PurchasesErrorCode gracefully, never throw raw exceptions

3. In `lib/core/providers.dart`, add:
   - `isProProvider`: AsyncNotifierProvider<IsProNotifier, bool>
   - `IsProNotifier` class that calls `ProService.checkIsPro()` on build
   - Method `refresh()` to re-check after purchase

4. In `lib/main.dart`, call `ProService.initialize('YOUR_ANDROID_KEY_HERE')` before `runApp`.

Use null safety throughout. Add // TODO: Replace with real API key comment.
```

---

## FEATURE P1-2: AdMob Banner Ad on Dashboard

### Spec
Show a banner ad at the bottom of the Dashboard for free users only. Hidden for Pro.

### Acceptance Criteria
- `google_mobile_ads` already integrated (from prior work)
- Banner ad appears fixed at bottom of Dashboard scaffold
- Reads `isProProvider` — if Pro, no ad shown
- Uses test ad unit ID with TODO comment for real ID
- Does not shift content (uses a persistent bottom area)

### Files to modify
- `lib/screens/dashboard_screen.dart`

### Prompt
```
You are adding an AdMob banner ad to the KYW Flutter app Dashboard screen.

CONTEXT: The app uses flutter_riverpod, go_router, and has a dark/light theme system.
The `isProProvider` (AsyncNotifierProvider<IsProNotifier, bool>) is available in providers.dart.
`google_mobile_ads` package is already in pubspec.yaml.

TASK: Modify `lib/screens/dashboard_screen.dart` to show a banner ad for free users.

1. Add a `BannerAd` instance to `_DashboardScreenState`:
   - Ad unit: 'ca-app-pub-3940256099942544/6300978111' (test ID) with TODO comment
   - Size: AdSize.banner
   - Load ad in initState, dispose in dispose()

2. Wrap the Scaffold body — use `bottomNavigationBar` slot (or a persistent `bottomSheet`) to show:
   - A `Container` with the banner ad widget, only if `!isPro && adLoaded`
   - Style: no border, backgroundColor matches scaffold background

3. Watch `isProProvider` — if isPro is true, show SizedBox.shrink() instead.

4. Handle ad load failure gracefully (just hide the slot).

DO NOT restructure the existing dashboard layout. Only add the banner at the bottom.
Preserve all existing animations and widget structure.
```

---

## FEATURE P1-3: Pro Upgrade / Paywall Screen

### Spec
A dedicated full-screen paywall shown when a free user tries to access a Pro feature.

### Acceptance Criteria
- Route: `/pro` via go_router
- Shows 3 pricing cards: Monthly $2.99, Annual $19.99 (highlighted), Lifetime $39.99
- Lists 6–8 top Pro benefits with icons
- "Restore Purchase" link at bottom
- Calls `ProService.getOfferings()` to load real prices
- Loading state while fetching offerings
- On purchase success: calls `isProProvider.notifier.refresh()` then pops

### Files to create/modify
- `lib/screens/pro_screen.dart` — new
- `lib/core/router.dart` — add `/pro` route

### Prompt
```
You are building the KYW Pro paywall screen in Flutter.

DESIGN SYSTEM:
- Background: dark=#0D0E14, light=#F4F5F8
- Surface cards: dark=#1A1C27, light=#FFFFFF
- Primary pink: #ED4187, accent purple: #9761DE
- Fonts: Space Grotesk (headings, w700), DM Sans (body)
- Border radius: 20px cards, pill buttons
- Use flutter_animate for entrance animations (fadeIn + slideY)
- Use lucide_icons package for icons

TASK: Create `lib/screens/pro_screen.dart` — a full-screen Pro upgrade paywall.

LAYOUT (top to bottom, scrollable):
1. AppBar: transparent, back button, title "KYW Pro" with a Crown icon (lucide)
2. Hero section: gradient text "Become the Partner She Deserves" (Space Grotesk, 28px, bold), subtitle "Unlock relationship intelligence"
3. Benefits list (8 items with icons):
   - LucideIcons.messageCircle — "Phase-specific conversation scripts"
   - LucideIcons.gift — "Gift & date ideas per phase"
   - LucideIcons.calendar — "3-month phase calendar"
   - LucideIcons.target — "Daily missions to strengthen your bond"
   - LucideIcons.shield — "SOS emergency de-escalation mode"
   - LucideIcons.brain — "Relationship Memory Bank"
   - LucideIcons.barChart2 — "Cycle analytics & insights"
   - LucideIcons.bellRing — "Advanced notifications (6 types)"
4. Pricing section — 3 cards in a Column:
   - Monthly: $2.99/mo
   - Annual: $19.99/yr (show "BEST VALUE" badge, highlighted with primary border)
   - Lifetime: $39.99 one-time
   - Each card: radio-style selection, price, short label
5. CTA button: "Start KYW Pro" (full width, pill, primary gradient)
6. "Restore Purchase" TextButton below CTA
7. Privacy note: "Cancel anytime · Secure payment via Google Play"

STATE:
- `_selectedPlan` (monthly/annual/lifetime) — annual selected by default
- Loading state for offerings fetch
- Call `ProService.getOfferings()` in initState, populate prices if available
- On CTA tap: call RevenueCat purchase for selected package
- On success: call `ref.read(isProProvider.notifier).refresh()` then `context.pop()`
- On error: show SnackBar with error message

Use ConsumerStatefulWidget. Follow existing app theme patterns exactly.
Never hardcode colors inline — use AppColors/DarkColors classes.
```

---

## FEATURE P1-4: Pro Gate Widget

### Spec
A reusable widget that wraps any Pro-only feature and shows the paywall if user is not Pro.

### Acceptance Criteria
- `ProGate` widget takes a `child` and optional `featureLabel`
- If `isPro` is true: renders child normally
- If `isPro` is false: renders a locked placeholder card with "Unlock with Pro" CTA
- The locked card shows: lock icon, feature name, "KYW Pro" badge, upgrade button
- Tapping upgrade button calls `context.push('/pro')`
- Loading state: shows shimmer/skeleton

### Files to create
- `lib/widgets/pro_gate.dart` — new

### Prompt
```
Create `lib/widgets/pro_gate.dart` in the KYW Flutter app.

DESIGN SYSTEM: AppColors/DarkColors from lib/theme/app_theme.dart, lucide_icons, flutter_animate.

TASK: Build a `ProGate` widget.

```dart
class ProGate extends ConsumerWidget {
  final Widget child;
  final String featureLabel;
  final bool compact; // if true, show small inline lock badge instead of full card

  const ProGate({
    super.key,
    required this.child,
    this.featureLabel = 'This Feature',
    this.compact = false,
  });
}
```

BEHAVIOR:
- Watch `isProProvider` from providers.dart
- Loading state: shimmer rectangle (Container with animated opacity, same size as child)
- isPro = true: return child as-is
- isPro = false, compact = false: return a Container styled as a locked card:
  - Same border-radius as a normal card (20px)
  - Background: surface color with primary color overlay at 5% opacity
  - Border: primary color at 30% opacity
  - Contents: LucideIcons.lock (24px, primary color), feature label text, "KYW Pro" badge chip, ElevatedButton "Unlock Pro Features" → context.push('/pro')
- isPro = false, compact = true: return a small GestureDetector badge overlay (just a "PRO" chip that navigates to /pro)

Animate the locked card with flutter_animate: fadeIn(300ms) + scale from 0.97.
Use ConsumerWidget, import providers.dart, go_router for navigation.
```

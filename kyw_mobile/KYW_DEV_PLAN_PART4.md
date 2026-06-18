# KYW Dev Plan — Part 4: Phase 4 Polish & Growth Features

---

## FEATURE P4-1: Gamification — Badges, Partner Score & Levels

### Spec
A gamification layer: score (0–100), badges, and relationship levels.

### Route: `/achievements`

### Prompt
```
Build the Gamification system for the KYW Flutter app.

TASK — 3 parts:

PART A: Logic (`lib/core/gamification_engine.dart`)

Define:
- `List<Badge> allBadges` — at least 10 badges:
  * "First Period Logged" — log first cycle
  * "5-Day Streak" — complete 5 daily missions
  * "Comfort Kit Complete" — add 5+ comfort items
  * "SOS Survived" — open SOS screen
  * "Memory Keeper" — add 3+ memories
  * "Guide Reader" — open guide 7 times
  * "Month One" — use app for 30 days
  * "Cycle Historian" — log 3 cycles
  * "Early Adopter" — signed up in first month
  * "Legend" — reach level 4

- `RelationshipLevel getLevel(int score)` — 4 levels:
  * 0–24: "Aware" (blue)
  * 25–49: "Supportive" (green)  
  * 50–74: "Thoughtful" (purple)
  * 75–100: "Legend" (gold)

- `int calculateScore(GamificationStats stats)` — weighted:
  * Missions completed: 3pts each (max 30)
  * Memories logged: 5pts each (max 20)
  * Guide opens: 2pts each (max 20)
  * Cycles logged: 10pts each (max 20)
  * Days since first cycle: 1pt/week (max 10)

PART B: Service (`lib/services/gamification_service.dart`)
- Track stats in SharedPreferences + Supabase profiles table
- `recordGuideOpen()`, `recordMissionComplete()`, `getStats()` → GamificationStats
- `getEarnedBadges(GamificationStats stats)` → List<Badge>

PART C: UI

1. `lib/widgets/partner_score_card.dart` — Dashboard widget (compact):
   - Score number (large, bold, primary colored)
   - Level name + progress bar to next level
   - "View Achievements" TextButton link
   - Compact horizontal card, surface background
   - Animate score number counting up with TweenAnimationBuilder

2. `lib/screens/achievements_screen.dart`:
   - AppBar: "Achievements" title
   - Score section: large donut arc showing score/100, level badge below
   - Level progress section: 4-step progress indicator
   - Badges grid: 2-column, each badge:
     * Earned: colored icon + title + description
     * Unearned: greyed out with lock icon, shows requirement
   - Monthly wrap-up card: "This month: X missions, Y cycles tracked 💪"
   
3. Add route `/achievements`.
4. Add Partner Score card to Dashboard below stats row, wrapped in ProGate.
5. Add Achievements entry to Settings screen.

All ProGate wrapped. Use ConsumerWidget.
```

---

## FEATURE P4-2: Education Cards & Myth Busting

### Spec
Educational content accessed from the Guide screen — phase deep dives, myth cards, hormone explainer.

### Route: `/education`

### Prompt
```
Build the Education & Hormonal Literacy section for the KYW Flutter app.

TASK:

1. Create `lib/core/education_content.dart`:

   A) PhaseDeepDive model (one per phase):
      - String title, String summary (200 words), List<String> keyFacts (5 facts), String whatHelps
      Populate for all 4 phases with real, accurate hormonal information.

   B) List<MythCard> mythCards (at least 8):
      - String myth, String fact, String explanation (2–3 sentences)
      Example: myth="She's just emotional", fact="Progesterone causes genuine physical discomfort"

   C) HormoneTimeline — data for visual:
      List of HormonePoint: phase, List<HormoneLevel> (estrogen, progesterone, LH, FSH each with a 0.0–1.0 value)

2. Create `lib/screens/education_screen.dart`:
   
   TabBar with 3 tabs:
   
   TAB 1 — "Phase Guides 📚":
   - 4 phase cards (tap to expand into full detail view):
     * Phase color header, phase badge, summary, key facts as bullet points, whatHelps section
     * Expandable via AnimatedSize or navigate to detail
   
   TAB 2 — "Myth Busters 🔍":
   - Swipeable card stack (PageView):
     * Each card: "MYTH" label + myth text (red tint bg) → flip-style reveal or toggle
     * "FACT" label + fact text (green tint) + explanation
     * "Next Myth →" button
   
   TAB 3 — "Hormones 🔬":
   - Hormone cycle chart (CustomPainter):
     * X-axis: cycle days 1–28
     * 4 colored curves (estrogen=blue, progesterone=purple, LH=orange, FSH=green)
     * Phase labels at bottom
     * Legend with colored dots
   - Below chart: 4 hormone definition cards (name, when it peaks, what it does)

3. Add route `/education`.
4. Add "Learn More" button to Guide screen bottom, navigating to `/education`.
5. Wrap screen in ProGate(featureLabel: 'Hormonal Education').

Use ConsumerWidget, flutter_animate for card animations.
```

---

## FEATURE P4-3: Partner Photo (Local Only)

### Spec
Allow the user to add a photo of his partner to the dashboard header. Stored locally, never uploaded.

### Where it lives
Dashboard header area. Settings has the option to set/remove it.

### Prompt
```
Add a partner photo feature to the KYW Flutter app. Privacy-first: stored locally only, never uploaded.

DEPENDENCIES to add to pubspec.yaml:
- image_picker: ^1.1.2
- path_provider: ^2.1.4

TASK:

1. Create `lib/services/photo_service.dart`:
   - `Future<String?> pickAndSavePhoto()` — opens image picker, copies to app documents dir as 'partner_photo.jpg', returns local path
   - `Future<String?> getPhotoPath()` — returns saved path if exists
   - `Future<void> removePhoto()` — deletes the saved file
   - Never touch Supabase or any network call

2. Riverpod provider in providers.dart:
   - `partnerPhotoProvider` — StateNotifierProvider<PartnerPhotoNotifier, String?>
   - Loads from PhotoService.getPhotoPath() on init

3. Dashboard header modification:
   In `lib/screens/dashboard_screen.dart`, update the greeting row:
   - If photo exists: show CircleAvatar (44px diameter) with the local image on the LEFT of the greeting text
   - CircleAvatar has a pink border (2px, primary color)
   - If no photo: show nothing (no empty placeholder)
   - Tap on avatar → navigates to Settings

4. Settings screen — add to Profile card:
   - "Partner's Photo" row with:
     * If no photo: "Add Photo" OutlinedButton.icon (LucideIcons.camera)
     * If photo exists: small CircleAvatar preview + "Change" and "Remove" TextButtons
   - On "Add Photo" tap: call PhotoService.pickAndSavePhoto(), invalidate provider
   - Show privacy note: "📱 Stored locally on your device only. Never uploaded."

5. Add Android permissions to AndroidManifest.xml (READ_EXTERNAL_STORAGE for API < 33, READ_MEDIA_IMAGES for API 33+). Provide the exact XML to add.

Use ConsumerStatefulWidget where needed.
```

---

## FEATURE P4-4: Monthly Wrap-Up Shareable Card

### Spec
A monthly summary card generated at month-end, optionally shareable as an image.

### Route: `/wrap-up` or shown as a bottom sheet from Achievements screen

### Prompt
```
Build the Monthly Wrap-Up card for the KYW Flutter app.

DEPENDENCIES to add:
- screenshot: ^3.0.0 (for capturing widget as image)
- share_plus: ^10.0.0 (for sharing)

TASK:

1. Create `lib/core/monthly_stats.dart`:
   - `MonthlyStats getMonthlyStats(List<Cycle> cycles, GamificationStats gamStats, DateTime month)`:
     * missionsCompleted (from SharedPreferences, count for that month)
     * cyclesTracked (from cycles list)
     * lutalPhaseSurvived (bool — did this month include a luteal phase)
     * memoriesAdded (count)
     * dayStreak (max streak achieved)

2. Create `lib/widgets/monthly_wrap_card.dart`:
   A visually stunning shareable card (NOT scrollable — fits in one screen):
   
   Design:
   - Fixed height (~520px), gradient background using current month's dominant phase color
   - KYW logo top-left, month + year top-right
   - Large centered stat: "X Missions Completed" with flame emoji
   - 3 smaller stat pills in a row: cycles / memories / streak
   - Fun message at bottom: "You survived 1 luteal phase 💪" or "You're becoming her person 💙"
   - Subtle watermark: "Made with KYW" bottom center

3. Create `lib/screens/wrap_up_screen.dart`:
   - Shows the MonthlyWrapCard widget
   - ScreenshotController wraps the card
   - "Share Card 📤" button: captures screenshot → Share.shareXFiles
   - "Save to Gallery" button: saves to device
   - AppBar: "Monthly Wrap-Up [Month]"
   - Below card: stats breakdown list (detailed version)

4. Add route `/wrap-up`.
5. Add "Monthly Wrap-Up" entry to Achievements screen as a card/button.

Wrap in ProGate. Use ConsumerWidget.
```

---

## FEATURE P4-5: Home Screen Widget (Android — Glance API)

### Spec
Android home screen widget showing current phase, days to next period, and one tip.

### Platform: Android only (V1). Uses `home_widget` package.

### Prompt
```
Implement the Android home screen widget for the KYW Flutter app.

DEPENDENCIES to add to pubspec.yaml:
- home_widget: ^0.6.0
- workmanager: ^0.5.2

TASK:

PART A: Flutter side

1. Create `lib/services/widget_service.dart`:
   - `static Future<void> updateWidget(PhaseInfo phaseInfo, String? partnerName, bool showName)`:
     * Calls HomeWidget.saveWidgetData for each field:
       - 'phase': phaseInfo.phase.name
       - 'dayInCycle': phaseInfo.dayInCycle
       - 'daysUntilPeriod': phaseInfo.daysUntilNextPeriod
       - 'cycleProgress': phaseInfo.cycleProgress
       - 'phaseEmoji': (map phase to emoji)
       - 'phaseColor': hex color string for phase
       - 'todaysTip': pick random tip for phase
       - 'partnerName': showName ? (partnerName ?? '') : ''
     * Then calls HomeWidget.updateWidget(name: 'KywWidgetProvider', androidName: 'KywWidgetProvider')

2. In `dashboard_screen.dart` initState: call `WidgetService.updateWidget(...)` after phase data loads.

3. In `lib/screens/settings_screen.dart` — add "KYW Widget" section (Pro-gated):
   - "Show partner's name on widget" toggle (OFF by default, saves to SharedPreferences)
   - Instructions card: "How to add your widget" with step-by-step:
     1. Long press your home screen
     2. Tap "Widgets"
     3. Find "KYW" and drag to your home screen
   - Small preview mockup of both widget sizes (just a styled Container, not real widget)

PART B: Android native files

Provide the exact content for these files:

1. `android/app/src/main/res/layout/kyw_widget_small.xml`:
   - 2x2 widget layout
   - RelativeLayout root
   - LinearLayout with: phase emoji TextView, phase name TextView, "Day X of Y" TextView, progress bar

2. `android/app/src/main/res/layout/kyw_widget_medium.xml`:
   - 4x2 widget layout
   - Shows: phase + name (if enabled), progress bar, days until period, tip text

3. `android/app/src/main/res/xml/kyw_widget_small_info.xml` and `kyw_widget_medium_info.xml`:
   - appwidget-provider XML with updatePeriodMillis="1800000", minWidth/minHeight for 2x2 and 4x2

4. `android/app/src/main/kotlin/.../KywWidgetProvider.kt`:
   - AppWidgetProvider subclass
   - Reads SharedPreferences written by home_widget
   - Updates RemoteViews for both widget sizes
   - Sets background color based on phase

5. AndroidManifest.xml additions:
   - receiver declaration for KywWidgetProvider
   - WorkManager initialization

Note: Wrap the Settings widget section in ProGate. The actual widget data updates happen for all users, but the setup UI is Pro-gated.
```

---

# IMPLEMENTATION ORDER SUMMARY

## Phase 1 — Revenue Foundation (Start Here)
1. P1-1: RevenueCat SDK Integration
2. P1-4: Pro Gate Widget (needed before any Pro features)
3. P1-3: Pro Upgrade / Paywall Screen
4. P1-2: AdMob Banner Ad on Dashboard

## Phase 2 — High-Value Pro Features
5. P2-1: Avoid Saying This Card (Dashboard)
6. P2-2: How to Talk to Her (Guide extension)
7. P2-3: Mood Predictor Card (Dashboard)
8. P2-4: Gift & Date Ideas Screen
9. P2-5: 3-Month Phase Calendar

## Phase 3 — Retention & Engagement
10. P3-1: Daily Missions System
11. P3-2: SOS Emergency Mode
12. P3-3: Relationship Memory Bank
13. P3-4: Advanced Notifications
14. P3-5: Cycle Analytics & Insights

## Phase 4 — Polish & Growth
15. P4-1: Gamification (Badges, Score, Levels)
16. P4-2: Education Cards & Myth Busting
17. P4-3: Partner Photo (Local)
18. P4-4: Monthly Wrap-Up Shareable Card
19. P4-5: Home Screen Widget (Android)

---

# HOW TO USE THESE PROMPTS

1. Open a new conversation with Antigravity
2. Start with: "@[/flutter-expert] — KYW Flutter app context:" followed by pasting the relevant prompt
3. Include the following context at the top of each prompt:
   ```
   APP CONTEXT:
   - Flutter 3.x, Dart 3.x
   - State: flutter_riverpod ^3.3.1
   - Router: go_router ^17.2.0
   - Backend: supabase_flutter ^2.12.2
   - Animations: flutter_animate ^4.5.2
   - Icons: lucide_icons ^0.257.0
   - Fonts: google_fonts (Space Grotesk + DM Sans)
   - Theme: lib/theme/app_theme.dart (AppColors + DarkColors classes)
   - Main screens: dashboard, guide, history, log, settings, onboarding
   - All Pro features gated via isProProvider (Riverpod AsyncNotifierProvider<bool>)
   - Android-first
   ```
4. Attach relevant files from the workspace as context when prompted

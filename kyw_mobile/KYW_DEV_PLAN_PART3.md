# KYW Dev Plan — Part 3: Phase 3 Retention & Engagement Features

---

## FEATURE P3-1: Daily Missions System

### Spec
A mission card shown daily — one concrete action for today. Includes streak tracking and completion rating.

### Where it lives
- Dashboard: prominent mission card below mood predictor
- New screen `/missions` for history/recap

### Prompt
```
Build the Daily Missions system for the KYW Flutter app.

CONTEXT: KYW is a period tracker for men. Has phase engine, Riverpod state, Supabase backend, existing design system.

TASK — 3 parts:

PART A: Content & Logic (`lib/core/mission_content.dart`)
- Model `DailyMission`: String id, String title, String description, CyclePhase phase, int dayInPhase
- Create a library of 5 missions per phase (20 total), e.g.:
  * Menstrual day 1: "Make her tea unprompted and ask nothing in return"
  * Luteal: "Notice if she seems stressed — offer a hug, not advice"
- Static method `getMissionForToday(CyclePhase phase, int dayInCycle)` — deterministic pick
- Model `MissionRecord`: String missionId, DateTime date, bool? liked (null=not rated)

PART B: Persistence (`lib/services/mission_service.dart`)
- Use SharedPreferences to store:
  * Today's mission completion: key `mission_completed_YYYY-MM-DD` (bool)
  * Rating: key `mission_rating_YYYY-MM-DD` (bool true=liked)
  * Streak count: key `mission_streak` (int)
  * Last completed date: key `mission_last_date` (String)
- Methods: `markComplete()`, `rateToday(bool liked)`, `getStreak()`, `isCompletedToday()`
- Streak logic: increment if completed yesterday, reset if gap > 1 day

PART C: UI

1. `lib/widgets/mission_card.dart` — Dashboard card:
   - Header: LucideIcons.target icon + "TODAY'S MISSION" label + streak badge ("🔥 5 day streak")
   - Mission title bold (17px) + description (14px, muted)
   - If not completed: "Mark as Done ✓" ElevatedButton (full width, primary)
   - If completed + not rated: two buttons side by side: "👍 It worked" | "👎 Not quite"
   - If completed + rated: completion badge ("Mission Complete ✓") in green
   - Card: accent purple tint background (5% opacity), purple border (20% opacity)
   - Animate: fadeIn + slideY 250ms

2. Add MissionCard to dashboard_screen.dart below MoodPredictorCard, wrapped in ProGate.

DO NOT create the /missions history screen yet — that is a separate feature.
Use ConsumerStatefulWidget for the card (needs local state for button interactions).
```

---

## FEATURE P3-2: SOS Emergency Mode

### Spec
A bottom sheet or full screen accessible via a floating button or guide entry. Shows phase-specific de-escalation scripts.

### Route: `/sos` — accessible from anywhere via the Guide screen button

### Prompt
```
Build the SOS Emergency Mode screen for the KYW Flutter app.

DESIGN: Dark-first. Even in light mode, this screen uses a deep dark background (#0D0E14) to convey urgency and focus. Primary accent: #EF4B4B (red). Use Space Grotesk + DM Sans.

TASK:

1. Create `lib/core/sos_content.dart`:
   Model `SosGuide` with:
   - String immediateAction (bold, first thing to do RIGHT NOW)
   - List<String> sayThis (3 phrases that help)
   - List<String> dontSay (3 phrases to avoid)
   - String spaceOrStay ("give space" or "stay close" — per phase)
   - String recoveryTip (for after the moment passes)
   - String calmingMantra (for HIM — e.g. "She's in luteal. This is temporary. Stay steady.")
   
   Static map SosContent.byPhase for all 4 phases + unknown fallback.

2. Create `lib/screens/sos_screen.dart`:
   LAYOUT (dark background always, scrollable):
   
   a) Top bar: red "SOS MODE" pill badge + X close button (context.pop())
   b) Calm mantra banner:
      - Full-width card, deep red border, text: calmingMantra in italic bold
      - Pulsing animation (flutter_animate: shimmer or opacity pulse)
   c) "DO THIS FIRST" card:
      - Red icon container + immediateAction text (large, 18px bold)
   d) Say This / Don't Say — side by side or stacked cards (reuse _DosDontsCard style)
   e) Space or Stay card:
      - Icon (LucideIcons.arrowRight or LucideIcons.home), bold verdict, explanation
   f) Recovery tip (shown after a divider "When things calm down..."):
      - Muted, italic, 14px

3. Phase selector at top (if user wants to check a different scenario):
   - 4 small phase chips, tappable, updates content below
   - Default to current phase from CycleEngine

4. Add route `/sos` to router.
5. Add SOS entry to Guide screen:
   - Large red OutlinedButton.icon at the very top: "🆘 SOS Mode — She's Upset"
   - Wrapped in ProGate(featureLabel: 'SOS Emergency Mode')
   - Navigates to `/sos`

Animate: all sections enter with staggered fadeIn + slideY (100ms apart).
Use ConsumerWidget. Get phase from cyclesProvider + userProfileProvider.
```

---

## FEATURE P3-3: Relationship Memory Bank

### Spec
A personal journal where he saves what worked, her comfort items, and notes per cycle.

### Route: `/memory`

### Prompt
```
Build the Relationship Memory Bank screen for the KYW Flutter app.

CONTEXT: Supabase backend, Riverpod state, existing design system.

DATABASE: Add two new Supabase tables (provide SQL):
1. `memory_entries` — columns: id (uuid), user_id (uuid FK), title (text), body (text), phase (text), created_at (timestamptz), tags (text[])
2. `comfort_items` — columns: id (uuid), user_id (uuid FK), item_name (text), category (text), emoji (text)

TASK:

1. Create `lib/services/memory_service.dart`:
   - `getMemories()` → List<MemoryEntry> ordered by created_at desc
   - `addMemory(MemoryEntry entry)` → insert to Supabase
   - `deleteMemory(String id)` → delete from Supabase
   - `getComfortItems()` → List<ComfortItem>
   - `addComfortItem(ComfortItem item)` → insert
   - `deleteComfortItem(String id)` → delete

2. Add Riverpod providers in providers.dart:
   - `memoriesProvider` — AsyncNotifierProvider<MemoriesNotifier, List<MemoryEntry>>
   - `comfortItemsProvider` — similar

3. Create `lib/screens/memory_screen.dart`:
   - AppBar: "Memory Bank" title, LucideIcons.brain icon in actions
   - TabBar with 2 tabs:
     
     TAB 1 — "What Worked 📝":
     - FloatingActionButton: "+" → shows bottom sheet to add memory
       * Fields: Title (text), Note (multiline), Phase selector (4 chips), Tags (comma-separated)
     - List of memory cards:
       * Phase-colored left border accent
       * Title bold, body text truncated to 2 lines, date + phase badge
       * Swipe to delete (Dismissible widget)
     - Empty state: illustration placeholder + "Start recording what works for your relationship"
     
     TAB 2 — "Comfort Kit 💝":
     - Grid of comfort item cards (2-column)
       * Emoji (large, centered), item name below, category chip
       * Long press to delete
     - FAB "+" → bottom sheet: emoji picker (text field), item name, category dropdown (Snack/Activity/Show/Song/Other)
     - Empty state: "Save her go-to comfort items. They'll appear automatically during her period."
   
   - Animate lists with staggered flutter_animate

4. Add route `/memory` to router.
5. Add Memory Bank entry to Settings screen under a new "Pro Features" section.

Wrap all screen content (after AppBar) in ProGate(featureLabel: 'Relationship Memory Bank').
```

---

## FEATURE P3-4: Advanced Notifications (6 Types)

### Spec
Extend the existing notification system with 5 new Pro notification types and custom reminder time picker.

### Where it lives
Settings screen — replaces/extends the existing single notifications toggle.

### Prompt
```
Extend the notification system in the KYW Flutter app with 6 notification types and custom timing.

CONTEXT: `lib/services/notification_service.dart` already exists with basic daily reminders using flutter_local_notifications. The settings screen has a single toggle for "Daily Reminders".

TASK:

1. Extend `lib/services/notification_service.dart`:
   Add scheduling for these notification types:
   - `schedulePeriodDueAlert(List<Cycle> cycles, int defaultLength)` — 3 days before predicted period
   - `schedulePhaseChangeAlerts(List<Cycle> cycles)` — day of phase change
   - `scheduleWeeklyBriefing()` — every Sunday at 9am
   - `scheduleSosReminder(List<Cycle> cycles)` — day 2 of period, reminder to check in
   
   All use flutter_local_notifications with distinct notification channel IDs.
   Store each type's on/off state in SharedPreferences separately.

2. Create `lib/widgets/notification_settings_card.dart`:
   A card showing all 6 notification toggles:
   
   | Toggle | Description |
   |--------|-------------|
   | Daily Tips | "Daily phase tip at your chosen time" |
   | Period Due Alert | "3-day heads-up before her period" |
   | Phase Change | "When she enters a new phase" |
   | Weekly Briefing | "Sunday summary of the week ahead" |
   | SOS Reminder | "Check-in reminder on period day 2" |
   
   - Each toggle row: icon, label, description (12px muted), Switch
   - Under the Daily Tips toggle: time picker row (shows "8:00 AM" → taps opens TimePickerDialog)
   - Save selected time to SharedPreferences, use when scheduling
   - Non-Pro users see the toggles greyed out with a "Pro" chip — tapping any shows paywall

3. Replace the existing notifications card in `lib/screens/settings_screen.dart`:
   - Remove the old single-toggle card
   - Add `NotificationSettingsCard()` in its place
   - Wrap Pro-only toggles (all except Daily Tips) in isPro check

4. On any toggle change, reschedule the relevant notification type.

Use ConsumerStatefulWidget for the card. Reference existing NotificationService patterns.
```

---

## FEATURE P3-5: Cycle Analytics & Insights

### Spec
A dedicated analytics screen with cycle regularity, pattern highlights, and unlimited history.

### Route: `/analytics` — linked from Dashboard "View All" and History screen

### Prompt
```
Build the Cycle Analytics screen for the KYW Flutter app.

CONTEXT: `lib/core/cycle_engine.dart` has basic cycle calculations. `lib/screens/history_screen.dart` shows cycle history. Riverpod providers expose cycles list.

TASK:

1. Extend `lib/core/cycle_engine.dart` with analytics methods:
   - `static CycleAnalytics getAnalytics(List<Cycle> cycles)` returning:
     * double avgCycleLength
     * double avgPeriodLength  
     * double cycleLengthVariance (standard deviation)
     * String regularityScore ("Very Regular" | "Regular" | "Slightly Irregular" | "Irregular")
     * int regularityPercent (0–100)
     * CyclePhase longestPhase (estimated from history)
     * Cycle? longestCycle, shortestCycle
     * List<int> cycleLengths (for the chart)

2. Create `lib/screens/analytics_screen.dart`:
   
   TOP SECTION — Summary cards (2-column grid):
   - Regularity Score card: large percent number, color-coded progress ring (reuse PhaseRing or build simple arc), label
   - Avg Cycle card: number + "days" 
   - Avg Period card: number + "days"
   - Total Cycles logged card: count + "cycles tracked"
   
   CHART SECTION — Cycle Length Trend:
   - Title "Cycle Length Over Time"
   - Custom bar chart using CustomPainter (NO chart packages):
     * Bars represent each cycle's length
     * Average line overlaid in primary color (dashed)
     * Y-axis labels (days), X-axis (cycle number)
     * Phase-colored bars
     * Animate bars growing up with TweenAnimationBuilder
   
   INSIGHTS SECTION — Pattern Highlights:
   - List of insight chips/cards, e.g.:
     * "Her luteal phase is typically the longest"
     * "Cycles have been consistent within ±2 days"
     * "You've tracked X cycles together"
   
   HISTORY SECTION — Unlimited cycle list:
   - Full scrollable list of ALL cycles (Pro = unlimited, free = show first 3 + blur/lock rest)
   - Same cycle row style as dashboard
   - Each row: start date, end date, duration, a phase color dot

3. Add route `/analytics`.
4. Update Dashboard "View All" TextButton to go to `/analytics` instead of `/history`.
5. Wrap analytics-specific content in ProGate where appropriate (chart and full history).

Use ConsumerWidget. Animate all sections with flutter_animate staggered delays.
```

---

# KYW Dev Plan — Part 2: Phase 2 High-Value Pro Features

---

## FEATURE P2-1: "Avoid Saying This" Daily Warning Card

### Spec
A daily card on the Dashboard showing one phrase to NEVER say to her today, based on her current phase.

### Where it lives
Dashboard screen — below the main phase card, above stats row.
Wrapped in `ProGate(featureLabel: 'Daily Warning Card')`.

### Prompt
```
Add an "Avoid Saying This" warning card to the KYW dashboard screen.

CONTEXT: KYW is a period tracker for men. The app has a phase engine (CycleEngine) that returns the current phase (menstrual/follicular/ovulation/luteal/unknown). Design system: AppColors/DarkColors, Space Grotesk + DM Sans fonts, flutter_animate, lucide_icons.

TASK:

1. Create `lib/core/avoid_content.dart`:
   A Map<CyclePhase, List<String>> with 5 phrases per phase to avoid.
   Example entries:
   - Menstrual: ["You're overreacting", "It's not that bad", "Are you on your period?", "Just cheer up", "You're being dramatic"]
   - Follicular: ["Don't get too excited", "That's unrealistic", "You always do this", ...]
   - Ovulation: ["Not now, I'm busy", "Why are you so clingy", ...]
   - Luteal: ["Calm down", "You're too sensitive", "I don't get why you're upset", ...]
   - Unknown: generic fallback list
   Add a static method `getToday(CyclePhase phase)` that returns a deterministic phrase for today (use DateTime.now().day % list.length as index).

2. Create `lib/widgets/avoid_card.dart`:
   A widget that receives the current phase and displays:
   - Header row: warning icon (LucideIcons.alertTriangle, amber/yellow), label "AVOID SAYING THIS TODAY" (10px, bold, letter-spaced)
   - The phrase in quotes, bold, 15px, red-tinted color
   - Subtle subtext: "Saying this during [phase] phase can escalate tension"
   - Card background: red tint at 8% opacity, border red at 20% opacity
   - Border radius: 16px
   - Animate: flutter_animate fadeIn + slideY(begin: 0.1)

3. In `lib/screens/dashboard_screen.dart`:
   - Import and add `AvoidCard` widget after the main phase card
   - Wrap it in `ProGate(featureLabel: 'Daily Warning Card', compact: false)`
   - Only show if phaseInfo != null
   - Add SizedBox(height: 16) before it

Keep all existing dashboard code intact. Only add the new card section.
```

---

## FEATURE P2-2: "How to Talk to Her" Tips

### Spec
Extends the existing Guide screen with a new section: phase-specific conversation starters.

### Where it lives
Guide screen — new expandable section after the "How To Say It" block.
Wrapped in `ProGate`.

### Prompt
```
Add a "How to Talk to Her" section to the KYW Guide screen.

CONTEXT: `lib/screens/guide_screen.dart` shows phase-aware content. It uses `GuideContentLibrary` from `lib/core/guide_content.dart`. The screen already has a "How To Say It" communication script section.

TASK:

1. Extend `lib/core/guide_content.dart` — add to the `GuideContent` model:
   - `List<String> conversationStarters` — 4 phrases per phase to open conversations
   - `String loveLanguageTip` — one sentence about what love language she responds to this phase
   Populate for all phases (menstrual, follicular, ovulation, luteal, unknown).

2. Create `lib/widgets/conversation_starters_card.dart`:
   A widget showing:
   - Header: LucideIcons.messageCircle icon + "HOW TO TALK TO HER" label
   - List of 4 conversation starters, each in a tap-to-copy chip/card style:
     - Rounded rectangle, surface2 background, border
     - LucideIcons.copy icon on right
     - On tap: copy to clipboard, show brief "Copied!" SnackBar
   - Love language tip below: italic, muted color, heart icon prefix
   - Animate list items with staggered flutter_animate delays (50ms each)

3. In `lib/screens/guide_screen.dart`:
   - Add the `ConversationStartersCard` below the existing communication script section
   - Wrap in `ProGate(featureLabel: 'Conversation Starters')`
   - Add SizedBox(height: 20) separator

DO NOT modify existing guide content. Only extend and append.
Use Clipboard.setData for copy functionality.
```

---

## FEATURE P2-3: Mood Predictor Card on Dashboard

### Spec
A card on the Dashboard predicting how she might be feeling today, with an energy level indicator.

### Where it lives
Dashboard — between the Avoid card and stats row.

### Prompt
```
Add a Mood Predictor card to the KYW dashboard.

CONTEXT: KYW Flutter app. Phase engine provides current phase via CycleEngine.getCurrentPhaseInfo(). Design system: AppColors/DarkColors, lucide_icons, flutter_animate.

TASK:

1. Create `lib/core/mood_content.dart`:
   Model `MoodPrediction` with fields:
   - String headline (e.g. "Energetic & Confident")
   - String body (e.g. "She's likely feeling motivated today. Great time for meaningful conversations.")
   - String energyLevel ("High" | "Medium" | "Low")
   - double energyValue (0.0 to 1.0)
   - String emoji
   - List<String> moodTags (e.g. ["Focused", "Social", "Creative"])

   Static map MoodContent.byPhase with entries for all 5 phases.

2. Create `lib/widgets/mood_predictor_card.dart`:
   Layout:
   - Header: LucideIcons.sparkles icon + "MOOD FORECAST" label (10px, bold, letter-spaced, primary color)
   - Emoji (32px) + headline text (bold, 16px) in a Row
   - Body text (14px, muted, height 1.5)
   - Energy bar:
     * Label row: "Energy Today" left, level text right (colored: green=High, amber=Medium, red=Low)
     * Animated LinearProgressIndicator (use TweenAnimationBuilder to animate from 0 to energyValue on build)
     * Color matches energy level
   - Mood tag chips row: small rounded chips with surface2 background
   - Card: surface background, border, radius 20px
   - Animate: fadeIn + slideY with 200ms delay

3. In dashboard_screen.dart:
   - Add MoodPredictorCard after the AvoidCard widget
   - Wrap in ProGate(featureLabel: 'Mood Predictor')
   - Only show if phaseInfo != null
```

---

## FEATURE P2-4: Gift & Date Ideas Screen

### Spec
A dedicated screen showing curated gift and date ideas for her current phase.

### Route: `/gift-ideas` (push from Guide screen or bottom nav eventually)

### Prompt
```
Create `lib/screens/gift_ideas_screen.dart` in the KYW Flutter app.

DESIGN: Match existing app style — AppColors/DarkColors, Space Grotesk + DM Sans, lucide_icons, flutter_animate, border-radius 20px cards, no elevation.

TASK:

1. Create `lib/core/gift_content.dart`:
   Model `PhaseGiftContent` with:
   - List<DateIdea> dateIdeas (4–5 per phase)
   - List<GiftIdea> giftIdeas (4–5 per phase)
   - List<String> foodSuggestions (3 per phase)
   
   Models:
   - DateIdea: String title, String description, IconData icon, String vibe
   - GiftIdea: String title, String description, String priceRange, IconData icon
   
   Populate for all 4 phases with themed content:
   - Menstrual: cozy, comfort, low-effort
   - Follicular: active, social, new experiences  
   - Ovulation: adventurous, romantic, social
   - Luteal: quiet, nourishing, thoughtful

2. Create the screen with:
   - AppBar: transparent, "Gift & Date Ideas" title, phase badge in the title row
   - Phase color header card (like guide screen style)
   - TabBar with 3 tabs: "Dates 💑", "Gifts 🎁", "Food 🍽️"
   - Tab 1 — Date Ideas: vertical list of cards
     * Each card: icon container (phase-colored), title bold, description muted, vibe tag chip
   - Tab 2 — Gift Ideas: same card style + price range badge (e.g. "Under $20")
   - Tab 3 — Food: simpler list with food emoji + suggestion text
   - All lists animate with staggered flutter_animate (50ms per item)

3. Add route `/gift-ideas` to the router.
4. Add a "Gift & Date Ideas" button to the Guide screen (OutlinedButton.icon below the Pro-gated sections).
5. Wrap entire screen content in ProGate on the Guide screen entry point.

Use ConsumerWidget. Get current phase from cyclesProvider + userProfileProvider via CycleEngine.
```

---

## FEATURE P2-5: 3-Month Phase Calendar

### Spec
A full calendar view showing color-coded phase predictions for 3 months ahead.

### Route: `/calendar`

### Prompt
```
Create `lib/screens/calendar_screen.dart` in the KYW Flutter app — a 3-month phase calendar.

TECH: Flutter 3.x, Riverpod, existing CycleEngine, AppColors/DarkColors, flutter_animate. DO NOT add any new calendar package — build it with a CustomScrollView + GridView.

DESIGN: Match existing app style exactly.

TASK:

1. Extend `lib/core/cycle_engine.dart` — add method:
   `static Map<DateTime, CyclePhase> predictNext90Days(List<Cycle> cycles, int defaultLength)`
   - Uses average cycle length from history
   - Returns a map of date → predicted phase for next 90 days
   - Handle edge case: no cycle history (return empty map with unknown phase)

2. Create the screen:
   - AppBar: "3-Month Calendar" title, Pro badge chip in actions
   - Phase legend row at top: 4 colored dot chips (Menstrual/Follicular/Ovulation/Luteal)
   - 3 monthly grids (current month + 2 ahead), each:
     * Month title (Space Grotesk bold, 18px)
     * Day-of-week header row (M T W T F S S)
     * GridView.count(crossAxisCount: 7) of day cells
   - Day cell design:
     * If predicted phase: filled circle with phase color at 70% opacity, white day number
     * If today: ring border in primary color (no fill unless also a phase day)
     * If no data: just the day number in muted text
     * Day number: 13px, centered
     * Size: 40×40, no gap between cells
   - "Best Week to Plan" highlight: find the ovulatory week in next 90 days, show a banner "✨ Best week: [date range]" below the legend
   - Animate: each month section fadeIn with 100ms staggered delay

3. Add route `/calendar` to router.
4. Add calendar entry point to Dashboard (a TextButton "View 3-Month Calendar" below the stats row, Pro-gated).

Use ConsumerWidget. Wrap screen body in ProGate.
```

---

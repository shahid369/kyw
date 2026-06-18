# Graph Report - kyw_mobile  (2026-06-18)

## Corpus Check
- 70 files · ~80,922 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 729 nodes · 925 edges · 52 communities (42 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `36aa0b6e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]

## God Nodes (most connected - your core abstractions)
1. `supabaseClientProvider` - 18 edges
2. `⭐ KYW Pro — All Features (60+)` - 14 edges
3. `currentUserProvider` - 13 edges
4. `userProfileProvider` - 12 edges
5. `KYW — Full Monetization & Pro Features Plan` - 12 edges
6. `cyclesProvider` - 11 edges
7. `KYW — Monetization Strategy` - 11 edges
8. `Create()` - 10 edges
9. `MessageHandler()` - 10 edges
10. `WndProc()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `wWinMain()` --calls--> `CreateAndAttachConsole()`  [INFERRED]
  windows/runner/main.cpp → windows/runner/utils.cpp
- `_deleteCycle` --references--> `supabaseClientProvider`  [EXTRACTED]
  lib/screens/history_screen.dart → lib/core/providers.dart
- `_HistoryScreenState` --references--> `supabaseClientProvider`  [EXTRACTED]
  lib/screens/history_screen.dart → lib/core/providers.dart
- `_signIn` --references--> `supabaseClientProvider`  [EXTRACTED]
  lib/screens/login_screen.dart → lib/core/providers.dart
- `_deleteAccount` --references--> `supabaseClientProvider`  [EXTRACTED]
  lib/screens/settings_screen.dart → lib/core/providers.dart

## Import Cycles
- None detected.

## Communities (52 total, 10 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (39): avgCycleLength, avgPeriodLength, colorValue, Cycle, CycleEngine, cycleProgress, dayInCycle, daysUntilNextPeriod (+31 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (34): RegisterPlugins(), PluginRegistry, Point, RECT, OnCreate(), Create(), Destroy(), EnableFullDpiSupportIfAvailable() (+26 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (41): _StatCard, _DosDontsCard, MainShell, _AlertBanner, animDelay, child, controller, createState (+33 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (30): ChangeNotifier, ConsumerWidget, SignupLoading, _AuthNotifier, core/router.dart, dispose, notifier, routerProvider (+22 more)

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (39): Animation, AnimationController, CustomPainter, DateTime?, SingleTickerProviderStateMixin, State, StatefulWidget, build (+31 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (26): static const Color, accent, AppColors, AppTheme, bg, bgSecondary, border, borderStrong (+18 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (22): FlPluginRegistry, fl_register_plugins(), FlView, GApplication, gboolean, gchar, GObject, GtkApplication (+14 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (21): FlutterLocalNotificationsPlugin, IOSFlutterLocalNotificationsPlugin, package:flutter_local_notifications/flutter_local_notifications.dart, package:flutter_timezone/flutter_timezone.dart, package:permission_handler/permission_handler.dart, package:timezone/data/latest_all.dart, package:timezone/timezone.dart, GeneratedPluginRegistrant (+13 more)

### Community 8 - "Community 8"
Cohesion: 0.12
Nodes (15): GlobalKey, package:tutorial_coach_mark/tutorial_coach_mark.dart, _actionKey, _confirmAction, createState, _guideKey, _hasCheckedOnboarding, icon (+7 more)

### Community 9 - "Community 9"
Cohesion: 0.13
Nodes (12): Any, FlutterAppDelegate, Bool, Flutter, AppDelegate, UIKit, Bool, Cocoa (+4 more)

### Community 10 - "Community 10"
Cohesion: 0.12
Nodes (14): app_links, RegisterGeneratedPlugins(), flutter_local_notifications, flutter_timezone, FlutterPluginRegistry, Foundation, FlutterMacOS, Cocoa (+6 more)

### Community 11 - "Community 11"
Cohesion: 0.05
Nodes (56): ConsumerState, ConsumerStatefulWidget, authState, authStateProvider, build, client, currentUserProvider, cyclesProvider (+48 more)

### Community 12 - "Community 12"
Cohesion: 0.18
Nodes (10): FormState, package:go_router/go_router.dart, Route /signup, build, createState, dispose, _emailController, _formKey (+2 more)

### Community 13 - "Community 13"
Cohesion: 0.04
Nodes (44): 📱 Ad Placement Strategy, Android (Glance API / App Widget), 📌 App Overview, 📚 CATEGORY 10 — Education & Hormonal Literacy, 🆘 CATEGORY 11 — SOS & Emergency Mode, 🏆 CATEGORY 12 — Gamification & Engagement, 🤰 CATEGORY 13 — Conception Mode *(Future Pro+ Feature)*, 🗣️ CATEGORY 1 — Communication & Emotional Intelligence (+36 more)

### Community 14 - "Community 14"
Cohesion: 0.07
Nodes (27): FEATURE P4-1: Gamification — Badges, Partner Score & Levels, FEATURE P4-2: Education Cards & Myth Busting, FEATURE P4-3: Partner Photo (Local Only), FEATURE P4-4: Monthly Wrap-Up Shareable Card, FEATURE P4-5: Home Screen Widget (Android — Glance API), HOW TO USE THESE PROMPTS, IMPLEMENTATION ORDER SUMMARY, KYW Dev Plan — Part 4: Phase 4 Polish & Growth Features (+19 more)

### Community 15 - "Community 15"
Cohesion: 0.17
Nodes (11): package:flutter/services.dart, build, createState, dispose, _endDate, _error, _isLoading, _periodLengthController (+3 more)

### Community 16 - "Community 16"
Cohesion: 0.08
Nodes (23): Acceptance Criteria, Acceptance Criteria, Acceptance Criteria, Acceptance Criteria, Design Rules (apply to ALL features), FEATURE P1-1: RevenueCat SDK Integration, FEATURE P1-2: AdMob Banner Ad on Dashboard, FEATURE P1-3: Pro Upgrade / Paywall Screen (+15 more)

### Community 17 - "Community 17"
Cohesion: 0.09
Nodes (21): FEATURE P2-1: "Avoid Saying This" Daily Warning Card, FEATURE P2-2: "How to Talk to Her" Tips, FEATURE P2-3: Mood Predictor Card on Dashboard, FEATURE P2-4: Gift & Date Ideas Screen, FEATURE P2-5: 3-Month Phase Calendar, KYW Dev Plan — Part 2: Phase 2 High-Value Pro Features, Prompt, Prompt (+13 more)

### Community 18 - "Community 18"
Cohesion: 0.15
Nodes (9): Flutter, RunnerTests, UIKit, XCTest, Cocoa, FlutterMacOS, RunnerTests, XCTest (+1 more)

### Community 19 - "Community 19"
Cohesion: 0.15
Nodes (12): _avgPeriodLength, build, _buildCycleLengthPage, _buildDatePage, _buildWelcomePage, createState, _currentPage, _endDate (+4 more)

### Community 20 - "Community 20"
Cohesion: 0.23
Nodes (9): _In_, _In_opt_, wWinMain(), CreateAndAttachConsole(), GetCommandLineArguments(), Utf8FromUtf16(), vector, string (+1 more)

### Community 21 - "Community 21"
Cohesion: 0.09
Nodes (21): FEATURE P3-1: Daily Missions System, FEATURE P3-2: SOS Emergency Mode, FEATURE P3-3: Relationship Memory Bank, FEATURE P3-4: Advanced Notifications (6 Types), FEATURE P3-5: Cycle Analytics & Insights, KYW Dev Plan — Part 3: Phase 3 Retention & Engagement Features, Prompt, Prompt (+13 more)

### Community 22 - "Community 22"
Cohesion: 0.18
Nodes (10): background_color, description, display, icons, name, orientation, prefer_related_applications, short_name (+2 more)

### Community 23 - "Community 23"
Cohesion: 0.22
Nodes (8): DartProject, MessageHandler(), HWND, LPARAM, LRESULT, FlutterWindow(), UINT, WPARAM

### Community 24 - "Community 24"
Cohesion: 0.20
Nodes (9): IconData, build, icon, label, navigationShell, _NavTab, _tabs, StatefulNavigationShell (+1 more)

### Community 25 - "Community 25"
Cohesion: 0.22
Nodes (8): AsyncNotifier, build, _kThemeKey, setMode, ThemeModeNotifier, package:flutter/material.dart, package:shared_preferences/shared_preferences.dart, ThemeMode

### Community 26 - "Community 26"
Cohesion: 0.11
Nodes (18): 1. 📅 Phase Prediction Calendar, 2. 💬 "How to Talk to Her" Tips *(highest value for men)*, 3. 🎁 Gift & Date Ideas, 4. 🌡️ Mood Predictor Card, 5. 🔔 Smart Notifications (Pro), 6. 📤 Data Export (PDF), 7. 🏠 Home Screen Widget, Ads Strategy (Free Tier) (+10 more)

### Community 27 - "Community 27"
Cohesion: 0.25
Nodes (7): package:google_fonts/google_fonts.dart, color, ../theme/app_theme.dart, build, fontSize, kColor, wColor

### Community 28 - "Community 28"
Cohesion: 0.12
Nodes (17): signupLoadingProvider, Route /login, build, _buildField, createState, dispose, _emailController, _formKey (+9 more)

### Community 29 - "Community 29"
Cohesion: 0.33
Nodes (5): handle_new_rx_page(), __lldb_init_module(), Intercept NOTIFY_DEBUGGER_ABOUT_RX_PAGES and touch the pages., SBDebugger, SBFrame

### Community 31 - "Community 31"
Cohesion: 0.29
Nodes (6): CyclePhase, ../core/cycle_engine.dart, package:flutter_animate/flutter_animate.dart, animate, build, phase

### Community 37 - "Community 37"
Cohesion: 0.18
Nodes (12): ../core/guide_content.dart, ../core/providers.dart, List, package:flutter_riverpod/flutter_riverpod.dart, package:intl/intl.dart, package:lucide_icons/lucide_icons.dart, isDoSection, items (+4 more)

## Knowledge Gaps
- **405 isolated node(s):** `SBFrame`, `SBDebugger`, `flutter_export_environment.sh script`, `Flutter`, `UIKit` (+400 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CyclePhase` connect `Community 31` to `Community 0`, `Community 4`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `color` connect `Community 27` to `Community 8`, `Community 2`, `Community 4`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Why does `supabaseClientProvider` connect `Community 11` to `Community 28`, `Community 37`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `SBFrame`, `SBDebugger`, `Intercept NOTIFY_DEBUGGER_ABOUT_RX_PAGES and touch the pages.` to the rest of the system?**
  _406 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.08658536585365853 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05226480836236934 - nodes in this community are weakly interconnected._
# Graph Report - .  (2026-06-18)

## Corpus Check
- 129 files · ~81,074 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 558 nodes · 757 edges · 48 communities (42 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

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

## God Nodes (most connected - your core abstractions)
1. `supabaseClientProvider` - 18 edges
2. `userProfileProvider` - 12 edges
3. `currentUserProvider` - 11 edges
4. `cyclesProvider` - 11 edges
5. `Create()` - 10 edges
6. `MessageHandler()` - 10 edges
7. `WndProc()` - 9 edges
8. `_SettingsScreenState` - 8 edges
9. `_DashboardScreenState` - 7 edges
10. `_MyApplication` - 7 edges

## Surprising Connections (you probably didn't know these)
- `wWinMain()` --calls--> `CreateAndAttachConsole()`  [INFERRED]
  windows/runner/main.cpp → windows/runner/utils.cpp
- `_DashboardScreenState` --references--> `supabaseClientProvider`  [EXTRACTED]
  lib/screens/dashboard_screen.dart → lib/core/providers.dart
- `_deleteCycle` --references--> `supabaseClientProvider`  [EXTRACTED]
  lib/screens/history_screen.dart → lib/core/providers.dart
- `_HistoryScreenState` --references--> `supabaseClientProvider`  [EXTRACTED]
  lib/screens/history_screen.dart → lib/core/providers.dart
- `_LogScreenState` --references--> `supabaseClientProvider`  [EXTRACTED]
  lib/screens/log_screen.dart → lib/core/providers.dart

## Import Cycles
- None detected.

## Communities (48 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (39): avgCycleLength, avgPeriodLength, colorValue, Cycle, CycleEngine, cycleProgress, dayInCycle, daysUntilNextPeriod (+31 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (34): RegisterPlugins(), PluginRegistry, Point, RECT, OnCreate(), Create(), Destroy(), EnableFullDpiSupportIfAvailable() (+26 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (40): _StatCard, MainShell, _AlertBanner, animDelay, child, controller, createState, _dailyReminders (+32 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (28): ChangeNotifier, ConsumerWidget, _AuthNotifier, core/router.dart, dispose, notifier, routerProvider, _sub (+20 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (26): Animation, AnimationController, CustomPainter, SingleTickerProviderStateMixin, State, StatefulWidget, CalendarPicker, _CalendarPickerState (+18 more)

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
Cohesion: 0.11
Nodes (18): GlobalKey, package:tutorial_coach_mark/tutorial_coach_mark.dart, Route /onboarding, _actionKey, _checkOnboarding, _confirmAction, createState, DashboardScreen (+10 more)

### Community 9 - "Community 9"
Cohesion: 0.13
Nodes (12): Any, FlutterAppDelegate, Bool, Flutter, AppDelegate, UIKit, Bool, Cocoa (+4 more)

### Community 10 - "Community 10"
Cohesion: 0.12
Nodes (14): app_links, RegisterGeneratedPlugins(), flutter_local_notifications, flutter_timezone, FlutterPluginRegistry, Foundation, FlutterMacOS, Cocoa (+6 more)

### Community 11 - "Community 11"
Cohesion: 0.12
Nodes (15): authState, authStateProvider, client, defaultCycleLength, fromMap, id, name, null (+7 more)

### Community 12 - "Community 12"
Cohesion: 0.16
Nodes (12): ../core/cycle_engine.dart, ../core/guide_content.dart, ../core/providers.dart, List, package:flutter_animate/flutter_animate.dart, package:intl/intl.dart, package:lucide_icons/lucide_icons.dart, _DosDontsCard (+4 more)

### Community 13 - "Community 13"
Cohesion: 0.19
Nodes (14): currentUserProvider, supabaseClientProvider, Route /, _endPeriod, _startPeriod, _deleteCycle, _logCycle, _signIn (+6 more)

### Community 14 - "Community 14"
Cohesion: 0.14
Nodes (13): DateTime?, build, createState, _currentMonth, _dragOrigin, endDate, _handlePointer, initState (+5 more)

### Community 15 - "Community 15"
Cohesion: 0.15
Nodes (13): package:flutter/services.dart, build, createState, dispose, _endDate, _error, _isLoading, LogScreen (+5 more)

### Community 16 - "Community 16"
Cohesion: 0.14
Nodes (13): Route /login, build, _buildField, createState, dispose, _emailController, _formKey, _isLoading (+5 more)

### Community 17 - "Community 17"
Cohesion: 0.17
Nodes (12): FormState, package:go_router/go_router.dart, Route /signup, build, createState, dispose, _emailController, _formKey (+4 more)

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
Cohesion: 0.27
Nodes (11): cyclesProvider, userProfileProvider, themeModeProvider, _DashboardScreenState, _promptNotifications, build, build, build (+3 more)

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
Nodes (8): AsyncNotifier, build, _kThemeKey, setMode, ThemeModeNotifier, package:flutter_riverpod/flutter_riverpod.dart, package:shared_preferences/shared_preferences.dart, ThemeMode

### Community 26 - "Community 26"
Cohesion: 0.28
Nodes (9): ConsumerState, ConsumerStatefulWidget, HistoryScreen, _HistoryScreenState, OnboardingScreen, _OnboardingScreenState, SettingsScreen, SignupScreen (+1 more)

### Community 27 - "Community 27"
Cohesion: 0.25
Nodes (7): package:google_fonts/google_fonts.dart, color, ../theme/app_theme.dart, build, fontSize, kColor, wColor

### Community 28 - "Community 28"
Cohesion: 0.33
Nodes (5): CyclePhase, package:flutter/material.dart, animate, build, phase

### Community 29 - "Community 29"
Cohesion: 0.33
Nodes (5): handle_new_rx_page(), __lldb_init_module(), Intercept NOTIFY_DEBUGGER_ABOUT_RX_PAGES and touch the pages., SBDebugger, SBFrame

### Community 31 - "Community 31"
Cohesion: 0.50
Nodes (4): Route /guide, Route /history, Route /log, build

## Knowledge Gaps
- **281 isolated node(s):** `SBFrame`, `SBDebugger`, `flutter_export_environment.sh script`, `Flutter`, `UIKit` (+276 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CyclePhase` connect `Community 28` to `Community 0`, `Community 4`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `color` connect `Community 27` to `Community 8`, `Community 2`, `Community 4`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `supabaseClientProvider` connect `Community 13` to `Community 11`, `Community 15`, `Community 17`, `Community 21`, `Community 26`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `SBFrame`, `SBDebugger`, `Intercept NOTIFY_DEBUGGER_ABOUT_RX_PAGES and touch the pages.` to the rest of the system?**
  _282 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.08658536585365853 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05365853658536585 - nodes in this community are weakly interconnected._
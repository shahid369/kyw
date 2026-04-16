import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../screens/dashboard_screen.dart';
import '../screens/login_screen.dart';
import '../screens/signup_screen.dart';
import '../screens/history_screen.dart';
import '../screens/log_screen.dart';
import '../screens/guide_screen.dart';
import '../screens/settings_screen.dart';
import '../screens/main_shell.dart';

/// Notifies GoRouter to re-evaluate redirects whenever auth state changes.
class _AuthNotifier extends ChangeNotifier {
  _AuthNotifier() {
    _sub = Supabase.instance.client.auth.onAuthStateChange.listen((_) {
      notifyListeners();
    });
  }
  late final dynamic _sub;

  @override
  void dispose() {
    _sub.cancel();
    super.dispose();
  }
}

final routerProvider = Provider<GoRouter>((ref) {
  final notifier = _AuthNotifier();
  ref.onDispose(notifier.dispose);

  return GoRouter(
    initialLocation: '/',
    refreshListenable: notifier,
    redirect: (context, state) {
      final session = Supabase.instance.client.auth.currentSession;
      final isAuth = session != null;
      final path = state.uri.path;
      final isPublic = path == '/login' || path == '/signup';

      if (!isAuth && !isPublic) return '/login';
      if (isAuth && isPublic) return '/';
      return null;
    },
    routes: [
      // ── Auth routes (outside shell — no bottom nav) ─────────────
      GoRoute(path: '/login',  builder: (_, __) => const LoginScreen()),
      GoRoute(path: '/signup', builder: (_, __) => const SignupScreen()),

      // ── Main shell (5 tabs) ─────────────────────────────────────
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) =>
            MainShell(navigationShell: navigationShell),
        branches: [
          StatefulShellBranch(routes: [
            GoRoute(path: '/',        builder: (_, __) => const DashboardScreen()),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(path: '/guide',   builder: (_, __) => const GuideScreen()),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(path: '/log',     builder: (_, __) => const LogScreen()),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(path: '/history', builder: (_, __) => const HistoryScreen()),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(path: '/settings', builder: (_, __) => const SettingsScreen()),
          ]),
        ],
      ),
    ],
  );
});

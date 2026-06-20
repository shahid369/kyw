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
import '../screens/onboarding_screen.dart';
import '../screens/paywall_screen.dart';
import 'providers.dart';

/// Notifies GoRouter to re-evaluate redirects whenever auth state changes.
class _AuthNotifier extends ChangeNotifier {
  _AuthNotifier(Ref ref) {
    _sub = Supabase.instance.client.auth.onAuthStateChange.listen((_) {
      notifyListeners();
    });
    ref.listen(signupLoadingProvider, (_, __) {
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
  final notifier = _AuthNotifier(ref);
  ref.onDispose(notifier.dispose);

  return GoRouter(
    initialLocation: '/',
    refreshListenable: notifier,
    redirect: (context, state) {
      final isSignupLoading = ref.read(signupLoadingProvider);
      if (isSignupLoading) return null;

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
      GoRoute(path: '/onboarding', builder: (_, __) => const OnboardingScreen()),
      GoRoute(path: '/paywall', builder: (_, __) => const PaywallScreen()),

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

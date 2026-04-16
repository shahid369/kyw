import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'theme/app_theme.dart';
import 'core/router.dart';
import 'core/theme_provider.dart';
import 'services/notification_service.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Supabase.initialize(
    url: 'https://wnisxixzztvomixnpkls.supabase.co',
    anonKey: 'sb_publishable_MQvk-2GXP7Jyw9Yg0pxJeg_D2PbFpbR',
  );

  await NotificationService().init();

  runApp(const ProviderScope(child: KYWMobileApp()));
}

class KYWMobileApp extends ConsumerWidget {
  const KYWMobileApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    // Use system theme as fallback while persisted preference loads
    final themeModeAsync = ref.watch(themeModeProvider);
    final themeMode = themeModeAsync.value ?? ThemeMode.system;

    return MaterialApp.router(
      title: 'KYW',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: themeMode,
      routerConfig: router,
    );
  }
}

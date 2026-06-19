import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'theme/app_theme.dart';
import 'core/router.dart';
import 'core/theme_provider.dart';
import 'core/config.dart';
import 'services/notification_service.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'services/ad_service.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Supabase.initialize(
    url: AppConfig.supabaseUrl,
    anonKey: AppConfig.supabaseAnonKey,
  );

  await NotificationService().init();
  await MobileAds.instance.initialize();
  
  // Register physical device for test ads
  RequestConfiguration configuration = RequestConfiguration(
    testDeviceIds: ["A7BFCCEB220734BC2E00BDEE984BDC81"],
  );
  MobileAds.instance.updateRequestConfiguration(configuration);

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
    ref.watch(adServiceProvider); // Initialize ad service early

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

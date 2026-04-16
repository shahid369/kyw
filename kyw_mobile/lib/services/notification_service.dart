import 'dart:math';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/data/latest_all.dart' as tz;
import 'package:timezone/timezone.dart' as tz;
import 'package:flutter_timezone/flutter_timezone.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:permission_handler/permission_handler.dart';

import '../core/cycle_engine.dart';
import '../core/guide_content.dart';

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  final FlutterLocalNotificationsPlugin _notificationsPlugin = FlutterLocalNotificationsPlugin();

  bool _initialized = false;
  static const String _prefDailyRemindersKey = 'kyw_daily_reminders_enabled';

  Future<void> init() async {
    if (_initialized) return;

    // Timezone setup
    tz.initializeTimeZones();
    final tzInfo = await FlutterTimezone.getLocalTimezone();
    tz.setLocalLocation(tz.getLocation(tzInfo.identifier));

    // Plugin setup
    const AndroidInitializationSettings androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    const DarwinInitializationSettings iosSettings = DarwinInitializationSettings(
      requestAlertPermission: false, // We'll request manually
      requestBadgePermission: false,
      requestSoundPermission: false,
    );

    const InitializationSettings initSettings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );

    await _notificationsPlugin.initialize(settings: initSettings);
    _initialized = true;
  }

  Future<bool> get isEnabled async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_prefDailyRemindersKey) ?? false;
  }

  Future<void> setEnabled(bool enabled, List<Cycle> currentCycles, {int defaultLength = 28}) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_prefDailyRemindersKey, enabled);

    if (enabled) {
      await requestPermissions();
      await scheduleNext30Days(currentCycles, defaultLength: defaultLength);
    } else {
      await cancelAll();
    }
  }

  Future<void> requestPermissions() async {
    // Android 13+ Notification
    await Permission.notification.request();
    // Android 12+ Exact Alarms
    await Permission.scheduleExactAlarm.request();
    
    // iOS
    await _notificationsPlugin.resolvePlatformSpecificImplementation<IOSFlutterLocalNotificationsPlugin>()?.requestPermissions(
      alert: true,
      badge: true,
      sound: true,
    );
  }

  Future<void> cancelAll() async {
    await _notificationsPlugin.cancelAll();
  }

  Future<void> scheduleNext30Days(List<Cycle> cycles, {int defaultLength = 28}) async {
    if (cycles.isEmpty) return; // Cannot predict without data
    
    final enabled = await isEnabled;
    if (!enabled) return;

    await cancelAll(); // Clear existing batch

    final today = DateTime.now();
    final random = Random();

    for (int i = 1; i <= 30; i++) {
      final targetDate = today.add(Duration(days: i));
      final phaseInfo = CycleEngine.getCurrentPhaseInfo(cycles, defaultLength, targetDate);
      
      if (phaseInfo == null || phaseInfo.phase == CyclePhase.unknown) continue;

      final guide = GuideContentLibrary.content[phaseInfo.phase]!;
      
      // Randomly pick the format of the tip (0: Do, 1: Don't, 2: Tip)
      final formatType = random.nextInt(3);
      String body = '';

      // Make sure array is not empty
      if (formatType == 0 && guide.dos.isNotEmpty) {
        body = "💡 Do: ${guide.dos[random.nextInt(guide.dos.length)]}";
      } else if (formatType == 1 && guide.donts.isNotEmpty) {
        body = "🛑 Don't: ${guide.donts[random.nextInt(guide.donts.length)]}";
      } else {
        body = "📌 Tip: ${guide.tipOfTheDay[random.nextInt(guide.tipOfTheDay.length)]}";
      }

      // Title mapped from PhaseConfig
      final config = CycleEngine.phaseConfig[phaseInfo.phase]!;
      final title = "Phase: ${config.label.replaceFirst(' Phase', '')} ${config.emoji}";

      // Randomize time between 8:00 AM and 10:00 AM
      final hour = 8 + random.nextInt(3); // 8, 9, or 10
      final minute = random.nextInt(60);

      final scheduledDate = tz.TZDateTime(
        tz.local,
        targetDate.year,
        targetDate.month,
        targetDate.day,
        hour,
        minute,
      );

      // Don't schedule in the past if somehow evaluating today
      if (scheduledDate.isBefore(tz.TZDateTime.now(tz.local))) {
        continue;
      }

      const androidDetails = AndroidNotificationDetails(
        'kyw_daily_tips',
        'Daily Partner Tips',
        channelDescription: 'Daily Dos and Donts based on cycle phase',
        importance: Importance.defaultImportance,
        priority: Priority.defaultPriority,
      );

      const iosDetails = DarwinNotificationDetails();

      const details = NotificationDetails(
        android: androidDetails,
        iOS: iosDetails,
      );

      await _notificationsPlugin.zonedSchedule(
        id: i,
        title: title,
        body: body,
        scheduledDate: scheduledDate,
        notificationDetails: details,
        androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
      );
    }
  }
}

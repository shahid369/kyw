import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../core/providers.dart';
import '../core/cycle_engine.dart';
import '../theme/app_theme.dart';
import '../widgets/phase_badge.dart';
import '../widgets/phase_ring.dart';
import '../widgets/kyw_logo.dart';

import '../services/notification_service.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:tutorial_coach_mark/tutorial_coach_mark.dart';

class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  final GlobalKey _actionKey = GlobalKey();
  final GlobalKey _ringKey = GlobalKey();
  final GlobalKey _guideKey = GlobalKey();
  bool _hasCheckedOnboarding = false;

  @override
  void initState() {
    super.initState();
    _promptNotifications();
  }

  Future<void> _promptNotifications() async {
    final prefs = await SharedPreferences.getInstance();
    final hasPrompted = prefs.getBool('kyw_has_prompted_notifications') ?? false;
    if (!hasPrompted) {
      await prefs.setBool('kyw_has_prompted_notifications', true);
      // If user said 'both', we prompt immediately
      await NotificationService().requestPermissions();
      // Auto enable if they are prompting first time? No, let's just let the settings handle true enablement, or let's auto enable them here.
      // Easiest is: auto-enable when we prompt, so if they accept, they get them.
      // They can turn them off in settings.
      final cycles = ref.read(cyclesProvider).value ?? [];
      final profile = ref.read(userProfileProvider).value;
      await NotificationService().setEnabled(true, cycles, defaultLength: profile?.defaultCycleLength ?? 28);
    } else {
      // Just ensure we reschedule if they are enabled (to keep 30 days rolling)
      final enabled = await NotificationService().isEnabled;
      if (enabled) {
        final cycles = ref.read(cyclesProvider).value ?? [];
        final profile = ref.read(userProfileProvider).value;
        await NotificationService().scheduleNext30Days(cycles, defaultLength: profile?.defaultCycleLength ?? 28);
      }
    }
  }

  Future<void> _startPeriod() async {
    final user = ref.read(currentUserProvider);
    if (user == null) return;
    final client = ref.read(supabaseClientProvider);
    try {
      await client.from('cycles').insert({
        'user_id': user.id,
        'start_date': DateTime.now().toIso8601String().split('T')[0],
        'end_date': null,
      });
      ref.invalidate(cyclesProvider);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    }
  }

  Future<void> _endPeriod() async {
    final cycles = ref.read(cyclesProvider).value ?? [];
    if (cycles.isEmpty) return;
    final activeCycle = cycles.first; // Last started cycle
    final user = ref.read(currentUserProvider);
    if (user == null) return;
    final client = ref.read(supabaseClientProvider);
    try {
      await client.from('cycles').update({
        'end_date': DateTime.now().toIso8601String().split('T')[0],
      }).eq('id', activeCycle.id);
      ref.invalidate(cyclesProvider);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    }
  }

  Future<void> _confirmAction(bool isEnding) async {
    final confirmed = await showGeneralDialog<bool>(
      context: context,
      barrierDismissible: true,
      barrierLabel: 'Dismiss',
      transitionDuration: const Duration(milliseconds: 250),
      pageBuilder: (context, anim1, anim2) {
        return const SizedBox(); 
      },
      transitionBuilder: (context, anim1, anim2, child) {
        final isDark = Theme.of(context).brightness == Brightness.dark;
        return ScaleTransition(
          scale: CurvedAnimation(parent: anim1, curve: Curves.easeOutBack),
          child: FadeTransition(
            opacity: anim1,
            child: AlertDialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
              backgroundColor: isDark ? DarkColors.surface : AppColors.surface,
              elevation: 24,
              contentPadding: const EdgeInsets.fromLTRB(24, 24, 24, 16),
              title: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: (isEnding ? AppColors.phaseMenstrual : AppColors.primary).withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(
                      isEnding ? LucideIcons.calendarCheck : LucideIcons.droplets, 
                      color: isEnding ? AppColors.phaseMenstrual : AppColors.primary, 
                      size: 24
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Text(
                      isEnding ? 'End Period?' : 'Start Period?',
                      style: TextStyle(
                        fontFamily: 'Space Grotesk',
                        fontWeight: FontWeight.bold,
                        fontSize: 20,
                        color: isDark ? DarkColors.text : AppColors.text,
                      ),
                    ),
                  ),
                ],
              ),
              content: Text(
                isEnding
                    ? 'Are you sure you want to log today as the final day of her period?'
                    : 'Are you sure you want to log today as the first day of her period?',
                style: TextStyle(
                  color: isDark ? DarkColors.textSecondary : AppColors.textSecondary,
                  height: 1.5,
                ),
              ),
              actionsPadding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(context).pop(false),
                  style: TextButton.styleFrom(
                    minimumSize: const Size(80, 44),
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                  ),
                  child: Text('Cancel', style: TextStyle(color: isDark ? DarkColors.textSecondary : AppColors.textSecondary)),
                ),
                ElevatedButton(
                  onPressed: () => Navigator.of(context).pop(true),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: isEnding ? AppColors.phaseMenstrual : AppColors.primary,
                    foregroundColor: Colors.white,
                    minimumSize: const Size(100, 44),
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: Text(
                    isEnding ? 'Yes, end it' : 'Yes, start it',
                    style: const TextStyle(fontWeight: FontWeight.w600),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );

    if (confirmed == true) {
      if (isEnding) {
        await _endPeriod();
      } else {
        await _startPeriod();
      }
    }
  }

  void _showTour() {
    List<TargetFocus> targets = [];
    
    if (_actionKey.currentContext != null) {
      targets.add(TargetFocus(
        identify: "actionKey",
        keyTarget: _actionKey,
        contents: [
          TargetContent(
            align: ContentAlign.bottom,
            builder: (context, controller) => const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text("Log her period", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 20)),
                SizedBox(height: 10),
                Text("Tap here to start or end logging a period cycle. It's that simple!", style: TextStyle(color: Colors.white)),
              ],
            ),
          )
        ],
      ));
    }
    
    if (_ringKey.currentContext != null) {
      targets.add(TargetFocus(
        identify: "ringKey",
        keyTarget: _ringKey,
        contents: [
          TargetContent(
            align: ContentAlign.bottom,
            builder: (context, controller) => const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text("Phase Ring", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 20)),
                SizedBox(height: 10),
                Text("This ring shows you exactly where she is in her current cycle.", style: TextStyle(color: Colors.white)),
              ],
            ),
          )
        ],
      ));
    }

    if (_guideKey.currentContext != null) {
      targets.add(TargetFocus(
        identify: "guideKey",
        keyTarget: _guideKey,
        contents: [
          TargetContent(
            align: ContentAlign.top,
            builder: (context, controller) => const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text("Today's Guide", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 20)),
                SizedBox(height: 10),
                Text("Read personalized tips on how to support her today based on her phase.", style: TextStyle(color: Colors.white)),
              ],
            ),
          )
        ],
      ));
    }

    if (targets.isEmpty) return;

    TutorialCoachMark(
      targets: targets,
      colorShadow: AppColors.primary,
      textSkip: "SKIP",
      paddingFocus: 10,
      opacityShadow: 0.8,
    ).show(context: context);
  }

  void _checkOnboarding(List<Cycle> cycles) async {
    if (_hasCheckedOnboarding) return;
    _hasCheckedOnboarding = true;

    final prefs = await SharedPreferences.getInstance();
    final hasSeenOnboarding = prefs.getBool('kyw_has_seen_onboarding') ?? false;
    
    if (cycles.isEmpty && !hasSeenOnboarding) {
      if (mounted) context.go('/onboarding');
      return;
    }
    
    final hasSeenTour = prefs.getBool('kyw_has_seen_tour') ?? false;
    if (!hasSeenTour && cycles.isNotEmpty) {
      Future.delayed(const Duration(milliseconds: 1000), () {
        if (mounted) _showTour();
      });
      await prefs.setBool('kyw_has_seen_tour', true);
    }
  }

  @override
  Widget build(BuildContext context) {
    final cyclesAsync = ref.watch(cyclesProvider);
    if (cyclesAsync is AsyncData) {
      _checkOnboarding(cyclesAsync.value ?? []);
    }

    final profileAsync = ref.watch(userProfileProvider);
    final cycles = cyclesAsync.value ?? [];
    final profile = profileAsync.value;
    final isProfileLoading = profileAsync.isLoading;
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    final phaseInfo = CycleEngine.getCurrentPhaseInfo(cycles, profile?.defaultCycleLength ?? 28);
    final config = phaseInfo != null ? CycleEngine.phaseConfig[phaseInfo.phase] : null;

    final todayStr = DateFormat('EEEE, MMMM d').format(DateTime.now());
    
    final hasActivePeriod = cycles.isNotEmpty && cycles.first.endDate == null;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const KywLogo(fontSize: 26),
        centerTitle: false,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Header
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(todayStr, style: Theme.of(context).textTheme.bodyMedium),
                  const SizedBox(height: 4),
                  // Show shimmer placeholder while profile is loading
                  if (isProfileLoading)
                    Container(
                      width: 200,
                      height: 36,
                      decoration: BoxDecoration(
                        color: isDark ? DarkColors.border : AppColors.border,
                        borderRadius: BorderRadius.circular(8),
                      ),
                    )
                  else
                    Text(
                      'Hey, ${profile?.name.isNotEmpty == true ? profile!.name : 'there'} 👋',
                      style: Theme.of(context).textTheme.displayLarge,
                    ),
                  const SizedBox(height: 4),
                  if (!isProfileLoading && profile?.partnerName != null && profile!.partnerName.isNotEmpty)
                    RichText(
                      text: TextSpan(
                        style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: AppColors.textSecondary),
                        children: [
                          const TextSpan(text: 'Tracking '),
                          TextSpan(
                            text: profile.partnerName, 
                            style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold)
                          ),
                          const TextSpan(text: '\'s cycle'),
                        ],
                      ),
                    ),
                ],
              ).animate().fadeIn(duration: 400.ms).slideY(begin: 0.2, end: 0, curve: Curves.easeOutCubic),

              const SizedBox(height: 32),

              // Smart Action
              Container(
                key: _actionKey,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      AppColors.phaseMenstrual.withOpacity(0.15),
                      AppColors.phaseMenstrual.withOpacity(0.08),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.phaseMenstrual.withOpacity(0.4)),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(hasActivePeriod ? 'Active period' : 'Quick action', style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                          const SizedBox(height: 4),
                          Text(hasActivePeriod 
                            ? '🩸 Period started ${DateFormat('MMM d').format(DateTime.parse(cycles.first.startDate))} — still ongoing' 
                            : '🗓️ Did her period start today?', 
                            style: TextStyle(fontWeight: FontWeight.w600, color: AppColors.text, fontSize: 13),
                          ),
                        ],
                      ),
                    ),
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: hasActivePeriod ? AppColors.phaseMenstrual : AppColors.primary,
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      ),
                      onPressed: () => _confirmAction(hasActivePeriod),
                      icon: Icon(hasActivePeriod ? LucideIcons.checkCircle2 : LucideIcons.plus, size: 16),
                      label: Text(hasActivePeriod ? 'End Period' : 'Start Period'),
                    ),
                  ],
                ),
              ).animate(delay: 100.ms).fadeIn(duration: 400.ms).slideY(begin: 0.1, curve: Curves.easeOutCubic),

              const SizedBox(height: 24),

              // Main Phase Card
              if (phaseInfo != null && config != null)
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        isDark ? DarkColors.surface : AppColors.surface,
                        Color(config.colorValue).withValues(alpha: isDark ? 0.2 : 0.1),
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: Color(config.colorValue).withValues(alpha: isDark ? 0.4 : 0.3)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.04),
                        blurRadius: 20,
                        offset: const Offset(0, 10),
                      )
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                PhaseBadge(phase: phaseInfo.phase),
                                const SizedBox(height: 16),
                                Text(
                                  config.description, 
                                  style: Theme.of(context).textTheme.titleLarge?.copyWith(height: 1.3),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'Day ${phaseInfo.dayInCycle} of ${phaseInfo.avgCycleLength} — Next period in ${phaseInfo.daysUntilNextPeriod} days',
                                  style: Theme.of(context).textTheme.bodyMedium,
                                ),
                                const SizedBox(height: 24),
                                Wrap(
                                  spacing: 12,
                                  runSpacing: 12,
                                  children: [
                                    ElevatedButton.icon(
                                      key: _guideKey,
                                      onPressed: () => context.push('/guide'),
                                      icon: const Icon(LucideIcons.book, size: 16),
                                      label: const Text('Today\'s Guide'),
                                    ),
                                    OutlinedButton.icon(
                                      onPressed: () => context.push('/log'),
                                      icon: const Icon(LucideIcons.plus, size: 16),
                                      label: const Text('Log Symptoms'),
                                      style: OutlinedButton.styleFrom(
                                        foregroundColor: isDark ? DarkColors.text : AppColors.text,
                                        side: BorderSide(color: isDark ? DarkColors.border : AppColors.border),
                                      ),
                                    ),
                                  ],
                                )
                              ],
                            ),
                          ),
                          const SizedBox(width: 16),
                          PhaseRing(
                            key: _ringKey,
                            phase: phaseInfo.phase, 
                            progress: phaseInfo.cycleProgress, 
                            dayInCycle: phaseInfo.dayInCycle,
                            size: 130,
                          ),
                        ],
                      ),
                    ],
                  ),
                ).animate(delay: 200.ms).fadeIn(duration: 500.ms).scale(begin: const Offset(0.97, 0.97), curve: Curves.easeOutBack),

              const SizedBox(height: 24),

              // Stats Row
              Row(
                children: [
                  _StatCard(title: 'Avg Cycle Length', value: '${phaseInfo?.avgCycleLength ?? '-'} days', icon: LucideIcons.trendingUp, color: AppColors.secondary),
                  const SizedBox(width: 16),
                  _StatCard(title: 'Avg Period Length', value: '${phaseInfo?.avgPeriodLength ?? '-'} days', icon: LucideIcons.calendarDays, color: AppColors.phaseMenstrual),
                ],
              ).animate(delay: 300.ms).fadeIn(duration: 400.ms).slideY(begin: 0.1),
              // Recent Cycles Section
              const SizedBox(height: 32),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Recent Cycles', style: Theme.of(context).textTheme.titleLarge),
                  TextButton(
                    onPressed: () => context.push('/history'),
                    child: const Text('View All', style: TextStyle(color: AppColors.textSecondary)),
                  )
                ],
              ).animate(delay: 400.ms).fadeIn(duration: 400.ms),
              const SizedBox(height: 16),
              
              ...cycles.take(3).map((cycle) {
                final start = DateTime.parse(cycle.startDate);
                final end = cycle.endDate != null ? DateTime.parse(cycle.endDate!) : null;
                final length = end != null ? end.difference(start).inDays + 1 : null;
                final isFirst = cycles.indexOf(cycle) == 0;
                
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: isFirst 
                        ? (isDark ? DarkColors.primarySubtle : AppColors.primarySubtle) 
                        : (isDark ? DarkColors.surface2 : AppColors.surface2),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: isFirst 
                          ? AppColors.primary.withValues(alpha: isDark ? 0.4 : 0.3) 
                          : (isDark ? DarkColors.border : AppColors.border)
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Text(DateFormat('MMM d, yyyy').format(start), 
                            style: const TextStyle(fontWeight: FontWeight.w600, fontFamily: 'Space Grotesk', fontSize: 15)),
                          if (end != null)
                            Text('  →  ${DateFormat('MMM d').format(end)}', 
                              style: TextStyle(color: AppColors.muted, fontSize: 13)),
                        ],
                      ),
                      Text(length != null ? '$length days' : 'Ongoing', 
                        style: TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                    ],
                  ),
                ).animate(delay: 450.ms).fadeIn().slideY(begin: 0.1);
              }),
            ],
          ),
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;

  const _StatCard({required this.title, required this.value, required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isDark ? DarkColors.surface : AppColors.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: isDark ? DarkColors.border : AppColors.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.withValues(alpha: isDark ? 0.25 : 0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 20),
            ),
            const SizedBox(height: 12),
            Text(title, style: Theme.of(context).textTheme.bodyMedium?.copyWith(fontSize: 12)),
            const SizedBox(height: 4),
            Text(value, style: Theme.of(context).textTheme.titleLarge),
          ],
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../core/providers.dart';
import '../core/cycle_engine.dart'; // added for Cycle
import '../theme/app_theme.dart';
import 'package:go_router/go_router.dart';
import '../widgets/calendar_picker.dart';
import '../services/notification_service.dart';
import '../services/ad_service.dart';

class LogScreen extends ConsumerStatefulWidget {
  const LogScreen({super.key});

  @override
  ConsumerState<LogScreen> createState() => _LogScreenState();
}

class _LogScreenState extends ConsumerState<LogScreen> {
  DateTime? _startDate;
  DateTime? _endDate;
  final TextEditingController _periodLengthController = TextEditingController(text: '5');
  bool _isLoading = false;
  String? _error;

  @override
  void dispose() {
    _periodLengthController.dispose();
    super.dispose();
  }

  void _logCycle() async {
    if (_startDate == null) return;
    
    final confirmed = await showGeneralDialog<bool>(
      context: context,
      barrierDismissible: true,
      barrierLabel: 'Dismiss',
      transitionDuration: const Duration(milliseconds: 250),
      pageBuilder: (context, anim1, anim2) => const SizedBox(),
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
                      color: AppColors.primary.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(LucideIcons.calendarPlus, color: AppColors.primary, size: 24),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Text(
                      'Save Cycle?',
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
                'Are you sure you want to log this cycle?',
                style: TextStyle(color: isDark ? DarkColors.textSecondary : AppColors.textSecondary, height: 1.5),
              ),
              actionsPadding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(context).pop(false),
                  style: TextButton.styleFrom(minimumSize: const Size(80, 44)),
                  child: Text('Cancel', style: TextStyle(color: isDark ? DarkColors.textSecondary : AppColors.textSecondary)),
                ),
                ElevatedButton(
                  onPressed: () => Navigator.of(context).pop(true),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    minimumSize: const Size(100, 44),
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Save', style: TextStyle(fontWeight: FontWeight.w600)),
                ),
              ],
            ),
          ),
        );
      },
    );

    if (confirmed != true || !mounted) return;

    setState(() {
      _isLoading = true;
      _error = null;
    });

    final user = ref.read(currentUserProvider);
    if (user == null) return;

    final client = ref.read(supabaseClientProvider);

    try {
      await client.from('cycles').insert({
        'user_id': user.id,
        'start_date': _startDate!.toIso8601String().split('T')[0],
        'end_date': _endDate?.toIso8601String().split('T')[0],
      });
      
      ref.invalidate(cyclesProvider);

      final enabled = await NotificationService().isEnabled;
      if (enabled) {
        final newCycles = await client.from('cycles').select().eq('user_id', user.id).order('start_date', ascending: false);
        final mappedCycles = (newCycles as List).map((data) => Cycle.fromMap(data)).toList();
        final profile = ref.read(userProfileProvider).value;
        await NotificationService().scheduleNext30Days(mappedCycles, defaultLength: profile?.defaultCycleLength ?? 28);
      }

      ref.read(adServiceProvider).showInterstitialAd();

      if (mounted) {
        if (context.canPop()) {
          context.pop();
        } else {
          context.go('/');
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() => _error = e.toString());
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final surface = isDark ? DarkColors.surface : AppColors.surface;
    final border = isDark ? DarkColors.border : AppColors.border;
    final textSecondary = isDark ? DarkColors.textSecondary : AppColors.textSecondary;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Log Entry', style: TextStyle(fontFamily: 'Space Grotesk', fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: isDark ? DarkColors.text : AppColors.text,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text('Record a cycle', style: TextStyle(color: textSecondary, fontSize: 15)),
            const SizedBox(height: 24),
            
            if (_error != null) ...[
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.phaseMenstrual.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppColors.phaseMenstrual.withValues(alpha: 0.3)),
                ),
                child: Text(_error!, style: const TextStyle(color: AppColors.phaseMenstrual, fontSize: 13)),
              ),
              const SizedBox(height: 16),
            ],

            // Card 1: Input
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: surface,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: border),
                boxShadow: [
                  BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.03), blurRadius: 10, offset: const Offset(0, 4)),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                   Text(
                    'Typical Period Length (days) *',
                    style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: isDark ? DarkColors.text : AppColors.text),
                  ),
                  const SizedBox(height: 10),
                  TextFormField(
                    controller: _periodLengthController,
                    keyboardType: TextInputType.number,
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      LengthLimitingTextInputFormatter(2),
                    ],
                    decoration: InputDecoration(
                      hintText: 'e.g. 5',
                      prefixIcon: Icon(LucideIcons.calendarClock, size: 18, color: textSecondary),
                      counterText: '',
                    ),
                    onChanged: (val) {
                      setState(() {
                         // Triggers a rebuild so periodLength applies instantly if user taps a new start date
                      });
                    },
                  ),
                ],
              ),
            ).animate().fadeIn().slideY(begin: 0.05),

            const SizedBox(height: 20),

            // Card 2: Calendar
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: surface,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: border),
                boxShadow: [
                  BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.03), blurRadius: 10, offset: const Offset(0, 4)),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Select Cycle Dates *',
                    style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: isDark ? DarkColors.text : AppColors.text),
                  ),
                  const SizedBox(height: 16),
                  CalendarPicker(
                    startDate: _startDate,
                    endDate: _endDate,
                    periodLength: int.tryParse(_periodLengthController.text) ?? 5,
                    onChange: (start, end) {
                      setState(() {
                        _startDate = start;
                        _endDate = end;
                      });
                    },
                  ),
                  if (_startDate == null)
                    Padding(
                      padding: const EdgeInsets.only(top: 16),
                      child: Text(
                        'Click a start date to begin tracking.',
                        style: TextStyle(color: textSecondary, fontSize: 13, fontStyle: FontStyle.italic),
                      ),
                    ),
                ],
              ),
            ).animate(delay: 100.ms).fadeIn().slideY(begin: 0.05),

            const SizedBox(height: 32),
            
            ElevatedButton.icon(
              onPressed: (_isLoading || _startDate == null) ? null : _logCycle,
              icon: _isLoading 
                ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                : const Icon(LucideIcons.save, size: 18),
              label: Text(_isLoading ? 'Saving…' : 'Save Cycle', style: const TextStyle(fontSize: 16)),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
            ).animate(delay: 200.ms).fadeIn().slideY(begin: 0.05),
            
            const SizedBox(height: 48),
          ],
        ),
      ),
    );
  }
}

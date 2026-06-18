import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/providers.dart';
import '../theme/app_theme.dart';
import '../widgets/calendar_picker.dart';


class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  int _avgPeriodLength = 5;
  DateTime? _lastPeriodDate;
  DateTime? _endDate;

  bool _isLoading = false;

  void _nextPage() {
    if (_currentPage < 2) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      _finishOnboarding();
    }
  }

  Future<void> _skipOnboarding() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('kyw_has_seen_onboarding', true);
    if (!mounted) return;
    context.go('/');
  }

  Future<void> _finishOnboarding() async {
    if (_lastPeriodDate == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a start date for the last period')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final user = ref.read(currentUserProvider);
      if (user != null) {
        final client = ref.read(supabaseClientProvider);
        
        String? endDateStr;
        if (_endDate != null) {
          endDateStr = _endDate!.toIso8601String().split('T')[0];
        }
        
        await client.from('cycles').insert({
          'user_id': user.id,
          'start_date': _lastPeriodDate!.toIso8601String().split('T')[0],
          'end_date': endDateStr,
        });

        // Invalidate providers
        ref.invalidate(userProfileProvider);
        ref.invalidate(cyclesProvider);
      }

      await _skipOnboarding(); // sets flag and navigates
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Header with Skip
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  onPressed: _skipOnboarding,
                  child: Text('Skip', style: TextStyle(color: AppColors.textSecondary)),
                ),
                const SizedBox(width: 8),
              ],
            ),

            // Expanding PageView
            Expanded(
              child: PageView(
                controller: _pageController,
                physics: const NeverScrollableScrollPhysics(), // disable swipe
                onPageChanged: (index) => setState(() => _currentPage = index),
                children: [
                  _buildWelcomePage(isDark),
                  _buildCycleLengthPage(isDark),
                  _buildDatePage(isDark),
                ],
              ),
            ),

            // Footer with Next/Finish
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: _isLoading 
                ? const Center(child: CircularProgressIndicator())
                : ElevatedButton(
                    onPressed: _nextPage,
                    style: ElevatedButton.styleFrom(
                      minimumSize: const Size(double.infinity, 56),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    child: Text(_currentPage == 2 ? 'Finish & Start Tracking' : 'Continue'),
                  ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildWelcomePage(bool isDark) {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(LucideIcons.heartHandshake, size: 64, color: AppColors.primary),
          ),
          const SizedBox(height: 40),
          Text(
            "Welcome to KYW",
            style: Theme.of(context).textTheme.displayLarge,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          Text(
            "Let's personalize your tracking experience by setting up her current cycle.",
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
              color: isDark ? DarkColors.textSecondary : AppColors.textSecondary,
              height: 1.5,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ).animate().fadeIn(duration: 500.ms).slideY(begin: 0.1),
    );
  }

  Widget _buildCycleLengthPage(bool isDark) {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            "Average Period Length?",
            style: Theme.of(context).textTheme.displayLarge,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          Text(
            "How many days does her bleeding usually last?",
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
              color: isDark ? DarkColors.textSecondary : AppColors.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 60),
          Text(
            "$_avgPeriodLength Days",
            style: const TextStyle(
              fontSize: 48, 
              fontWeight: FontWeight.bold, 
              color: AppColors.primary,
              fontFamily: 'Outfit',
            ),
          ),
          const SizedBox(height: 20),
          Slider(
            value: _avgPeriodLength.toDouble(),
            min: 2,
            max: 10,
            divisions: 8,
            activeColor: AppColors.primary,
            onChanged: (value) => setState(() => _avgPeriodLength = value.toInt()),
          ),
        ],
      ).animate().fadeIn(duration: 500.ms).slideY(begin: 0.1),
    );
  }

  Widget _buildDatePage(bool isDark) {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            "Last Period Start?",
            style: Theme.of(context).textTheme.displayLarge,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          Text(
            "When did her last period start? If you aren't sure, an estimate is fine.",
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
              color: isDark ? DarkColors.textSecondary : AppColors.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 40),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isDark ? DarkColors.surface : AppColors.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: isDark ? DarkColors.border : AppColors.border),
            ),
            child: CalendarPicker(
              startDate: _lastPeriodDate,
              endDate: _endDate,
              periodLength: _avgPeriodLength,
              onChange: (start, end) {
                setState(() {
                  _lastPeriodDate = start;
                  _endDate = end;
                });
              },
            ),
          ),
        ],
      ).animate().fadeIn(duration: 500.ms).slideY(begin: 0.1),
    );
  }
}

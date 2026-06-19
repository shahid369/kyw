import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/providers.dart';
import '../theme/app_theme.dart';

class ProfileSetupScreen extends ConsumerStatefulWidget {
  const ProfileSetupScreen({super.key});

  @override
  ConsumerState<ProfileSetupScreen> createState() => _ProfileSetupScreenState();
}

class _ProfileSetupScreenState extends ConsumerState<ProfileSetupScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _partnerNameController = TextEditingController();
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    // Prefill name from Google metadata if available
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final user = ref.read(currentUserProvider);
      if (user != null) {
        final googleName = user.userMetadata?['full_name'] ?? user.userMetadata?['name'] ?? '';
        if (googleName.toString().isNotEmpty) {
          _nameController.text = googleName.toString();
        }
      }
    });
  }

  Future<void> _submitProfile() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);

    try {
      final user = ref.read(currentUserProvider);
      if (user == null) throw Exception('No authenticated user found.');

      final client = ref.read(supabaseClientProvider);

      // 1. Reset onboarding flag for the new user
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool('kyw_has_seen_onboarding_${user.id}', false);

      // 2. Upsert profile details
      await client.from('profiles').upsert({
        'id': user.id,
        'name': _nameController.text.trim(),
        'partner_name': _partnerNameController.text.trim(),
        'default_cycle_length': 28,
      });

      // 3. Invalidate profile cached state so Dashboard switches layout
      ref.invalidate(userProfileProvider);
      ref.invalidate(cyclesProvider);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e'), backgroundColor: AppColors.phaseMenstrual),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _partnerNameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 32.0),
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Logo/Brand Icon with Gradient
                  Center(
                    child: Container(
                      width: 72,
                      height: 72,
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [AppColors.primary, AppColors.accent],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(22),
                      ),
                      child: const Icon(Icons.favorite_rounded, color: Colors.white, size: 36),
                    ).animate().fadeIn(duration: 400.ms).scale(begin: const Offset(0.8, 0.8)),
                  ),
                  const SizedBox(height: 32),

                  Text(
                    'Complete Your Profile',
                    style: Theme.of(context).textTheme.displayLarge,
                    textAlign: TextAlign.center,
                  ).animate().fadeIn(delay: 100.ms).slideY(begin: 0.2),
                  const SizedBox(height: 8),

                  Text(
                    'Just a couple of details to personalize your period tracking experience.',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: isDark ? DarkColors.textSecondary : AppColors.textSecondary,
                        ),
                    textAlign: TextAlign.center,
                  ).animate().fadeIn(delay: 150.ms),
                  const SizedBox(height: 40),

                  // Inputs Section
                  TextFormField(
                    controller: _nameController,
                    maxLength: 50,
                    textInputAction: TextInputAction.next,
                    style: TextStyle(color: isDark ? DarkColors.text : AppColors.text),
                    decoration: InputDecoration(
                      labelText: 'Your Name',
                      hintText: 'e.g. James',
                      prefixIcon: Icon(Icons.person_outline_rounded, size: 20, color: isDark ? DarkColors.muted : AppColors.muted),
                      counterText: '',
                    ),
                    validator: (v) {
                      if (v == null || v.trim().isEmpty) return 'Enter your name';
                      if (v.length > 50) return 'Name too long';
                      return null;
                    },
                  ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.1),
                  const SizedBox(height: 16),

                  TextFormField(
                    controller: _partnerNameController,
                    maxLength: 50,
                    textInputAction: TextInputAction.done,
                    style: TextStyle(color: isDark ? DarkColors.text : AppColors.text),
                    decoration: InputDecoration(
                      labelText: "Partner's Name",
                      hintText: "e.g. Sarah",
                      prefixIcon: Icon(Icons.favorite_border_rounded, size: 20, color: AppColors.primary.withOpacity(0.8)),
                      counterText: '',
                    ),
                    onFieldSubmitted: (_) => _submitProfile(),
                    validator: (v) {
                      if (v == null || v.trim().isEmpty) return "Enter your partner's name";
                      if (v.length > 50) return 'Name too long';
                      return null;
                    },
                  ).animate().fadeIn(delay: 250.ms).slideY(begin: 0.1),
                  const SizedBox(height: 32),

                  // Submit Button
                  ElevatedButton(
                    onPressed: _isLoading ? null : _submitProfile,
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    child: _isLoading
                        ? const SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                          )
                        : const Text('Save & Continue'),
                  ).animate().fadeIn(delay: 300.ms),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

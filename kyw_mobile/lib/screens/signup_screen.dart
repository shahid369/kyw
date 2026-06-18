import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:go_router/go_router.dart';
import '../core/providers.dart';
import '../theme/app_theme.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SignupScreen extends ConsumerStatefulWidget {
  const SignupScreen({super.key});

  @override
  ConsumerState<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends ConsumerState<SignupScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _partnerNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  bool _obscurePassword = true;

  Future<void> _signUp() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);
    ref.read(signupLoadingProvider.notifier).set(true);
    final stopwatch = Stopwatch()..start();

    try {
      final client = ref.read(supabaseClientProvider);

      // 1. Create auth user
      final response = await client.auth.signUp(
        email: _emailController.text.trim(),
        password: _passwordController.text.trim(),
      );

      final userId = response.user?.id;
      if (userId == null) throw Exception('Sign up failed — no user returned.');

      // Reset the onboarding flag so the new account sees the setup screen
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool('kyw_has_seen_onboarding_$userId', false);

      // 2. Upsert profile
      await client.from('profiles').upsert({
        'id': userId,
        'name': _nameController.text.trim(),
        'partner_name': _partnerNameController.text.trim(),
        'default_cycle_length': 28,
      });

      // Enforce minimum duration for a premium, polished feel
      final elapsed = stopwatch.elapsed;
      const minimumDuration = Duration(seconds: 3);
      if (elapsed < minimumDuration) {
        await Future.delayed(minimumDuration - elapsed);
      }
    } on AuthException catch (error) {
      final elapsed = stopwatch.elapsed;
      const minimumDuration = Duration(seconds: 3);
      if (elapsed < minimumDuration) {
        await Future.delayed(minimumDuration - elapsed);
      }

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(error.message), backgroundColor: AppColors.phaseMenstrual),
      );
    } catch (error) {
      final elapsed = stopwatch.elapsed;
      const minimumDuration = Duration(seconds: 3);
      if (elapsed < minimumDuration) {
        await Future.delayed(minimumDuration - elapsed);
      }

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(error.toString()), backgroundColor: AppColors.phaseMenstrual),
      );
    } finally {
      stopwatch.stop();
      ref.read(signupLoadingProvider.notifier).set(false);
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _partnerNameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 32),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 24),

                // Logo / Brand
                Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [AppColors.primary, AppColors.accent],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Icon(Icons.favorite_rounded, color: Colors.white, size: 32),
                ).animate().fadeIn(duration: 400.ms).scale(begin: const Offset(0.8, 0.8)),

                const SizedBox(height: 24),

                Text(
                  'Create Account',
                  style: Theme.of(context).textTheme.displayLarge,
                ).animate().fadeIn(delay: 100.ms).slideY(begin: 0.2),

                const SizedBox(height: 8),

                Text(
                  'Start understanding her cycle — together.',
                  style: Theme.of(context).textTheme.bodyMedium,
                ).animate().fadeIn(delay: 150.ms),

                const SizedBox(height: 40),

                // Section: About You
                _SectionLabel(label: 'About You').animate().fadeIn(delay: 200.ms),
                const SizedBox(height: 12),

                _buildField(
                  controller: _nameController,
                  label: 'Your Name',
                  hint: 'e.g. James',
                  icon: Icons.person_outline_rounded,
                  maxLength: 50,
                  validator: (v) {
                    if (v == null || v.trim().isEmpty) return 'Enter your name';
                    if (v.length > 50) return 'Name too long';
                    return null;
                  },
                  action: TextInputAction.next,
                ).animate().fadeIn(delay: 220.ms).slideY(begin: 0.1),

                const SizedBox(height: 16),

                _buildField(
                  controller: _partnerNameController,
                  label: "Partner's Name",
                  hint: "e.g. Sarah",
                  icon: Icons.favorite_border_rounded,
                  maxLength: 50,
                  validator: (v) {
                    if (v == null || v.trim().isEmpty) return "Enter your partner's name";
                    if (v.length > 50) return 'Name too long';
                    return null;
                  },
                  action: TextInputAction.next,
                ).animate().fadeIn(delay: 240.ms).slideY(begin: 0.1),

                const SizedBox(height: 28),

                // Section: Your Account
                _SectionLabel(label: 'Your Account').animate().fadeIn(delay: 260.ms),
                const SizedBox(height: 12),

                _buildField(
                  controller: _emailController,
                  label: 'Email Address',
                  hint: 'you@example.com',
                  icon: Icons.email_outlined,
                  keyboardType: TextInputType.emailAddress,
                  validator: (v) {
                    if (v == null || v.trim().isEmpty) return 'Enter your email';
                    if (!RegExp(r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+").hasMatch(v)) {
                      return 'Enter a valid email';
                    }
                    return null;
                  },
                  action: TextInputAction.next,
                ).animate().fadeIn(delay: 280.ms).slideY(begin: 0.1),

                const SizedBox(height: 16),

                TextFormField(
                  controller: _passwordController,
                  obscureText: _obscurePassword,
                  textInputAction: TextInputAction.done,
                  onFieldSubmitted: (_) => _signUp(),
                  validator: (v) {
                    if (v == null || v.isEmpty) return 'Enter a password';
                    if (v.length < 8) return 'Password must be at least 8 characters';
                    return null;
                  },
                  decoration: InputDecoration(
                    labelText: 'Password',
                    hintText: 'At least 8 characters',
                    prefixIcon: const Icon(Icons.lock_outline_rounded, size: 20, color: AppColors.muted),
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                        size: 20,
                        color: AppColors.muted,
                      ),
                      onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                    ),
                  ),
                ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.1),

                const SizedBox(height: 32),

                // Sign Up Button
                ElevatedButton(
                  onPressed: _isLoading ? null : _signUp,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  child: _isLoading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                        )
                      : const Text('Create Account'),
                ).animate().fadeIn(delay: 340.ms),

                const SizedBox(height: 20),

                // Already have account
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Already have an account? ',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                    GestureDetector(
                      onTap: () => context.go('/login'),
                      child: const Text(
                        'Sign In',
                        style: TextStyle(
                          color: AppColors.primary,
                          fontWeight: FontWeight.w600,
                          fontSize: 14,
                        ),
                      ),
                    ),
                  ],
                ).animate().fadeIn(delay: 380.ms),

                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildField({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData icon,
    TextInputType? keyboardType,
    String? Function(String?)? validator,
    TextInputAction? action,
    int? maxLength,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      textInputAction: action,
      validator: validator,
      maxLength: maxLength,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        prefixIcon: Icon(icon, size: 20, color: AppColors.muted),
        counterText: '',
      ),
    );
  }
}

class _SectionLabel extends StatelessWidget {
  final String label;
  const _SectionLabel({required this.label});

  @override
  Widget build(BuildContext context) {
    return Text(
      label.toUpperCase(),
      style: const TextStyle(
        fontSize: 11,
        fontWeight: FontWeight.w700,
        color: AppColors.muted,
        letterSpacing: 1.2,
      ),
    );
  }
}

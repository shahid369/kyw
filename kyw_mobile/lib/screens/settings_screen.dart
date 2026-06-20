import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../core/providers.dart';
import '../core/theme_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/kyw_logo.dart';
import '../services/notification_service.dart';
import '../services/revenuecat_service.dart';
import 'package:go_router/go_router.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  // Profile editing
  final _nameController = TextEditingController();
  final _partnerController = TextEditingController();
  bool _profileLoaded = false;
  bool _isSaving = false;
  bool _saveSuccess = false;
  String? _saveError;

  // Account
  bool _isLoggingOut = false;
  bool _isDeletingAccount = false;

  // Notifications
  bool _dailyReminders = false;
  bool _remindersLoaded = false;

  @override
  void initState() {
    super.initState();
    _loadNotificationSettings();
  }

  Future<void> _loadNotificationSettings() async {
    final enabled = await NotificationService().isEnabled;
    if (mounted) {
      setState(() {
        _dailyReminders = enabled;
        _remindersLoaded = true;
      });
    }
  }

  Future<void> _toggleReminders(bool value) async {
    setState(() => _dailyReminders = value);
    final cycles = ref.read(cyclesProvider).value ?? [];
    int defaultLength = 28;
    final profile = ref.read(userProfileProvider).value;
    if (profile?.defaultCycleLength != null) defaultLength = profile!.defaultCycleLength;
    await NotificationService().setEnabled(value, cycles, defaultLength: defaultLength);
  }

  @override
  void dispose() {
    _nameController.dispose();
    _partnerController.dispose();
    super.dispose();
  }

  void _populateProfile() {
    if (_profileLoaded) return;
    final profile = ref.read(userProfileProvider).value;
    if (profile != null) {
      _nameController.text = profile.name;
      _partnerController.text = profile.partnerName;
      _profileLoaded = true;
    }
  }

  Future<void> _saveProfile() async {
    setState(() { _isSaving = true; _saveError = null; _saveSuccess = false; });
    try {
      final user = ref.read(currentUserProvider);
      if (user == null) return;
      final client = ref.read(supabaseClientProvider);
      await client.from('profiles').upsert({
        'id': user.id,
        'name': _nameController.text.trim(),
        'partner_name': _partnerController.text.trim(),
      });
      // Invalidate cached profile so dashboard refreshes
      ref.invalidate(userProfileProvider);
      setState(() => _saveSuccess = true);
      await Future.delayed(const Duration(seconds: 2));
      if (mounted) setState(() => _saveSuccess = false);
    } catch (e) {
      setState(() => _saveError = e.toString());
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  Future<void> _logout() async {
    setState(() => _isLoggingOut = true);
    try {
      await ref.read(supabaseClientProvider).auth.signOut();
      // Router will redirect via auth state change
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString()), backgroundColor: AppColors.phaseMenstrual),
      );
    } finally {
      if (mounted) setState(() => _isLoggingOut = false);
    }
  }

  Future<void> _deleteAccount() async {
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
                      color: const Color(0xFFDC2626).withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(
                      LucideIcons.trash2, 
                      color: Color(0xFFDC2626), 
                      size: 24
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Text(
                      'Delete Account?',
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
                'This will permanently erase your account and all cycle data. This cannot be undone. Are you absolutely sure?',
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
                    backgroundColor: const Color(0xFFDC2626), // Tailwind Red 600
                    foregroundColor: Colors.white,
                    minimumSize: const Size(100, 44),
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Yes, delete', style: TextStyle(fontWeight: FontWeight.w600)),
                ),
              ],
            ),
          ),
        );
      },
    );

    if (confirmed != true || !mounted) return;

    setState(() => _isDeletingAccount = true);
    try {
      final client = ref.read(supabaseClientProvider);
      // RPC call seamlessly drops the auth.user which cascades down to all other tables
      await client.rpc('delete_user');
      await client.auth.signOut();
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString()), backgroundColor: AppColors.phaseMenstrual),
      );
    } finally {
      if (mounted) setState(() => _isDeletingAccount = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    _populateProfile();

    final profileAsync = ref.watch(userProfileProvider);
    // Watch the async themeMode — .value is null while loading
    final themeModeAsync = ref.watch(themeModeProvider);
    final themeMode = themeModeAsync.value ?? ThemeMode.system;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final mutedColor = isDark ? DarkColors.muted : AppColors.muted;
    final textSecondary = isDark ? DarkColors.textSecondary : AppColors.textSecondary;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const KywLogo(fontSize: 26),
        centerTitle: false,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [

            // ── Page Header ──────────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.only(bottom: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Settings', style: Theme.of(context).textTheme.displayMedium),
                  const SizedBox(height: 4),
                  Text('Manage your profile & preferences', style: TextStyle(color: textSecondary, fontSize: 14)),
                ],
              ),
            ).animate().fadeIn(duration: 300.ms).slideY(begin: 0.1),

            // ── Pro Subscription Card ────────────────────────────────────
            Consumer(
              builder: (context, ref, _) {
                final isPro = ref.watch(isProProvider);
                return _SettingsCard(
                  isDark: isDark,
                  icon: LucideIcons.crown,
                  title: 'KYW Pro',
                  iconColor: const Color(0xFFEAB308), // Yellow-500
                  animDelay: 40,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      if (isPro) ...[
                        Row(
                          children: [
                            const Icon(LucideIcons.checkCircle2, color: Color(0xFF22C55E), size: 18),
                            const SizedBox(width: 8),
                            Text('Pro Member Active', style: TextStyle(color: isDark ? DarkColors.text : AppColors.text, fontWeight: FontWeight.w600)),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text('Thank you for supporting KYW! You have access to all features and an ad-free experience.', style: TextStyle(color: mutedColor, fontSize: 13, height: 1.4)),
                        const SizedBox(height: 16),
                        OutlinedButton(
                          onPressed: () => RevenueCatService.presentCustomerCenter(),
                          child: const Text('Manage Subscription'),
                        ),
                      ] else ...[
                        Text('Unlock all features and remove ads for just \$1/month.', style: TextStyle(color: mutedColor, fontSize: 13, height: 1.4)),
                        const SizedBox(height: 16),
                        ElevatedButton.icon(
                          onPressed: () => context.push('/paywall'),
                          icon: const Icon(LucideIcons.sparkles, size: 16),
                          label: const Text('Upgrade to Pro'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFEAB308), // Yellow-500
                            foregroundColor: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 8),
                        TextButton(
                          onPressed: () => RevenueCatService.restorePurchases(),
                          child: Text('Restore Purchases', style: TextStyle(color: textSecondary, fontSize: 12)),
                        ),
                      ],
                    ],
                  ),
                );
              },
            ),

            const SizedBox(height: 16),

            // ── Profile Card ─────────────────────────────────────────────
            _SettingsCard(
              isDark: isDark,
              icon: LucideIcons.user,
              title: 'Profile',
              animDelay: 80,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  if (_saveError != null) ...[
                    _AlertBanner(message: _saveError!, isError: true),
                    const SizedBox(height: 12),
                  ],
                  if (_saveSuccess) ...[
                    const _AlertBanner(message: '✓ Profile saved!', isError: false),
                    const SizedBox(height: 12),
                  ],

                  _ProfileField(
                    controller: _nameController,
                    label: 'Your Name',
                    icon: Icons.person_outline_rounded,
                    isDark: isDark,
                  ),
                  const SizedBox(height: 12),
                  _ProfileField(
                    controller: _partnerController,
                    label: "Partner's Name",
                    icon: Icons.favorite_border_rounded,
                    isDark: isDark,
                    iconColor: AppColors.primary,
                  ),
                  const SizedBox(height: 12),

                  // Email (read-only)
                  profileAsync.when(
                    data: (profile) => _ReadOnlyField(
                      label: 'Email',
                      value: ref.read(currentUserProvider)?.email ?? '—',
                      isDark: isDark,
                    ),
                    loading: () => const SizedBox.shrink(),
                    error: (_, __) => const SizedBox.shrink(),
                  ),

                  const SizedBox(height: 16),

                  ElevatedButton.icon(
                    onPressed: _isSaving ? null : _saveProfile,
                    icon: _isSaving
                        ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                        : const Icon(LucideIcons.save, size: 16),
                    label: Text(_isSaving ? 'Saving…' : 'Save Changes'),
                    style: ElevatedButton.styleFrom(
                      alignment: Alignment.center,
                      padding: const EdgeInsets.symmetric(vertical: 13),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // ── Appearance Card ──────────────────────────────────────────
            _SettingsCard(
              isDark: isDark,
              icon: LucideIcons.palette,
              title: 'Appearance',
              animDelay: 160,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Theme', style: TextStyle(fontSize: 13, color: mutedColor, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      _ThemeChip(
                        label: 'Light',
                        icon: LucideIcons.sun,
                        isSelected: themeMode == ThemeMode.light,
                        isDark: isDark,
                        onTap: () => ref.read(themeModeProvider.notifier).setMode(ThemeMode.light),
                      ),
                      const SizedBox(width: 8),
                      _ThemeChip(
                        label: 'System',
                        icon: LucideIcons.monitor,
                        isSelected: themeMode == ThemeMode.system,
                        isDark: isDark,
                        onTap: () => ref.read(themeModeProvider.notifier).setMode(ThemeMode.system),
                      ),
                      const SizedBox(width: 8),
                      _ThemeChip(
                        label: 'Dark',
                        icon: LucideIcons.moon,
                        isSelected: themeMode == ThemeMode.dark,
                        isDark: isDark,
                        onTap: () => ref.read(themeModeProvider.notifier).setMode(ThemeMode.dark),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    themeMode == ThemeMode.system
                        ? 'Follows your device setting'
                        : themeMode == ThemeMode.dark
                            ? 'Always dark — easier on the eyes'
                            : 'Always light — bright & clean',
                    style: TextStyle(fontSize: 12, color: mutedColor),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // ── Notifications Card ───────────────────────────────────────
            _SettingsCard(
              isDark: isDark,
              icon: LucideIcons.bell,
              title: 'Notifications',
              animDelay: 200,
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Daily Reminders',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: isDark ? DarkColors.text : AppColors.text,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Receive a creative daily tip in the morning based on her current cycle phase.',
                          style: TextStyle(fontSize: 12, color: mutedColor),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 16),
                  if (!_remindersLoaded)
                    const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(strokeWidth: 2))
                  else
                    Switch(
                      value: _dailyReminders,
                      onChanged: _toggleReminders,
                      activeColor: AppColors.primary,
                    ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // ── Account Card ─────────────────────────────────────────────
            _SettingsCard(
              isDark: isDark,
              icon: LucideIcons.logOut,
              title: 'Account',
              iconColor: AppColors.secondary,
              animDelay: 240,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    'Sign out of your account on this device.',
                    style: TextStyle(fontSize: 13, color: textSecondary, height: 1.5),
                  ),
                  const SizedBox(height: 14),
                  OutlinedButton.icon(
                    onPressed: _isLoggingOut ? null : _logout,
                    icon: _isLoggingOut
                        ? SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.secondary))
                        : const Icon(LucideIcons.logOut, size: 16),
                    label: Text(_isLoggingOut ? 'Signing out…' : 'Sign Out'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.secondary,
                      side: const BorderSide(color: AppColors.secondary),
                      padding: const EdgeInsets.symmetric(vertical: 13),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // ── Danger Zone ──────────────────────────────────────────────
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: isDark 
                    ? const Color(0xFF7F1D1D).withValues(alpha: 0.15) 
                    : const Color(0xFFFEF2F2),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.phaseMenstrual.withValues(alpha: isDark ? 0.35 : 0.2)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(LucideIcons.trash2, color: AppColors.phaseMenstrual, size: 18),
                      const SizedBox(width: 8),
                      const Text(
                        'Danger Zone',
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: AppColors.phaseMenstrual,
                          fontFamily: 'Space Grotesk',
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Permanently delete your account and all cycle data. This cannot be undone.',
                    style: TextStyle(fontSize: 13, color: textSecondary, height: 1.5),
                  ),
                  const SizedBox(height: 14),
                  ElevatedButton.icon(
                    onPressed: _isDeletingAccount ? null : _deleteAccount,
                    icon: _isDeletingAccount
                        ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                        : const Icon(LucideIcons.trash2, size: 16),
                    label: Text(_isDeletingAccount ? 'Deleting…' : 'Delete Account'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFDC2626), // red-600
                      foregroundColor: Colors.white,
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 20),
                    ),
                  ),
                ],
              ),
            ).animate(delay: 300.ms).fadeIn().slideY(begin: 0.1),

            const SizedBox(height: 32),

            // ── App Version ──────────────────────────────────────────────
            Center(
              child: Text(
                'KYW v1.0.1 · Built with ♥',
                style: TextStyle(fontSize: 12, color: mutedColor),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-widgets
// ─────────────────────────────────────────────────────────────────────────────

class _SettingsCard extends StatelessWidget {
  final bool isDark;
  final IconData icon;
  final String title;
  final Widget child;
  final int animDelay;
  final Color? iconColor;

  const _SettingsCard({
    required this.isDark,
    required this.icon,
    required this.title,
    required this.child,
    this.animDelay = 0,
    this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    final surface = isDark ? DarkColors.surface : AppColors.surface;
    final border = isDark ? DarkColors.border : AppColors.border;
    final effectiveIconColor = iconColor ?? AppColors.primary;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(7),
                decoration: BoxDecoration(
                  color: effectiveIconColor.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, size: 16, color: effectiveIconColor),
              ),
              const SizedBox(width: 10),
              Text(
                title,
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: isDark ? DarkColors.text : AppColors.text,
                  fontFamily: 'Space Grotesk',
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Divider(color: isDark ? DarkColors.border : AppColors.border, height: 1),
          const SizedBox(height: 16),
          child,
        ],
      ),
    ).animate(delay: Duration(milliseconds: animDelay)).fadeIn(duration: 300.ms).slideY(begin: 0.05);
  }
}

class _ThemeChip extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool isSelected;
  final bool isDark;
  final VoidCallback onTap;

  const _ThemeChip({
    required this.label,
    required this.icon,
    required this.isSelected,
    required this.isDark,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: isSelected
                ? AppColors.primary.withValues(alpha: 0.15)
                : (isDark ? DarkColors.surface2 : AppColors.surface2),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isSelected ? AppColors.primary : (isDark ? DarkColors.border : AppColors.border),
              width: isSelected ? 1.5 : 1,
            ),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                icon,
                size: 18,
                color: isSelected ? AppColors.primary : (isDark ? DarkColors.muted : AppColors.muted),
              ),
              const SizedBox(height: 4),
              Text(
                label,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                  color: isSelected ? AppColors.primary : (isDark ? DarkColors.muted : AppColors.muted),
                  fontFamily: 'Space Grotesk',
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ProfileField extends StatelessWidget {
  final TextEditingController controller;
  final String label;
  final IconData icon;
  final bool isDark;
  final Color? iconColor;

  const _ProfileField({
    required this.controller,
    required this.label,
    required this.icon,
    required this.isDark,
    this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      textInputAction: TextInputAction.next,
      maxLength: 50,
      style: TextStyle(color: isDark ? DarkColors.text : AppColors.text, fontSize: 15),
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, size: 18, color: iconColor ?? (isDark ? DarkColors.muted : AppColors.muted)),
        counterText: '',
      ),
    );
  }
}

class _ReadOnlyField extends StatelessWidget {
  final String label;
  final String value;
  final bool isDark;

  const _ReadOnlyField({required this.label, required this.value, required this.isDark});

  @override
  Widget build(BuildContext context) {
    final mutedColor = isDark ? DarkColors.muted : AppColors.muted;
    return InputDecorator(
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(Icons.email_outlined, size: 18, color: mutedColor),
        enabled: false,
      ),
      child: Text(
        value,
        style: TextStyle(fontSize: 15, color: mutedColor),
      ),
    );
  }
}

class _AlertBanner extends StatelessWidget {
  final String message;
  final bool isError;

  const _AlertBanner({required this.message, required this.isError});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: (isError ? AppColors.phaseMenstrual : const Color(0xFF22C55E)).withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: (isError ? AppColors.phaseMenstrual : const Color(0xFF22C55E)).withValues(alpha: 0.3),
        ),
      ),
      child: Text(
        message,
        style: TextStyle(
          fontSize: 13,
          color: isError ? AppColors.phaseMenstrual : const Color(0xFF16A34A),
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}

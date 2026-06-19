import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../core/providers.dart';
import '../core/cycle_engine.dart';
import '../core/guide_content.dart';
import '../theme/app_theme.dart';
import '../widgets/phase_badge.dart';

class GuideScreen extends ConsumerWidget {
  const GuideScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cyclesAsync = ref.watch(cyclesProvider);
    final cycles = cyclesAsync.value ?? [];
    final profile = ref.watch(userProfileProvider).value;

    final phaseInfo = CycleEngine.getCurrentPhaseInfo(cycles, profile?.defaultCycleLength ?? 28);
    final phase = phaseInfo?.phase ?? CyclePhase.unknown;
    final guide = GuideContentLibrary.content[phase]!;
    final config = CycleEngine.phaseConfig[phase]!;
    final baseColor = Color(config.colorValue);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Today's Guide",
          style: TextStyle(fontFamily: 'Space Grotesk', fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: AppColors.text,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // ── Header Card ─────────────────────────────────────────
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    baseColor.withValues(alpha: isDark ? 0.25 : 0.12), 
                    baseColor.withValues(alpha: isDark ? 0.08 : 0.04)
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: baseColor.withValues(alpha: isDark ? 0.4 : 0.25)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  PhaseBadge(phase: phase),
                  const SizedBox(height: 16),
                  Text(
                    guide.title,
                    style: Theme.of(context).textTheme.displayMedium?.copyWith(color: baseColor),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    guide.subtitle,
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontSize: 16,
                          color: isDark ? DarkColors.textSecondary : AppColors.textSecondary,
                          fontWeight: FontWeight.w400,
                        ),
                  ),
                ],
              ),
            ).animate().fadeIn().slideY(begin: 0.1),

            const SizedBox(height: 16),

            // ── Tip of the Day ──────────────────────────────────────
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDark ? DarkColors.primarySubtle : AppColors.primarySubtle,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.primary.withValues(alpha: 0.2)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(LucideIcons.lightbulb, color: isDark ? const Color(0xFFFFB2D1) : AppColors.primary, size: 18),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'TIP OF THE DAY',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: isDark ? const Color(0xFFFFB2D1) : AppColors.primary,
                            letterSpacing: 1.1,
                          ),
                        ),
                        const SizedBox(height: 3),
                        Text(
                          GuideContentLibrary.getRandomTip(phase),
                          style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 14, height: 1.4),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ).animate(delay: 100.ms).fadeIn().slideY(begin: 0.1),

            const SizedBox(height: 28),

            // ── What's Happening ───────────────────────────────────
            Text(guide.whatIsHappeningHeading, style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 10),
            Text(
              guide.whatIsHappeningBody,
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(height: 1.65),
            ),

            const SizedBox(height: 28),

            // ── Do's and Don'ts — full-width cards ────────────────
            if (guide.dos.isNotEmpty) ...[
              _DosDontsCard(
                isDoSection: true,
                items: guide.dos,
              ).animate(delay: 180.ms).fadeIn().slideY(begin: 0.08),
              const SizedBox(height: 14),
            ],

            if (guide.donts.isNotEmpty) ...[
              _DosDontsCard(
                isDoSection: false,
                items: guide.donts,
              ).animate(delay: 240.ms).fadeIn().slideY(begin: 0.08),
              const SizedBox(height: 28),
            ],

            // ── Communication Script ───────────────────────────────
            if (guide.communicationScript.isNotEmpty) ...[
              Text('How To Say It', style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: isDark ? DarkColors.surface : AppColors.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: isDark ? DarkColors.border : AppColors.border),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.04),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppColors.muted.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(LucideIcons.messageSquare, color: AppColors.muted, size: 18),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Text(
                        guide.communicationScript,
                        style: const TextStyle(
                          fontStyle: FontStyle.italic,
                          fontSize: 15,
                          height: 1.6,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ),
                  ],
                ),
              ).animate(delay: 300.ms).fadeIn().slideY(begin: 0.1),
              const SizedBox(height: 32),
            ],
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Do / Don't Card Widget
// ─────────────────────────────────────────────────────────────────────────────

class _DosDontsCard extends StatelessWidget {
  final bool isDoSection;
  final List<String> items;

  const _DosDontsCard({required this.isDoSection, required this.items});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final Color bgColor = isDark 
        ? (isDoSection ? const Color(0xFF064E3B).withValues(alpha: 0.3) : const Color(0xFF7F1D1D).withValues(alpha: 0.3))
        : (isDoSection ? const Color(0xFFECFDF5) : const Color(0xFFFFF1F2));
    final Color borderColor = isDark 
        ? (isDoSection ? const Color(0xFF10B981).withValues(alpha: 0.3) : const Color(0xFFEF4444).withValues(alpha: 0.3))
        : (isDoSection ? const Color(0xFF86EFAC) : const Color(0xFFFCA5A5));
    final Color iconBgColor = isDark 
        ? (isDoSection ? const Color(0xFF22C55E).withValues(alpha: 0.2) : const Color(0xFFEF4444).withValues(alpha: 0.2))
        : (isDoSection ? const Color(0xFF22C55E).withValues(alpha: 0.18) : const Color(0xFFEF4444).withValues(alpha: 0.15));
    final Color iconColor = isDark 
        ? (isDoSection ? const Color(0xFF4ADE80) : const Color(0xFFF87171))
        : (isDoSection ? const Color(0xFF16A34A) : const Color(0xFFDC2626));
    final Color labelColor = isDark 
        ? (isDoSection ? const Color(0xFF86EFAC) : const Color(0xFFFCA5A5))
        : (isDoSection ? const Color(0xFF15803D) : const Color(0xFFB91C1C));
    final Color dotColor = isDark 
        ? (isDoSection ? const Color(0xFF4ADE80) : const Color(0xFFF87171))
        : (isDoSection ? const Color(0xFF22C55E) : const Color(0xFFEF4444));
    final Color textColor = isDark ? DarkColors.text : labelColor.withValues(alpha: 0.85);

    return Container(
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: borderColor, width: 1.5),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header row
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 16, 18, 12),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: iconBgColor,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(
                    isDoSection ? LucideIcons.checkCircle2 : LucideIcons.xCircle,
                    color: iconColor,
                    size: 18,
                  ),
                ),
                const SizedBox(width: 10),
                Text(
                  isDoSection ? 'DO THIS' : "AVOID THIS",
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    color: labelColor,
                    letterSpacing: 0.8,
                    fontFamily: 'Space Grotesk',
                  ),
                ),
              ],
            ),
          ),

          // Divider
          Container(height: 1, color: borderColor.withValues(alpha: 0.6)),

          // Items list
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 14, 18, 16),
            child: Column(
              children: items.map((item) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Padding(
                        padding: const EdgeInsets.only(top: 5),
                        child: Container(
                          width: 6,
                          height: 6,
                          decoration: BoxDecoration(
                            color: dotColor,
                            shape: BoxShape.circle,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          item,
                          style: TextStyle(
                            fontSize: 14,
                            height: 1.5,
                            color: textColor,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
}

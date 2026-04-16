import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../core/providers.dart';
import '../theme/app_theme.dart';

class HistoryScreen extends ConsumerStatefulWidget {
  const HistoryScreen({super.key});

  @override
  ConsumerState<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends ConsumerState<HistoryScreen> {
  Future<void> _deleteCycle(String cycleId) async {
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
                    child: const Icon(LucideIcons.trash2, color: Color(0xFFDC2626), size: 24),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Text(
                      'Delete Cycle?',
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
                'This will permanently remove this cycle record. This cannot be undone.',
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
                    backgroundColor: const Color(0xFFDC2626),
                    foregroundColor: Colors.white,
                    minimumSize: const Size(100, 44),
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Delete', style: TextStyle(fontWeight: FontWeight.w600)),
                ),
              ],
            ),
          ),
        );
      },
    );

    if (confirmed != true || !mounted) return;

    try {
      final client = ref.read(supabaseClientProvider);
      await client.from('cycles').delete().eq('id', cycleId);
      ref.invalidate(cyclesProvider);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Cycle deleted'), backgroundColor: Color(0xFF22C55E)),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error deleting: $e'), backgroundColor: AppColors.phaseMenstrual),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cyclesAsync = ref.watch(cyclesProvider);
    final cycles = cyclesAsync.value ?? [];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Cycle History', style: TextStyle(fontFamily: 'Space Grotesk', fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: isDark ? DarkColors.text : AppColors.text,
      ),
      body: cyclesAsync.isLoading
          ? const Center(child: CircularProgressIndicator())
          : cycles.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(LucideIcons.history, size: 48, color: isDark ? DarkColors.muted : AppColors.muted),
                      const SizedBox(height: 16),
                      Text('No cycles logged yet.', style: Theme.of(context).textTheme.bodyLarge),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(24),
                  itemCount: cycles.length,
                  itemBuilder: (context, index) {
                    final cycle = cycles[index];
                    final start = DateTime.parse(cycle.startDate);
                    final end = cycle.endDate != null ? DateTime.parse(cycle.endDate!) : null;
                    final length = end != null ? end.difference(start).inDays + 1 : null;

                    return Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: isDark ? DarkColors.surface : AppColors.surface,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: isDark ? DarkColors.border : AppColors.border),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.02),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          )
                        ],
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                DateFormat('MMMM d, yyyy').format(start),
                                style: const TextStyle(
                                  fontWeight: FontWeight.w700,
                                  fontFamily: 'Space Grotesk',
                                  fontSize: 16,
                                ),
                              ),
                              if (end != null) ...[
                                const SizedBox(height: 6),
                                Text(
                                  'Ended on ${DateFormat('MMMM d, yyyy').format(end)}',
                                  style: TextStyle(color: isDark ? DarkColors.textSecondary : AppColors.textSecondary, fontSize: 13),
                                ),
                              ],
                            ],
                          ),
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: length == null 
                                      ? AppColors.phaseMenstrual.withValues(alpha: 0.1) 
                                      : (isDark ? DarkColors.surface2 : AppColors.surface2),
                                  borderRadius: BorderRadius.circular(999),
                                ),
                                child: Text(
                                  length != null ? '$length days' : 'Ongoing',
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                    color: length == null 
                                        ? AppColors.phaseMenstrual 
                                        : (isDark ? DarkColors.textSecondary : AppColors.textSecondary),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              IconButton(
                                onPressed: () => _deleteCycle(cycle.id),
                                icon: const Icon(LucideIcons.trash2, size: 18),
                                color: const Color(0xFFDC2626),
                                padding: EdgeInsets.zero,
                                constraints: const BoxConstraints(),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ).animate(delay: (index * 100).ms).fadeIn().slideY(begin: 0.1);
                  },
                ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../core/cycle_engine.dart';

class PhaseBadge extends StatelessWidget {
  final CyclePhase phase;
  final bool animate;

  const PhaseBadge({
    super.key,
    required this.phase,
    this.animate = true,
  });

  @override
  Widget build(BuildContext context) {
    final config = CycleEngine.phaseConfig[phase]!;
    final baseColor = Color(config.colorValue);

    Widget badge = Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: baseColor.withOpacity(0.15),
        border: Border.all(color: baseColor.withOpacity(0.3), width: 1.5),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(config.emoji, style: const TextStyle(fontSize: 14)),
          const SizedBox(width: 6),
          Text(
            config.label.toUpperCase(),
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: baseColor,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );

    if (animate) {
      return badge.animate()
        .fadeIn(duration: 400.ms, curve: Curves.easeOut)
        .scale(begin: const Offset(0.95, 0.95), duration: 400.ms, curve: Curves.easeOutBack);
    }
    
    return badge;
  }
}

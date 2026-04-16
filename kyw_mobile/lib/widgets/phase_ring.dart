import 'dart:math';
import 'package:flutter/material.dart';
import '../core/cycle_engine.dart';
import '../theme/app_theme.dart';

class PhaseRing extends StatefulWidget {
  final CyclePhase phase;
  final int progress; // 0-100 percentage
  final int dayInCycle;
  final double size;

  const PhaseRing({
    super.key,
    required this.phase,
    required this.progress,
    required this.dayInCycle,
    this.size = 150.0,
  });

  @override
  State<PhaseRing> createState() => _PhaseRingState();
}

class _PhaseRingState extends State<PhaseRing> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _progressAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );
    
    _progressAnimation = Tween<double>(
      begin: 0.0, 
      end: widget.progress / 100.0
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOutCirc,
    ));

    _controller.forward();
  }

  @override
  void didUpdateWidget(covariant PhaseRing oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.progress != widget.progress) {
      _progressAnimation = Tween<double>(
        begin: _progressAnimation.value,
        end: widget.progress / 100.0,
      ).animate(CurvedAnimation(
        parent: _controller,
        curve: Curves.easeOutCubic,
      ));
      _controller.forward(from: 0.0);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final config = CycleEngine.phaseConfig[widget.phase]!;
    final baseColor = Color(config.colorValue);

    return AnimatedBuilder(
      animation: _progressAnimation,
      builder: (context, child) {
        return SizedBox(
          width: widget.size,
          height: widget.size,
          child: Stack(
            alignment: Alignment.center,
            children: [
              CustomPaint(
                size: Size(widget.size, widget.size),
                painter: _RingPainter(
                  progress: _progressAnimation.value,
                  ringColor: baseColor,
                  trackColor: baseColor.withOpacity(0.1),
                ),
              ),
              Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Day',
                    style: TextStyle(
                      fontSize: widget.size * 0.12,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textSecondary,
                      letterSpacing: 1,
                    ),
                  ),
                  Text(
                    '${widget.dayInCycle}',
                    style: TextStyle(
                      fontSize: widget.size * 0.35,
                      fontWeight: FontWeight.w700,
                      color: AppColors.text,
                      height: 1.1,
                      fontFamily: 'Space Grotesk',
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}

class _RingPainter extends CustomPainter {
  final double progress;
  final Color ringColor;
  final Color trackColor;

  _RingPainter({
    required this.progress,
    required this.ringColor,
    required this.trackColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = min(size.width / 2, size.height / 2);
    final strokeWidth = size.width * 0.08;

    final trackPaint = Paint()
      ..color = trackColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    final ringPaint = Paint()
      ..color = ringColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    // Draw background track
    canvas.drawCircle(center, radius - (strokeWidth / 2), trackPaint);

    // Draw progress arc (-pi/2 means starting from 12 o'clock)
    final sweepAngle = 2 * pi * progress;
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius - (strokeWidth / 2)),
      -pi / 2,
      sweepAngle,
      false,
      ringPaint,
    );
  }

  @override
  bool shouldRepaint(covariant _RingPainter oldDelegate) {
    return oldDelegate.progress != progress ||
        oldDelegate.ringColor != ringColor ||
        oldDelegate.trackColor != trackColor;
  }
}

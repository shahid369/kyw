import 'dart:math';

enum CyclePhase {
  menstrual,
  follicular,
  ovulation,
  luteal,
  pms,
  unknown,
}

class Cycle {
  final String id;
  final String startDate;
  final String? endDate;

  Cycle({
    required this.id,
    required this.startDate,
    this.endDate,
  });

  factory Cycle.fromMap(Map<String, dynamic> map) {
    return Cycle(
      id: map['id'],
      startDate: map['start_date'],
      endDate: map['end_date'],
    );
  }
}

class PhaseInfo {
  final CyclePhase phase;
  final int dayInCycle;
  final int daysUntilNextPeriod;
  final DateTime nextPeriodDate;
  final DateTime ovulationDate;
  final int avgCycleLength;
  final int avgPeriodLength;
  final int cycleProgress; // 0-100 percentage

  PhaseInfo({
    required this.phase,
    required this.dayInCycle,
    required this.daysUntilNextPeriod,
    required this.nextPeriodDate,
    required this.ovulationDate,
    required this.avgCycleLength,
    required this.avgPeriodLength,
    required this.cycleProgress,
  });
}

class PhaseConfig {
  final String label;
  final String emoji;
  final String description;
  final int colorValue; // Because Flutter Colors are int (0xFFRRGGBB)

  const PhaseConfig({
    required this.label,
    required this.emoji,
    required this.description,
    required this.colorValue,
  });
}

class CycleEngine {
  // Matches "Clinical Vitality" CSS hsl values to 0xFF... Hex (approximated based on hsl conversions)
  // Menstrual: hsl(0, 72%, 58%) -> #EF4444 (roughly corresponding) -> 0xFFE55353 (precise matching needed later, using close approximations)
  static const Map<CyclePhase, PhaseConfig> phaseConfig = {
    CyclePhase.menstrual: PhaseConfig(
      label: 'Menstrual Phase',
      colorValue: 0xFFEF4B4B, // var(--phase-menstrual)
      emoji: '🔴',
      description: 'The period is active. Low energy, high sensitivity.',
    ),
    CyclePhase.follicular: PhaseConfig(
      label: 'Follicular Phase',
      colorValue: 0xFF2B9EE0, // var(--phase-follicular)
      emoji: '🌱',
      description: 'Energy is rising. She may feel social, motivated, and upbeat.',
    ),
    CyclePhase.ovulation: PhaseConfig(
      label: 'Ovulation Phase',
      colorValue: 0xFFF7BD11, // var(--phase-ovulation)
      emoji: '✨',
      description: 'Peak energy and communication. She feels her best.',
    ),
    CyclePhase.luteal: PhaseConfig(
      label: 'Luteal Phase',
      colorValue: 0xFF9761DE, // var(--phase-luteal)
      emoji: '🍂',
      description: 'Energy winds down. She needs calm and reassurance.',
    ),
    CyclePhase.pms: PhaseConfig(
      label: 'PMS Phase',
      colorValue: 0xFFCA4EE0, // var(--phase-pms)
      emoji: '⚡',
      description: 'Pre-period tension. Emotions run high — be extra gentle.',
    ),
    CyclePhase.unknown: PhaseConfig(
      label: 'No Data',
      colorValue: 0xFF888888, // var(--color-muted)
      emoji: '❓',
      description: 'Log a cycle to unlock phase tracking.',
    ),
  };

  static int getAverageCycleLength(List<Cycle> cycles, [int defaultCycleLength = 28]) {
    List<int> lengths = [];

    for (int i = 1; i < cycles.length; i++) {
      final newer = DateTime.parse(cycles[i - 1].startDate);
      final older = DateTime.parse(cycles[i].startDate);
      final diff = newer.difference(older).inDays.abs();
      if (diff > 15 && diff < 60) lengths.add(diff); // sanity filter
    }

    if (lengths.isEmpty) return defaultCycleLength;
    return (lengths.reduce((a, b) => a + b) / lengths.length).round();
  }

  static int getAveragePeriodLength(List<Cycle> cycles) {
    List<int> lengths = cycles.where((c) => c.endDate != null).map((c) {
      final start = DateTime.parse(c.startDate);
      final end = DateTime.parse(c.endDate!);
      return end.difference(start).inDays.abs() + 1;
    }).where((l) => l > 1 && l < 15).toList();

    if (lengths.isEmpty) return 5;
    return (lengths.reduce((a, b) => a + b) / lengths.length).round();
  }

  static PhaseInfo? getCurrentPhaseInfo(List<Cycle> cycles, [int defaultCycleLength = 28, DateTime? targetDate]) {
    if (cycles.isEmpty) return null;

    // Sort descending by start_date
    final sorted = List<Cycle>.from(cycles)..sort((a, b) {
      return DateTime.parse(b.startDate).compareTo(DateTime.parse(a.startDate));
    });

    final lastCycle = sorted.first;
    final avgCycleLength = getAverageCycleLength(sorted, defaultCycleLength);
    final avgPeriodLength = getAveragePeriodLength(sorted);

    final lastStart = DateTime.parse(lastCycle.startDate).toLocal();
    final today = (targetDate ?? DateTime.now()).toLocal();
    
    final lastStartTruncate = DateTime(lastStart.year, lastStart.month, lastStart.day);
    final todayTruncate = DateTime(today.year, today.month, today.day);

    final dayInCycle = todayTruncate.difference(lastStartTruncate).inDays + 1;

    final nextPeriodDate = lastStartTruncate.add(Duration(days: avgCycleLength));
    final daysUntilNextPeriod = nextPeriodDate.difference(todayTruncate).inDays;

    final ovulationDay = avgCycleLength - 14;
    final ovulationDate = lastStartTruncate.add(Duration(days: ovulationDay - 1));

    int cycleProgress = ((dayInCycle / avgCycleLength) * 100).round();
    cycleProgress = min(100, max(0, cycleProgress));

    CyclePhase phase = CyclePhase.unknown;

    if (dayInCycle <= avgPeriodLength) {
      phase = CyclePhase.menstrual;
    } else if (dayInCycle <= ovulationDay - 2) {
      phase = CyclePhase.follicular;
    } else if (dayInCycle <= ovulationDay + 2) {
      phase = CyclePhase.ovulation;
    } else if (dayInCycle <= avgCycleLength - 7) {
      phase = CyclePhase.luteal;
    } else {
      phase = CyclePhase.pms;
    }

    return PhaseInfo(
      phase: phase,
      dayInCycle: dayInCycle,
      daysUntilNextPeriod: daysUntilNextPeriod,
      nextPeriodDate: nextPeriodDate,
      ovulationDate: ovulationDate,
      avgCycleLength: avgCycleLength,
      avgPeriodLength: avgPeriodLength,
      cycleProgress: cycleProgress,
    );
  }
}

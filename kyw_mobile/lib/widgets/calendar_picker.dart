import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../theme/app_theme.dart';

class CalendarPicker extends StatefulWidget {
  final DateTime? startDate;
  final DateTime? endDate;
  final int periodLength;
  final void Function(DateTime? start, DateTime? end) onChange;

  const CalendarPicker({
    super.key,
    this.startDate,
    this.endDate,
    this.periodLength = 5,
    required this.onChange,
  });

  @override
  State<CalendarPicker> createState() => _CalendarPickerState();
}

class _CalendarPickerState extends State<CalendarPicker> {
  late DateTime _currentMonth;
  final DateTime _today = DateTime.now();
  DateTime? _dragOrigin;

  @override
  void initState() {
    super.initState();
    _currentMonth = widget.startDate ?? _today;
    _currentMonth = DateTime(_currentMonth.year, _currentMonth.month, 1);
  }

  void _handlePointer(Offset localPosition, BoxConstraints constraints, int totalCells, int daysBefore, DateTime firstDayOfMonth, {required bool isDown}) {
    final cellWidth = (constraints.maxWidth - 6 * 4) / 7;
    final colWidth = cellWidth + 4;
    final rowHeight = cellWidth + 4;
    
    if (localPosition.dx < 0 || localPosition.dy < 0 || localPosition.dx > constraints.maxWidth) return;
    
    int col = (localPosition.dx / colWidth).floor();
    int row = (localPosition.dy / rowHeight).floor();
    
    if (col < 0 || col > 6 || row < 0) return;
    
    int index = row * 7 + col;
    if (index >= totalCells) return;
    
    final date = firstDayOfMonth.add(Duration(days: index - daysBefore));
    final isFuture = date.isAfter(_today) && !DateUtils.isSameDay(date, _today);
    if (isFuture) return;

    if (isDown) {
      if (widget.startDate != null && DateUtils.isSameDay(date, widget.startDate)) {
        widget.onChange(null, null);
        _dragOrigin = null; // Prevent dragging
        return;
      }
      
      _dragOrigin = date;
      if (widget.startDate == null || date.isBefore(widget.startDate!)) {
        final calculatedEnd = date.add(Duration(days: (widget.periodLength > 0 ? widget.periodLength : 1) - 1));
        widget.onChange(date, calculatedEnd);
      } else {
        widget.onChange(widget.startDate, date);
      }
    } else {
      if (_dragOrigin != null) {
        if (DateUtils.isSameDay(date, _dragOrigin!)) {
          return;
        }
        if (date.isBefore(_dragOrigin!)) {
          widget.onChange(date, _dragOrigin);
        } else {
          widget.onChange(_dragOrigin, date);
        }
      }
    }
  }

  void _nextMonth() {
    setState(() {
      _currentMonth = DateTime(_currentMonth.year, _currentMonth.month + 1, 1);
    });
  }

  void _prevMonth() {
    setState(() {
      _currentMonth = DateTime(_currentMonth.year, _currentMonth.month - 1, 1);
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textSecondary = isDark ? DarkColors.textSecondary : AppColors.textSecondary;
    final mutedColor = isDark ? DarkColors.muted : AppColors.muted;

    final firstDayOfMonth = DateTime(_currentMonth.year, _currentMonth.month, 1);
    final lastDayOfMonth = DateTime(_currentMonth.year, _currentMonth.month + 1, 0);
    
    // Calculate days to prepend for the first week (assuming Sunday start)
    final daysBefore = firstDayOfMonth.weekday % 7; // Sunday=0, Monday=1, ...
    
    final daysToGenerate = daysBefore + lastDayOfMonth.day;
    final totalCells = (daysToGenerate / 7).ceil() * 7;
    
    final currentMonthIsTodayMonth = _currentMonth.year == _today.year && _currentMonth.month == _today.month;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Header
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            IconButton(
              icon: Icon(LucideIcons.chevronLeft, color: textSecondary, size: 20),
              onPressed: _prevMonth,
            ),
            Text(
              DateFormat('MMMM yyyy').format(_currentMonth),
              style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16, fontFamily: 'Space Grotesk'),
            ),
            IconButton(
              icon: Icon(LucideIcons.chevronRight, color: currentMonthIsTodayMonth ? mutedColor.withValues(alpha: 0.3) : textSecondary, size: 20),
              onPressed: currentMonthIsTodayMonth ? null : _nextMonth,
            ),
          ],
        ),
        const SizedBox(height: 8),
        // Weekdays
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) {
            return SizedBox(
              width: 32,
              child: Text(
                d,
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: mutedColor),
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: 8),
        // Grid
        LayoutBuilder(
          builder: (context, constraints) {
            return Listener(
              onPointerDown: (event) => _handlePointer(event.localPosition, constraints, totalCells, daysBefore, firstDayOfMonth, isDown: true),
              onPointerMove: (event) => _handlePointer(event.localPosition, constraints, totalCells, daysBefore, firstDayOfMonth, isDown: false),
              onPointerUp: (event) => _dragOrigin = null,
              onPointerCancel: (event) => _dragOrigin = null,
              child: GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 7,
                  mainAxisSpacing: 4,
                  crossAxisSpacing: 4,
                  childAspectRatio: 1.0,
                ),
                itemCount: totalCells,
                itemBuilder: (context, index) {
                  final date = firstDayOfMonth.add(Duration(days: index - daysBefore));
                  final isCurrentMonth = date.month == _currentMonth.month;
                  final isFuture = date.isAfter(_today) && !DateUtils.isSameDay(date, _today);
                  
                  bool isStart = widget.startDate != null && DateUtils.isSameDay(date, widget.startDate);
                  bool isEnd = widget.endDate != null && DateUtils.isSameDay(date, widget.endDate);
                  bool isHighlighted = false;
                  
                  if (widget.startDate != null && widget.endDate != null) {
                    if ((date.isAfter(widget.startDate!) || isStart) && 
                        (date.isBefore(widget.endDate!) || isEnd)) {
                      isHighlighted = true;
                    }
                  }

                  Color textColor = isDark ? DarkColors.text : AppColors.text;
                  Color bgColor = Colors.transparent;
                  BoxBorder? border;
                  BorderRadius? borderRadius = BorderRadius.circular(8);

                  if (!isCurrentMonth) {
                    textColor = mutedColor.withValues(alpha: 0.5);
                  } else if (isFuture) {
                    textColor = mutedColor.withValues(alpha: 0.3);
                  }

                  if (isStart || isEnd) {
                    bgColor = AppColors.phaseMenstrual;
                    textColor = Colors.white;
                    if (isStart && isEnd) {
                      // Keep radius 8
                    } else if (isStart) {
                      borderRadius = const BorderRadius.horizontal(left: Radius.circular(8));
                    } else if (isEnd) {
                      borderRadius = const BorderRadius.horizontal(right: Radius.circular(8));
                    }
                  } else if (isHighlighted) {
                    bgColor = AppColors.phaseMenstrual.withValues(alpha: isDark ? 0.2 : 0.1);
                    textColor = isDark ? const Color(0xFFFFB2D1) : AppColors.phaseMenstrual;
                    borderRadius = BorderRadius.zero;
                  }

                  if (DateUtils.isSameDay(date, _today) && !isHighlighted && !isStart && !isEnd) {
                    textColor = AppColors.phaseMenstrual;
                    border = Border.all(color: AppColors.phaseMenstrual.withValues(alpha: 0.5));
                  }

                  return Container(
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: bgColor,
                      borderRadius: borderRadius,
                      border: border,
                    ),
                    child: Text(
                      '${date.day}',
                      style: TextStyle(
                        color: textColor,
                        fontWeight: (isHighlighted || isStart || isEnd) ? FontWeight.w600 : FontWeight.w400,
                      ),
                    ),
                  );
                },
              ),
            );
          }
        ),
      ],
    );
  }
}

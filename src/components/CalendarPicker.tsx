'use client'

import React, { useState } from 'react'
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  isAfter,
  isBefore,
  eachDayOfInterval,
  parseISO
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CalendarPickerProps {
  startDate: string | null
  endDate: string | null
  periodLength?: number
  onChange: (start: string | null, end: string | null) => void
}

export function CalendarPicker({ startDate, endDate, periodLength = 1, onChange }: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(startDate ? parseISO(startDate) : new Date())
  const [hoverDate, setHoverDate] = useState<Date | null>(null)

  const handleDateClick = (day: Date) => {
    // If no start date, or we click before current start date: reset start and calculate end
    if (!startDate || isBefore(day, parseISO(startDate))) {
      const newStart = day
      const calculatedEnd = addDays(newStart, Math.max(1, periodLength) - 1)
      onChange(format(newStart, 'yyyy-MM-dd'), format(calculatedEnd, 'yyyy-MM-dd'))
      return
    }

    // If start date exists and we click after it: adjust the end date
    if (startDate && !isBefore(day, parseISO(startDate))) {
      onChange(startDate, format(day, 'yyyy-MM-dd'))
    }
  }

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  
  // Prevent logging dates in the future beyond today.
  const today = new Date()

  // Building the grid
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDateGrid = startOfWeek(monthStart)
  const endDateGrid = endOfWeek(monthEnd)

  const dateFormat = 'd'
  const rows = []
  
  let days = []
  let day = startDateGrid
  let formattedDate = ''

  const startD = startDate ? parseISO(startDate) : null
  const endD = endDate ? parseISO(endDate) : null

  // Calculate hovered range
  let hoverStart: Date | null = null
  let hoverEnd: Date | null = null

  if (hoverDate) {
    if (!startDate) {
      hoverStart = hoverDate
      hoverEnd = addDays(hoverDate, Math.max(1, periodLength) - 1)
    } else if (startDate && isAfter(hoverDate, parseISO(startDate))) {
      hoverStart = parseISO(startDate)
      hoverEnd = hoverDate
    } else if (startDate && isBefore(hoverDate, parseISO(startDate))) {
      hoverStart = hoverDate
      hoverEnd = addDays(hoverDate, Math.max(1, periodLength) - 1)
    }
  }

  const isDateHighlighted = (calendarDay: Date) => {
    // 1. Explicitly selected range
    if (startD && endD && !isBefore(calendarDay, startD) && !isAfter(calendarDay, endD)) {
      return true
    }
    // 2. Hover range preview
    if (hoverStart && hoverEnd && !isBefore(calendarDay, hoverStart) && !isAfter(calendarDay, hoverEnd)) {
      return true
    }
    return false
  }

  const isDateStart = (calendarDay: Date) => {
    if (startD && isSameDay(calendarDay, startD)) return true
    if (!startD && hoverStart && isSameDay(calendarDay, hoverStart)) return true
    return false
  }

  const isDateEnd = (calendarDay: Date) => {
    if (endD && isSameDay(calendarDay, endD)) return true
    if (!endD && hoverEnd && isSameDay(calendarDay, hoverEnd)) return true
    // Also if hover explicitly modifies end date
    if (startD && hoverEnd && isSameDay(calendarDay, hoverEnd)) return true
    return false
  }

  while (day <= endDateGrid) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat)
      const cloneDay = day
      const isCurrentMonth = isSameMonth(day, monthStart)
      const isFuture = isAfter(day, today)
      
      const highlighted = isDateHighlighted(day)
      const isStart = isDateStart(day)
      const isEnd = isDateEnd(day)

      let className = 'calendar-day'
      if (!isCurrentMonth) className += ' date-muted'
      if (isFuture) className += ' date-future'
      if (highlighted) className += ' date-highlighted'
      if (isStart) className += ' date-start'
      if (isEnd) className += ' date-end'

      days.push(
        <div
          key={day.toString()}
          className={className}
          onClick={() => {
            if (!isFuture) handleDateClick(cloneDay)
          }}
          onMouseEnter={() => {
            if (!isFuture) setHoverDate(cloneDay)
          }}
          onMouseLeave={() => setHoverDate(null)}
        >
          <span>{formattedDate}</span>
        </div>
      )
      day = addDays(day, 1)
    }
    rows.push(
      <div className="calendar-row" key={day.toString()}>
        {days}
      </div>
    )
    days = []
  }

  return (
    <div className="calendar-picker">
      <div className="calendar-header">
        <button type="button" onClick={prevMonth} className="btn-icon">
          <ChevronLeft size={18} />
        </button>
        <span className="calendar-month-year">{format(currentMonth, 'MMMM yyyy')}</span>
        <button type="button" onClick={nextMonth} className="btn-icon" disabled={isSameMonth(currentMonth, today)}>
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="calendar-weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="calendar-weekday">{d}</div>
        ))}
      </div>
      <div className="calendar-body">{rows}</div>
    </div>
  )
}

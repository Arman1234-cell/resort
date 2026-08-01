import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomCalendarProps {
  checkIn: string;
  checkOut: string;
  onChange: (checkIn: string, checkOut: string) => void;
  unavailableDates: string[];
}

export default function CustomCalendar({ checkIn, checkOut, onChange, unavailableDates }: CustomCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date(checkIn || Date.now());
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selecting, setSelecting] = useState<'checkIn' | 'checkOut'>('checkIn');

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    const now = new Date();
    const isCurrentMonth =
      currentMonth.getFullYear() === now.getFullYear() &&
      currentMonth.getMonth() === now.getMonth();
    if (!isCurrentMonth) {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    }
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const handleDateClick = (dateStr: string) => {
    if (unavailableDates.includes(dateStr)) return;

    if (selecting === 'checkIn') {
      onChange(dateStr, dateStr);
      setSelecting('checkOut');
    } else {
      if (dateStr <= checkIn) {
        onChange(dateStr, dateStr);
        setSelecting('checkOut');
      } else {
        // Validate no unavailable dates fall within the range
        let valid = true;
        let d = new Date(checkIn);
        const end = new Date(dateStr);
        while (d <= end) {
          const s = d.toISOString().split('T')[0];
          if (unavailableDates.includes(s)) {
            valid = false;
            break;
          }
          d.setDate(d.getDate() + 1);
        }

        if (valid) {
          onChange(checkIn, dateStr);
          setSelecting('checkIn');
        } else {
          alert('Cannot select range containing unavailable dates.');
          onChange(dateStr, dateStr);
          setSelecting('checkOut');
        }
      }
    }
  };

  const renderCalendar = () => {
    const days = [];
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = String(today.getMonth() + 1).padStart(2, '0');
    const todayDate = String(today.getDate()).padStart(2, '0');
    const todayStr = `${todayYear}-${todayMonth}-${todayDate}`;

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const isPast = dateStr < todayStr;
      const isUnavailable = unavailableDates.includes(dateStr);
      const isCheckIn = dateStr === checkIn;
      const isCheckOut = dateStr === checkOut;
      const isBetween = dateStr > checkIn && dateStr < checkOut;
      const disabled = isPast || isUnavailable;

      let bg = 'bg-neutral-900';
      let hover = 'hover:bg-neutral-800 cursor-pointer';

      if (disabled) {
        bg = isUnavailable
          ? 'bg-red-950/40 text-red-500/50 line-through'
          : 'bg-neutral-950/50 text-neutral-600';
        hover = 'cursor-not-allowed';
      } else if (isCheckIn || isCheckOut) {
        bg = 'bg-white text-black font-bold';
        hover = 'hover:bg-gray-200 cursor-pointer';
      } else if (isBetween) {
        bg = 'bg-neutral-800 text-white';
      }

      days.push(
        <button
          key={dateStr}
          type="button"
          disabled={disabled}
          onClick={() => handleDateClick(dateStr)}
          className={`w-8 h-8 rounded-xs text-xs flex items-center justify-center transition-colors ${bg} ${hover}`}
          title={isUnavailable ? 'Sold Out' : ''}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="bg-neutral-950 border border-neutral-900 p-4 rounded-xs select-none">
      <div className="flex justify-between items-center mb-4">
        <button type="button" onClick={prevMonth} className="p-1 hover:bg-neutral-900 rounded text-neutral-400">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-mono font-medium text-white tracking-widest uppercase">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button type="button" onClick={nextMonth} className="p-1 hover:bg-neutral-900 rounded text-neutral-400">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="w-8 text-center text-[10px] font-mono text-neutral-500">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {renderCalendar()}
      </div>

      <div className="mt-4 flex gap-4 text-[10px] font-mono text-neutral-500">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-950/40 border border-red-900/50 rounded-sm"></div> Sold Out
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-white rounded-sm"></div> Selected
        </div>
      </div>
    </div>
  );
}

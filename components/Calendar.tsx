import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface CalendarProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ currentDate, onDateSelect }) => {
  const [displayDate, setDisplayDate] = useState(currentDate);

  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  
  const startOfMonth = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1);
  const endOfMonth = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0);
  
  const startDate = new Date(startOfMonth);
  const dayOfWeek = startDate.getDay();
  // Adjust to Monday as the first day of the week (0=Sun, 1=Mon...)
  const diff = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
  startDate.setDate(startDate.getDate() - diff);
  
  const dates: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }

  const handlePrevMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  return (
    <div className="bg-gray-700/50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-600 transition"><ChevronLeftIcon /></button>
        <div className="font-bold text-lg">
          {displayDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </div>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-600 transition"><ChevronRightIcon /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-400 mb-2">
        {daysOfWeek.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {dates.map((date, index) => {
          const isCurrentMonth = date.getMonth() === displayDate.getMonth();
          const isSelected = isSameDay(date, currentDate);
          
          return (
            <button
              key={index}
              onClick={() => onDateSelect(date)}
              className={`
                p-2 rounded-full text-center text-sm transition
                ${isCurrentMonth ? 'text-white' : 'text-gray-500'}
                ${isSelected ? 'bg-emerald-500 font-bold' : 'hover:bg-gray-600'}
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;

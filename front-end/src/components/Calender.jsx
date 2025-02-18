import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from "date-fns";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start, end });

  return (
    <div className="flex flex-col bg-slate-50 p-4 rounded-xl">
      <div className="flex justify-between w-full mb-4">
        <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="text-gray-500">◀</button>
        <h2 className="text-lg font-semibold">{format(currentDate, "MMMM yyyy")}</h2>
        <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="text-gray-500">▶</button>
      </div>
      <div className="grid grid-cols-7 gap-5 text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="text-gray-400 font-medium">{day}</div>
        ))}
        {days.map((day) => (
          <div key={day} className="w-8 h-8 flex items-center justify-center text-gray-400 border rounded-md">
            {format(day, "d")}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;

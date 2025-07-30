import React from "react";
import { generateTimeSlots } from "../utils/timeUtils";
import type { Booking } from "../types";

interface CalendarProps {
  date: string;
  bookings: Booking[];
  onBookSlot: (time: string) => void;
  onDeleteBooking: (bookingId: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  date,
  bookings,
  onBookSlot,
  onDeleteBooking,
}) => {
  const timeSlots = generateTimeSlots();


  const getBookingForSlot = (time: string): Booking | undefined => {
    const slotTime = new Date(`${date}T${time}`);

    return bookings.find((booking) => {
      const bookingTime = new Date(`${booking.date}T${booking.time}`);
      const selectedDay = new Date(date).getDay();
      const bookingDay = new Date(booking.date).getDay();

      if (booking.callType === "follow-up") {
        if (booking.recurring) {
          return selectedDay === bookingDay && bookingTime.getTime() === slotTime.getTime();
        }
        return booking.date === date && booking.time === time;
      }

      if (booking.callType === "onboarding") {
        const diff = (slotTime.getTime() - bookingTime.getTime()) / (1000 * 60);
        if (booking.recurring) {
          return selectedDay === bookingDay && (diff === 0 || diff === 20);
        }
        return booking.date === date && (booking.time === time || diff === 20);
      }

      return false;
    });
  };



  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-semibold md:mb-2 text-center">
        Calendar - {date}
      </h2>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2 pt-5 md:pt-10">
        {timeSlots.map((time) => {
          const booking = getBookingForSlot(time);
          return (
            <div
              key={time}
              className={`flex items-center justify-between p-3 rounded border ${booking
                ? "bg-red-100 border-red-400"
                : "bg-green-50 border-green-300"
                }`}
            >
              <div>
                <span className="font-mono font-medium">{time}</span>
                {booking && (
                  <div className="text-sm text-gray-700">
                    <strong>{booking.clientName} ({booking.clientPhone})</strong> - {booking.callType}
                  </div>
                )}
              </div>
              <div>
                {booking ? (
                  <button
                    className="text-red-500 hover:underline text-sm"
                    onClick={() => onDeleteBooking(booking.id!)}
                  >
                    Delete
                  </button>
                ) : (
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    onClick={() => onBookSlot(time)}
                  >
                    Book
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;

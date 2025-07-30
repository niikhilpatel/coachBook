// src/components/TimeSlot.tsx
import React from "react";
import type { Booking } from "../types";

interface TimeSlotProps {
    time: string;
    date: string;
    booking?: Booking;
    onBookSlot: (time: string) => void;
    onDeleteBooking: (bookingId: string) => void;
}


const TimeSlot: React.FC<TimeSlotProps> = ({
    time,
    booking,
    onBookSlot,
    onDeleteBooking,
}) => {
    return (
        <div
            className={`flex items-center justify-between p-3 rounded border ${booking
                ? "bg-red-100 border-red-400"
                : "bg-green-50 border-green-300"
                }`}
        >
            <div>
                <span className="font-mono font-medium">{time}</span>
                {booking && (
                    <div className="text-sm text-gray-700">
                        <div>
                            <strong>{booking.clientName}</strong> - {booking.callType}
                        </div>
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
};

export default TimeSlot;

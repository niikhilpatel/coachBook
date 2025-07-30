import { db } from "./config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import type { Booking } from "../types";
import { isSameWeekday } from "../utils/date";

export const deleteBooking = async (id: string) => {
    await deleteDoc(doc(db, "bookings", id));
};

export const getBookingsForDate = async (selectedDate: string): Promise<Booking[]> => {
    const snapshot = await getDocs(collection(db, "bookings"));
    const allBookings = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
    })) as Booking[];

    const result = allBookings.filter(booking => {
        const selected = new Date(selectedDate);
        const bookingStart = new Date(booking.date);
        const bookingEnd = booking.endDate ? new Date(booking.endDate) : null;

        if (booking.callType === "onboarding") {
            return booking.date === selectedDate;
        }

        if (booking.callType === "follow-up") {
            if (booking.recurring) {
                return (
                    isSameWeekday(booking.date, selectedDate) &&
                    selected >= bookingStart &&
                    (!bookingEnd || selected <= bookingEnd)
                );
            } else {
                return booking.date === selectedDate;
            }
        }

        return false;
    });

    return result;
};

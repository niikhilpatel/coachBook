import type { Booking } from "../types";

const getMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};

const getDuration = (callType: "onboarding" | "follow-up"): number => {
    return callType === "onboarding" ? 40 : 20;
};

export const doesOverlap = (
    newTime: string,
    newType: "onboarding" | "follow-up",
    bookings: Booking[]
): boolean => {
    const newStart = getMinutes(newTime);
    const newEnd = newStart + getDuration(newType);

    return bookings.some((booking) => {
        const existingStart = getMinutes(booking.time);
        const existingEnd = existingStart + getDuration(booking.callType);

        // Overlap check
        return newStart < existingEnd && newEnd > existingStart;
    });
};

export const generateTimeSlots = () => {
    const slots = [];
    let hour = 10;
    let minute = 30;

    while (hour < 19 || (hour === 19 && minute <= 30)) {
        slots.push(
            `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        );

        minute += 20;

        if (minute >= 60) {
            hour += Math.floor(minute / 60);
            minute = minute % 60;
        }
    }

    return slots;
};

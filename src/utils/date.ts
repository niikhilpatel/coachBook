export const isSameWeekday = (baseDate: string, selectedDate: string): boolean => {
    const base = new Date(baseDate);
    const selected = new Date(selectedDate);
    return base.getDay() === selected.getDay();
};

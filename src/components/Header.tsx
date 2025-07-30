import React from "react";

interface HeaderProps {
    selectedDate: string;
    onDateChange: (newDate: string) => void;
    goToPreviousDay: () => void;
    goToNextDay: () => void;
}

const Header: React.FC<HeaderProps> = ({
    selectedDate,
    onDateChange,
    goToPreviousDay,
    goToNextDay,
}) => {
    return (
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
                <label className="font-medium">Select Date:</label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => onDateChange(e.target.value)}
                    className="border px-3 py-1 rounded"
                />
            </div>
            <div className="space-x-2">
                <button
                    onClick={goToPreviousDay}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                    ← Previous
                </button>
                <button
                    onClick={goToNextDay}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                    Next →
                </button>
            </div>
        </div>
    );
};

export default Header;

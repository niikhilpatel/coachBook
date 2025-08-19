import { useState, useEffect } from "react";
import Calendar from "../components/Calendar";
import { getBookingsForDate, deleteBooking } from "../firebase/bookings";
import BookingModal from "../components/BookingModal";
import { RiseLoader } from "react-spinners";
import type { Booking } from "../types";
import Logo from "../assests/logo.png";
import { FcCalendar } from "react-icons/fc";
import { FcBarChart } from "react-icons/fc";
import { IoIosPersonAdd } from "react-icons/io";

const Home = () => {
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        const today = new Date();
        return today.toISOString().split("T")[0]; // format: YYYY-MM-DD
    });
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    const goToPreviousDay = () => {
        const prev = new Date(selectedDate);
        prev.setDate(prev.getDate() - 1);
        setSelectedDate(prev.toISOString().split("T")[0]);
    };

    const goToNextDay = () => {
        const next = new Date(selectedDate);
        next.setDate(next.getDate() + 1);
        setSelectedDate(next.toISOString().split("T")[0]);
    };

    useEffect(() => {
        setLoading(true);
        getBookingsForDate(selectedDate)
            .then(setBookings)
            .finally(() => setLoading(false));
    }, [selectedDate]);

    const handleBookSlot = (time: string) => {
        setSelectedTime(time);
    };

    const handleDeleteBooking = async (id: string) => {
        await deleteBooking(id);
        setBookings((prev) => prev.filter((b) => b.id !== id));
    };

    const onboardingCount = bookings.filter((b) => b.callType === "onboarding").length;
    const followUpCount = bookings.filter((b) => b.callType === "follow-up").length;

    return (
        <div className="md:h-screen md:flex overflow-hidden shadow-2xl shadow-grey-800 rounded-lg">
            {/* Left Sidebar (30%) */}
            <div className="md:w-1/3 p-4 md:p-6 md:ml-4 md:my-4  rounded-lg shadow-orange-100 shadow-2xl bg-white space-y-6">
                <div className="flex items-center gap-3 mb-10">
                    <img src={Logo} alt="Health-Tick Logo" className="h-10 md:h-15 bg-black rounded-full  " />
                    <h2 className="text-lg md:text-3xl font-bold gradient-text ">CoachBook</h2>
                </div>
                <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2 "><FcCalendar size={28} /> Select Date</h2>

                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full outline-3 outline-offset-2 outline-orange-400 px-3 py-2 rounded-lg"
                />

                <div className="md:mt-6">
                    <h3 className="text-lg font-semibold md:mb-2 flex items-center gap-2"><FcBarChart size={28} /> Summary</h3>
                    <p className="font-bold text-lg text-gray-700">Total Bookings: <strong>{bookings.length}</strong></p>
                    <p className="text-md text-gray-700">Onboarding: <strong>{onboardingCount}</strong></p>
                    <p className="text-md text-gray-700">Follow-ups: <strong>{followUpCount}</strong></p>

                    {/* Booked Clients */}
                    {bookings.length > 0 && (
                        <div className="mt-1 md:mt-4">
                            <h4 className="text-md font-medium md:mb-2 flex items-center gap-2"><IoIosPersonAdd size={28} /> Clients:</h4>
                            <ul className="list-disc list-inside text-gray-700 space-y-1 max-h-40 overflow-auto pr-2">
                                {bookings.map((b, index) => (
                                    <li key={index} className="text-sm md:text-base">
                                        <strong>{b.clientName} ({b.clientPhone})</strong> – {b.callType} @ {b.time}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

            </div>

            {/* Right Panel */}
            <div className="md:w-2/3 p-4 md:p-6 md:m-4 rounded-lg flex flex-col shadow-teal-100 shadow-2xl bg-white">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                    <h2 className="text-xl text-md font-semibold mb-2 md:mb-0">Schedule for {selectedDate}</h2>
                    <div className="space-x-2">
                        <button
                            onClick={goToPreviousDay}
                            className="px-2 md:px-4 py-1 md:py-2 bg-gray-300 rounded hover:bg-gray-400"
                            disabled={loading}
                        >
                            ← Previous
                        </button>

                        <button
                            onClick={goToNextDay}
                            className="px-2 md:px-4 py-1 md:py-2 bg-gray-300 rounded hover:bg-gray-400"
                            disabled={loading}
                        >
                            Next →
                        </button>
                    </div>
                </div>

                {/* Scrollable Calendar */}
                {loading && (
                    <div className="text-center py-4 text-blue-600 font-semibold">
                        <RiseLoader color="#0086ff" />
                    </div>
                )}

                <div className="flex-1 overflow-y-auto rounded-lg shadow bg-white">
                    <Calendar
                        date={selectedDate}
                        bookings={bookings}
                        onBookSlot={handleBookSlot}
                        onDeleteBooking={handleDeleteBooking}
                    />
                </div>

                {/* Booking Modal */}
                {selectedTime && (
                    <BookingModal
                        date={selectedDate}
                        time={selectedTime}
                        bookings={bookings}
                        onClose={() => setSelectedTime(null)}
                        onBookingSuccess={(newBooking: Booking) =>
                            setBookings([...bookings, newBooking])
                        }
                    />
                )}
            </div>
        </div>

    );
};

export default Home;

import { useState, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/config";
import type { Booking } from "../types/index";
import type { BookingModalProps } from "../types/index";
import { doesOverlap } from "../utils/checkOverlap";
import { fetchClients, addClient } from "../data/clients";
import { query, where, getDocs } from "firebase/firestore";
import { RiseLoader } from "react-spinners";
import { deleteDoc, doc } from "firebase/firestore";


const BookingModal: React.FC<BookingModalProps> = ({
    date,
    time,
    bookings,
    onClose,
    onBookingSuccess,
}) => {
    const [clients, setClients] = useState<{ name: string; phone: string }[]>([]);
    const [client, setClient] = useState("");
    const [callType, setCallType] = useState<"onboarding" | "follow-up">("onboarding");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showAddClient, setShowAddClient] = useState(false);
    const [newClientName, setNewClientName] = useState("");
    const [newClientPhone, setNewClientPhone] = useState("");
    const [clientsLoading, setClientsLoading] = useState(true);
    const [confirmDeleteClient, setConfirmDeleteClient] = useState<{ name: string; phone: string } | null>(null);
    const [endDate, setEndDate] = useState<string>("");

    // Inside component:
    useEffect(() => {
        const loadClients = async () => {
            try {
                setClientsLoading(true);
                const data = await fetchClients();
                setClients(data);
            } catch (err) {
                console.error("Failed to fetch clients:", err);
            } finally {
                setClientsLoading(false);
            }
        };

        loadClients();
    }, []);


    const handleSubmit = async () => {
        if (!client) {
            setError("Please select a client");
            return;
        }

        if (doesOverlap(time, callType, bookings)) {
            setError("This time slot overlaps with another call.");
            return;
        }

        setLoading(true);
        setError("");

        const clientObj = clients.find((c) => c.name === client);

        if (!clientObj) {
            setError("Client not found.");
            setLoading(false);
            return;
        }

        const alreadyBooked = bookings.some(
            (b) => b.clientPhone === clientObj.phone && b.date === date
        );

        if (alreadyBooked) {
            setError("This client already has a booking on this date.");
            setLoading(false);
            return;
        }

        try {
            const bookingsRef = collection(db, "bookings");
            const q = query(
                bookingsRef,
                where("clientPhone", "==", clientObj.phone),
                where("date", "==", date)
            );

            const snapshot = await getDocs(q);

            const conflict = snapshot.docs.find((doc) => {
                const data = doc.data() as Booking;
                return data.time === time && data.callType === callType;
            });

            if (conflict) {
                setError("This client already has a booking at this time on this date or upcoming dates.");
                setLoading(false);
                return;
            }


            const newBooking: Booking = {
                clientName: clientObj!.name,
                clientPhone: clientObj!.phone,
                callType,
                date,
                time,
                recurring: callType === "follow-up",
                ...(callType === "follow-up" && endDate ? { endDate } : {})
            };




            const docRef = await addDoc(collection(db, "bookings"), newBooking);
            onBookingSuccess({ ...newBooking, id: docRef.id });
            onClose();
        } catch (err) {
            console.error("Booking failed:", err);
            setError("Failed to book call. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddClient = async () => {
        if (!newClientName || !newClientPhone) {
            alert("Both name and phone are required.");
            return;
        }

        const newClient = { name: newClientName, phone: newClientPhone };

        try {
            await addClient(newClient);
            const updatedClients = await fetchClients();
            setClients(updatedClients);
            setClient(newClientName);
            setNewClientName("");
            setNewClientPhone("");
            setShowAddClient(false);
        } catch (error) {
            alert("Failed to add client.");
            console.error(error);
        }
    };

    const handleDeleteClient = async (phone: string) => {


        try {
            await deleteDoc(doc(db, "clients", phone));
            const updatedClients = await fetchClients();
            setClients(updatedClients);
        } catch (error) {
            alert("Failed to delete client.");
            console.error(error);
        }
    };

    return (
        <>
            {/* Main Booking Modal */}
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white relative rounded-lg p-6 w-full max-w-4xl shadow-lg flex gap-6 border-5 border-purple-500 ml-6 m-4 md:m-0">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-red-600"
                    >
                        ×
                    </button>

                    <div className="flex flex-col md:flex-row">
                        {/* Left Panel */}
                        <div className="md:w-1/3 space-y-4 md:border-r-2 md:border-teal-500 pr-4">
                            <h2 className="text-xl font-bold">Book Call</h2>

                            <div>
                                <label className="block text-sm font-medium mb-1">Client</label>

                                {client ? (
                                    <div className="flex items-center justify-between px-3 py-2 border rounded bg-blue-50 mb-2">
                                        <span className="text-gray-800 font-medium">{client}</span>
                                        <button
                                            onClick={() => setClient("")}
                                            className="text-red-500 text-lg font-bold hover:text-red-700"
                                            aria-label="Clear selection"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Search client..."
                                            value={client}
                                            onChange={(e) => setClient(e.target.value)}
                                            className="w-full outline-2 outline-blue-500 px-3 py-2 rounded mb-2"
                                        />
                                        {clientsLoading ? (
                                            <div className="text-sm text-gray-500 italic">
                                                <RiseLoader color="#0086ff" />
                                            </div>
                                        ) : (
                                            <ul className="max-h-32 overflow-y-auto">
                                                {clients
                                                    .filter((c) =>
                                                        c.name.toLowerCase().includes(client.toLowerCase())
                                                    )
                                                    .map((c) => (
                                                        <li
                                                            key={c.phone}
                                                            className="flex justify-between items-center px-3 py-2 hover:bg-blue-100"
                                                        >
                                                            <span
                                                                className="cursor-pointer hover:underline"
                                                                onClick={() => setClient(c.name)}
                                                            >
                                                                {c.name} ({c.phone})
                                                            </span>
                                                            <button
                                                                onClick={() => setConfirmDeleteClient(c)}
                                                                className="text-red-600 hover:text-red-800 font-bold text-lg"
                                                            >
                                                                ×
                                                            </button>
                                                        </li>
                                                    ))}
                                            </ul>
                                        )}
                                    </>
                                )}

                                <div className="mt-2 text-right">
                                    <button
                                        className="text-sm text-blue-600 hover:bg-blue-400 outline-2 rounded bg-blue-600 text-white text-semibold py-1 px-1"
                                        onClick={() => setShowAddClient((prev) => !prev)}
                                    >
                                        {showAddClient ? "Cancel" : "Add New Client"}
                                    </button>
                                </div>

                                {/* Add New Client Form */}
                                {showAddClient && (
                                    <div className="mt-3 space-y-2">
                                        <input
                                            type="text"
                                            placeholder="Client Name"
                                            value={newClientName}
                                            onChange={(e) => setNewClientName(e.target.value)}
                                            className="w-full border px-3 py-2 rounded"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Client Phone"
                                            value={newClientPhone}
                                            onChange={(e) => setNewClientPhone(e.target.value)}
                                            className="w-full border px-3 py-2 rounded"
                                        />
                                        <button
                                            onClick={handleAddClient}
                                            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                                        >
                                            Add Client
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Call Type Selector */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Call Type</label>
                                <select
                                    value={callType}
                                    onChange={(e) =>
                                        setCallType(e.target.value as "onboarding" | "follow-up")
                                    }
                                    className="w-full outline-2 outline-blue-500 px-3 py-2 rounded"
                                >
                                    <option value="onboarding">
                                        Onboarding (40 min One-time only)
                                    </option>
                                    <option value="follow-up">
                                        Follow-up (20 min Weekly recurring)
                                    </option>
                                </select>
                            </div>

                            {/* Date Display */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Date(can't edit here)</label>
                                <input
                                    type="date"
                                    value={date}
                                    disabled
                                    className="w-full outline-2 outline-blue-500 px-3 py-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
                                />
                            </div>
                            
                            {/* Follow-up End Date */}
                            {callType === "follow-up" && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Follow-up End Date (Recurring)</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        min={date}
                                        className="w-full outline-2 outline-blue-500 px-3 py-2 rounded"
                                    />
                                </div>
                            )}

                            {/* Date Display */}

                            {error && <div className="text-red-500 text-sm">{error}</div>}

                            {/* Buttons */}
                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 w-full mr-2"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className={`px-4 py-2 w-full ml-2 rounded text-white ${loading || clientsLoading
                                        ? "bg-blue-300 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                        }`}
                                    disabled={loading || clientsLoading}
                                >
                                    {loading ? "Booking..." : clientsLoading ? "Loading..." : "Book"}
                                </button>
                            </div>
                        </div>

                        {/* Right Panel */}
                        <div className="md:w-2/3 pl-2 mt-4 md:mt-0 ">
                            <h3 className="text-xl font-bold mb-2">Time Slot Summary</h3>
                            <p className="text-gray-700 font-mono">
                                <strong>Time:</strong> {time}
                            </p>
                            <p className="text-gray-700 mt-2">
                                <strong>Date:</strong> {date}
                            </p>
                            <p className="text-gray-700 mt-2">
                                <strong>Client:</strong>{" "}
                                {client
                                    ? `${client} (${clients.find((c) => c.name === client)?.phone ?? "Phone not found"})`
                                    : "(Not selected)"}
                            </p>
                            {callType === "follow-up" && endDate && (
                                <p className="text-gray-700 mt-2">
                                    <strong>Follow-up Ends On:</strong> {endDate}
                                </p>
                            )}


                            <hr className="my-4 border-purple-300" />
                            <div className="text-sm text-gray-500">
                                This call will be booked for the above slot if it doesn't overlap with another.
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* Confirm Delete Modal */}
            {confirmDeleteClient && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800">Delete Client</h2>
                        <p className="text-gray-600">
                            Are you sure you want to delete{" "}
                            <strong>{confirmDeleteClient.name}</strong> (
                            {confirmDeleteClient.phone})?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmDeleteClient(null)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    await handleDeleteClient(confirmDeleteClient.phone);
                                    setConfirmDeleteClient(null);
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );


};

export default BookingModal;

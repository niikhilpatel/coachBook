export interface BookingModalProps {
  date: string;
  time: string;
  bookings: Booking[];
  onClose: () => void;
  onBookingSuccess: (newBooking: Booking) => void;
}

export type CallType = "onboarding" | "follow-up";

export interface Client {
    id: string;
    name: string;
    phone: string;
}

export interface Booking {
    id?: string;
    clientId?: string;
    clientName: string;
    clientPhone: string;
    callType: CallType;
    time: string;
    date: string;
    recurring?: boolean;
}



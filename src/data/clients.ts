import { db } from "../firebase/config";
import {
    collection,
    getDocs,
    addDoc,
    type CollectionReference,
} from "firebase/firestore";

export interface Client {
    name: string;
    phone: string;
}

const clientsRef = collection(db, "clients") as CollectionReference<Client>;

export const fetchClients = async (): Promise<{ name: string; phone: string }[]> => {
    const snapshot = await getDocs(clientsRef);
    return snapshot.docs.map((doc) => doc.data() as { name: string; phone: string });
};

// Add a new client
export const addClient = async (client: Client): Promise<void> => {
    await addDoc(clientsRef, client);
};

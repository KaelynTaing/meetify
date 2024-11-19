import { app }  from "./app"
import { getFirestore, collection, getDocs } from "firebase/firestore";


const db = getFirestore(app)

export async function getAllEvents() {
    return await getDocs(collection(db, "events"))
}
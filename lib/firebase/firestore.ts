import { app }  from "./app"
import { getFirestore, collection, getDoc,  getDocs, setDoc, doc, updateDoc } from "firebase/firestore";

interface User {
    name: string
    times?: []
}

export interface Event {
    calendarDays: string[]
    eventName: string
    users: User[]
}


const db = getFirestore(app)

export async function getAllEvents() {
    return await getDocs(collection(db, "events"))
}

export async function addEvent(id: string, eventName: string, userName: string, dates: Date[]){
    const stringDates = dates.map(date => date.toDateString())
    const data: Event = {

    calendarDays: stringDates,
    eventName: eventName,
    users: [{
        name: userName,
        times: []
    }]

    }
    await setDoc(doc(db, "events", id), data)

}

export async function fetchEvent(id: string): Promise<Event> {
    const docRef = doc(db, "events", id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()){
        return docSnap.data() as Event
    }

    else{
        throw new Error("No Document Found")
    }
}

export async function addUser(id: string, user: string, dataRef: Event) {
    const docRef = doc(db, "events", id)
    const usersTemp: User[] = []

    dataRef.users.forEach((user) => {
        usersTemp.push(user)
    })
    usersTemp.push({
        name: user,
        times: []
    })
    await updateDoc(docRef, {
        users: usersTemp
    }
    )
}

export async function updateTimes(id: string, times: string[], dataRef: Event){

}


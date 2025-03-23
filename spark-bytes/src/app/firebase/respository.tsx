import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, collection, addDoc, getDocs, where, query } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { auth } from "@/app/firebase/config";
import LocalEvent from "../classes/LocalEvent";

export async function fetchUserData(user: any) {
    // Retrieves all data for a given user from Firestore
    // doc.uid is the unique identifier for the user
    // doc.email is the email of the user
    // doc.first_name is the first name of the user
    // doc.last_name is the last name of the user
    // doc.phone is the phone number of the user
    // doc.staff is a boolean indicating if the user is a staff member
    // doc.phone_notification is a boolean indicating if the user wants phone notifications
    // doc.email_notification is a boolean indicating if the user wants email notifications

  if (!user) return null;
  if (!user.uid) return null;
  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      console.log("User data:", userDoc.data());
      return userDoc.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (err) {
    console.error("Error fetching user data:", err);
    return null;
  }
}

export async function createEvent(event: LocalEvent) {
    // Creates a new event in Firestore

    try {
        const eventRef = await addDoc(collection(db, "events"), {
            user: event.user,
            title: event.title,
            description: event.description,
            start: event.start,
            end: event.end,
            location: event.location,
            organizer: event.organizer,
            food_provider: event.food_provider,
            food_type: event.food_type,
            createdAt: event.createdAt,
        });

        console.log("Event created with ID: ", eventRef.id);

        // return local event object
        event.id = eventRef.id;
        return event;
    }
    catch (err) {
        console.error("Error creating event: ", err);
        return null;
    }
}

/**
 * EXAMPLE CALL TO CRAETE NEW EVENT
 * async function createNewEvent() {
    var event: LocalEvent = {
      description: "Test Event",
      end: new Date(),
      food_provider: ["Test Food Provider"],
      food_type: ["Test Food Type"],
      location: "Test Location",
      organizer: "Test Organizer",
      start: new Date(),
      title: "Test Event",
      user: user?.uid || "",
      createdAt: new Date(),
    };
    const title = "Test Event";
    const description = "This is a test event";
    const start = new Date();
    const end = new Date();
    const location = "Test Location";
    const organizer = "Test Organizer";
    const food_provider = ["Test Food Provider"];
    const food_type = ["Test Food Type"];
    const userId = user;

    if (!userId) {
      console.error("User ID is not available");
      return;
    }

    createEvent(event);
  };
 */

export async function fetchEvents() {
    // Fetches all events from Firestore and returns them as an array of LocalEvent objects
    try {
        const eventsCollection = collection(db, "events");
        const events = await getDocs(eventsCollection);
        const eventsList: LocalEvent[] = [];
        events.forEach((doc) => {
            const event = doc.data() as LocalEvent;
            event.id = doc.id;
            eventsList.push(event);
        });
        console.log("Events: ", eventsList);
        return eventsList;
    } catch (err) {
        console.error("Error fetching events: ", err);
        return null;
    }
}


export async function fetchUserIdEvents(userId: string) {
    // Fetches all events for a specific user from Firestore and returns them as an array of LocalEvent objects
    try {
        const eventsQuery = query(collection(db, "events"), where("user", "==", userId));
        const events = await getDocs(eventsQuery);
        const eventsList: LocalEvent[] = [];
        events.forEach((doc) => {
            const event = doc.data() as LocalEvent;
            event.id = doc.id;
            eventsList.push(event);
        });
        console.log("Events: ", eventsList);
        return eventsList;
    } catch (err) {
        console.error("Error fetching events: ", err);
        return null;
    }
}
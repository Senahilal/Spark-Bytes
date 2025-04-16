import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, updateDoc, collection, addDoc, getDocs, where, query, deleteDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "@/app/firebase/config";
import LocalEvent from "../classes/LocalEvent";
/** 
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
*/


export async function fetchUserData(userId: string) {
  // Retrieves all data for a given user from Firestore
  // doc.uid is the unique identifier for the user
  // doc.email is the email of the user
  // doc.first_name is the first name of the user
  // doc.last_name is the last name of the user
  // doc.phone is the phone number of the user
  // doc.phone_notification is a boolean indicating if the user wants phone notifications
  // doc.email_notification is a boolean indicating if the user wants email notifications
  // doc.organizer is a boolean indicating if the user is an organizer
  // doc.admin is a boolean indicating if the user is an admin

  try {
    const userDoc = await getDoc(doc(db, "users", userId));
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
      date: event.date,
      start: event.start,
      end: event.end,
      area: event.area,
      location: event.location,
      food_provider: event.food_provider,
      food_type: event.food_type,
      created_at: new Date(),
      last_updated_by: event.user,
      last_updated_at: new Date(),
      followers: event.followers,
      reminder_sent: false,
      imageURL: event.imageUrl ? event.imageUrl : "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/104.png", //Default BU logo with Rhett if no url is provided
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

  async function createNewEvent() {

    // make sure user is logged in
    // const [user, loading, error] = useAuthState(auth);
    // Create a new event object
    // Ensure that the event object matches the LocalEvent interface
    var event: LocalEvent = {
      description: "Test Event",
      end: new Date(),
      food_provider: ["Test Food Provider"],
      food_type: ["Test Food Type"],
      area: "Test Area", //Should be one of the specific areas in the app
      location: "Test Location",
      date: new Date(),
      start: new Date(),
      title: "Test Event",
      user: user?.uid || "",
      created_at: new Date(),
      followers: [user?.uid || ""],
      last_updated_by: user?.uid || "",
    };

    createEvent(event);
  };

  createNewEvent();
 */

// export async function fetchEvents() {
//   // Fetches all events from Firestore and returns them as an array of LocalEvent objects
//   try {
//     const eventsCollection = collection(db, "events");
//     const events = await getDocs(eventsCollection);
//     const eventsList: LocalEvent[] = [];
//     events.forEach((doc) => {
//       const event = doc.data() as LocalEvent;
//       event.id = doc.id;
//       eventsList.push(event);
//     });
//     console.log("Events: ", eventsList);
//     return eventsList;
//   } catch (err) {
//     console.error("Error fetching events: ", err);
//     return null;
//   }
// }


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

export async function updateUserData(user: any, updatedData: any) {
  if (!user || !user.uid) return;

  try {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, updatedData);
    console.log("User data updated.");
  } catch (err) {
    console.error("Error updating user data:", err);
  }
}

export async function fetchAllEvents() {
  try {
    const eventsCollection = collection(db, "events");
    const snapshot = await getDocs(eventsCollection);

    const eventsList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log("Events:", eventsList);
    return eventsList;
  } catch (err) {
    console.error("Error fetching events:", err);
    return null;
  }
}


// export async function fetchEvents(
//   date?: string,
//   location?: string,
//   foodType?: string
// ) {
//   try {
//     const eventsRef = collection(db, "events");

//     // No filters selected → fetch all events
//     if (!date && !location && !foodType) {
//       return fetchAllEvents()
//     }

//     // Apply filters if selected
//     const filters = [];
//     if (date) filters.push(where("date", "==", date));
//     if (location) filters.push(where("location", "==", location));
//     if (foodType) filters.push(where("foodType", "==", foodType));

//     const filteredQuery = query(eventsRef, ...filters);
//     const snapshot = await getDocs(filteredQuery);
//     return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//   } catch (error) {
//     console.error("Error fetching events with filters:", error);
//     return [];
//   }
// }

export async function deleteEvent(eventId: string) {
  // takes an event Id and deletes that specific event from Firestore
  try {
    const eventRef = doc(db, "events", eventId);
    await deleteDoc(eventRef);

    console.log("Event deleted with ID: ", eventId);
  } catch (err) {
    console.error("Error deleting event: ", err);
  }
}

// today's events - components/todaysEvents.tsx
export async function fetchTodaysEvents() {
  try {
    const today = new Date();
    today.setHours(0, 0);
    
    const endOfToday = new Date();
    endOfToday.setHours(23, 59);
    
    const startTimestamp = Timestamp.fromDate(today);
    const endTimestamp = Timestamp.fromDate(endOfToday);
    
    const eventsRef = collection(db, "events");
    const q = query(
      eventsRef,
      where('start', '>=', startTimestamp),
      where('start', '<=', endTimestamp)
    );
    
    const snapshot = await getDocs(q);
    const eventsList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log("Today's Events:", eventsList);
    return eventsList;
  } catch (err) {
    console.error("Error fetching today's events:", err);
    return null;
  }
}
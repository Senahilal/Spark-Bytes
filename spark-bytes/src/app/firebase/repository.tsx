import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, updateDoc, collection, addDoc, getDocs, where, query } from "firebase/firestore";
import { db, auth } from "@/app/firebase/config";

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
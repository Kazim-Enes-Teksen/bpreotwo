import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const saveData = async (description, correctAnswer) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated");
  }

  try {
    const docRef = await addDoc(collection(db, "questions"), {
      description,
      correctAnswer,
      userId: user.uid, // Ensure the user ID is added for permission checks
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

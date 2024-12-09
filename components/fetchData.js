import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const fetchQuestions = async () => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("User is not logged in");
    }

    // Reference to the 'questions' collection, with a filter for the current user's ID
    const questionsQuery = query(
      collection(db, "questions"),
      where("userId", "==", currentUser.uid)
    );

    // Fetch the documents based on the query
    const querySnapshot = await getDocs(questionsQuery);

    // Map each document to a question object
    const questions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    return questions;
  } catch (error) {
    console.error("Error fetching questions: ", error);
    throw error;
  }
};

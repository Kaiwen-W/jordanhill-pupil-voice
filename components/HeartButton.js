import { auth } from "@/lib/firebase";
import { useDocument } from "react-firebase-hooks/firestore";
import { increment, writeBatch, doc, getFirestore } from "firebase/firestore";

// Allows user to heart or like a post
export default function HeartButton({ postRef }) {
  // Listen to heart document for currently logged in user
  const heartRef = doc(
    getFirestore(),
    postRef.path,
    "hearts",
    auth.currentUser.uid
  );
  const [heartDoc] = useDocument(heartRef);

  // Create a user-to-post relationship
  const addHeart = async () => {
    const uid = auth.currentUser.uid;
    const batch = writeBatch(getFirestore());

    batch.update(postRef, { heartCount: increment(1) });
    batch.set(heartRef, { uid });

    await batch.commit();
  };

  // Remove a user-to-post relationship
  const removeHeart = async () => {
    const batch = writeBatch(getFirestore());

    batch.update(postRef, { heartCount: increment(-1) });
    batch.delete(heartRef);

    await batch.commit();
  };

  return heartDoc?.exists() ? (
    <button
      className="flex mt-2 justify-center rounded-md bg-blue-300 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-400"
      onClick={removeHeart}
    >
      💔 Unheart
    </button>
  ) : (
    <button
      className="flex mt-2 justify-center rounded-md bg-pink-300 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-400"
      onClick={addHeart}
    >
      💗 Heart
    </button>
  );
}

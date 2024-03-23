import AuthCheck from "@/components/AuthCheck";
import PostFeed from "@/components/PostFeed";
import { UserContext } from "@/lib/context";
import { auth } from "@/lib/firebase";
import {
  serverTimestamp,
  query,
  collection,
  orderBy,
  getFirestore,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useCollection } from "react-firebase-hooks/firestore";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";
import GlowingBlob from "@/components/GlowingBlob";

export default function AdminPostsPage(props) {
  // const { username } = useContext(UserContext);

  // const [house, setHouse] = useState("");

  // async function getUserDoc() {
  //   const docRef = doc(getFirestore(), "usernames", username);
  //   const docSnap = await getDoc(docRef);
  //   const userDoc = docSnap.data();
  //   return userDoc;
  // }

  // useEffect(() => {
  //   const userDoc = getUserDoc();
  //   const userHouse = userDoc.house;
  //   setHouse(userHouse);
  // }, [setHouse]);

  // const houseStyle = house + "-blob";
  // console.log(house);

  const houseStyles = [
    "crawfurd-blob",
    "montgomerie-blob",
    "smith-blob",
    "stjohn-blob",
  ];
  const houseStyle =
    houseStyles[Math.floor(houseStyles.length * Math.random())];

  return (
    <main>
      <AuthCheck>
        <GlowingBlob style={houseStyle} />
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const ref = collection(
    getFirestore(),
    "users",
    auth.currentUser.uid,
    "posts"
  );
  const postQuery = query(ref, orderBy("createdAt"));

  const [querySnapshot] = useCollection(postQuery);

  const posts = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <button onClick={() => router.back()} className="text-white p-6">
        ← Go back
      </button>
      <div className="flex items-center flex-col">
        <h1 className="text-white text-5xl">Manage your Posts</h1>
        <PostFeed posts={posts} admin />
      </div>
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  // Create a new post in firestore
  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = doc(getFirestore(), "users", uid, "posts", slug);

    const docRef = doc(getFirestore(), "usernames", username);
    const docSnap = await getDoc(docRef);
    const userDoc = docSnap.data();

    const data = {
      title,
      slug,
      uid,
      username,
      house: userDoc.house,
      published: false,
      content: "Add your content here!",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await setDoc(ref, data);

    toast.success("Post created!");

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`);
  };

  return (
    <div className="items-center flex flex-col">
      <div
        className="h-2/5 w-10/12
                  bg-gray-800/30 border border-gray-900   
                  my-6 p-8 rounded-lg border-solid 
                  shadow-md z-1
                  backdrop-blur-[100px]
                  text-white"
      >
        <form onSubmit={createPost} className="flex justify-evenly">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post Title"
            className="bg-gray-800/30 block h-16 w-1/3 my-3 rounded-md border-0 py-1.5 pl-1 text-white shadow-sm ring-1 ring-inset ring-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
          />
          <button
            type="submit"
            disabled={!isValid}
            className="text-white my-3 bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-1 text-center inline-flex items-center"
          >
            Create New Post
          </button>
        </form>
      </div>
    </div>
  );
}

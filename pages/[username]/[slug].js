import PostContent from "@/components/PostContent";
import CommentList from "@/components/CommentList";
import { commentToJSON, getUserWithUsername, postToJSON } from "@/lib/firebase";
import {
  doc,
  getDocs,
  getDoc,
  collectionGroup,
  query,
  limit,
  getFirestore,
  serverTimestamp,
  setDoc,
  orderBy,
  where,
  collection,
} from "firebase/firestore";

import { auth } from "@/lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import GlowingBlob from "@/components/GlowingBlob";
import AuthCheck from "@/components/AuthCheck";
import HeartButton from "@/components/HeartButton";
import Link from "next/link";
import { useContext, useState } from "react";
import { UserContext } from "@/lib/context";
import toast from "react-hot-toast";

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;
  let comments;

  if (userDoc) {
    const postRef = doc(getFirestore(), userDoc.ref.path, "posts", slug);

    post = postToJSON(await getDoc(postRef));

    path = postRef.path;

    const commentsRef = collection(
      getFirestore(),
      userDoc.ref.path,
      "posts",
      slug,
      "comments"
    );
    const commentsQuery = query(
      commentsRef
      // orderBy("createdAt", "asc"),
      // where("path", "==", path)
      // limit(LIMIT)
    );

    comments = (await getDocs(commentsQuery)).docs.map(commentToJSON);

    console.log(comments);
  }

  return {
    props: { post, path, comments },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  const q = query(collectionGroup(getFirestore(), "posts"), limit(20));
  const snapshot = await getDocs(q);

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
}

export default function Post(props) {
  const router = useRouter();

  const postRef = doc(getFirestore(), props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;
  const { user: currentUser } = useContext(UserContext);

  const comments = props.comments;

  const blobStyle = post.house + "-blob";
  return (
    <main>
      <GlowingBlob houseStyle={blobStyle} />

      <button onClick={() => router.back()} className="text-white pl-6 pt-6">
        ← Go back
      </button>

      <div className="flex">
        <PostContent post={post} />

        <div
          className="h-3/5 w-1/5
                    bg-gray-800/30 border border-gray-900   
                    my-6 p-8 rounded-lg border-solid 
                    shadow-md z-1
                    backdrop-blur-[100px]
                    text-white
                    ml-[5%]
                    flex justify-center items-center flex-col"
        >
          <p>
            <strong>{post.heartCount || 0} 🤍</strong>
          </p>

          <AuthCheck
            fallback={
              <Link href="/enter">
                <button className="flex mt-5 justify-center rounded-md bg-gray-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-800">
                  💗 Sign Up
                </button>
              </Link>
            }
          >
            <HeartButton postRef={postRef} />
          </AuthCheck>

          {currentUser?.uid === post.uid && (
            <Link href={`/admin/${post.slug}`}>
              <button className="flex mt-5 justify-center rounded-md bg-gray-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-800">
                Edit Post
              </button>
            </Link>
          )}
        </div>
      </div>

      <AuthCheck>
        <CreateNewComment props={props} />
      </AuthCheck>

      <CommentList comments={comments} />
    </main>
  );
}

function CreateNewComment({ props }) {
  const [content, setContent] = useState("");
  const postRef = doc(getFirestore(), props.path);

  const isValid = content.length > 2;

  function makeId(length) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  // Create a new post in firestore
  const createComment = async (e) => {
    const id = makeId(100);

    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = doc(getFirestore(), postRef.path, "comments", id);

    const data = {
      uid,
      content,
      createdAt: serverTimestamp(),
    };

    await setDoc(ref, data);

    toast.success("Comment made!");
    document.getElementById("input").value = "";
  };

  return (
    <div className="">
      <h1 className="font-bold text-2xl mb-3 text-white">Comments</h1>

      <form
        onSubmit={createComment}
        className="w-8/9
        bg-gray-800/30 border border-gray-900   
        p-4 rounded-lg border-solid 
        shadow-md z-1
        backdrop-blur-[100px]
        text-white
        mx-[2%]
        mb-8 
        flex justify-around"
      >
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Comment"
          className="bg-gray-800/30 block h-12 w-1/3 my-3 rounded-md border-0 py-1.5 pl-1 text-white shadow-sm ring-1 ring-inset ring-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
          id="input"
        />
        <button
          type="submit"
          disabled={!isValid}
          className="text-white my-3 bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-1 text-center inline-flex items-center"
        >
          Comment
        </button>
      </form>
    </div>
  );
}

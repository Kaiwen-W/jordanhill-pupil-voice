import PostContent from "@/components/PostContent";
import { getUserWithUsername, postToJSON } from "@/lib/firebase";
import {
  doc,
  getDocs,
  getDoc,
  collectionGroup,
  query,
  limit,
  getFirestore,
} from "firebase/firestore";

import { useDocumentData } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import GlowingBlob from "@/components/GlowingBlob";
import AuthCheck from "@/components/AuthCheck";
import HeartButton from "@/components/HeartButton";
import Link from "next/link";
import { useContext, useEffect } from "react";
import { UserContext } from "@/lib/context";

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = doc(getFirestore(), userDoc.ref.path, "posts", slug);

    post = postToJSON(await getDoc(postRef));

    path = postRef.path;
  }

  return {
    props: { post, path },
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
  useEffect(() => {
    document.body.style.overflow = "hidden";
  });

  const router = useRouter();

  const postRef = doc(getFirestore(), props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;
  const { user: currentUser } = useContext(UserContext);

  const blobStyle = post.house + "-blob";
  return (
    <main>
      <GlowingBlob style={blobStyle} />

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
    </main>
  );
}

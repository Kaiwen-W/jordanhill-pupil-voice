import GlowingBlob from "@/components/GlowingBlob";
import SideBar from "@/components/SideBar";

import React from "react";
import PostFeed from "@/components/PostFeed";
import Loader from "@/components/Loader";
import { postToJSON } from "@/lib/firebase";
import {
  Timestamp,
  query,
  where,
  orderBy,
  limit,
  collectionGroup,
  getDocs,
  startAfter,
  getFirestore,
} from "firebase/firestore";

import { useState } from "react";

// Max post to query per page
const LIMIT = 4;

export async function getServerSideProps(context) {
  const ref = collectionGroup(getFirestore(), "posts");
  const postsQuery = query(
    ref,
    where("published", "==", true),
    where("house", "==", "montgomerie"),
    where("category", "==", "academia"),
    orderBy("createdAt", "desc"),
    limit(LIMIT)
  );

  const posts = (await getDocs(postsQuery)).docs.map(postToJSON);

  return {
    props: { posts }, // will be passed to the page component as props
  };
}

export default function MontgomeriePosts(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

  // Get next page in pagination query
  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor =
      typeof last.createdAt === "number"
        ? Timestamp.fromMillis(last.createdAt)
        : last.createdAt;

    const ref = collectionGroup(getFirestore(), "posts");
    const postsQuery = query(
      ref,
      where("published", "==", true),
      where("house", "==", "montgomerie"),
      where("category", "==", "academia"),
      orderBy("createdAt", "desc"),
      startAfter(cursor),
      limit(LIMIT)
    );

    const newPosts = (await getDocs(postsQuery)).docs.map((doc) => doc.data());

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };
  return (
    <>
      <GlowingBlob houseStyle={"montgomerie-blob"} />
      <SideBar house={"mo-sidebar sidebar-icon group"} />

      <div className="ml-16">
        <div className="flex items-center justify-center flex-col">
          <PostFeed posts={posts} />

          {!loading && !postsEnd && (
            <button
              onClick={getMorePosts}
              className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2  inline-flex items-center"
            >
              Load more
            </button>
          )}

          <Loader show={loading} />

          {postsEnd && (
            <button
              disabled
              className="text-white bg-gray-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2  inline-flex items-center"
            >
              You have reached the end!
            </button>
          )}
        </div>
      </div>
    </>
  );
}

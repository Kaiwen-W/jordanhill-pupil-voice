import { getUserWithUsername, postToJSON } from "@/lib/firebase";
import {
  query,
  collection,
  where,
  getDocs,
  limit,
  orderBy,
  getFirestore,
} from "firebase/firestore";

import PostFeed from "@/components/PostFeed";
import UserProfile from "@/components/UserProfile";
import React from "react";
import GlowingBlob from "@/components/GlowingBlob";

export async function getServerSideProps({ query: urlQuery }) {
  const { username } = urlQuery;

  const userDoc = await getUserWithUsername(username);

  // If no user, short circuit to 404 page
  //   if (!userDoc) {
  //     return {
  //       notFound: true,
  //     };
  //   }

  // JSON serializable data
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();

    const postsQuery = query(
      collection(getFirestore(), userDoc.ref.path, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    posts = (await getDocs(postsQuery)).docs.map(postToJSON);
  }

  return {
    props: { user, posts },
  };
}

const UserProfilePage = ({ user, posts }) => {
  const houseBlob = user.house + "-blob";
  console.log(houseBlob);

  return (
    <main>
      <GlowingBlob style={houseBlob} />
      <UserProfile user={user} />

      <div className="flex justify-center items-center flex-col">
        <PostFeed posts={posts} />
      </div>
    </main>
  );
};

export default UserProfilePage;

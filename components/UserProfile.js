import React from "react";

const UserProfile = ({ user }) => {
  return (
    <div
      className="bg-gray-800/30 border border-gray-900   
        mx-0 my-6 p-8 rounded-lg border-solid 
        shadow-md z-1
        backdrop-blur-[100px]
        flex items-center justify-center flex-col
        "
    >
      <img
        src={user.photoURL || "/jordanhill.jpeg"}
        className="w-30 rounded-full"
      />
      <p className="text-gray-400 pt-1">
        <i>@{user.username}</i>
      </p>
      <h1 className="text-5xl pt-4 text-white">{user.displayName}</h1>
    </div>
  );
};

export default UserProfile;

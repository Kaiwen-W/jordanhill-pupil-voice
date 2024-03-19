import GlowingBlob from "@/components/GlowingBlob";
import { useContext, useState, useCallback, useEffect } from "react";
import { UserContext } from "@/lib/context";
import debounce from "lodash.debounce";

import { auth, googleAuthProvider } from "@/lib/firebase";
import { doc, writeBatch, getDoc, getFirestore } from "firebase/firestore";
import { signInWithPopup, signOut } from "firebase/auth";
import Link from "next/link";

const enter = () => {
  const { user, username } = useContext(UserContext);

  // random house colour for blob background
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
      {user ? (
        !username ? (
          // if user doesn't have username
          <>
            <GlowingBlob style={houseStyle} />
            <UsernameForm />
            <GoHome />
          </>
        ) : (
          // if user has username
          <>
            <GlowingBlob style={houseStyle} />
            <SignOutButton />
            <GoHome />
          </>
        )
      ) : (
        // no user or username
        <>
          <GlowingBlob style={houseStyle} />
          <SignInButton />
          <GoHome />
        </>
      )}
    </main>
  );
};
export default enter;

function GoHome() {
  return (
    <div className="top-5 fixed ml-3">
      <Link href="/" className="text-sm font-semibold leading-6 text-gray-300">
        <span aria-hidden="true"> ← </span>
        Go Home
      </Link>
    </div>
  );
}

function SignInButton() {
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuthProvider);
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className="bg-gray-800/30 border border-gray-900   
      mx-0 my-6 p-8 rounded-lg border-solid 
      shadow-md z-1
      backdrop-blur-[100px] mt-[300px]
      justify-center items-center
      "
      >
        <button
          className="flex w-full justify-center rounded-md text-white p-4"
          onClick={signInWithGoogle}
        >
          <img src={"/google.png"} className="w-10 mr-3" />
          <span className="pt-[6px]"> Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}

function SignOutButton() {
  return (
    <div className="flex justify-center items-center">
      <div
        className="bg-gray-800/30 border border-gray-900   
                    mx-0 my-6 p-8 rounded-lg border-solid 
                    shadow-md z-1
                    backdrop-blur-[100px] mt-[300px]
                    justify-center items-center
                  "
      >
        <div>
          <button
            className="flex w-full justify-center rounded-md text-white p-4"
            onClick={() => signOut(auth)}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [house, setHouse] = useState("");

  const [isValid, setIsValid] = useState(false);
  const [isHouseValid, setIsHouseValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = doc(getFirestore(), "users", user.uid);
    const usernameDoc = doc(getFirestore(), "usernames", formValue);

    // Commit both docs together as a batch write.
    const batch = writeBatch(getFirestore());
    batch.set(userDoc, {
      username: formValue,
      house: house,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  const onChange = (event) => {
    // Force form value typed in form to match correct format
    const val = event.target.value.toLowerCase();
    const regex = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (regex.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  //

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = doc(getFirestore(), "usernames", username);
        const snap = await getDoc(ref);
        console.log("Firestore read executed!", snap.exists());
        setIsValid(!snap.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  const onChangeHouse = (event) => {
    const house = event.target.value;
    setHouse(house);
    setIsHouseValid(true);
  };

  return (
    !username && (
      <div className="flex justify-center items-center">
        <div
          className="bg-gray-800/30 border border-gray-900   
                    mx-0 my-6 p-8 rounded-lg border-solid 
                    shadow-md z-1
                    backdrop-blur-[100px] mt-[250px]
                    w-10/12 h-72
                    justify-center items-center
                  "
        >
          <h1 className="text-white text-4xl justify-center flex">
            All Inputs in the Form are Final
          </h1>

          <div className="flex justify-between">
            <h3 className="text-white text-2xl">Choose Username</h3>
            <h3 className="text-white text-2xl float-right">Choose House</h3>
          </div>

          <form onSubmit={onSubmit} className="">
            <div className="flex justify-between">
              <input
                className="bg-gray-800/30 block h-10 w-1/3 my-3 rounded-md border-0 py-1.5 pl-1 text-white shadow-sm ring-1 ring-inset ring-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                name="username"
                placeholder=" Enter Name"
                value={formValue}
                onChange={onChange}
              />

              <select
                className="bg-gray-800/30 block h-10 w-1/3 mt-3 rounded-md border-0 py-1.5 pl-1 text-white shadow-sm ring-1 ring-inset ring-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                name="house"
                onChange={onChangeHouse}
              >
                <option value="" selected disabled hidden>
                  Choose House
                </option>
                <option value="montgomerie">Montgomerie</option>
                <option value="crawfurd">Crawfurd</option>
                <option value="stjohn">St John</option>
                <option value="smith">Smith</option>
              </select>
            </div>

            <UsernameMessage
              username={formValue}
              isValid={isValid}
              loading={loading}
            />

            <button
              type="submit"
              className="flex w-full justify-center mt-12 rounded-md bg-gray-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={!isHouseValid || !isValid}
            >
              Choose
            </button>
          </form>
        </div>
      </div>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p className="text-white">Checking...</p>;
  } else if (isValid) {
    return <p className="text-green-600">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-red-600">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}

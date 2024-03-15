import GlowingBlob from "@/components/GlowingBlob";
import { useContext, useState, useCallback, useEffect } from "react";
import { UserContext } from "@/lib/context";
import debounce from "lodash.debounce";

import { auth, googleAuthProvider } from "@/lib/firebase";
import { doc, writeBatch, getDoc, getFirestore } from "firebase/firestore";
import { signInWithPopup, signOut } from "firebase/auth";

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
          <UsernameForm />
        ) : (
          // if user has username
          <SignOutButton />
        )
      ) : (
        // no user or username
        <>
          <GlowingBlob style={houseStyle} />
          <SignInButton />
        </>
      )}
    </main>
  );
};
export default enter;

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

// Sign out button
function SignOutButton() {
  return (
    <div className="bg-white">
      <button onClick={() => signOut(auth)}>Sign Out</button>
    </div>
  );
}

function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
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

  return (
    !username && (
      <section className="bg-white">
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="myname"
            value={formValue}
            onChange={onChange}
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <button type="submit" className="" disabled={!isValid}>
            Choose
          </button>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}

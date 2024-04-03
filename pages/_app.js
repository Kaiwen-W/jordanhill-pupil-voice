import { UserContext } from "@/lib/context";
import { useUserData } from "@/lib/hooks";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }) {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <title>Jordanhill Pupil Achievements</title>
      <Component {...pageProps} />
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: "black",
              color: "green",
              border: "4px solid darkgreen",
            },
          },
          error: {
            style: {
              background: "black",
              color: "red",
              border: "4px solid darkred",
            },
          },
        }}
      />
    </UserContext.Provider>
  );
}

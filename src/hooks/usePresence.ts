// import { useEffect, useRef } from "react";
// import {
//   ref,
//   onDisconnect,
//   set,
//   onValue,
//   getDatabase,
//   get,
// } from "firebase/database";
// import { getAuth } from "firebase/auth";
// import { rtdb } from "@/src/firebase/config";

// const usePresence = () => {
//   const disconnectRef = useRef<ReturnType<typeof onDisconnect> | null>(null);

//   useEffect(() => {
//     const auth = getAuth();
//     const user = auth.currentUser;
//     if (!user) return;

//     const uid = user.uid;
//     const userStatusRef = ref(rtdb, `/status/${uid}`);
//     const connectedRef = ref(rtdb, ".info/connected");

//     const unsubscribe = onValue(connectedRef, (snapshot) => {
//       if (snapshot.val() === false) return;

//       const disconnect = onDisconnect(userStatusRef);
//       disconnect.set({
//         state: "offline",
//         last_changed: Date.now(),
//       });

//       disconnectRef.current = disconnect;

//       set(userStatusRef, {
//         state: "online",
//         last_changed: Date.now(),
//       });
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, []);

//   // Optional: expose a way to cancel disconnect externally
//   const cancelDisconnect = async (uid: string) => {
//     const userStatusRef = ref(rtdb, `/status/${uid}`);
//     await set(userStatusRef, {
//       state: "offline",
//       last_changed: Date.now(),
//     });
//   };

//   return { cancelDisconnect };
// };

// export default usePresence;
import { useEffect } from "react";
import { ref, onDisconnect, set, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { rtdb } from "@/src/firebase/config";

const usePresence = () => {
  useEffect(() => {
    const auth = getAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      const uid = user.uid;
      const sessionId = `${uid}_${Date.now()}`;
      const userSessionRef = ref(rtdb, `/status/${uid}/sessions/${sessionId}`);
      const connectedRef = ref(rtdb, ".info/connected");

      const unsubscribeConnection = onValue(connectedRef, (snapshot) => {
        if (snapshot.val() === false) return;

        // Disconnect this session when tab closes
        onDisconnect(userSessionRef).remove();

        // Set online status for this session
        set(userSessionRef, {
          state: "online",
          last_changed: Date.now(),
        });
      });

      // Cleanup
      return () => {
        unsubscribeConnection();
        onDisconnect(userSessionRef).cancel(); // optional: cleanup on unmount
        set(userSessionRef, null); // remove on component unmount
      };
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);
};

export default usePresence;

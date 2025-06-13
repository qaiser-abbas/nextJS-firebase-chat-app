// src/services/auth/authService.ts

import { auth, db, rtdb } from "@/src/firebase/config";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  UserCredential,
} from "firebase/auth";
import {
  setDoc,
  doc,
  getDoc,
  getDocs,
  collection,
  getFirestore,
} from "firebase/firestore";
import { ref, get, set } from "firebase/database";

class Auth {
  registerUser = async (
    email: string,
    password: string,
    name: string
  ): Promise<UserCredential> => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // ✅ Set display name
    await updateProfile(user, {
      displayName: name,
    });

    // ✅ Save to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name,
      email: user.email,
      createdAt: new Date().toISOString(),
      photoURL: user.photoURL || "", // <-- no quotes, just string
    });

    return userCredential;
  };

  /**
   * Signs in user with Firebase Auth
   */
  loginUser = async (email: string, password: string): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // No need to manually set status here
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        throw new Error("No user found. Please register first.");
      } else if (error.code === "auth/wrong-password") {
        throw new Error("Incorrect password.");
      } else {
        throw new Error(error.message);
      }
    }
  };

  /**
   * Signs out current user
   */
  logoutUser = async (): Promise<void> => {
    const user = auth.currentUser;

    if (user) {
      const userStatusRef = ref(rtdb, `/status/${user.uid}`);

      // ✅ Overwrite and break onDisconnect()
      await set(userStatusRef, {
        state: "offline",
        last_changed: Date.now(),
      });

      // Small delay to ensure RTDB syncs before disconnect
      await new Promise((res) => setTimeout(res, 200));
    }

    await signOut(auth);
  };

  getCurrentUserData = async (): Promise<any | null> => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        if (!user) return resolve(null);

        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          resolve({ id: userSnap.id, ...userSnap.data() });
        } else {
          resolve(null);
        }
      });
    });
  };

  getAllUsers = async (currentUserId: string) => {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const users: any[] = [];
    usersSnapshot.forEach((doc) => {
      if (doc.id !== currentUserId) {
        users.push({ id: doc.id, ...doc.data() });
      }
    });

    try {
      const statusSnapshot = await get(ref(rtdb, "/status"));
      const statusData = statusSnapshot.val() || {};

      const mergedUsers = users.map((user) => {
        const sessions = statusData[user.id]?.sessions || {};
        const sessionList = Object.values(sessions) as any[];

        const isOnline = sessionList.some((s) => s.state === "online");
        const lastChanged = sessionList.length
          ? Math.max(...sessionList.map((s) => s.last_changed || 0))
          : null;

        return {
          ...user,
          isOnline,
          lastChanged,
        };
      });

      return mergedUsers;
    } catch (error) {
      console.error("⚠️ Error fetching Realtime DB status:", error);
      throw new Error("Failed to fetch user presence");
    }
  };
}
const AuthService = new Auth();

export default AuthService;

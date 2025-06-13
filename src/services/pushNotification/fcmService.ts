import { getMessaging, getToken } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app, db } from "@/src/firebase/config";

const functions = getFunctions(app, "us-central1");
const sendNotification = httpsCallable(functions, "sendPushNotification");

class PushNoti {
  // Trigger callable function
  triggerPush = async (token: string, title: string, body: string) => {
    await sendNotification({ token, title, body });
  };

  // Save FCM token under `fcmTokens/` collection
  requestAndStoreToken = async (userId: string) => {
    try {
      const token = await getToken(getMessaging(app), {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });

      if (token) {
        await setDoc(doc(db, "fcmTokens", userId), { token });
      }
    } catch (err) {
      console.error("FCM token error:", err);
    }
  };

  // Optional: save directly under user profile
  saveTokenInUserDoc = async (uid: string) => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.warn("Notification permission not granted");
        return;
      }

      const messaging = getMessaging(app); // ✅ Define here
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
      });

      if (token) {
        await setDoc(
          doc(db, "users", uid),
          { fcmToken: token },
          { merge: true }
        );
        console.log("✅ Token saved in Firestore:", token);
      } else {
        console.warn("No token generated");
      }
    } catch (err) {
      console.error("FCM token error:", err);
    }
  };
}

const FcmService = new PushNoti();
export default FcmService;

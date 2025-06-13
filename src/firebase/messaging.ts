import { getMessaging, isSupported } from "firebase/messaging";
import { app } from "./config";

let messagingInstance: ReturnType<typeof getMessaging> | null = null;

export const getMessagingClient = async () => {
  if (typeof window !== "undefined" && (await isSupported())) {
    if (!messagingInstance) {
      messagingInstance = getMessaging(app);
    }
    return messagingInstance;
  }
  return null;
};

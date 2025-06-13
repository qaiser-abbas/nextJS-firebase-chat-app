import { app, db } from "@/src/firebase/config";
import {
  collection,
  addDoc,
  setDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  where,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

// Setup Firebase Functions callable
const functions = getFunctions(app, "us-central1");
const sendPushNotification = httpsCallable(functions, "sendPushNotification");

// ✅ Helper to generate a unique chat ID based on both users
const getChatId = (userId1: string, userId2: string): string => {
  return [userId1, userId2].sort().join("_");
};

class Chat {
  // Send a new message
  sendMessage = async (
    senderId: string,
    receiverId: string,
    message: string,
    imageUrl?: string,
    readAt?: number
  ) => {
    const chatId = getChatId(senderId, receiverId);
    const chatRef = doc(db, "chats", chatId);
    const messagesRef = collection(chatRef, "messages");

    // Create/update chat metadata
    await setDoc(
      chatRef,
      {
        users: [senderId, receiverId],
        lastMessage: message,
        updatedAt: serverTimestamp(),
        readAtMap: {
          [senderId]: serverTimestamp(),
        },
      },
      { merge: true }
    );

    const messageData: any = {
      senderId,
      receiverId,
      text: message,
      imageUrl: imageUrl || "",
      createdAt: serverTimestamp(),
    };

    if (readAt !== undefined) {
      messageData.readAt = readAt;
    }

    await addDoc(messagesRef, messageData);
  };

  markMessagesAsRead = async (chatId: string, userId: string) => {
    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
      [`readAtMap.${userId}`]: serverTimestamp(),
    });
  };

  // Add inside Chat class
  editMessage = async (chatId: string, messageId: string, newText: string) => {
    const messageRef = doc(db, "chats", chatId, "messages", messageId);
    await updateDoc(messageRef, {
      text: newText,
      updatedAt: serverTimestamp(),
    });
  };

  deleteMessage = async (chatId: string, messageId: string) => {
    const messageRef = doc(db, "chats", chatId, "messages", messageId);
    await deleteDoc(messageRef);
  };

  // Listen to messages in real-time
  listenToMessages = (
    senderId: string,
    receiverId: string,
    callback: (messages: any[]) => void
  ) => {
    const chatId = getChatId(senderId, receiverId);
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt"));

    return onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(msgs);
    });
  };

  // Inside Chat class
  getUserChats = async (currentUserId: string): Promise<any[]> => {
    try {
      const q = query(
        collection(db, "chats"),
        where("users", "array-contains", currentUserId),
        orderBy("updatedAt", "desc")
      );

      const snapshot = await getDocs(q);
      const chats: any[] = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const chatId = docSnap.id;
        const otherUserId = data.users.find(
          (id: string) => id !== currentUserId
        );

        const userDoc = await getDoc(doc(db, "users", otherUserId));
        const user = userDoc.exists() ? userDoc.data() : null;

        let unreadCount = 0;

        // 🔥 FIXED: Only count messages SENT BY otherUser that currentUser hasn't read
        const readAt = data.readAtMap?.[currentUserId];
        if (readAt) {
          const messagesRef = collection(db, "chats", chatId, "messages");
          const unreadQuery = query(
            messagesRef,
            where("createdAt", ">", readAt),
            where("senderId", "==", otherUserId) // ✅ FIXED
          );
          const unreadSnap = await getDocs(unreadQuery);
          unreadCount = unreadSnap.size;
        }

        if (user) {
          chats.push({
            chatId,
            otherUser: { id: otherUserId, ...user },
            lastMessage: data.lastMessage || "",
            updatedAt: data.updatedAt,
            unreadCount,
          });
        }
      }

      return chats;
    } catch (error: any) {
      console.error("Firestore query failed in getUserChats:", error.message);
      return [];
    }
  };

  getChatId = getChatId;
}

// ✅ Exporting a singleton instance
const ChatService = new Chat();
export default ChatService;

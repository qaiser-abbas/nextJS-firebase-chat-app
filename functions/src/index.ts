const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// 🔁 Auto push notification on Firestore message create
exports.pushOnNewMessage = functions.firestore
  .document("messages/{messageId}")
  .onCreate(async (snap: any, context: any) => {
    const newMessage = snap.data();

    const tokenDoc = await admin
      .firestore()
      .doc(`fcmTokens/${newMessage.receiverId}`)
      .get();
    const fcmToken = tokenDoc.exists ? tokenDoc.data().token : null;

    if (fcmToken) {
      const payload = {
        notification: {
          title: `New message from ${newMessage.senderName}`,
          body: newMessage.text,
          clickAction: "FLUTTER_NOTIFICATION_CLICK",
        },
        data: {
          senderId: newMessage.senderId,
          messageId: context.params.messageId,
        },
      };

      await admin.messaging().sendToDevice(fcmToken, payload);
    }
  });

// ⚡ Callable function for manual notification trigger
exports.sendPushNotification = functions.https.onCall(
  async (data: any, context: any) => {
    const { token, title, body } = data;

    if (!token || !title || !body) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing fields"
      );
    }

    const payload = {
      notification: { title, body },
    };

    try {
      const response = await admin.messaging().sendToDevice(token, payload);
      return { success: true, response };
    } catch (error) {
      console.error("Notification error:", error);
      throw new functions.https.HttpsError("internal", "Send failed");
    }
  }
);

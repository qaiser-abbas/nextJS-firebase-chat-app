importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCADpcuvxbocr_FCDQCW0C60soS6nTrJU4",
  authDomain: "nextjs-pro-5a934.firebaseapp.com",
  projectId: "nextjs-pro-5a934",
  storageBucket: "nextjs-pro-5a934.firebasestorage.app",
  messagingSenderId: "486147832529",
  appId: "1:486147832529:web:61112c0fe5cb1847ace3f0",
  measurementId: "G-GW8QZCL4EN",
  vapidKey:
    "BNXsQjGn__umc7FoMmg4lLY1hxzQ38TcR1MycTqTsy6BkZKXt4jGBUQnWyXbMT_u2ea57N5qqsZBj1OXim5UVFA",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon.png",
  });
});

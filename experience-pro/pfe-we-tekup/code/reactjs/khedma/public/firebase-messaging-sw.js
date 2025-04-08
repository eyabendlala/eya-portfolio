// // Scripts for firebase and firebase messaging
// importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// // Initialize the Firebase app in the service worker by passing the generated config
// const firebaseConfig = {
//     apiKey: "AIzaSyDMnWkSCH5MLx--sU3SANOkviQZyAQ_y40",
//     authDomain: "khedmapushnotif.firebaseapp.com",
//     projectId: "khedmapushnotif",
//     storageBucket: "khedmapushnotif.appspot.com",
//     messagingSenderId: "1000069458701",
//     appId: "1:1000069458701:web:7122b9327ff0d427559e44",
//     measurementId: "G-QMXBZLT2WC"
// };

// firebase.initializeApp(firebaseConfig);

// // Retrieve firebase messaging
// const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function(payload) {
//   console.log('Received background message ', payload);
//  // Customize notification here
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//   };

//   self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });

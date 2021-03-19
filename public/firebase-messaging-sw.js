// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');
;
// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
    apiKey: "AIzaSyDRbMvGqw8A29wDWZ2PrjbH0AAiemg_gPo",
    authDomain: "invoicemate-cc07d.firebaseapp.com",
    projectId: "invoicemate-cc07d",
    storageBucket: "invoicemate-cc07d.appspot.com",
    messagingSenderId: "835332221375",
    appId: "1:835332221375:web:56d3a7b6260a35c061590a",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();


messaging.onBackgroundMessage(function(payload) {
    console.log(payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
     
 };
  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
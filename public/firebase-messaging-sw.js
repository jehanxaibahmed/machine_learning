importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js");
firebase.initializeApp({
     apiKey: "AIzaSyDRbMvGqw8A29wDWZ2PrjbH0AAiemg_gPo",
     authDomain: "invoicemate-cc07d.firebaseapp.com",
     projectId: "invoicemate-cc07d",
     storageBucket: "invoicemate-cc07d.appspot.com",
     messagingSenderId: "835332221375",
     appId: "1:835332221375:web:56d3a7b6260a35c061590a",
});
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
     console.log(payload);
  const promiseChain = clients
    .matchAll({
      type: "window",
      includeUncontrolled: true
    })
    .then(windowClients => {
      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        windowClient.postMessage(payload);
      }
    })
    .then(() => {
      return registration.showNotification("my notification title");
    });
  return promiseChain;
});
self.addEventListener('notificationclick', function(event) {
     console.log(event);
});
import firebase from 'firebase/app';
import 'firebase/messaging';
import {firebaseConfig} from "./config/Firebase";
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

export const getToken = (setTokenFound) => {
    return new Promise((res,rej)=>{
      messaging.getToken({vapidKey: 'BMJe3ulY2GQsme1JTdoUXn0BGOUwmzE5FoWHomcfeC98R73CUCvwpVOFYw1p3plWShjMcGLdyyG8KDpvVvA8m6o'}).then((currentToken) => {
        if (currentToken) {
          console.log(currentToken);
          res(currentToken);
          // setTokenFound(true);
          // Track the token -> client mapping, by sending to backend server
          // show on the UI that permission is secured
        } else {
          rej('No registration token available. Request permission to generate one.');
          // setTokenFound(false);
          // shows on the UI that permission is required 
        }
      }).catch((err) => {
       rej('An error occurred while retrieving token. '+ err);
        // catch error while creating client token
      });
    })
  }

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
});
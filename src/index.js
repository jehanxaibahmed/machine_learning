import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./redux";
import { PersistGate } from 'redux-persist/integration/react'
import addNotification from 'react-push-notification'; 


// import AuthLayout from "layouts/Auth.js";
// import RtlLayout from "layouts/RTL.js";
import AdminLayout from "layouts/Admin.js";
import ActionLayout from "layouts/Action.js";
import InvoiceLayout from "layouts/Invoice.js";
import VendorLayout from "layouts/Vendor.js";
import AuthLayout from "layouts/Auth.js";
import DefaultLayout from "layouts/default";
import RtlLayout from "layouts/RTL.js";
import InvoiceDetail from "views/LDocs/Invoices/InvoiceDetail/InvoiceDetail";
import ActivateClient from "views/LDocs/Clients/ActivateClient";
import "assets/scss/material-dashboard-pro-react.scss?v=1.8.0";
import { registerServiceWorker } from "./register-sw";
import AcknowledgedClient from "views/LDocs/Clients/AcknowledgedClient";

navigator.serviceWorker.addEventListener("notificationclick", (message) => {
  console.log(message);
});
const loader = document.querySelector('.loader');

// if you want to show the loader when React loads data again
const showLoader = () => loader.classList.remove('loader--hide');

const hideLoader = () => loader.classList.add('loader--hide');
navigator.serviceWorker.addEventListener("message", (message) => {
  var payload = message.data['firebase-messaging-msg-data'];
  addNotification(
    {
      title: payload.notification.title,
      message: payload.notification.body, //optional
      duration: 6000, //optional, default: 5000,
      native: true, //optional, makes the push notification a native OS notification
      icon: "https://i.ibb.co/k409jfP/logo.png", // optional, Native only. Sets an icon for the notification.
      vibrate: 4, // optional, Native only. Sets a vibration for the notification.
      silent: false, // o
      onClick: () => window.open(payload.data.url)
    });
});

const hist = createBrowserHistory();
registerServiceWorker();
hideLoader();
ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router history={hist}>
        <Switch>
          <Route path="/default" component={DefaultLayout} />
          <Route path="/rtl" component={RtlLayout} />
          <Route path="/auth" component={AuthLayout} />
          <Route path="/admin" component={AdminLayout} />
          <Route path="/invoice" component={InvoiceLayout} />
          <Route path="/action" component={ActionLayout} />
          <Route path="/vendor" component={VendorLayout} />
          <Route path="/invoiceDetail" component={InvoiceDetail} />
          <Route path="/client/activate" component={ActivateClient} />
          <Route path="/client/acknowladged" component={AcknowledgedClient} />
          {/**  <Redirect from="/" to="/admin/dashboard" />  */}
          <Redirect from="/" to="/auth" />
        </Switch>
      </Router>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

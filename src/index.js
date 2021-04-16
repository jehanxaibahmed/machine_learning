import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux";
import addNotification from 'react-push-notification';


// import AuthLayout from "layouts/Auth.js";
// import RtlLayout from "layouts/RTL.js";
import AdminLayout from "layouts/Admin.js";
import ActionLayout from "layouts/Action.js";
import InvoiceLayout from "layouts/Invoice.js";
import VendorLayout from "layouts/Vendor.js";
import AuthLayout from "layouts/Auth.js";
import RtlLayout from "layouts/RTL.js";
import InvoiceDetail from "views/LDocs/Invoices/InvoiceDetail/InvoiceDetail";
import "assets/scss/material-dashboard-pro-react.scss?v=1.8.0";
import { registerServiceWorker } from "./register-sw";

navigator.serviceWorker.addEventListener("notificationclick", (message) => {
  console.log(message);
});
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
      onClick:()=> window.open(payload.data.url)
    });
}); 

const hist = createBrowserHistory();
registerServiceWorker();
    ReactDOM.render(
      <Provider store={store}>
        <Router history={hist}>
          <Switch>
            <Route path="/rtl" component={RtlLayout} />
            <Route path="/auth" component={AuthLayout} />
            <Route path="/admin" component={AdminLayout} />
            <Route path="/invoice" component={InvoiceLayout} />
            <Route path="/action" component={ActionLayout} />
            <Route path="/vendor" component={VendorLayout} />
            <Route path="/invoiceDetail" component={InvoiceDetail} />
            {/**  <Redirect from="/" to="/admin/dashboard" />  */}
            <Redirect from="/" to="/auth" />
          </Switch>
        </Router>
      </Provider>,
      document.getElementById("root")
);

import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux";
import ScrollToTop  from "./ScrollToTop";
import addNotification from 'react-push-notification';
import {Notifications} from 'react-push-notification';


// import AuthLayout from "layouts/Auth.js";
// import RtlLayout from "layouts/RTL.js";
import AdminLayout from "layouts/Admin.js";
import ActionLayout from "layouts/Action.js";
import InvoiceLayout from "layouts/Invoice.js";
import VendorLayout from "layouts/Vendor.js";
import AuthLayout from "layouts/Auth.js";
import RtlLayout from "layouts/RTL.js";
import firebase from 'firebase/app';
import "assets/scss/material-dashboard-pro-react.scss?v=1.8.0";
import { getToken, onMessageListener } from './firebase';
const messaging = firebase.messaging();
messaging.onMessage((payload) => {
  console.log(payload);
  addNotification(
        {
          title: payload.notification.title,
          message: payload.notification.body,
          duration:999*999,
          native: true,
          onClick:()=> window.open(payload.data.url)
        });
});
const hist = createBrowserHistory();

ReactDOM.render(
  <Provider store={store}>
    <Notifications
    position="bottom-right"
    />
    <Router history={hist}>
    <ScrollToTop>
      <Switch>
        <Route path="/rtl" component={RtlLayout} />
        <Route path="/auth" component={AuthLayout} />
        <Route path="/admin" component={AdminLayout} />
        <Route path="/invoice" component={InvoiceLayout} />
        <Route path="/action" component={ActionLayout} />
        <Route path="/vendor" component={VendorLayout} />
        {/**  <Redirect from="/" to="/admin/dashboard" />  */}
        <Redirect from="/" to="/auth" />
      </Switch>
      </ScrollToTop>
    </Router>
  </Provider>,
  document.getElementById("root")
);

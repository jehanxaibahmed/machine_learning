import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux";

// import AuthLayout from "layouts/Auth.js";
// import RtlLayout from "layouts/RTL.js";
import AdminLayout from "layouts/Admin.js";
import ActionLayout from "layouts/Action.js";
import InvoiceLayout from "layouts/Invoice.js";
import AuthLayout from "layouts/Auth.js";
import RtlLayout from "layouts/RTL.js";

import "assets/scss/material-dashboard-pro-react.scss?v=1.8.0";


const hist = createBrowserHistory();

ReactDOM.render(
  <Provider store={store}>
    <Router history={hist}>
      <Switch>
        <Route path="/rtl" component={RtlLayout} />
        <Route path="/auth" component={AuthLayout} />
        <Route path="/admin" component={AdminLayout} />
        <Route path="/invoice" component={InvoiceLayout} />
        <Route path="/action" component={ActionLayout} />
        {/**  <Redirect from="/" to="/admin/dashboard" />  */}
        <Redirect from="/" to="/auth" />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById("root")
);

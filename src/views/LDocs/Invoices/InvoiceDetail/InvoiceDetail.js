import React, {useState} from "react";
import jwt from "jsonwebtoken";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";

export default function InvoiceDetail() {
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
    const [userDetails, setUserDetails] = useState(null);
    const getParameterByName = (name, url) => {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
          var results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
      }
  React.useEffect(() => {
    console.log(getParameterByName("invoiceId"));
    const userData = jwt.decode(Token);
    setUserDetails(userData);
  }, []);

  return (
    <div>
      {/* {
        userDetails ? userDetails.isVendor ? (
          <Redirect to="/vendor/dashboard" />
        ) : userDetails.role == "Action Desk" ? (
          <Redirect to="/action/dashboard" />
        ) : userDetails.role == "Invoice Desk" ? (
          <Redirect to="/invoice/dashboard" />
        ) : userDetails.role == "Admin Desk" ? (
          <Redirect to="/admin/dashboard" />
        ) : (
          ""
        ): ( */}
            <CircularProgress />
        {/* )
    } */}
    </div>
  );
}

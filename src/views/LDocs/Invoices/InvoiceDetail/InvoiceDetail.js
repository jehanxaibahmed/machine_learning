import React, { useState } from "react";
import jwt from "jsonwebtoken";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import axios from "axios";
import { CircularProgress, LinearProgress, makeStyles } from "@material-ui/core";
import FileAdvanceView from "../AdvanceView/FileAdvanceView";
import { setIsTokenExpired } from "actions";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import Swal from 'sweetalert2'
import { successAlert, errorAlert, msgAlert } from "views/LDocs/Functions/Functions.js";
export default function InvoiceDetail() {
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
    const dispatch = useDispatch();
    const logo = require("assets/img/logo.png");
    const [userDetails, setUserDetails] = useState(null);
    const [invoice, setInvoice] = useState(null);
    const getParameterByName = (name, url) => {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        var results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };




  React.useEffect(() => {
    const userData = jwt.decode(Token);
    setUserDetails(userData);
    const invoice = {
      id: getParameterByName("invoiceId"),
      version: getParameterByName("version"),
      vendorId: getParameterByName("vendorId"),
      clientId: getParameterByName("clientId"),
      isAR: getParameterByName("isAR"),
    };

    axios({
      method: "post", //you can set what request you want to be
      url: invoice.isAR == "true" ?  `${process.env.REACT_APP_LDOCS_API_URL}/invoice/getSingleInvoiceByVersion/ar` : `${process.env.REACT_APP_LDOCS_API_URL}/invoice/getSingleInvoiceByVersion/ap`,
      data: {
        invoiceId: invoice.id,
        version: invoice.version,
        vendorId:  invoice.isAR  == "true" ?  null : invoice.vendorId,
        clientId: invoice.isAR  == "true" ? invoice.clientId: null,
        isAR: invoice.isAR  == "true" ? true : false
      },
      headers: {
        cooljwt: Token,
      },
    })
      .then(async (invoiceRes) => {
        const invoice = invoiceRes.data;
        setInvoice(invoice);
        console.log(invoice);
      })
      .catch((error) => {
        error.response && error.response.status == 401 && errorAlert('TOKEN HAS BEEN EXPIRED!');
        setInvoice(null);
        errorAlert('UNABLE TO FIND INVOICE IN SYSTEM');
        console.log(error);
      });
  }, []);

  return (
    <React.Fragment>
       
      <div style={{paddingLeft:20,paddingRight:20, textAlign:'center'}}>
          <img src={logo} width={300} />
          </div>
          <Card >
            <CardBody>
              {invoice ? (
                <FileAdvanceView fileData={invoice} isVendor={userDetails.isVendor ? userDetails.isVendor : false } />
              ) : (
                <LinearProgress />
              )}
            </CardBody>
          </Card>
          </React.Fragment>  );
}

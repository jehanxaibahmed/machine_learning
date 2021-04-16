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
import { CircularProgress, LinearProgress } from "@material-ui/core";
import FileAdvanceView from "../AdvanceView/FileAdvanceView";

export default function InvoiceDetail() {
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
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
    };

    axios({
      method: "post", //you can set what request you want to be
      url: `${process.env.REACT_APP_LDOCS_API_URL}/invoice/getSingleInvoiceByVersion`,
      data: {
        invoiceId: invoice.id,
        version: invoice.version,
        vendorId: invoice.vendorId,
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
      .catch((err) => {
        setInvoice(null);
        console.log(err);
      });
  }, []);

  return (
      <div style={{paddingLeft:20,paddingRight:20, textAlign:'center'}}>
          <img src={logo} width={300} />
          <Card >
            <CardBody>
              {invoice ? (
                <FileAdvanceView fileData={invoice} isVendor={userDetails.isVendor} />
              ) : (
                <LinearProgress />
              )}
            </CardBody>
          </Card>
        </div>
  );
}

import React, { useState } from "react";
import { Redirect } from "react-router-dom";
// @material-ui/core components
import {
  makeStyles,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@material-ui/core";
// @material-ui/icons
import Email from "@material-ui/icons/ScreenLockPortrait";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import { useDispatch } from "react-redux";
import { getNotification } from "../../../actions";
import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import axios from "axios";
import jwt from "jsonwebtoken";
import DeviceUUID, { getToken } from "views/LDocs/Functions/Functions";
let uuid = new DeviceUUID().get();
let os = new DeviceUUID().parse().os;
console.log(new DeviceUUID().parse());
let firebase_token;
getToken().then((res) => {
  firebase_token = res;
  console.log(res);
});

const useStyles = makeStyles(styles);
export default function LoginSecret(props) {
  const [twofa, setTwofa] = useState("");
  const [loggedIn, setloggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [twofaError, setTwofaError] = useState("");
  const classes = useStyles();
  const dispatch = useDispatch();

  function handletwofa(event) {
    setTwofa(event.target.value);
  }
  function handleClick(e) {
    e.preventDefault();
    setLoading(true);
    let token = localStorage.getItem("cooljwt");
    var isTenant = jwt.decode(token).isTenant;
    const url = isTenant
      ? `${process.env.REACT_APP_LDOCS_API_URL}/tenant/avotp`
      : `${process.env.REACT_APP_LDOCS_API_URL}/user/activateOtp`;
    axios({
      method: "post", //you can set what request you want to be
      url: url,
      data: { otp: twofa },
      headers: {
        cooljwt: token,
      },
    })
      .then(async (response) => {
        let token = response.headers.cooljwt;
        let decoded = jwt.decode(token);
        if(!decoded.isTenant){
        await axios({
          method: "post", //you can set what request you want to be
          url: `${process.env.REACT_APP_LDOCS_API_URL}/user/updateUserFcm`,
          data: {
            osType: os,
            fcmToken: firebase_token,
            deviceId: uuid,
          },
          headers: {
            cooljwt: response.headers.cooljwt,
          },
        });
        }
        setLoading(false);
        setUserData(decoded);
        if (decoded.otp) {
          localStorage.setItem("cooljwt", token);
          setTwofaError("success");
          dispatch(getNotification());
          setloggedIn(true);
        } else {
          setTwofaError("error");
        }
      })
      .catch((error) => {
        setLoading(false);
        setUserData(null);
        setTwofaError("error");
        console.log(
          typeof error.response != "undefined"
            ? error.response.data
            : error.message
        );
      });
  }

  return (
    <div className={classes.container}>
      {loggedIn && userData !== null ? (
        userData.role === "Action Desk" ? (
          <Redirect to="/action/dashboard/ap" />
        ) : userData.role === "Invoice Desk" ? (
          <Redirect to="/invoice/dashboard/ap" />
        ) : userData.role === "Finance Desk" ? (
          <Redirect to="/finance/dashboard" />
        ) : (
          <Redirect to="/admin/dashboard" />
        )
      ) : (
        ""
      )}
      <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={4}>
          <form onSubmit={handleClick}>
            <Card login>
              <CardHeader
                className={`${classes.cardHeader} ${classes.textCenter}`}
                color="info"
              >
                <h4 className={classes.cardTitle}>Secret Key</h4>
              </CardHeader>
              <CardBody>
                <TextField
                  fullWidth={true}
                  error={twofaError === "error"}
                  helperText={twofaError === "error" ? "Invalid OTP" : null}
                  label="Secret key.."
                  id="twofa"
                  name="twofa"
                  onChange={(event) => {
                    handletwofa(event);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Email className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    ),
                  }}
                  type="text"
                  value={twofa || ""}
                />
              </CardBody>
              <CardFooter className={classes.justifyContentCenter}>
                <Button color="info" simple size="lg" block type="submit">
                  {loading ? (
                    <CircularProgress disableShrink />
                  ) : (
                    "Enter Secret"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </GridItem>
      </GridContainer>
    </div>
  );
}

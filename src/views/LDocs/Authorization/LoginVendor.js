import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core";
// @material-ui/icons
import { Redirect } from "react-router-dom";


// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import LoginVendorPage from "./LoginVendorPage";
import LoginSecret from "./LoginSecret";
import { Animated } from "react-animated-css";

const useStyles = makeStyles(styles);

export default function LoginVendor() {
  const classes = useStyles();
  const [login, setLogin] = useState(false);
  const [removeLogin, setRemoveLogin] = useState(true);
  const [removeotpCheck, setRemoveotpCheck] = useState(false);
  const [loggined, setIsLoggined] = useState(false);
  const [optCheck, setoptCheck] = useState(false);

  const loginSuccess = () => {
    setLogin(true);
  };
  // const loginOTPsuccess = () => {
  //   setoptCheck(false);

  //   setTimeout(function() {
  //     setRemoveotpCheck(false);
  //     setRemoveLogin(true);
  //     setLogin(true);
  //   }, 500);
  // };

  return (
    login ? <Redirect to="/vendor/dashboard" /> : 
    <div className={classes.container}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={12}>
          {removeLogin ? (
            <Animated
              animationIn="bounceInUp"
              animationOut="bounceOutUp"
              animationInDuration={1000}
              animationOutDuration={1000}
              isVisible={true}
            >
              <div>
                <LoginVendorPage loginSuccess={loginSuccess} />
              </div>
            </Animated>
          ) : (
            ""
          )}
        </GridItem>
      </GridContainer>
    </div>
  );
}

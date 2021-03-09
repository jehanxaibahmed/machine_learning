import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core";
// @material-ui/icons


// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import LoginPage from "./LoginPage";
import LoginSecret from "./LoginSecret";
import { Animated } from "react-animated-css";

const useStyles = makeStyles(styles);


export default function Auth() {
  const classes = useStyles();
  const [login, setLogin] = useState(true);
  const [removeLogin, setRemoveLogin] = useState(true);
  const [removeotpCheck, setRemoveotpCheck] = useState(false);
  const [optCheck, setoptCheck] = useState(false);

  const loginSuccess = () => {
    setLogin(false);

    setTimeout(function () {
      setRemoveLogin(false);
      setRemoveotpCheck(true);
      setLogin(false);
      setoptCheck(true);
    }, 500);
  };
  const loginOTPsuccess = () => {
    setoptCheck(false);

    setTimeout(function () {
      setRemoveotpCheck(false);
      setRemoveLogin(true);
      setLogin(true);
    }, 500);
  };

  return (
    <div className={classes.container}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={12}>
          {removeLogin ? (
            <Animated
              animationIn="bounceInUp"
              animationOut="bounceOutUp"
              animationInDuration={1000}
              animationOutDuration={1000}
              isVisible={login}
            >
              <div>
                <LoginPage loginSuccess={loginSuccess} />
              </div>
            </Animated>
          ) : (
              ""
            )}
          {removeotpCheck ? (
            <Animated
              animationIn="bounceInUp"
              animationOut="bounceOutUp"
              animationInDuration={1000}
              animationOutDuration={1000}
              isVisible={optCheck}
            >
              <div>
                <LoginSecret loginOTPsuccess={loginOTPsuccess} />
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

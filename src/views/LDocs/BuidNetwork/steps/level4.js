
import React, { useState } from "react";
// @material-ui/icons
import {
  makeStyles,
} from "@material-ui/core";
import { Animated } from "react-animated-css";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import TitleForm  from "../../Title/TitleForm";
const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

export default function Step4(props) {
  const classes = useStyles();
  return (
    <div>
      <Animated
        animationIn="bounceInRight"
        animationOut="bounceOutLeft"
        animationInDuration={1000}
        animationOutDuration={1000}
        isVisible={true}
      >
        <TitleForm />
      </Animated>
    </div>
  );
}


















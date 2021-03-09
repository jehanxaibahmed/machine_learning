import React, { useState, useEffect } from "react";
import {
  makeStyles,
} from "@material-ui/core";
// @material-ui/core components

import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import { Animated } from "react-animated-css";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import CompanyForm from "../../Company/CompanyForm";

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

export default function Step2(props) {
  const classes = useStyles();
  const [animateStep, setAnimateStep] = useState(true);

  return (
    <Animated
      animationIn="bounceInRight"
      animationOut="bounceOutLeft"
      animationInDuration={1000}
      animationOutDuration={1000}
      isVisible={animateStep}
    >
    <CompanyForm />
    </Animated>
  );
}

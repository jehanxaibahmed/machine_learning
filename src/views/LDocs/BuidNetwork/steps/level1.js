import React, {useState, useEffect} from "react";
// @material-ui/icons
import {
  makeStyles,
} from "@material-ui/core";
// core components
import { Animated } from "react-animated-css";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import OrganizationForm from "../../Organization/OrganizationForm";

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

export default function Step1(props) {
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
      <OrganizationForm />
    </Animated>
  );
  }



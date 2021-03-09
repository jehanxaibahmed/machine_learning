import React, {useState, useEffect} from "react";
// @material-ui/icons
import {
  makeStyles,
  TextField
} from "@material-ui/core";
// core components
import { Animated } from "react-animated-css";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
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
      <GridContainer>
              <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <TextField
                    fullWidth={true}
                    label="Vendor Name"
                    id="name"
                    name="name"
                    type="text"
                    disabled={true}
                    value={props.vendorData.level1.vendorName || ''}
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <TextField
                    fullWidth={true}
                    label="License Number"
                    id="licenseNumber"
                    name="licenseNumber"
                    type="text"
                    disabled={true}
                    value={
                      props.vendorData.level1.licenseNumber||""
                    }
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <TextField
                    fullWidth={true}
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                    disabled={true}
                    value={props.vendorData.level1.email ||""}
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <TextField
                    fullWidth={true}
                    label="Login Name"
                    id="loginname"
                    name="loginname"
                   
                    type="text"
                    disabled={true}
                    value={props.vendorData.level1.displayName || ''}
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <TextField
                    fullWidth={true}
                    label="Cell Number"
                    id="cellnumber"
                    name="cellnumber"
                    type="text"
                    disabled={true}
                    value={props.vendorData.level1.contactNumber || ''}
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <TextField
                    fullWidth={true}
                    label="Remarks"
                    id="referenceTicket"
                    name="referenceTicket"
                   
                    type="text"
                    disabled={true}
                    value={
                      props.vendorData.level1.remarks||""
                    }
                  />
                </GridItem>
              </GridContainer>
    </Animated>
  );
  }



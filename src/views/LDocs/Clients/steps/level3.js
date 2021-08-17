import React, { useState, useEffect } from "react";
// @material-ui/icons
import {
  makeStyles,
  TextField
} from "@material-ui/core";
// core components
import { Animated } from "react-animated-css";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

export default function Step3(props) {
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
      <div>
        {props.vendorData.level3.bankDetails.map((b, index)=>(
<Card profile key={index}>
          <CardHeader color="info" icon>
                <CardIcon color="info">
                  <h4 className={classes.cardTitle}>
                  {b.bankName}
                  </h4>
                </CardIcon>
              </CardHeader>
        <CardBody profile>
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
                    label="Branch Name"
                    id=""
                    name=""
                   
                    type="text"
                    disabled={true}
                    value={b.branchCode}
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
                    label="IBAN #"
                    id="name"
                    name="name"
                    type="text"
                    disabled={true}
                    value={b.iBAN}
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
                    label="Account #"
                    type="text"
                    disabled={true}
                    value={
                      b.accountNumber
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
                    label="Bank Address"
                    id="email"
                    name="email"
                    type="email"
                    disabled={true}
                    value={b.bankAddress}
                  />
                </GridItem>
              </GridContainer>
          </CardBody>
        </Card>
        ))}
      </div>
    </Animated>
  );
}

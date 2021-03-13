import React, { useState, useEffect } from "react";
// @material-ui/icons
import { makeStyles, TextField } from "@material-ui/core";
// core components
import { Animated } from "react-animated-css";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import Validator from "../../../../Components/Timeline";

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

export default function Step5(props) {
  const classes = useStyles();
  const [animateStep, setAnimateStep] = useState(true);
//   validation

  return (
    <Animated
      animationIn="bounceInRight"
      animationOut="bounceOutLeft"
      animationInDuration={1000}
      animationOutDuration={1000}
      isVisible={animateStep}
    >
      <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12} className={classes.center}>
              <Card>
                <CardBody>
                  <Validator validation={props.validation} />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
      
    </Animated>
  );
}

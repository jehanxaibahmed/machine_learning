import React, { useState, useEffect} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { useDispatch, useSelector } from "react-redux";
// core components
import Wizard from "./Wizard.js";

import Step1 from "./steps/level1.js";
import Step2 from "./steps/level2.js";
import Step3 from "./steps/level3.js";
import Step4 from "./steps/level4.js";
import jwt from "jsonwebtoken";


const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
  cardTitleText: {
    color: "white",
  },
  buttonRight: {},
};

const useStyles = makeStyles(styles);

export default function BuildNetwork() {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const userDetails = jwt.decode(Token);
  const classes = useStyles();
  const steps = [
    userDetails.isTenant ?
    {
      stepName: "Level 1 - Organzation",
      stepComponent: Step1,
      stepId: "about",
    }
    :
    {}
    ,
    {
      stepName: "Level 2 - Locations",
      stepComponent: Step2,
      stepId: "account",
    },
    {
      stepName: "Level 3 - Department",
      stepComponent: Step3,
      stepId: "address",
    },
    {
      stepName: "Level 4 - Designation",
      stepComponent: Step4,
      stepId: "designation",
    }
  ];
  return (
    <div>
      <GridContainer justify="center">
      <GridItem xs={12} sm={12} md={12} lg={12}>
          <Card>
            <CardHeader color="info" icon>
              <CardIcon color="info">
                <h4 className={classes.cardTitleText}>Build Network</h4>
              </CardIcon>
            </CardHeader>
            <CardBody>
            <Wizard
              validate
              steps={steps.filter(s=>s.stepName !== undefined || null)}
              
           />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
     
     
    </div>
  );
}

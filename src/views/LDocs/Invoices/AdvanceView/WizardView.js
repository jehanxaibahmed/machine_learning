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
import Button from "components/CustomButtons/Button.js";
// core components
import Wizard from "./Wizard.js";

import Step1 from "./steps/level1.js";
import Step2 from "./steps/level2.js";
import Step3 from "./steps/level3.js";
import Step4 from "./steps/level4.js";


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

export default function WizardView(props) {
  const classes = useStyles();
  
  return (
    <div>
      <GridContainer justify="center">
      <GridItem xs={12} sm={12} md={12} lg={12}>
            <Wizard
              validate
              steps={[
                {
                  stepName: "Items",
                  stepComponent: Step1,
                  stepId: "about",
                },
                {
                  stepName: "Workflow Steps",
                  stepComponent: Step2,
                  stepId: "account",
                },
                {
                  stepName: "Attachments",
                  stepComponent: Step3,
                  stepId: "address",
                },
                {
                  stepName: "Payments",
                  stepComponent: Step4,
                  stepId: "payments",
                }
              ]}
              items={props.items}
              isWorkflowInit={props.isWorkflowInit}
              blockChainData={props.blockChainData}
              workflow={props.workflow}
              attachments={props.attachments}
              payments={props.payments}

              
           />
        </GridItem>
      </GridContainer>
     
     
    </div>
  );
}

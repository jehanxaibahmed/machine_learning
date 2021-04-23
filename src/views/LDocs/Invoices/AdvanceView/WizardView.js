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
import Button from "components/CustomButtons/Button.js";
// core components
import Wizard from "./Wizard.js";

import Step1 from "./steps/level1.js";
import Step2 from "./steps/level2.js";
import Step3 from "./steps/level3.js";
import Step4 from "./steps/level4.js";
import Step5 from "./steps/level5.js";


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
  console.log("Wizard", props);
  const classes = useStyles();
  const steps = [
    {
      stepName: "Items",
      stepComponent: Step1,
      stepId: "about",
    },
    !props.isVendor?
    {
      stepName: "Workflow Steps",
      stepComponent: Step2,
      stepId: "account",
    }:{},
    {
      stepName: "Attachments",
      stepComponent: Step3,
      stepId: "address",
    },
    {
      stepName: "Payments / Exports",
      stepComponent: Step4,
      stepId: "payments",
    },
    !props.isVendor?
    {
      stepName: "Validation",
      stepComponent: Step5,
      stepId: "validation",
    }:{}
  ]
  // .filter(s=>s.stepName != null||undefined||'')
  return (
    <div>
      <GridContainer justify="center">
      <GridItem xs={12} sm={12} md={12} lg={12}>
            <Wizard
              validate
              steps={steps.filter(s=>s.stepName != null||undefined||'')}
              items={props.items}
              isWorkflowInit={props.isWorkflowInit}
              blockChainData={props.blockChainData}
              workflow={props.workflow}
              attachments={props.attachments}
              payments={props.payments}
              currency={props.currency}
              validation={props.validation}
              isVendor={props.isVendor}
              isExported={props.isExported}
              reviewStatus={props.reviewStatus}
              approveStatus={props.approveStatus}
              
           />
        </GridItem>
      </GridContainer>
     
     
    </div>
  );
}

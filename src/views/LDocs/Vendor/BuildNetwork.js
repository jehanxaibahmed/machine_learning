import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
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

export default function BuildNetwork(props) {
  const classes = useStyles();
  
  return (
    <div>
      <GridContainer justify="center">
      <GridItem xs={12} sm={12} md={12} lg={12}>
          <Card>
            <CardHeader color="info" icon>
              <CardIcon color="info">
                <h4 className={classes.cardTitleText}>Vendor Details</h4>
              </CardIcon>
              <Button
              color="danger"
              round
              style={{ float: "right" }}
              className={classes.marginRight}
              onClick={() => props.goBack()}
            >
              Go Back
            </Button>
            </CardHeader>
            <CardBody>
            <Wizard
              validate
              steps={[
                {
                  stepName: "General Information",
                  stepComponent: Step1,
                  stepId: "about",
                },
                {
                  stepName: "Certificates / Attachments",
                  stepComponent: Step2,
                  stepId: "account",
                },
                {
                  stepName: "Bank Details",
                  stepComponent: Step3,
                  stepId: "address",
                }
              ]}
             vendorData={props.vendorData}

              
           />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
     
     
    </div>
  );
}

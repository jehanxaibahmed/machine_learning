/*eslint-disable*/
import React, { useState } from "react";
// @material-ui/core components
import { TextField, makeStyles, CircularProgress } from "@material-ui/core";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import axios from "axios";
import defaultAvatar from "assets/img/placeholder.jpg";
import { Animated } from "react-animated-css";
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import dateFormat from "dateformat";

const useStyles = makeStyles(styles);

export default function ViewTeam(props) {
  // register form
  const [animateTable, setAnimateTable] = React.useState(true);
  const [formState, setFormState] = useState({
    values: {
      titleName: props.titleDetail.titleName,
      referenceTicket: props.titleDetail.referenceTicket,
      organizationName: props.titleDetail.organizationName,
      companyName: props.titleDetail.companyName,
      created: dateFormat(props.titleDetail.created, "dd/mm/yyyy, h:MM:ss TT"),
    },
  });
  const closeModal = () => {
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        titleName: "",
        referenceTicket: "",
        organizationName: "",
        companyName: "",
        created: "",
      },
    }));
    props.closeModal();
  };
  const classes = useStyles();
  return (
    <Animated
      animationIn="bounceInRight"
      animationOut="bounceOutLeft"
      animationInDuration={1000}
      animationOutDuration={1000}
      isVisible={animateTable}
    >
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="info" icon>
              <CardIcon color="info">
                <h4 className={classes.cardTitle}>Designation Details</h4>
              </CardIcon>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <TextField
                    fullWidth={true}
                    label="Designation Name"
                    id="titleName"
                    name="titleName"
                    type="text"
                    disabled={true}
                    value={formState.values.titleName || ""}
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
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
                    value={formState.values.referenceTicket || ""}
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <TextField
                    fullWidth={true}
                    label="Organization Name"
                    id="organizationName"
                    name="organizationName"
                    type="text"
                    disabled={true}
                    value={formState.values.organizationName || ""}
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <TextField
                    fullWidth={true}
                    label="Location Name"
                    id="companyName"
                    name="companyName"
                    type="text"
                    disabled={true}
                    value={formState.values.companyName || ""}
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <TextField
                    fullWidth={true}
                    label="Created At"
                    id="created"
                    name="created"
                    type="text"
                    disabled={true}
                    value={formState.values.created || ""}
                  />
                </GridItem>
              </GridContainer>
              <Button
                color="danger"
                className={classes.registerButton}
                onClick={closeModal}
                round
              >
                Close
              </Button>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </Animated>
  );
}

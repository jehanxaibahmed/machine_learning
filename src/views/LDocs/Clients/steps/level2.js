import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
// @material-ui/core components
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { Animated } from "react-animated-css";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import defaultAvatar from "assets/img/placeholder.jpg";
import AttachmentIcon from "@material-ui/icons/Attachment";
const sweetAlertStyle = makeStyles(styles2);
let Token = localStorage.getItem("cooljwt");
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

export default function Step2(props) {
  const useStyles = makeStyles(styles);
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
        {props.vendorData.level2.attachments.map((attach) => (
          <GridItem xs={12} sm={12} md={2}>
            <a
              style={{ color: "grey" }}
              href={`${process.env.REACT_APP_LDOCS_API_URL}/${attach.eAttachmentPath}`}
              target="_blank"
            >
              <Card profile>
                <CardHeader color="info" icon>
                  <CardIcon color="info">
                    <h4 className={classes.cardTitle}>
                      {attach.attachmentTitle}
                    </h4>
                  </CardIcon>
                </CardHeader>
                <CardBody profile>
                  <AttachmentIcon
                    style={{
                      alignSelf: "center",
                      width: 150,
                      height: 150,
                      marginBottom: 10,
                    }}
                    fontSize="large"
                  />
                </CardBody>
              </Card>
            </a>
          </GridItem>
        ))}
      </GridContainer>
    </Animated>
  );
}

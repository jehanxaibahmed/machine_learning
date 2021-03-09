import React, { useState, useEffect } from "react";
// @material-ui/icons
import { makeStyles, TextField } from "@material-ui/core";
// core components
import { Animated } from "react-animated-css";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Typography from "@material-ui/core/Typography";
import AttachmentIcon from "@material-ui/icons/Attachment";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import Card from "components/Card/Card.js";
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
      {props.attachments.length > 0 ? (
        <GridContainer style={{ paddingTop: 20 }}>
          {props.attachments.map((att, index) => (
            <GridItem xs={12} sm={3} md={2} lg={2}>
              <a style={{color:'grey'}} href={`${process.env.REACT_APP_LDOCS_API_URL}/${att.attachmentPath}`} target="_blank">
              <Card
                style={{
                  padding: "10px",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <AttachmentIcon
                  style={{
                    alignSelf: "center",
                    width: 50,
                    height: 50,
                    marginBottom: 10,
                  }}
                  fontSize="large"
                />
                <Typography variant="body2" component="h6">
                  {att.attachmentTitle}
                </Typography>
              </Card>
              </a>
            </GridItem>
          ))}
        </GridContainer>
      ) : (
        ""
      )}
    </Animated>
  );
}

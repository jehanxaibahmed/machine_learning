import React from "react";
import { useSelector } from "react-redux";
// @material-ui/core components
import {
  makeStyles,
  CircularProgress,
  Slide,
} from "@material-ui/core";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import defaultAvatar from "assets/img/placeholder.jpg";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { Animated } from "react-animated-css";
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
export default function SignatureStamp() {
  const classes = useStyles();
  const [signIsLoaded, setSignIsLoaded] = React.useState(false);
  const [stampIsLoaded, setStampIsLoaded] = React.useState(false);
  const [signature, setSignature] = React.useState("");
  const [stamp, setStamp] = React.useState("");

  const user = useSelector((state) => state.userReducer.userListData);
  
  React.useEffect(() => {
    if (typeof user.level3 != "undefined") {
        if (typeof user.level3.signatureURL != "undefined" || '' || null || undefined || "null") {
          // var preImage = user.level4.signatureURL;
          // var base64Flag = `data:${user.level4.eSignatureT};base64,`;
          // let profileImage = base64Flag + preImage;
          setSignature(user.level3.signatureURL);
          setSignIsLoaded(true);
        } else {
            setSignature(defaultAvatar);
            setSignIsLoaded(true);
        }
      } else {
        setSignature(defaultAvatar);
        setSignIsLoaded(true);
      }
    if (typeof user.level3 != "undefined") {
        if (typeof user.level3.stampURL != "undefined" || '' || null || undefined || "null") {
          // var preImage = user.level4.eStamp;
          // var base64Flag = `data:${user.level4.eStampT};base64,`;
          // let profileImage = base64Flag + preImage;
          setStamp(user.level3.stampURL);
          setStampIsLoaded(true);
        } else {
            setStamp(defaultAvatar);
            setStampIsLoaded(true);
        }
      } else {
        setStamp(defaultAvatar);
        setStampIsLoaded(true);
      }
  }, [user]);

  return (
    <div>
      <Animated
        animationIn="bounceInRight"
        animationOut="bounceOutLeft"
        animationInDuration={1000}
        animationOutDuration={1000}
        isVisible={true}
      >
        <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
              <Card profile>
                  <CardHeader color="info" icon>
                        <CardIcon color="info">
                          <h4 className={classes.cardTitle}>
                            Signature
                          </h4>
                        </CardIcon>
                      </CardHeader>
                <CardBody profile>
                  {signIsLoaded ? (
                    <a href="#signature" onClick={(e) => e.preventDefault()}>
                      <img style={{maxWidth:400,height:300}} src={signature} alt="..." />
                    </a>
                  ) : (
                    <CircularProgress disableShrink />
                  )}
                </CardBody>
              </Card>
            </GridItem>
        <GridItem xs={12} sm={12} md={6}>
              <Card profile>
                  <CardHeader color="info" icon>
                        <CardIcon color="info">
                          <h4 className={classes.cardTitle}>
                            Stamp
                          </h4>
                        </CardIcon>
                      </CardHeader>
                <CardBody profile>
                  {stampIsLoaded ? (
                    <a href="#stamp" onClick={(e) => e.preventDefault()}>
                      <img  style={{maxWidth:400,height:300}} src={stamp} alt="..." />
                    </a>
                  ) : (
                    <CircularProgress disableShrink />
                  )}
                </CardBody>
              </Card>
            </GridItem>
        </GridContainer>
      </Animated>
    </div>
  );
}

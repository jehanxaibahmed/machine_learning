import React, { useState, useEffect} from "react";
import { Redirect } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setToken } from "../../../actions";
import jwt from "jsonwebtoken";
import { Animated } from "react-animated-css";

const useStyles = makeStyles(styles);



export default function LoginSecret(props) {
  const [QRCode, setQRrCode] = useState("");
  const [Token, setUserToken] = useState("");
  const [isLoading,setIsloading] = useState(false);
  const [loggedIn, setloggedIn] = useState(false);
  const [isTenant, setIsTenant] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [twofa, setTwofa] = useState("");
  const [twofaError, setTwofaError] = useState("");
  const dispatch = useDispatch();


  const classes = useStyles();
  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
      var results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
    useEffect(() => {
    setUserToken(getParameterByName("activate"));
    setQRrCode(getParameterByName("qr").split(' ').join('+'));
    setIsTenant(getParameterByName('isTenant'));
    setIsVendor(getParameterByName('isVendor'));
    }, []);
   function handletwofa(event) {
     setTwofa(event.target.value);
   }
  function handleClick(e) {
    setIsloading(true);
    let url; 
    if(isTenant == 'true'){ url = `${process.env.REACT_APP_LDOCS_API_URL}/tenant/avotp`}
    else if(isVendor == 'true'){url = `${process.env.REACT_APP_LDOCS_API_URL}/vendor/activateOtp`}
    else{url = `${process.env.REACT_APP_LDOCS_API_URL}/user/activateOtp`}
    axios({
      method: "post", //you can set what request you want to be
      url: url,
      data: { otp: twofa },
      headers: {
        cooljwt: Token,
      },
    })
      .then((response) => {
        let token = response.headers.cooljwt;
        localStorage.setItem("cooljwt", token);
        dispatch(setToken(token));
        let decoded = jwt.decode(token);
        if (decoded.otp) {
          setIsloading(false);
          setTwofaError("success");
          setloggedIn(true);
          return(
            <Redirect to="/auth/activate" />
          )

        } else {
          setTwofaError("error");
        }
      })
      .catch((error) => {
        setTwofaError("error");
        setIsloading(false);
        console.log(
          typeof error.response != "undefined"
            ? error.response.data
            : error.message
        );
      });
  }

  return (
    <div className={classes.container}>
      {loggedIn ? <Redirect to="/auth/activate" /> : ""}
      <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={4}>
          <Animated
            animationIn="bounceInRight"
            animationOut="bounceOutLeft"
            animationInDuration={1000}
            animationOutDuration={1000}
            isVisible={true}
          >
            <div>
              <form>
                <Card login>
                  <CardHeader
                    className={`${classes.cardHeader} ${classes.textCenter}`}
                    color="info"
                  >
                    <h4 className={classes.cardTitle}>Activation</h4>
                  </CardHeader>
                  <CardBody>
                    <center>
                      <img
                        src={QRCode}
                        alt="QR Code"
                        style={{ maxWidth: "15vW" }}
                      />
                    </center>
                    <TextField
                      fullWidth
                      error={twofaError === "error"}
                      helperText={
                        twofaError === "error" ? "Valid OTP is required" : null
                      }
                      label="Secret Key..."
                      id="twofa"
                      name="twofa"
                      onChange={(event) => {
                        handletwofa(event);
                      }}
                      type="text"
                      value={twofa || ""}
                    />
                  </CardBody>
                  <CardFooter className={classes.justifyContentCenter}>
                    <Button
                      color="info"
                      simple
                      size="lg"
                      block
                      onClick={handleClick}
                    >
                      {isLoading ? <CircularProgress /> : "Enter Secret"} 
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </div>
          </Animated>
        </GridItem>
      </GridContainer>
    </div>
  );
}

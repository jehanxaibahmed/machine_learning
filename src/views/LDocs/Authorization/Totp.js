import React, { useState} from "react";
import { Redirect } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress } from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import TextField from "@material-ui/core/TextField";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";

import { Animated } from "react-animated-css";
import axios from "axios";
import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import Swal from 'sweetalert2'
import { successAlert, errorAlert, msgAlert }from "views/LDocs/Functions/Functions";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import  jwt  from "jsonwebtoken";
import { useSelector } from "react-redux";


const sweetAlertStyle = makeStyles(styles2);
const useStyles = makeStyles(styles);

export default function Totp() {
  const classes = useStyles();
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [confPasswordError, setConfPasswordError] = useState("");
  const [loggedIn, setloggedIn] = useState(false);
  const [isLoading,setIsloading] = useState(false);
  let token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  let decoded = jwt.decode(token);
    
  function handleClick(e) {
    // e.preventDefault();
    setIsloading(true);
    if (password !== confPassword) {
      setConfPasswordError("error");
      setIsloading(false);
      return false;
    } else {
      setPasswordError("success");
      setConfPasswordError("success");
    }
    let url;
    if(decoded.isTenant){
       url = `${process.env.REACT_APP_LDOCS_API_URL}/tenant/tenantpass`;
    }else if(decoded.isVendor){
      url = `${process.env.REACT_APP_LDOCS_API_URL}/vendor/vendorPass`;      
    }else{
       url = `${process.env.REACT_APP_LDOCS_API_URL}/user/userPassword`;      
    }
     axios({
       method: "post", //you can set what request you want to be
       url: url,
       data: { password: password },
       headers: {
         cooljwt: token,
       },
     })
       .then((response) => {
         setIsloading(false);
         successAlert();
         setloggedIn(true);
       })
       .catch((error) => {
        setIsloading(false);
         setConfPasswordError("error");
         console.log(
           typeof error.response != "undefined"
             ? error.response.data
             : error.message
         );
         errorAlert();
       });
  }

  return (
    <div className={classes.container}>
      {loggedIn ? decoded.isVendor ? <Redirect to="/auth/loginVendor" /> : <Redirect to="/auth/login" /> : ""}
       
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
                <Card login>
                  <CardHeader
                    className={`${classes.cardHeader} ${classes.textCenter}`}
                    color="info"
                  >
                    <h4 className={classes.cardTitle}>ACTIVATION</h4>
                  </CardHeader>
                  <CardBody>
                    <TextField
                      fullWidth
                      error={passwordError === "error"}
                      helperText={
                        passwordError === "error"
                          ? "Valid Password is required"
                          : null
                      }
                      label="Password"
                      id="password"
                      name="password"
                      onChange={(event) => {
                        setPassword(event.target.value);
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className={classes.inputAdornmentIcon}>
                              lock_outline
                            </Icon>
                          </InputAdornment>
                        ),
                      }}
                      type="password"
                      value={password || ""}
                    />
                    <TextField
                      fullWidth
                      error={confPasswordError === "error"}
                      helperText={
                        confPasswordError === "error"
                          ? "Password did not Matched"
                          : null
                      }
                      label="Confirm Password"
                      id="confPassword"
                      name="confPassword"
                      onChange={(event) => {
                        setConfPassword(event.target.value);
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className={classes.inputAdornmentIcon}>
                              lock_outline
                            </Icon>
                          </InputAdornment>
                        ),
                      }}
                      type="password"
                      value={confPassword || ""}
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
                      {isLoading ? <CircularProgress /> : "Let's Go"} 
                    </Button>
                  </CardFooter>
                </Card>
            </div>
          </Animated>
        </GridItem>
      </GridContainer>
    </div>
  );
}

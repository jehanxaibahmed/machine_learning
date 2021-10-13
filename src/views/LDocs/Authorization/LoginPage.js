import React, { useEffect, useState } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import CircularProgress from "@material-ui/core/CircularProgress";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../../../actions";
import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import axios from "axios";

const useStyles = makeStyles(styles);



export default function LoginPage(props) {
  const [loginnameError, setloginnameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [apiErrorMessage, setAPIErrorMessage] = useState("");
  const [logging, setlogging] = useState(false);
  const [loginName, setloginname] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const classes = useStyles();

 const handleLoginName = (event) => {
   event.persist();
   setloginname(event.target.value);
 };
 const handlePassword = (event) => {
   event.persist();
   setPassword(event.target.value);
  };
    const handleLoginIn = (event) => {
      event.preventDefault();

      setAPIErrorMessage("");
      setlogging(true);
      axios
        .post(`${process.env.REACT_APP_LDOCS_API_URL}/user/userLogin`, {
          email: loginName,
          password: password,
        })
        .then(async (response) => {
          setlogging(false);
          //let token = response.headers.cooljwt;
          localStorage.setItem("cooljwt", response.data);
          dispatch(setToken(response.data));
          setloginnameError("success");
          setPasswordError("success");
          
          props.loginSuccess();
        })
        .catch((error) => {
          setlogging(false);
          setloginnameError("error");
          setPasswordError("error");
          setAPIErrorMessage(typeof error.response != "undefined"
            ? error.response.data
            : error.message);
            setTimeout(function() {
              setAPIErrorMessage("");
            }, 2000);
        });
    };
    
    useEffect(()=>{
    })
  return (
    <div className={classes.container}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={4}>
          <form onSubmit={handleLoginIn}>
            <Card login>
              <CardHeader
                className={`${classes.cardHeader} ${classes.textCenter}`}
                color="info"
              >
                <h4 className={classes.cardTitle}>O-ZONE</h4>
              </CardHeader>
              <CardBody>
                <CustomInput
                  success={loginnameError === "success"}
                  error={loginnameError === "error"}
                  labelText="Email ID"
                  id="loginName"
                  name="loginName"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    onChange: (event) => {
                      handleLoginName(event);
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <Email className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    ),
                    type: "email",
                  }}
                />
                <CustomInput
                  success={passwordError === "success"}
                  error={passwordError === "error"}
                  labelText="Password"
                  id="password"
                  name="password"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    onChange: (event) => {
                      handlePassword(event);
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icon className={classes.inputAdornmentIcon}>
                          lock_outline
                        </Icon>
                      </InputAdornment>
                    ),
                    type: "password",
                    autoComplete: "off",
                  }}
                />
                <br />
                <h6 style={{ color: "red" }}>{apiErrorMessage}</h6>
              </CardBody>
              <CardFooter className={classes.justifyContentCenter}>
                <Button color="info" simple size="lg" type="submit" block>
                {logging ? <CircularProgress /> : "Let's Go"} 
                </Button>
                
              </CardFooter>
            </Card>
          </form>
        </GridItem>
      </GridContainer>
    </div>
  );
}
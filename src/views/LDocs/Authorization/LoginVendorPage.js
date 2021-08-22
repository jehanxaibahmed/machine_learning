import React, { useState } from "react";
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
import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";
import axios from "axios";
import jwt from "jsonwebtoken";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../../../actions";
import DeviceUUID , { getToken } from "views/LDocs/Functions/Functions";
let uuid = new DeviceUUID().get();
let os = new DeviceUUID().parse().os;
let firebase_token;
getToken().then(res=>{
  firebase_token = res;
});

const useStyles = makeStyles(styles);
export default function LoginVendorPage(props) {
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
      .post(`${process.env.REACT_APP_LDOCS_API_URL}/vendor/vendorLogin`, {
        email: loginName,
        password: password,
      })
      .then(async (response) => {
        console.log(firebase_token);
        await axios({
          method: "post", //you can set what request you want to be
          url: `${process.env.REACT_APP_LDOCS_API_URL}/vendor/updateFcm`,
          data: {
            osType : os,
            fcmToken:firebase_token,
            deviceId:uuid
          },
          headers: {
            cooljwt: response.data.token,
          },
        });
        setlogging(false);
        localStorage.setItem("cooljwt", response.data.token);
        dispatch(setToken(response.data.token));
        setloginnameError("success");
        setPasswordError("success");
        props.loginSuccess();
      })
      .catch((error) => {
        setlogging(false);
        setloginnameError("error");
        setPasswordError("error");
        setAPIErrorMessage(
          typeof error.response != "undefined"
            ? error.response.data
            : error.message
        );
        setTimeout(function() {
          setAPIErrorMessage("");
        }, 2000);
      });
  };
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
                <h4 className={classes.cardTitle}>S-ZONE</h4>
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

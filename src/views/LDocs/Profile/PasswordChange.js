import React, { useState } from "react";
// @material-ui/core components
import {
  Button,
  makeStyles,
  CircularProgress,
  TextField,
} from "@material-ui/core";
// @material-ui/icons

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Clearfix from "components/Clearfix/Clearfix.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import { Animated } from "react-animated-css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import jwt from "jsonwebtoken";
import { setIsTokenExpired } from "actions";

const useStyles = makeStyles(styles);

export default function ChangePassword(props) {
  const classes = useStyles();
  //Token
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const dispatch = useDispatch();
  const [animateProfile, setAnimateProfile] = useState(true);
  const [formState, setFormState] = useState({
    isLoading: false,
    values: {
      passwordOld: "",
      passwordNew: "",
      passwordConfirm: "",
    },
    errors: {
      passwordOld: "",
      passwordNew: "",
      passwordConfirm: "",
    },
  });

      const handleChange = (event) => {
        event.persist();

        setFormState((formState) => ({
          ...formState,
          values: {
            ...formState.values,
            [event.target.name]: event.target.value,
          },
        }));
    };
    const changeUserPassword = () => {
        setFormState((formState) => ({
            ...formState,
            isLoading: true,
        }));
        let passwordOld;
        let passwordNew;
        let passwordConfirm;
        const Check = require("is-null-empty-or-undefined").Check;
        var error = false;
        if (!Check(formState.values.passwordOld)) {
            passwordOld = "success";
        } else {
            passwordOld = "error";
            error = true;
        }
        if (!Check(formState.values.passwordNew)) {
            passwordNew = "success";
        } else {
            passwordNew = "error";
            error = true;
        }
        if (!Check(formState.values.passwordConfirm)) {
            passwordConfirm = "success";
        } else {
            passwordConfirm = "error";
            error = true;
        }
        if (formState.values.passwordNew == formState.values.passwordConfirm) {
            passwordConfirm = "success";
        } else {
            passwordConfirm = "error";
            error = true;
        }
        setFormState((formState) => ({
            ...formState,
            errors: {
                ...formState.errors,
                passwordOld: passwordOld,
                passwordNew: passwordNew,
                passwordConfirm: passwordConfirm
            },
        }));
    if (error) {
      setFormState((formState) => ({
        ...formState,
        isLoading: false,
      }));
      return false;
    } else {
      let data = {
        oldpassword: formState.values.passwordOld,
        password: formState.values.passwordNew,
      };

      axios({
        method: "POST",
        url: jwt.decode(Token).isTenant ?  `${process.env.REACT_APP_LDOCS_API_URL}/tenant/tenantpass` : `${process.env.REACT_APP_LDOCS_API_URL}/user/userPassword`,
        data: data,
        headers: { cooljwt: Token },
      })
          .then((response) => {
             setFormState((formState) => ({
               ...formState,
               isLoading: false,
               values: {
                 ...formState.values,
                 passwordOld: "",
                 passwordNew: "",
                 passwordConfirm: "",
               },
               errors: {
                 ...formState.errors,
                 passwordOld: "",
                 passwordNew: "",
                 passwordConfirm: "",
               },
             }));
          props.successAlert("Password Changed Successfully!");
        })
        .catch((error) => {
          if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
          setFormState((formState) => ({
            ...formState,
            isLoading: false,
          }));
          props.errorAlert(
            typeof error.response != "undefined"
              ? error.response.data
              : error.message
          );
        });
    }
     };
  return (
    <Animated
      animationIn="bounceInRight"
      animationOut="bounceOutLeft"
      animationInDuration={1000}
      animationOutDuration={1000}
      isVisible={animateProfile}
    >
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="info" icon>
                <CardIcon color="info">Change Password</CardIcon>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    style={{ marginBottom: "10px", marginTop: "10px" }}
                  >
                    <TextField
                      fullWidth={true}
                      error={formState.errors.passwordOld === "error"}
                      helperText={
                        formState.errors.passwordOld === "error"
                          ? "Valid Password is required"
                          : null
                      }
                      label="Password"
                      id="passwordOld"
                      name="passwordOld"
                      onChange={(event) => {
                        handleChange(event);
                      }}
                      type="password"
                      value={formState.values.passwordOld || ""}
                    />
                  </GridItem>
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    style={{ marginBottom: "10px", marginTop: "10px" }}
                  >
                    <TextField
                      fullWidth={true}
                      error={formState.errors.passwordNew === "error"}
                      helperText={
                        formState.errors.passwordNew === "error"
                          ? "Valid New Password is required"
                          : null
                      }
                      label="New Password"
                      id="passwordNew"
                      name="passwordNew"
                      onChange={(event) => {
                        handleChange(event);
                      }}
                      type="password"
                      value={formState.values.passwordNew || ""}
                    />
                  </GridItem>
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    style={{ marginBottom: "10px", marginTop: "10px" }}
                  >
                    <TextField
                      fullWidth={true}
                      error={formState.errors.passwordConfirm === "error"}
                      helperText={
                        formState.errors.passwordConfirm === "error"
                          ? "Valid Confirm Password is required"
                          : null
                      }
                      label="Confirm Password"
                      id="passwordConfirm"
                      name="passwordConfirm"
                      onChange={(event) => {
                        handleChange(event);
                      }}
                      type="password"
                      value={formState.values.passwordConfirm || ""}
                    />
                  </GridItem>
                </GridContainer>
                <Clearfix />
                <Button
                  color="info"
                  round
                  style={{
                    backgroundColor: "#007f5e",
                    color: "white",
                    float: "right",
                  }}
                  onClick={changeUserPassword}
                >
                  Update Password
                </Button>
                {formState.isLoading ? <CircularProgress disableShrink /> : ""}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    </Animated>
  );
}

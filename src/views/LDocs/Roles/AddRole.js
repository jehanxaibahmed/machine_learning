/*eslint-disable*/
import React, { useState } from "react";
// @material-ui/core components
import { TextField, makeStyles, CircularProgress, MenuItem, Checkbox, FormControlLabel } from "@material-ui/core";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import axios from "axios";
import jwt from "jsonwebtoken";
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { useSelector, useDispatch } from "react-redux";
import { setIsTokenExpired } from "actions/index.js";
import { successAlert, errorAlert } from "views/LDocs/Functions/Functions";


const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

export default function AddRole(props) {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const dispatch = useDispatch();
  const [currencyLookups, setCurrencyLookups] = React.useState([]);
  const [formState, setFormState] = useState({
    isRegistering: false,
    message: "",
    values: {
      name: "",
      isAdmin: false
    },
    errors: {
      name: "",
      isAdmin: ""
    },
  });
  const [tradeFile, setTradeFile] = useState(null);
  const [displayLogo, setDisplayLogo] = useState(null);
  const handleImageChange = (file, status, imageName) => {

    if (status == 1) {
      if (imageName == "tradeLicenseImage") {
        setTradeFile(file);
      } else if ("displayLogo") {
        setDisplayLogo(file);
      }

    } else {
      if (imageName == "tradeLicenseImage") {
        setTradeFile(null);
      } else if ("displayLogo") {
        setDisplayLogo(null);
      }
    }
  };
  const handleChange = (event) => {
    event.persist();

    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.name == "isAdmin" ?  !formState.values.isAdmin : event.target.value.toUpperCase(),
      },
    }));
  };
  // function that returns true if value is email, false otherwise
  const verifyEmail = (value) => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };

  const handleSignUp = () => {
    setFormState((formState) => ({
      ...formState,
      isRegistering: true,
    }));
    let name;
    let isAdmin;
    const Check = require("is-null-empty-or-undefined").Check;
    var error = false;

    if (!Check(formState.values.name)) {
      name = "success";
    } else {
      name = "error";
      error = true;
    }

    setFormState((formState) => ({
      ...formState,
      errors: {
        ...formState.errors,
        name: name,
      }
    }));
    if (error) {
      setFormState((formState) => ({
        ...formState,
        isRegistering: false,
        message: "Invalid User Details!",
      }));
      return false;
    } else {
      var bodyFormData = {
        "roleName": formState.values.name,
        "isAdmin": formState.values.isAdmin
      }
      let msg = "";
      axios({
        method: "post",
        url: `${process.env.REACT_APP_LDOCS_API_URL}/user/saveRole`,
        data: bodyFormData,
        headers: { cooljwt: Token },
      })
        .then((response) => {
          removeImages();
          props.getRoles();
          setFormState((formState) => ({
            ...formState,
            message: "Role has been successfully Added ",
            isRegistering: false,
          }));
          setTradeFile(null);
          setDisplayLogo(null);
          msg = "Role has been Successfully Added ";
          successAlert(msg);
          closeModal();
        })
        .catch((error) => {
          if (error.response) { error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
          setFormState((formState) => ({
            ...formState,
            message:
              typeof error.response != "undefined"
                ? error.response.data
                : error.message,
            isRegistering: false,
          }));
          msg =
            typeof error.response != "undefined"
              ? error.response.data
              : error.message;
          errorAlert(msg);
        });
    }
  }

  React.useEffect(() => {
  }, [])

  const closeModal = () => {
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        name: "",
        isAdmin: false
      },
      errors: {
        ...formState.errors,
        name: "",
        isAdmin: ""
      },
    }));
    props.closeModal();
  }
  const classes = useStyles();
  const removeImages = () => {
    if (document.getElementById("removeTradeImage") != null) {
      document.getElementById("removeTradeImage").click();
    }
    if (document.getElementById("removeLogoImage") != null) {
      document.getElementById("removeLogoImage").click();
    }
  }
  return (
    <GridContainer>

      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info" icon>
            <CardIcon color="info">
              <h4 className={classes.cardTitle}>
                Add Role
              </h4>
            </CardIcon>
          </CardHeader>
          <CardBody>
            <form>
              <GridContainer>
                <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    fullWidth={true}
                    error={formState.errors.name === "error"}
                    helperText={
                      formState.errors.name === "error"
                        ? "Valid name is required"
                        : null
                    }
                    label="Role Name"
                    id="name"
                    name="name"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="text"
                    value={formState.values.name || ""}
                  />
                </GridItem>
                {/* <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <FormControlLabel

                    control={<Checkbox
                      size="large"
                      checked={formState.values.isAdmin}
                      onChange={handleChange}
                      name="isAdmin" />}
                    label="Admin"
                  />
                </GridItem> */}
              </GridContainer>
              <Button
                color="info"
                className={classes.registerButton}
                round
                type="button"
                onClick={handleSignUp}
              >
                Save
              </Button>
              {formState.isRegistering ? (
                <CircularProgress disableShrink />
              ) : (
                ""
              )}
              <Button
                color="danger"
                className={classes.registerButton}
                onClick={closeModal}
                round
              >
                Close
              </Button>
            </form>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

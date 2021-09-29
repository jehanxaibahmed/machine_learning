/*eslint-disable*/
import React, { useState, useEffect } from "react";
// @material-ui/core components
import {
  TextField,
  makeStyles,
  CircularProgress,
  MenuItem,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import Swal from "sweetalert2";
import {
  successAlert,
  errorAlert,
  msgAlert,
} from "views/LDocs/Functions/Functions";
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
import { useDispatch, useSelector } from "react-redux";
import { setIsTokenExpired } from "actions";
import Refresh from "@material-ui/icons/Refresh";

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

export default function AddAccount(props) {
  // register form
  const dispatch = useDispatch();
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  const [formState, setFormState] = useState({
    isRegistering: false,
    message: "",
    orgs: [],
    selectedOrg: {},
    values: {
      Acc_NO: "",
      Acc_Description: "",
      Acc_Type: "",
      Acc_Opening_Balance: 0,
      Acc_Ref_Remarks: "",
    },
    errors: {
      Acc_NO: "",
      Acc_Description: "",
      Acc_Type: "",
      Acc_Opening_Balance: "",
      Acc_Ref_Remarks: "",
    },
  });
  useEffect(() => {}, []);
  const userDetails = jwt.decode(Token);

  //Handle Change
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

  const account_types = [
    "Expenses",
    "Assets",
    "Revenue",
    "Liabilities",
    "Equity",
  ];

  const saveAccount = () => {
    setFormState((formState) => ({
      ...formState,
      isRegistering: true,
    }));
    let Acc_NO, Acc_Description, Acc_Type, Acc_Opening_Balance, Acc_Ref_Remarks;
    const Check = require("is-null-empty-or-undefined").Check;
    var error = false;

    if (!Check(formState.values.Acc_NO)) {
      Acc_NO = "success";
    } else {
      Acc_NO = "error";
      error = true;
    }
    if (!Check(formState.values.Acc_Description)) {
      Acc_Description = "success";
    } else {
      Acc_Description = "error";
      error = true;
    }
    if (!Check(formState.values.Acc_Type)) {
      Acc_Type = "success";
    } else {
      Acc_Type = "error";
      error = true;
    }

    if (!Check(formState.values.Acc_Opening_Balance)) {
      Acc_Opening_Balance = "success";
    } else {
      Acc_Opening_Balance = "error";
      error = true;
    }

    setFormState((formState) => ({
      ...formState,
      errors: {
        ...formState.errors,
        Acc_NO,
        Acc_Description,
        Acc_Type,
        Acc_Opening_Balance,
      },
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
        Acc_NO: formState.values.Acc_NO,
        Acc_Description: formState.values.Acc_Description,
        Acc_Type: formState.values.Acc_Type,
        Acc_Opening_Balance: formState.values.Acc_Opening_Balance,
        Acc_Ref_Remarks: formState.values.Acc_Ref_Remarks,
        Status: true,
      };
      let msg = "";
      axios({
        method: "post",
        url: `${process.env.REACT_APP_LDOCS_API_URL}/tenant/saveAccount`,
        data: bodyFormData,
        headers: { cooljwt: Token },
      })
        .then((response) => {
          props.getCOA();
          setFormState((formState) => ({
            ...formState,
            message: "Account has been successfully Added!",
            isRegistering: false,
          }));
          msg = "Account Added Successfully!";
          successAlert(msg);
        })
        .catch((error) => {
          if (error.response) {
            error.response.status == 401 && dispatch(setIsTokenExpired(true));
          }
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
  };
  const closeModal = () => {
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        Acc_NO: "",
        Acc_Description: "",
        Acc_Type: "",
        Acc_Opening_Balance: "",
        Acc_Ref_Remarks: "",
      },
      errors: {
        ...formState.errors,
        Acc_NO: "",
        Acc_Description: "",
        Acc_Type: "",
        Acc_Opening_Balance: "",
        Acc_Ref_Remarks: "",
      },
    }));
    props.closeModal();
  };
  const classes = useStyles();
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info" icon>
            <CardIcon color="info">
              <h4 className={classes.cardTitle}>Add Account</h4>
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
                    error={formState.errors.Acc_Description === "error"}
                    helperText={
                      formState.errors.Acc_Description === "error"
                        ? "Valid Account Description is required"
                        : null
                    }
                    label="Account Description"
                    id="Acc_Description"
                    name="Acc_Description"
                    onChange={handleChange}
                    type="text"
                    value={formState.values.Acc_Description || ""}
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    fullWidth={true}
                    error={formState.errors.Acc_NO === "error"}
                    helperText={
                      formState.errors.Acc_NO === "error"
                        ? "Valid Account No is required"
                        : null
                    }
                    label="Account No"
                    id="accountNO"
                    name="Acc_NO"
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="text"
                    value={formState.values.Acc_NO || ""}
                  />
                </GridItem>
                <GridItem
                  xs={10}
                  sm={10}
                  md={4}
                  lg={4}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    className={classes.textField}
                    error={formState.errors.Acc_Type === "error"}
                    fullWidth={true}
                    helperText={
                      formState.errors.Acc_Type === "error"
                        ? "Account Type is required"
                        : null
                    }
                    label="Account Type"
                    name="Acc_Type"
                    onChange={handleChange}
                    select
                    value={formState.values.Acc_Type || ""}
                  >
                    <MenuItem
                      disabled
                      classes={{
                        root: classes.selectMenuItem,
                      }}
                    >
                      Choose Account Type
                    </MenuItem>
                    {account_types.map((type, index) => {
                      return (
                        <MenuItem key={index} value={type}>
                          {type}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    fullWidth={true}
                    error={formState.errors.Acc_Opening_Balance === "error"}
                    helperText={
                      formState.errors.Acc_Opening_Balance === "error"
                        ? "Valid Account Opening Balance is required"
                        : null
                    }
                    label="Opening Balance"
                    id="openingBalance"
                    name="Acc_Opening_Balance"
                   
                    onChange={(event) => {
                      handleChange(event);
                    }}
                    type="number"
                    value={formState.values.Acc_Opening_Balance || ""}
                  />
                </GridItem>

                <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    fullWidth={true}
                    error={formState.errors.Acc_Ref_Remarks === "error"}
                    helperText={
                      formState.errors.Acc_Ref_Remarks === "error"
                        ? "Valid Remarks is required"
                        : null
                    }
                    label="Reference Remarks"
                    id="Acc_Ref_Remarks"
                    multiline
                    minRows="3"
                    name="Acc_Ref_Remarks"
                    onChange={handleChange}
                    type="text"
                    value={formState.values.Acc_Ref_Remarks || ""}
                  />
                </GridItem>

               
              </GridContainer>
              <Button
                color="info"
                className={classes.registerButton}
                round
                type="button"
                onClick={saveAccount}
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

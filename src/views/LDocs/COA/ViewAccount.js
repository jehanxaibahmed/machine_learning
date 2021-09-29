/*eslint-disable*/
import React, { useState } from "react";
// @material-ui/core components
import {
  TextField,
  makeStyles,
  CircularProgress,
  Slide,
  Dialog,
  MenuItem,
} from "@material-ui/core";
import Swal from "sweetalert2";
import {
  successAlert,
  errorAlert,
  msgAlert,
} from "views/LDocs/Functions/Functions";
import { getCompanies } from "actions";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import axios from "axios";
import { Animated } from "react-animated-css";
import { useDispatch, useSelector } from "react-redux";
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import jwt from "jsonwebtoken";
import OtpCheck from "../Authorization/OtpCheck";
import { setIsTokenExpired } from "actions";
const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function ViewComp(props) {
  // register form
  const dispatch = useDispatch();
  const [animateTable, setAnimateTable] = React.useState(true);
  const [otpModal, setotpModal] = React.useState(false);
  const [OTP, setOTP] = React.useState("");
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  let { AccDetail } = props;
  const [formState, setFormState] = useState({
    isLoading: true,
    isRegistering: false,
    orgs: [],
    values: {
      Acc_NO: AccDetail.Acc_NO,
      Acc_Description: AccDetail.Acc_Description,
      Acc_Type: AccDetail.Acc_Type,
      Acc_Opening_Balance: AccDetail.Acc_Opening_Balance,
      Acc_Ref_Remarks: AccDetail.Acc_Ref_Remarks,
      Status: AccDetail.status,
    },
    errors: {
      errors: {
        Acc_NO: "",
        Acc_Description: "",
        Acc_Type: "",
        Acc_Opening_Balance: "",
        Acc_Ref_Remarks: "",
      },
    },
  });

  React.useEffect(() => {}, []);

  const account_types = [
    "Expenses",
    "Assets",
    "Revenue",
    "Liabilities",
    "Equity",
  ];

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

  const handleUpdate = () => {
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
      if (!OTP) {
        setotpModal(true);
        return false;
      }
      setFormState((formState) => ({
        ...formState,
        isRegistering: true,
      }));

      var bodyFormData = {
        Acc_NO: formState.values.Acc_NO,
        Acc_Description: formState.values.Acc_Description,
        Acc_Type: formState.values.Acc_Type,
        Acc_Opening_Balance: formState.values.Acc_Opening_Balance,
        Acc_Ref_Remarks: formState.values.Acc_Ref_Remarks,
        accountId:AccDetail._id,
        createdBy:AccDetail.createdBy,
        status:true ,
        otp: OTP,
      };
      let msg = "";
      axios({
        method: "put",
        url: `${process.env.REACT_APP_LDOCS_API_URL}/tenant/updateAccount`,
        data: bodyFormData,
        headers: { cooljwt: Token },
      })
        .then((response) => {
          setOTP("");
          props.getCOA();
          setFormState((formState) => ({
            ...formState,
            isRegistering: false,
          }));
          msg = "Account Updated Successfully!";
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
  React.useEffect(() => {
    if (!otpModal) {
      const Check = require("is-null-empty-or-undefined").Check;
      if (!Check(OTP)) {
        handleUpdate();
      }
    }
  }, [otpModal]);
  const setOtpValue = (value) => {
    setOTP(value);
    setotpModal(false);
  };
  const classes = useStyles();
  return (
    <Animated
      animationIn="bounceInRight"
      animationOut="bounceOutLeft"
      animationInDuration={1000}
      animationOutDuration={1000}
      isVisible={animateTable}
    >
      {otpModal ? (
        <Dialog
          classes={{
            root: classes.center + " " + classes.modalRoot,
            paper: classes.modal,
          }}
          fullWidth={true}
          maxWidth={"xs"}
          open={otpModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setotpModal(false)}
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description"
        >
          <OtpCheck setOtpValue={setOtpValue} />
        </Dialog>
      ) : (
        ""
      )}
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="info" icon>
              <CardIcon color="info">
                <h4 className={classes.cardTitle}>Account Details</h4>
              </CardIcon>
            </CardHeader>
            <CardBody>
              <GridContainer>
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
                    disabled={!props.Updating}
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
                    disabled={!props.Updating}
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
                    disabled={!props.Updating}
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
                    disabled={!props.Updating}
                    name="Acc_Ref_Remarks"
                    onChange={handleChange}
                    multiline
                    minRows="3"
                    type="text"
                    value={formState.values.Acc_Ref_Remarks || ""}
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
                    error={formState.errors.Acc_Description === "error"}
                    helperText={
                      formState.errors.Acc_Description === "error"
                        ? "Valid Account Description is required"
                        : null
                    }
                    label="Account Description"
                    id="Acc_Description"
                    disabled={!props.Updating}
                    name="Acc_Description"
                    multiline
                    minRows="3"
                    onChange={handleChange}
                    type="text"
                    value={formState.values.Acc_Description || ""}
                  />
                </GridItem>
              </GridContainer>
              {props.Updating ? (
                <>
                  <Button
                    color="info"
                    className={classes.registerButton}
                    disabled={formState.isRegistering}
                    round
                    type="button"
                    onClick={handleUpdate}
                  >
                    Update
                  </Button>
                  {formState.isRegistering ? (
                    <CircularProgress disableShrink />
                  ) : (
                    ""
                  )}
                </>
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
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </Animated>
  );
}

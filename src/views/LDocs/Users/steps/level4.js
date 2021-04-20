
import React, { useState } from "react";
// @material-ui/icons
import {
  Button,
  makeStyles,
  CircularProgress,
  TextField,
  
} from "@material-ui/core";
// @material-ui/core components

// core components
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import { Animated } from "react-animated-css";
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import SweetAlert from "react-bootstrap-sweetalert";
import axios from "axios";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import LevelAuthorization from "./modal/LevelAuthorization"
import LevelAccessgroup from "./modal/LevelAccessgroup"
import LevelFilegroup from "./modal/LevelFilegroup"
import Slide from "@material-ui/core/Slide";
import SignatureUpload from "./signatureUpload.js";
import StampUpload from "./stampUpload.js";
import { setIsTokenExpired } from "actions";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function Step4(props) {
  const classes = useStyles();
  const [authorizationModal , setauthorizationModal] = useState(false);
  const [accessgroupModal , setaccessgroupModal] = useState(false);
  const [filegroupModal, setfilegroupModal] = useState(false);
  const dispatch = useDispatch();
  
  var row = props.userData.level3;
  var row4 = props.userData.level4;
  const [formState, setFormState] = useState({
    isLoading: false,
    values: {
      loginName: typeof row.loginName != "undefined" ? row.loginName : "",
      fam: typeof row4.accessGroup != "undefined" ? row4.accessGroup : "",
      authorization: typeof row4.authorizationGroup != "undefined" ? row4.authorizationGroup : "",
      fileGroup: typeof row4.fileGroup != "undefined" ? row4.fileGroup : "",
      signature: typeof row4.signature != "undefined" ? row4.signature : "",
      accessUserGroup: []
    },
    errors: {},
  });
  const handleChange = (accessUserGroup) => {
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        accessUserGroup: accessUserGroup,
      },
    }));
  };

  const sweetClass = sweetAlertStyle();
  const [alert, setAlert] = React.useState(null);
  const successAlert = (msg) => {
    setAlert(
      <SweetAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Success!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={sweetClass.button + " " + sweetClass.success}
      >
        {msg}
      </SweetAlert>
    );
  };
  const errorAlert = (msg) => {
    setAlert(
      <SweetAlert
        error
        style={{ display: "block", marginTop: "-100px" }}
        title="Error!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={sweetClass.button + " " + sweetClass.danger}
      >
        {msg}
        <br />
        Unable To Update Level 4 Please Contact {process.env.REACT_APP_LDOCS_CONTACT_MAIL}
      </SweetAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };

  const saveUserLevelFour = () => {
    setFormState((formState) => ({
      ...formState,
      isLoading: true,
    }));
    let authorization;
    let fam;
    let fileGroup;

    const Check = require("is-null-empty-or-undefined").Check;
    var error = false;

 
    if (!Check(formState.values.fam)) {
      fam = "success";
    } else {
      fam = "error";
      error = true;
    }
    if (!Check(formState.values.authorization)) {
      authorization = "success";
    } else {
      authorization = "error";
      error = true;
    }
   if (!Check(formState.values.fileGroup)) {
       fileGroup = "success";
     
   } else {
      fileGroup = "error";
     error = true;
   }
   
    setFormState((formState) => ({
      ...formState,
      errors: {
        ...formState.errors,
        fam: fam,
        authorization: authorization,
        fileGroup: fileGroup,
      },
    }));
    if (error) {
      setFormState((formState) => ({
        ...formState,
        isLoading: false,
      }));
      return false;
    } else {
      var data = {
        loginName: formState.values.loginName,
        authorizationGroup: formState.values.authorization,
        accessGroup: formState.values.fam,
        fileGroup: formState.values.fileGroup,
        signature: formState.values.signature,
      };
      let msg = "";
      let Token = localStorage.getItem("cooljwt");

      axios({
        method: "post",
        url: `${process.env.REACT_APP_LDOCS_API_URL}/dev/upd/avuserfour`,
        data: data,
        headers: { cooljwt: Token },
      })
        .then((response) => {
          props.userData.level4.authorizationGroup = data.authorizationGroup;
          props.userData.level4.accessGroup = data.accessGroup;
          props.userData.level4.fileGroup = data.fileGroup;
          props.userData.level4.signature = data.signature;
          props.updateUserData(props.userData);
          setFormState((formState) => ({
            ...formState,
            isLoading: false,
          }));
          msg = "Level 4 Info Updated Successfully!";
          successAlert(msg);
        })
        .catch((error) => {
          error.response.status == 401 && dispatch(setIsTokenExpired(true));
          setFormState((formState) => ({
            ...formState,
            isLoading: false,
          }));
          msg =
            typeof error.response != "undefined"
              ? error.response.data
              : error.message;
          errorAlert(msg);
        });
    }
  };

  const setAccessCode = (code) => {
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        fam: code,
      },
    }));
  }
  const setAuthorizeCode = (code) => {
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        authorization: code,
      },
    }));
  };
  const setFileGroupCode = (code) => {
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        fileGroup: code,
      },
    }));
  };
  return (
    <div>
      {/** level authorization */}
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={12} className={classes.center}>
          {authorizationModal ? (
            <Dialog
              classes={{
                root: classes.center + " " + classes.modalRoot,
                paper: classes.modal,
              }}
              fullWidth={true}
              maxWidth={"md"}
              open={authorizationModal}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => setauthorizationModal(false)}
              aria-labelledby="classic-modal-slide-title"
              aria-describedby="classic-modal-slide-description"
            >
              <DialogContent
                id="classic-modal-slide-description"
                className={classes.modalBody}
              >
                <LevelAuthorization
                  closeModal={() => setauthorizationModal(false)}
                  setAuthorizeCode={setAuthorizeCode}
                />
              </DialogContent>
            </Dialog>
          ) : (
            ""
          )}
        </GridItem>
      </GridContainer>

      {/** level accessGroup */}
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={12} className={classes.center}>
          {accessgroupModal ? (
            <Dialog
              classes={{
                root: classes.center + " " + classes.modalRoot,
                paper: classes.modal,
              }}
              fullWidth={true}
              maxWidth={"md"}
              open={accessgroupModal}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => setaccessgroupModal(false)}
              aria-labelledby="classic-modal-slide-title"
              aria-describedby="classic-modal-slide-description"
            >
              <DialogContent
                id="classic-modal-slide-description"
                className={classes.modalBody}
              >
                <LevelAccessgroup
                  closeModal={() => setaccessgroupModal(false)}
                  setAccessCode={setAccessCode}
                />
              </DialogContent>
            </Dialog>
          ) : (
            ""
          )}
        </GridItem>
      </GridContainer>

      {/** level accessGroup */}
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={12} className={classes.center}>
          {filegroupModal ? (
            <Dialog
              classes={{
                root: classes.center + " " + classes.modalRoot,
                paper: classes.modal,
              }}
              fullWidth={true}
              maxWidth={"md"}
              open={filegroupModal}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => setfilegroupModal(false)}
              aria-labelledby="classic-modal-slide-title"
              aria-describedby="classic-modal-slide-description"
            >
              <DialogContent
                id="classic-modal-slide-description"
                className={classes.modalBody}
              >
                <LevelFilegroup
                  closeModal={() => setfilegroupModal(false)}
                  setFileGroupCode={setFileGroupCode}
                />
              </DialogContent>
            </Dialog>
          ) : (
            ""
          )}
        </GridItem>
      </GridContainer>

      <Animated
        animationIn="bounceInRight"
        animationOut="bounceOutLeft"
        animationInDuration={1000}
        animationOutDuration={1000}
        isVisible={true}
      >
        {alert}
        <GridContainer justify="center" lg={12} md={12} xs={12} sm={12}>
          <GridItem
            xs={12}
            sm={12}
            md={4}
            lg={4}
            style={{ marginBottom: "10px", marginTop: "10px" }}
          >
            <TextField
              className={classes.textField}
              error={formState.errors.fam === "error"}
              fullWidth={true}
              helperText={
                formState.errors.fam === "error" ? "email is required" : null
              }
              label="File Access Mode"
              name="fam"
              onChange={(event) => {
                handleChange(event);
              }}
              type="text"
              disabled={props.disabledCheck}
              value={formState.values.fam || ""}
              onClick={(event) =>
                setaccessgroupModal(props.disabledCheck ? false : true)
              }
              InputProps={{
                readOnly: true,
              }}
            />
          </GridItem>
          <GridItem
            xs={12}
            sm={12}
            md={4}
            lg={4}
            style={{ marginBottom: "10px", marginTop: "10px" }}
          >
            <TextField
              className={classes.textField}
              error={formState.errors.authorization === "error"}
              fullWidth={true}
              helperText={
                formState.errors.authorization === "error"
                  ? "authorization code is required"
                  : null
              }
              label="Authorization Group for user"
              name="authorization"
              onChange={(event) => {
                handleChange(event);
              }}
              type="text"
              disabled={props.disabledCheck}
              value={formState.values.authorization || ""}
              onClick={(event) =>
                setauthorizationModal(props.disabledCheck ? false : true)
              }
              InputProps={{
                readOnly: true,
              }}
            ></TextField>
          </GridItem>
          <GridItem
            xs={12}
            sm={12}
            md={4}
            lg={4}
            style={{ marginBottom: "10px", marginTop: "10px" }}
          >
            <TextField
              className={classes.textField}
              error={formState.errors.fileGroup === "error"}
              fullWidth={true}
              helperText={
                formState.errors.fileGroup === "error"
                  ? "fileGroup is required"
                  : null
              }
              label="File Access Group"
              name="fileGroup"
              onChange={(event) => {
                handleChange(event);
              }}
              onClick={(event) =>
                setfilegroupModal(props.disabledCheck ? false : true)
              }
              type="text"
              disabled={props.disabledCheck}
              value={formState.values.fileGroup || ""}
              InputProps={{
                readOnly: true,
              }}
            ></TextField>
          </GridItem>
          <GridItem
            xs={12}
            sm={12}
            md={6}
            lg={6}
            style={{ marginBottom: "10px", marginTop: "10px" }}
          >
            <legend>Signature Upload</legend>
            <SignatureUpload
              addButtonProps={{
                color: "info",
                round: true,
              }}
              changeButtonProps={{
                color: "warning",
                round: true,
              }}
              removeButtonProps={{
                color: "danger",
                round: true,
              }}
              uploadButtonProps={{
                color: "success",
                round: true,
              }}
              signImg={props.userData}
              name="signatureImage"
              avatar
              disabledCheck={props.disabledCheck}
              successAlert={successAlert}
              errorAlert={errorAlert}
            />
          </GridItem>
          <GridItem
            xs={12}
            sm={12}
            md={6}
            lg={6}
            style={{ marginBottom: "10px", marginTop: "10px" }}
          >
            <legend>Stamp Upload</legend>
            <StampUpload
              addButtonProps={{
                color: "info",
                round: true,
              }}
              changeButtonProps={{
                color: "warning",
                round: true,
              }}
              removeButtonProps={{
                color: "danger",
                round: true,
              }}
              uploadButtonProps={{
                color: "success",
                round: true,
              }}
              name="signatureImage"
              stampImg={props.userData}
              avatar
              disabledCheck={props.disabledCheck}
              successAlert={successAlert}
              errorAlert={errorAlert}
            />
          </GridItem>
          {props.disabledCheck ? (
            ""
          ) : (
            <GridItem
              xs={12}
              sm={12}
              md={12}
              lg={12}
              style={{
                marginBottom: "20px",
                marginTop: "20px",
              }}
            >
              <Button
                style={{
                  backgroundColor: "#00AFC3",
                  color: "white",
                }}
                className={classes.registerButton}
                round
                onClick={saveUserLevelFour}
              >
                Save Level 4 Data
              </Button>
              {formState.isLoading ? <CircularProgress disableShrink /> : ""}
            </GridItem>
          )}
        </GridContainer>
      </Animated>
    </div>
  );
}


















/*eslint-disable*/
import React, { useState } from "react";
// @material-ui/core components
import { TextField, makeStyles, CircularProgress, Slide, Dialog, MenuItem, FormControlLabel, Checkbox } from "@material-ui/core";
// core components
import { useSelector, useDispatch } from "react-redux";
import { getOrganizations } from "actions";
import Swal from 'sweetalert2'
import { successAlert, errorAlert, msgAlert } from "views/LDocs/Functions/Functions";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import axios from "axios";
import defaultAvatar from "assets/img/placeholder.jpg";
import { Animated } from "react-animated-css";
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import ImageUpload from "./ImageUpload.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import OtpCheck from "../Authorization/OtpCheck";
import { loopHooks } from "react-table";

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function ViewOrg(props) {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const dispatch = useDispatch();
const [animateTable, setAnimateTable] = React.useState(true);
const [otpModal, setotpModal] = React.useState(false);
const [currencyLookups, setCurrencyLookups] = React.useState([]);
const [OTP, setOTP] = React.useState("");
  const [formState, setFormState] = useState({
    isLoading: true,
    isRegistering: false,
    values: {
      name: props.RoleDetail.roleName,
      isAdmin:props.RoleDetail.isAdmin
      // displayLogo: "",
      // tradeLicenseImage: "",
    },
    errors: {
      name: "",
      isAdmin:""
    },
  });
    // const getOrgDetails = () => {
    // axios
    //   .get(
    //     `${process.env.REACT_APP_LDOCS_API_URL}/dev/reg/orglist/${props.orgDetail.organizationName}`
    //   )
    //   .then((response) => {
    //     let org = response.data;
    //     var base64Flag = "";
    //     let tradeLicenseImage = "";
    //     let displayLogo = "";
    //     if (typeof org.tradeLicenseImage != "undefined") {
    //       base64Flag = `data:${org.tradeLicenseImageT};base64,`;
    //       tradeLicenseImage = base64Flag + org.tradeLicenseImage;

    //       base64Flag = `data:${org.displayLogoT};base64,`;
    //       displayLogo = base64Flag + org.displayLogo;
    //     } else {
    //       tradeLicenseImage = defaultAvatar;
    //       displayLogo = defaultAvatar;
    //     }
        
    //     setFormState((formState) => ({
    //       ...formState,
    //       isLoading: false,
    //       values: {
    //         ...formState.values,
    //         displayLogo: displayLogo,
    //         tradeLicenseImage: tradeLicenseImage,
    //       },
    //     }));
    //   })
    //   .catch((error) => {
    //  if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
    //     setFormState((formState) => ({
    //       ...formState,
    //       isLoading: false,
    //       values: {
    //         ...formState.values,
    //         displayLogo: "",
    //         tradeLicenseImage: "",
    //       },
    //     }));
    //     console.log(
    //       typeof error.response != "undefined"
    //         ? error.response.data
    //         : error.message
    //     );
    //   });
    // };
    React.useEffect(()=>{
    },[])
  
  const closeModal = () => {
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        name: "",
        isAdmin: false
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
        [event.target.name]: event.target.name == "isAdmin" ?  !formState.values.isAdmin : event.target.value.toUpperCase(),
      },
    }));
  };
  const verifyEmail = (value) => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };
  // const [tradeFile, setTradeFile] = useState(null);
  // const [displayLogo, setDisplayLogo] = useState(null);
  // const handleImageChange = (file, status, imageName) => {

  //   if (status == 1) {
  //     if (imageName == "tradeLicenseImage") {
  //       setTradeFile(file);
  //     } else if ("displayLogo") {
  //       setDisplayLogo(file);
  //     }
      
  //   } else {
  //     if (imageName == "tradeLicenseImage") {
  //       setTradeFile(null);
  //     } else if ("displayLogo") {
  //       setDisplayLogo(null);
  //     }
  //   }
  // };
 
  const handleUpdate = () => {

    let name;
   
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
      }));
      errorAlert("Invalid Details!");
      return false;
    } else { 
      if(!OTP){
        setotpModal(true);
        return false;
      }
      setFormState((formState) => ({
        ...formState,
        isRegistering: true,
      }));
      var bodyFormData = {
        "roleName": formState.values.name,
        "isAdmin": formState.values.isAdmin,
        "roleId":props.RoleDetail._id
      }
      let msg = "";
       axios({
         method: "put",
         url: `${process.env.REACT_APP_LDOCS_API_URL}/user/updateRole`,
         data: bodyFormData,
         headers: { "cooljwt": Token },
       })
         .then((response) => {
          setFormState((formState) => ({
            ...formState,
            isRegistering: false,
          }));
          setOTP("");
          // setTradeFile(null);
          //  setDisplayLogo(null);
           props.getRoles();
           msg = "Role Updated Successfully!";
          successAlert(msg);
         })
         .catch((error) => {
          if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
           setFormState((formState) => ({
             ...formState,
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
    if (!otpModal) {
      const Check = require("is-null-empty-or-undefined").Check;
      if (!Check(OTP)) {
        handleUpdate();
      }
    }
  }, [otpModal])
  const setOtpValue = (value) => {
    setOTP(value);
    setotpModal(false);  
  }
  const classes = useStyles();
    return (
      <Animated
        animationIn="bounceInRight"
        animationOut="bounceOutLeft"
        animationInDuration={1000}
        animationOutDuration={1000}
        isVisible={animateTable}
      >
         
        {otpModal ?
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
        : ""}
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="info" icon>
                <CardIcon color="info">
                  <h4 className={classes.cardTitle}>Role Details</h4>
                </CardIcon>
              </CardHeader>
              <CardBody>
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
                    disabled={!props.Updating}
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
                      disabled={!props.Updating}
                      checked={formState.values.isAdmin}
                      onChange={handleChange}
                      name="isAdmin" />}
                    label="Admin"
                  />
                </GridItem> */}
                  {/* {formState.isLoading ? (
                    <React.Fragment>
                      Loading Images...&nbsp;&nbsp;
                      <CircularProgress disableShrink />
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <GridItem xs={12} sm={12} md={6} lg={6}>
                      <legend>Trade License Image</legend>
                        {props.Updating ? 
                  <ImageUpload
                    addButtonProps={{
                      color: "info",
                      round: true,
                    }}
                    changeButtonProps={{
                      color: "info",
                      round: true,
                    }}
                    removeButtonProps={{
                      color: "danger",
                      round: true,
                    }}
                    oldImage={formState.values.tradeLicenseImage}
                    name="tradeLicenseImage"
                    buttonId="removeTradeImage"
                    handleImageChange={handleImageChange}
                  /> :
                  <div className="fileinput text-center">
                    <div className="thumbnail">
                      <img
                        src={formState.values.tradeLicenseImage}
                        alt="..."
                      />
                    </div>
                    </div>}
                        
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6} lg={6}>
                        <legend>Display Logo</legend>
                        {props.Updating ? 
                          <ImageUpload
                            addButtonProps={{
                              color: "info",
                              round: true,
                            }}
                            changeButtonProps={{
                              color: "info",
                              round: true,
                            }}
                            removeButtonProps={{
                              color: "danger",
                              round: true,
                            }}
                            oldImage={formState.values.displayLogo}
                            name="displayLogo"
                            buttonId="removeLogoImage"
                            handleImageChange={handleImageChange}
                          /> : <div className="fileinput text-center">
                          <div className="thumbnail">
                            <img src={formState.values.displayLogo} alt="..." />
                          </div>
                        </div>}
                        
                      </GridItem>
                    </React.Fragment>
                  )} */}
                </GridContainer>
                {props.Updating ?
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
                {formState.isRegistering ? 
                  <CircularProgress disableShrink />
                 : "" } 
                  </>
                  : "" }
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

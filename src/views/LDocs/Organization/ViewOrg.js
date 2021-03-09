/*eslint-disable*/
import React, { useState } from "react";
// @material-ui/core components
import { TextField, makeStyles, CircularProgress, Slide, Dialog, MenuItem } from "@material-ui/core";
// core components
import { useSelector, useDispatch } from "react-redux";
import { getOrganizations } from "actions";
import SweetAlert from "react-bootstrap-sweetalert";
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
      name: props.orgDetail.organizationName,
      id: props.orgDetail._id,
      Address: props.orgDetail.Address,
      tradeLicenseNumber: props.orgDetail.tradeLicenseNumber,
      pbr: props.orgDetail.primaryBusinessRepresentative,
      pbrEmail: props.orgDetail.primaryBusinessRepresentativeEmail,
      pbrloginname: props.orgDetail.adminLoginName,
      pbrcellnumber: props.orgDetail.primaryBusinessRepresentativeCellNumber,
      currencyBase:props.orgDetail.Currency_Base,
      referenceTicket: props.orgDetail.referenceTicket,
      created: props.orgDetail.created,
      // displayLogo: "",
      // tradeLicenseImage: "",
    },
    errors: {
      name: "",
      Address: "",
      tradeLicenseNumber: "",
      pbr: "",
      pbrEmail: "",
      pbrloginname: "",
      pbrcellnumber: "",
      referenceTicket: "",
      currencyBase:""
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
      getLookUp();
    },[])
  
    const getLookUp = () => {
      axios({
        method: "get", //you can set what request you want to be
        url: `${process.env.REACT_APP_LDOCS_API_URL}/lookup/getLookups/1`,
        headers: {
          cooljwt: Token,
        },
      }).then(res=>{
        if(typeof res.data.result == 'object' ){
          setCurrencyLookups(res.data.result);
        };
      }).catch(err=>{
        console.log(err);
      })
    }
  const closeModal = () => {
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        name: "",
        Address: "",
        tradeLicenseNumber: "",
        pbr: "",
        pbrEmail: "",
        pbrloginname: "",
        pbrcellnumber: "",
        referenceTicket: "",
        currencyBase:""
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
        [event.target.name]: event.target.name == 'currencyBase' ? event.target.value :  event.target.value.toUpperCase(),
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
            onConfirm={() => hideErrorAlert()}
            onCancel={() => hideErrorAlert()}
            confirmBtnCssClass={sweetClass.button + " " + sweetClass.danger}
          >
            {msg ? msg : "Unable To Update Organization Please Contact {process.env.REACT_APP_LDOCS_CONTACT_MAIL}"}
          </SweetAlert>
        );
      };
  const hideAlert = () => {
        closeModal();
        setAlert(null);
      };
  const hideErrorAlert = () => {
    setAlert(null);
  };
  const handleUpdate = () => {

    let name;
    let Address;
    let tradeLicenseNumber;
    let pbr;
    let pbrEmail;
    let pbrloginname;
    let pbrcellnumber;
    let currencyBase;
    let referenceTicket;
      const Check = require("is-null-empty-or-undefined").Check;
      var error = false;

      if (!Check(formState.values.name)) {
        name = "success";
      } else {
        name = "error";
        error = true;
       }
      if (!Check(formState.values.Address)) {
        Address = "success";
      } else {
        Address = "error";
        error = true;
      }
      // if (!Check(formState.values.tradeLicenseNumber)) {
      //   tradeLicenseNumber = "success";
      // } else {
      //   tradeLicenseNumber = "error";
      //   error = true;
      // }
      if (!Check(formState.values.pbr)) {
        pbr = "success";
      } else {
        pbr = "error";
        error = true;
      }
      if (!Check(formState.values.pbrEmail)) {
        if (verifyEmail(formState.values.pbrEmail)) {
          pbrEmail = "success";
        } else {
          pbrEmail = "error";
          error = true;
        }
      } else {
        pbrEmail = "error";
        error = true;
    }
     if (!Check(formState.values.pbrloginname)) {
       pbrloginname = "success";
     } else {
       pbrloginname = "error";
       error = true;
     }
     if (!Check(formState.values.pbrcellnumber)) {
       pbrcellnumber = "success";
     } else {
       pbrcellnumber = "error";
       error = true;
     }
    if (!Check(formState.values.currencyBase)) {
      referenceTicket = "success";
    } else {
      referenceTicket = "error";
      error = true;
    }
    // if (!Check(formState.values.referenceTicket)) {
    //   referenceTicket = "success";
    // } else {
    //   referenceTicket = "error";
    //   error = true;
    // }
    setFormState((formState) => ({
      ...formState,
      errors: {
        ...formState.errors,
          name: name,
          Address: Address,
          tradeLicenseNumber: tradeLicenseNumber,
          pbr: pbr,
          pbrEmail: pbrEmail,
          pbrloginname: pbrloginname,
          pbrcellnumber: pbrcellnumber,
          currencyBase:currencyBase,
          referenceTicket: referenceTicket,
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
      var bodyFormData = new FormData();
      var bodyFormData = {
        "organizationName": formState.values.name,
        "organizationId": formState.values.id,
        "Address": formState.values.Address,
        "tradeLicenseNumber": formState.values.tradeLicenseNumber,
        "adminLoginName": formState.values.pbrloginname,
        "Currency_Base": formState.values.currencyBase,
        "primaryBusinessRepresentative": formState.values.pbr,
        "primaryBusinessRepresentativeEmail": formState.values.pbrEmail,
        "primaryBusinessRepresentativeLoginName": formState.values.pbrloginname,
        "primaryBusinessRepresentativeCellNumber": formState.values.pbrcellnumber,
        "referenceTicket": formState.values.referenceTicket,
        "otp":OTP
      }
      let msg = "";
       axios({
         method: "put",
         url: `${process.env.REACT_APP_LDOCS_API_URL}/organization/updateOrg`,
         data: bodyFormData,
         headers: { "cooljwt": Token },
       })
         .then((response) => {
          dispatch(getOrganizations());
          setFormState((formState) => ({
            ...formState,
            isRegistering: false,
          }));
          setOTP("");
          // setTradeFile(null);
          //  setDisplayLogo(null);
           props.getOrganizations();
           msg = "Organization Updated Successfully!";
          successAlert(msg);
         })
         .catch((error) => {
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
        {alert}
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
                  <h4 className={classes.cardTitle}>Organization Details</h4>
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
                      label="Organization Name"
                      id="name"
                      name="name"
                      type="text"
                      disabled={true}
                      value={formState.values.name || ""}
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
                      error={formState.errors.Address === "error"}
                      helperText={
                        formState.errors.Address === "error"
                          ? "Valid Address is required"
                          : null
                      }
                      label="Address"
                      id="Address"
                      name="Address"
                      type="text"
                      onChange={(event) => {
                        handleChange(event);
                      }}
                      disabled={props.Updating ? false : true}
                      value={formState.values.Address || ""}
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
                      error={formState.errors.tradeLicenseNumber === "error"}
                      helperText={
                        formState.errors.tradeLicenseNumber === "error"
                          ? "Valid Trade License Number is required"
                          : null
                      }
                      label="Trade License Number"
                      id="tradeLicenseNumber"
                      name="tradeLicenseNumber"
                      type="text"
                      onChange={(event) => {
                        handleChange(event);
                      }}
                      disabled={props.Updating ? false : true}
                      value={formState.values.tradeLicenseNumber || ""}
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
                      error={formState.errors.pbr === "error"}
                      helperText={
                        formState.errors.pbr === "error"
                          ? "Valid PBR First Name is required"
                          : null
                      }
                      label="PBR First Name"
                      id="pbr"
                      name="pbr"
                      type="text"
                      onChange={(event) => {
                        handleChange(event);
                      }}
                      disabled={props.Updating ? false : true}
                      value={formState.values.pbr || ""}
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
                      error={formState.errors.pbrloginname === "error"}
                      helperText={
                        formState.errors.pbrloginname === "error"
                          ? "Valid PBR Last Name is required"
                          : null
                      }
                      label="PBR Last Name"
                      id="pbrloginname"
                      name="pbrloginname"
                      type="text"
                      onChange={(event) => {
                        handleChange(event);
                      }}
                      disabled={props.Updating ? false : true}
                      value={formState.values.pbrloginname || ""}
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
                      error={formState.errors.pbrEmail === "error"}
                      helperText={
                        formState.errors.pbrEmail === "error"
                          ? "Valid PBR Email is required"
                          : null
                      }
                      label="PBR Email"
                      id="pbrEmail"
                      name="pbrEmail"
                      type="email"
                      onChange={(event) => {
                        handleChange(event);
                      }}
                      disabled={props.Updating ? false : true}
                      value={formState.values.pbrEmail || ""}
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
                      error={formState.errors.pbrcellnumber === "error"}
                      helperText={
                        formState.errors.pbrcellnumber === "error"
                          ? "Valid PBR Cell Number is required"
                          : null
                      }
                      label="PBR Cell Number"
                      id="pbrcellnumber"
                      name="pbrcellnumber"
                      type="text"
                      onChange={(event) => {
                        handleChange(event);
                      }}
                      disabled={props.Updating ? false : true}
                      value={formState.values.pbrcellnumber || ""}
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
                     error={formState.errors.currencyBase === "error"}
                     helperText={
                       formState.errors.currencyBase === "error"
                         ? "Valid Currency Base is required"
                         : null
                     }
                     label="Currency Base"
                     id="currencyBase"
                     name="currencyBase"
                     onChange={(event) => {
                       handleChange(event);
                     }}
                     type="text"
                     value={formState.values.currencyBase || ""}
                     select
                  >
                    <MenuItem
                      disabled
                      classes={{
                        root: classes.selectMenuItem,
                      }}
                    >
                      Choose Currency Base
                    </MenuItem>
                    {currencyLookups.map(cu =>  (
                        <MenuItem
                          key={cu._id} 
                          value={cu._id}>
                           {cu.Name.toUpperCase()}
                        </MenuItem>
                      ))
                     }
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
                      error={formState.errors.referenceTicket === "error"}
                      helperText={
                        formState.errors.referenceTicket === "error"
                          ? "Valid Remarks is required"
                          : null
                      }
                      label="Remarks"
                      id="referenceTicket"
                      name="referenceTicket"
                      type="text"
                      onChange={(event) => {
                        handleChange(event);
                      }}
                      disabled={props.Updating ? false : true}
                      value={formState.values.referenceTicket || ""}
                    />
                  </GridItem>
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

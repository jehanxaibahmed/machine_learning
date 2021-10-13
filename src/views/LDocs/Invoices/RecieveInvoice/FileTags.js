/*eslint-disable*/
import React, { useState, useEffect } from "react";
// @material-ui/core components
import {
  makeStyles,
  CircularProgress,
  LinearProgress,
} from "@material-ui/core";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import Swal from 'sweetalert2'
import { successAlert, errorAlert, msgAlert }from "views/LDocs/Functions/Functions";
import axios from "axios";
import jwt from "jsonwebtoken";
import ChipInput from "material-ui-chip-input";
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { useDispatch, useSelector } from "react-redux";
import {  Redirect } from "react-router-dom";

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

export default function FileTags(props) {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const isAr = useSelector(state => state.userReducer.isAr);
  const decoded = jwt.decode(Token);
  const classes = useStyles();
  const sweetClass = sweetAlertStyle();
  const [isSavingTags, setIsSavingTags] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [alert, setAlert] = React.useState(null);
  
  const saveTags = () => {

    setIsSavingTags(true);
    let file = props.fileData;
    let data = {
      invoiceId: file.invoiceId,
      tenantId:file.tenantId,
      organizationId:file.organizationId,
      vendorId:file.vendorId,
      clientId:file.clientId,
      version:file.version,
      invoiceTag: {
        email: decoded.email,
        tag: myChips
      }
    };
    axios({
      method: "PUT",
      url: isAr ? `${process.env.REACT_APP_LDOCS_API_URL}/AR/updateInvoiceTagsAR` : `${process.env.REACT_APP_LDOCS_API_URL}/invoice/updateInvoiceTags`,
      data: data,
      headers: {
        cooljwt: Token,
      },
    })
      .then((response) => {
        successAlert('TAG ADDED');
        setIsSavingTags(false);
      })
      .catch((error) => {
        if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        console.log(
          typeof error.response != "undefined"
            ? error.response.data
            : error.message
        );
        errorAlert(
          typeof error.response != "undefined"
            ? error.response.data
            : error.message
        );
        setIsSavingTags(false);
      });
  };
  const getFileTags = () => {
    let file = props.fileData;
    axios({
      method: "GET", //you can set what request you want to be
      url: isAr ? `${process.env.REACT_APP_LDOCS_API_URL}/AR/getInvoiceTagsAR/${file.invoiceId}` : `${process.env.REACT_APP_LDOCS_API_URL}/invoice/getInvoiceTags/${file.invoiceId}`,
      headers: {
        cooljwt: Token,
      },
    })
      .then((response) => {
        if (response.data.invoiceTag.length > 0 && typeof response.data.invoiceTag != 'string') {

          let result = [];
           response.data.invoiceTag.map(t=>{
            //t == userBaseTags
            t.tag.map((tag=>{
              //tags 
                 if (typeof tag == 'object') {
                    result = result.concat(tag);
                  }
                  else if (typeof tag == 'string') {
                    result = result.concat([tag]);
                  }
            }))
           
            // console.log(result.concat(t.tag));
          });
          // .find(
          //   (itm) => itm.email == decoded.email
          // );
          if (result) {
            // setMyChips(result.tag);
            setMyChips(result);
          }
        } else {
          setMyChips([]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        console.log(
          typeof error.response != "undefined"
            ? error.response.data
            : error.message
        );
        setIsLoading(false);
      });
  };
  React.useEffect(() => {
    getFileTags();
  }, []);

  const [myChips, setMyChips] = React.useState([]);
  const handleChips = (chip) => {
    let chips = myChips;
    let index = chip.length - 1;
    chips.push(chip[index]);
    setMyChips(chips);
  };
  const handleDeleteChip = (chip, index) => {
    let chips = myChips;
    chips.splice(index, 1);
    setMyChips(chips);
    document.getElementById("tagElementInput").focus();
  };
  function closeModal() {
    props.closeTagModal();
  }
  return (
    <GridContainer>
       
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info" icon>
            <CardIcon color="info">
              <h4 className={classes.cardTitle}>
                Add Tags For Invoice:{" "}
                {props.fileData.invoiceId +
                  " Version: " +
                  props.fileData.version}
              </h4>
            </CardIcon>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ marginTop: "20px", marginBottom: "20px" }}
              >
                {isLoading ? (
                  // <CircularProgress disableShrink />
                  <LinearProgress />
                ) : (
                    <ChipInput
                      label="My Tags"
                      id="tagElementInput"
                      value={myChips}
                      style={{ width: '100%' }}
                      onChange={(chips) => handleChips(chips)}
                      onDelete={(chip, index) => handleDeleteChip(chip, index)}
                    />
                  )}
              </GridItem>
            </GridContainer>
            <span style={{ float: "right" }}>
              <Button
                color="info"
                className={classes.registerButton}
                round
                type="button"
                onClick={saveTags}
              >
                Save Tags
              </Button>
              {isSavingTags ? <CircularProgress disableShrink /> : ""}
              <Button
                color="danger"
                className={classes.registerButton}
                onClick={closeModal}
                round
              >
                Close
              </Button>
            </span>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
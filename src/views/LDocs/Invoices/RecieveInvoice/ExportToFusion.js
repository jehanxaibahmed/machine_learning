/*eslint-disable*/
import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles, MenuItem, TextField,CircularProgress,
    Slide,
    Dialog,
    LinearProgress,
    DialogContent,
    IconButton,
    Tooltip } from "@material-ui/core";
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
import Pending from "assets/img/statuses/Pending.png";
import Success from "assets/img/statuses/Success.png";
import Rejected from "assets/img/statuses/Rejected.png";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { useDispatch, useSelector } from "react-redux";
import BuildNetwork from "views/LDocs/Vendor/BuildNetwork";
import Step3 from "views/LDocs/Vendor/steps/level3";
import { formatDateTime } from "views/LDocs/Functions/Functions";
import ExportingInvoiceAnimation from "components/ExportingInvoiceAnimation/ExportingInvoiceAnimation";


const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

export default function ExportToFusion(props) {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const decoded = jwt.decode(Token);
  const classes = useStyles();
  const sweetClass = sweetAlertStyle();
  const [alert, setAlert] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
 
  React.useEffect(() => {
      setTimeout(() => {
        successAlert('Exported SuccessFully');
      }, 3000);
  }, []);

  return (
    <GridContainer>
       
      <GridItem xs={12} sm={12} md={12}>
                    <Card>
                      <CardHeader color="info" icon>
                        <CardIcon color="info">
                          <h4 className={classes.cardTitle}>
                            Exporting To Oracle Fusion
                          </h4>
                        </CardIcon>
                      </CardHeader>
                      <CardBody>
                       <ExportingInvoiceAnimation />
                        </CardBody>
                        </Card>
                    </GridItem>
                    </GridContainer>
  );
}

/*eslint-disable*/
import React, { useState, useEffect } from "react";
// @material-ui/core components
import {
  MenuItem,
  makeStyles,
  CircularProgress,
  TextField,
  Typography,
  Select,
  Input,
  FormControlLabel,
} from "@material-ui/core";
import Table from "components/Table/Table.js";
import WarningIcon from "@material-ui/icons/Warning";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import Swal from 'sweetalert2'
import axios from "axios";
import jwt from "jsonwebtoken";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Paypal from "assets/img/paypal.png";
import Mastercard from "assets/img/mastercard.png";
import MoneyButton from "assets/img/moneyButton.png";
import CoinGate from "assets/img/coingate.png";

//Redux
import { sendNotification, getNotification, sendEventLog } from "actions";
import { useSelector, useDispatch } from "react-redux";
import { DateRangePicker, DateRange } from "materialui-daterange-picker";

//Animation
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { addZeroes,successAlert, errorAlert, msgAlert } from "views/LDocs/Functions/Functions";
import { whiteColor } from "assets/jss/material-dashboard-pro-react";

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);
const Check = require("is-null-empty-or-undefined").Check;

export default function ProccedToPayment(props) {
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  const decoded = jwt.decode(Token);
  const classes = useStyles();

  const sweetClass = sweetAlertStyle();
  const [isLoading, setIsLoading] = React.useState(false);
  const [alert, setAlert] = React.useState(null);
  const dispatch = useDispatch();
  const paymentMethods = [
      {
          title:"PayPal",
          id:1,
          logo:Paypal
      },
      {
        title:"Master Card",
        id:2,
        logo:Mastercard
    },
    {
        title:"Money Button",
        id:3,
        logo:MoneyButton
    },
    {
        title:"Coin Gate",
        id:4,
        logo:CoinGate
    }
  ]

  const [checked, setChecked] = React.useState(1);

  const [State, setState] = React.useState({});

  return (
    <GridContainer justify="center">
      <GridItem xs={12} sm={12} md={12} className={classes.center}>
        <Card>
          <CardHeader color="info" icon>
            <CardIcon color="info">
              <h4 className={classes.cardTitleText}>Selected Invoices</h4>
            </CardIcon>
            <Button
              color="danger"
              round
              style={{ float: "right" }}
              className={classes.marginRight}
              onClick={() => props.goBack()}
            >
              Go Back
            </Button>
          </CardHeader>
          <CardBody>
            <Table
              hover
              tableHeaderColor="info"
              tableHead={["Invoice ID", "Version", "Amount"]}
              tableData={props.selectedInvoices.map((file, index) => {
                return [
                  file.id,
                  file.version,
                  `${file.LC_currency.Code} ${file.netAmt_bc}`,
                ];
              })}
            />
            <Button
              
              style={{ float: "right", fontWeight:400,color:'grey',fontSize:16, background:'white',border:'1px solid grey'  }}
              className={classes.marginRight}
            >
              Total {''}
              {props.selectedInvoices[0].LC_currency.Code} {parseFloat(addZeroes(props.selectedInvoices
                .map((item) => item.netAmt_bc)
                .reduce((prev, next) => prev + next))).toFixed(2)}
            </Button>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12} className={classes.center}>
        <Card>
          <CardHeader color="danger" icon>
            <CardIcon color="danger">
              <h4 className={classes.cardTitleText}>Select Payment Method</h4>
            </CardIcon>
          </CardHeader>
          <CardBody>
          <List className={classes.root} style={{background:'white'}}>
      {paymentMethods.map((value) => {
        return (
          <ListItem
          onClick={()=>{
              setChecked(value.id)
          }}
          key={value.id} button style={{marginTop:20,paddingTop:10,paddingBottom:10}} >
            <ListItemAvatar>
              <img
              style={{minWidth:70,height:50}}
                alt={`Avatar n°${value + 1}`}
                src={value.logo}
              />
            </ListItemAvatar>
            <ListItemText id={value.id} primary={""} />
            <ListItemSecondaryAction>
               {checked == value.id ? <CheckCircleIcon style={{color:'green'}} /> : <RadioButtonUncheckedIcon/> } 
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
          </CardBody>
         
        </Card>
        <Button
              color="info"
              round
              style={{ float: "right" }}
              className={classes.marginRight}
              onClick={() => {}}
            >
              Next
            </Button>
      </GridItem>
    </GridContainer>
  );
}

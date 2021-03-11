import React, {useState, useEffect} from "react";
// @material-ui/icons
import {
  makeStyles,
  TextField
} from "@material-ui/core";
// core components
import { Animated } from "react-animated-css";
import GridContainer from "components/Grid/GridContainer.js";
import {Table,TableHead,TableRow,TableCell,TableBody,Card} from '@material-ui/core';
import GridItem from "components/Grid/GridItem.js";
import { formatDateTime, addZeroes } from "../../../Functions/Functions";

// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);
const useStyle = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    maxHeight: 500,
    position: 'relative',
    maxWidth: 360,
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  table: {
    minWidth: '100%',
    border:1
  },
  TableCell:{
      width:'10%'
  },
  TableRow:{
      cursor:'pointer',
      background:'white',
      border:1, width:'100%'
  }
  
  }));

export default function Step4(props) {
  const classes = useStyles();
  const classesList = useStyle();
  const [animateStep, setAnimateStep] = useState(true);
  return (
    <Animated
      animationIn="bounceInRight"
      animationOut="bounceOutLeft"
      animationInDuration={1000}
      animationOutDuration={1000}
      isVisible={animateStep}
    >
        <GridContainer>
        <Table className={classesList.table} aria-label="simple table">
            <TableHead>
                    <TableRow className={classesList.TableRow}>
                    <TableCell className={classesList.TableCell}>Payment ID</TableCell>
                    <TableCell className={classesList.TableCell}>Paid Amount</TableCell>
                    <TableCell className={classesList.TableCell}>Balance Due</TableCell>
                    <TableCell className={classesList.TableCell}>Payment Status </TableCell>
                    <TableCell className={classesList.TableCell}>Transaction By</TableCell>
                    <TableCell className={classesList.TableCell}>Transaction Date</TableCell>
                    
                    
                </TableRow>
            </TableHead>
            <TableBody style={{paddingBottom:5}}>
                {props.payments ? props.payments.map((item, index)=>{
                    let Payment = JSON.parse(item.Record);
                    return (
                    <TableRow key={item.id}>
                        <TableCell className={classesList.TableCell}>{`P-${index+1}`}</TableCell>
                        <TableCell className={classesList.TableCell}>{addZeroes(Payment.PaidAmt)}</TableCell>
                        <TableCell className={classesList.TableCell}>{addZeroes(Payment.BalanceDue)}</TableCell>
                        <TableCell className={classesList.TableCell}>{Payment.PaymentStatus.toUpperCase()}</TableCell>
                        <TableCell className={classesList.TableCell}>{Payment.TransactionBy.toUpperCase()}</TableCell>
                        <TableCell className={classesList.TableCell}>{formatDateTime(Payment.Date)}</TableCell>
                        
                    </TableRow>
                )
              }
                ):''}
            </TableBody>
            </Table> 
        </GridContainer>
    </Animated>
  );
  }



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
import { addZeroes } from "views/LDocs/Functions/Functions";

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
      minWidth:'10%',
      alignContent:'right'
  },
  TableID:{
    maxWidth:'3%'
  },
  TableRow:{
      cursor:'pointer',
      background:'white',
      border:1, width:'100%'
  }
  
  }));

export default function Step1(props) {
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
                    <TableCell className={classesList.TableID}>ID</TableCell>
                    <TableCell >Name</TableCell>
                    <TableCell className={classesList.TableCell}>Receipt / Expense / Revenue</TableCell>
                    <TableCell className={classesList.TableCell}>Quantity</TableCell>
                    <TableCell className={classesList.TableCell}>Unit Cost </TableCell>
                    <TableCell className={classesList.TableCell}>Discount (%)</TableCell>
                    <TableCell className={classesList.TableCell}>Sub Total </TableCell>
                    
                    
                </TableRow>
            </TableHead>
            <TableBody style={{paddingBottom:5}}>
                {props.items ? props.items.map((item, index)=>{
                    return (
                    <TableRow key={item.id}>
                        <TableCell className={classesList.TableID}>{index+1}</TableCell>
                        <TableCell >{item.itemName}</TableCell>
                        <TableCell className={classesList.TableCell}>{item.receiptNumber[0] || item.expenseType}</TableCell>
                        <TableCell className={classesList.TableCell}>{addZeroes(item.quantity)}</TableCell>
                        <TableCell className={classesList.TableCell}>{props.currency.fc.Code} {addZeroes(item.unitCost)} <br/>{props.currency.fc._id !== props.currency.bc._id ? `(${props.currency.bc.Code} ${addZeroes(item.unitCost_bc)})`:""} </TableCell>
                        <TableCell className={classesList.TableCell}>{props.currency.fc.Code} {parseFloat(addZeroes((item.discount*item.unitCost)/100*item.quantity)).toFixed(2)}({item.discount}%)<br />{props.currency.fc._id !== props.currency.bc._id ? `(${props.currency.bc.Code} ${parseFloat(addZeroes((item.discount*item.unitCost_bc)/100*item.quantity)).toFixed(2)})`:""} </TableCell>
                        <TableCell className={classesList.TableCell}>{props.currency.fc.Code} {addZeroes(item.amount)} <br/>{props.currency.fc._id !== props.currency.bc._id ? `(${props.currency.bc.Code} ${addZeroes(item.amount_bc)})`:""}</TableCell>
                        
                    </TableRow>
                )}
                ):''}
            </TableBody>
            </Table> 
        </GridContainer>
    </Animated>
  );
  }



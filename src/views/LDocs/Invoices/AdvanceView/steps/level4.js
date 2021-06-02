import React, { useState, useEffect } from "react";
// @material-ui/icons
import { makeStyles, TextField } from "@material-ui/core";
// core components
import { Animated } from "react-animated-css";
import GridContainer from "components/Grid/GridContainer.js";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
} from "@material-ui/core";
import GridItem from "components/Grid/GridItem.js";
import { formatDateTime, addZeroes } from "../../../Functions/Functions";
import GetAppIcon from '@material-ui/icons/GetApp';
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);
const useStyle = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    maxHeight: 500,
    position: "relative",
    maxWidth: 360,
  },
  listSection: {
    backgroundColor: "inherit",
  },
  ul: {
    backgroundColor: "inherit",
    padding: 0,
  },
  table: {
    minWidth: "100%",
    border: 1,
  },
  TableCell: {
    width: "10%",
  },
  TableRow: {
    cursor: "pointer",
    background: "white",
    border: 1,
    width: "100%",
  },
}));

export default function Step4(props) {
  console.log(props);
  const classes = useStyles();
  const classesList = useStyle();
  const [animateStep, setAnimateStep] = useState(true);
  const [payments, setPayments] = useState(props.payments);
  const isExported = props.isExported.status
    ? props.isExported.status == "completed"
      ? true
      : false
    : false;
  console.log(isExported, props.isExported);
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
                <TableCell className={classesList.TableCell}>Payment Gateway</TableCell>
                {/* <TableCell className={classesList.TableCell}>Payer ID</TableCell> */}
                <TableCell className={classesList.TableCell}>Balance Due</TableCell>
                {/* <TableCell className={classesList.TableCell}>Order ID</TableCell> */}
                <TableCell className={classesList.TableCell}>Partial / Fully</TableCell>
                <TableCell className={classesList.TableCell}>Paid Amount</TableCell>
                <TableCell className={classesList.TableCell}>Transaction Fee</TableCell>
                <TableCell className={classesList.TableCell}>Transaction Date</TableCell>
                <TableCell className={classesList.TableCell}>Receipt</TableCell>
              </TableRow>
            </TableHead>
            <TableBody style={{ paddingBottom: 5 }}>
              {payments ? payments.map((item, index)=>{
                    return (
              <TableRow>
                <TableCell className={classesList.TableCell}>{item.paymentID}</TableCell>
                <TableCell className={classesList.TableCell}>{item.paymentGateway}</TableCell>
                <TableCell className={classesList.TableCell}>{item.currencyCode ? item.currencyCode : "" } {addZeroes(item.balanceDue)}</TableCell>
                {/* <TableCell className={classesList.TableCell}>{item.payerID}</TableCell> */}
                {/* <TableCell className={classesList.TableCell}>{item.orderId}</TableCell> */}
                <TableCell className={classesList.TableCell}>{item.finalPayment ? "Fully":"Partial"}</TableCell>
                <TableCell className={classesList.TableCell}> {item.currencyCode ? item.currencyCode : "" } {addZeroes(item.paidAmount)}</TableCell>
                <TableCell className={classesList.TableCell}>{item.currencyCode ? item.currencyCode : "" } {addZeroes(item.transactionFee)}</TableCell>
                <TableCell className={classesList.TableCell}>
                  {formatDateTime(item.date)}
                </TableCell>
                <TableCell className={classesList.TableCell}><a href={`${process.env.REACT_APP_LDOCS_API_URL}/${item.receiptUrl}`} download target="_blank" ><GetAppIcon /></a></TableCell>
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

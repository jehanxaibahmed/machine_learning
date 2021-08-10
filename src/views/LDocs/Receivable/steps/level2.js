import React, { useState, useEffect } from "react";
import { makeStyles, Tooltip, Chip, CircularProgress } from "@material-ui/core";
// @material-ui/core components
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { Animated } from "react-animated-css";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import defaultAvatar from "assets/img/placeholder.jpg";
import AttachmentIcon from "@material-ui/icons/Attachment";
import ReactTable from "react-table";
import { formatDateTime } from "views/LDocs/Functions/Functions";
import { currentTracking } from "views/LDocs/Functions/Functions";
import { addZeroes } from "views/LDocs/Functions/Functions";
import { formatDate } from "views/LDocs/Functions/Functions";
const sweetAlertStyle = makeStyles(styles2);
let Token = localStorage.getItem("cooljwt");
const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
  cardTitleText: {
    color: "white",
  },
  buttonRight: {},
};

export default function Step2({invoices, loading, openAdvanceView}) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const [animateStep, setAnimateStep] = useState(true);
  const [data, setData] = useState([]);


  useEffect(()=>{
    setData(
      invoices.map((prop, key) => {
        var currentStatus = currentTracking(prop.trackingStatus);
        let isCorrectionRequiredInWorkflow = prop.workFlowStatus == "correctionRequired";
        let payload  = {
          invoiceId : prop.invoiceId,
          version : prop.version,
          vendorId : prop.vendorId,
        };
        return {
          invoiceId:<span style={{cursor:'pointer', color:'blue'}} onClick={()=>openAdvanceView(payload)}>{prop.invoiceId}</span>,
          amount: `${prop.LC_currency.Code}   ${addZeroes(prop.netAmt_bc)}`,
          dueDate:(<div className="actions-right">
          {formatDate(prop.dueDate)}</div>),
          balanceDue:`${prop.LC_currency.Code}   ${addZeroes(prop.balanceDue)}`,
          invoiceDate: formatDateTime(prop.createdDate),
          status: currentStatus.status == "rejected" ? (
            <Tooltip title="REJECTED">
              <Chip
                variant="outlined"
                size="small"
                // avatar={<Avatar>M</Avatar>}
                label="REJECTED"
                clickable
                color="secondary"
              />
            </Tooltip>
          ) : (currentStatus.status == "correctionRequired" &&
              currentStatus.val == 1) ||
            isCorrectionRequiredInWorkflow ? (
            <Tooltip title="SENT FOR CORRECTION">
              <Chip
                variant="outlined"
                size="small"
                // avatar={<Avatar>M</Avatar>}
                label="SENT FOR CORRECTION"
                clickable
                style={{ border: "orange 1px solid", color: "orange" }}
              />
            </Tooltip>
          ) : currentStatus.status == "rejected" ? (
            <Tooltip title="REJECTED">
              <Chip
                variant="outlined"
                size="small"
                // avatar={<Avatar>M</Avatar>}
                label="REJECTED"
                clickable
                color="secondary"
              />
            </Tooltip>
          )
          : prop.trackingStatus.paid.status == "partial" ? (
            <Tooltip title="PARTIALLY PAID">
              <Chip
                variant="outlined"
                size="small"
                // avatar={<Avatar>M</Avatar>}
                label="PARTIALLY PAID"
                clickable
                style={{ border: "lightgreen 1px solid", color: "lightgreen" }}
              />
            </Tooltip>
          )
          : prop.trackingStatus.paid.status == "completed" ? (
            <Tooltip title="FULLY PAID">
              <Chip
                variant="outlined"
                size="small"
                // avatar={<Avatar>M</Avatar>}
                label="FULLY PAID"
                clickable
                style={{ border: "green 1px solid", color: "green" }}
              />
            </Tooltip>
          )
          : currentStatus.status == "readyToPay" ? (
            <Tooltip title="READY TO PAY">
              <Chip
                variant="outlined"
                size="small"
                // avatar={<Avatar>M</Avatar>}
                label="READY TO PAY"
                clickable
                style={{ border: "orange 1px solid", color: "orange" }}
              />
            </Tooltip>
          )
          : currentStatus.val == 0 ? (
            <Tooltip title="PENDING">
              <Chip
                variant="outlined"
                size="small"
                // avatar={<Avatar>M</Avatar>}
                label="PENDING"
                clickable
                style={{ border: "orange 1px solid", color: "orange" }}
              />
            </Tooltip>
          ) : currentStatus.val == 1 ? (
            <Tooltip title="UNDER INITIAL REVIEW">
              <Chip
                variant="outlined"
                size="small"
                // avatar={<Avatar>M</Avatar>}
                label="INITIAL REVIEW"
                clickable
                color="primary"
              />
            </Tooltip>
          ) : currentStatus.val == 2 ? (
            <Tooltip title="UNDER REVIEW">
              <Chip
                variant="outlined"
                size="small"
                // avatar={<Avatar>M</Avatar>}
                label="UNDER REVIEW"
                clickable
                color="primary"
              />
            </Tooltip>
          ) : currentStatus.val == 3 ? (
            <Tooltip title="UNDER APPROVAL">
              <Chip
                variant="outlined"
                size="small"
                // avatar={<Avatar>M</Avatar>}
                label="UNDER APPROVAL"
                clickable
                color="primary"
              />
            </Tooltip>
          ) : currentStatus.val == 4 ? (
            <Tooltip title="DONE">
              <Chip
                variant="outlined"
                size="small"
                // avatar={<Avatar>M</Avatar>}
                label="APPROVAL DONE"
                clickable
                style={{ border: "green 1px solid", color: "green" }}
              />
            </Tooltip>
          ) : (
            <Tooltip title="NO STATUS">
              <Chip
                variant="outlined"
                size="small"
                // avatar={<Avatar>M</Avatar>}
                label="NO STATUS"
                clickable
                color="primary"
              />
            </Tooltip>
          )}
  }));
},[invoices]);


  return (
    <Animated
      animationIn="bounceInRight"
      animationOut="bounceOutLeft"
      animationInDuration={1000}
      animationOutDuration={1000}
      isVisible={animateStep}
    >
      <GridContainer>
      <GridItem xs={12}>
      {loading ? (
            <div
              style={{ textAlign: "center", marginTop: 100, marginBottom: 100 }}
            >
              <CircularProgress style={{ width: 200, height: 200 }} />
            </div>
          ) : (
      <ReactTable
                      data={data}
                      sortable={false}
                      style={{textAlign: "initial"}}
                      columns={
                       [
                              {
                                Header: "InvoiceID",
                                accessor: "invoiceId",
                                filterable: true,
                                filter: "fuzzyText",
                                sortType: "basic",
                              },
                              {
                                Header: "Status",
                                accessor: "status",
                              },
                              {
                                Header: "Amount",
                                accessor: "amount",
                              },
                              {
                                Header: "Invoice Date",
                                accessor: "invoiceDate",
                              },
                              {
                                Header: "Balance Due",
                                accessor: "balanceDue",
                              },
                              {
                                Header: "Due Date",
                                accessor: "dueDate",
                              }
                              
                            ]
                      }
                      defaultPageSize={10}
                      className="-striped -highlight"
                    />)}
                    </GridItem>
      </GridContainer>
    </Animated>
  );
}

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
import { GetApp, PinDropSharp } from "@material-ui/icons";
import { addZeroes } from "views/LDocs/Functions/Functions";
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

export default function Step1({ transactions, loading, isVendor, openAdvanceView}) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const [animateStep, setAnimateStep] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(
      transactions.map((prop, key) => {
        let payload  = {
          invoiceId : prop.invoiceId,
          version : prop.version,
          vendorId : prop.vendorId,
        };
        return {
          paymentID: prop.paymentID,
          transactionAmount: `${prop.currencyCode}  ${addZeroes(parseFloat(
            prop.paidAmount
          ))}`,
          invoiceID: <span style={{cursor:'pointer', color:'blue'}} onClick={()=>openAdvanceView(payload)}>{prop.invoiceId}</span>,
          payerID: isVendor
            ? `${prop.currencyCode}  ${parseFloat(prop.transactionFee).toFixed(
                2
              )}`
            : prop.payerID,
          paymentChannel: prop.paymentGateway,
          transactionDate: formatDateTime(prop.date),
          payment: prop.finalPayment ? (
            <Tooltip title="Full Payment">
              <Chip
                variant="outlined"
                size="small"
                // avatar={<Avatar>M</Avatar>}
                label="Full"
                clickable
                style={{ border: "green 1px solid", color: "green" }}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Partial Payment">
              <Chip
                variant="outlined"
                size="small"
                // avatar={<Avatar>M</Avatar>}
                label="Partial"
                clickable
                style={{ border: "blue 1px solid", color: "blue" }}
              />
            </Tooltip>
          ),
          isFait: prop.currencyType == 1 || "1" ? "Fiat" : "Crypto",
          actions: (
            <div>
              <a
                href={`${process.env.REACT_APP_LDOCS_API_URL}/${prop.receiptUrl}`}
                download
                target="_blank"
              >
                <GetApp />
              </a>
            </div>
          ),
        };
      })
    );
  }, [transactions]);

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
              columns={[
                {
                  Header: "Invoice ID",
                  accessor: "invoiceID",
                  filterable: true,
                  filter: "fuzzyText",
                  sortType: "basic",
                },
                {
                  Header: "Payment ID",
                  accessor: "paymentID",
                  filterable: true,
                  filter: "fuzzyText",
                  sortType: "basic",
                },
                {
                  Header: "Txn Amount",
                  accessor: "transactionAmount",
                },

                {
                  Header: isVendor ? "Txn Fee" : "Payer ID",
                  accessor: "payerID",
                },
                {
                  Header: "Channel",
                  accessor: "paymentChannel",
                },
                {
                  Header: "Fiat / Crypto",
                  accessor: "isFait",
                },
                {
                  Header: "Txn Date",
                  accessor: "transactionDate",
                },
                {
                  Header: "Payment",
                  accessor: "payment",
                  filterable: false,
                },
                {
                  Header: "Actions",
                  accessor: "actions",
                  filterable: false,
                },
              ]}
              defaultPageSize={10}
              className="-striped -highlight"
            />
          )}
        </GridItem>
      </GridContainer>
    </Animated>
  );
}

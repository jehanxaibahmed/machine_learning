import React, { useState } from "react";
// @material-ui/core components
import {
  TextField,
  makeStyles,
  Tooltip,
  IconButton,
  withStyles,
  MenuItem,
  Typography,
  Select,
  Input,
  Chip,
  Button,
} from "@material-ui/core";
// core components
import GridItem from "components/Grid/GridItem.js";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Collapse from "@material-ui/core/Collapse";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import CreateIcon from "@material-ui/icons/Create";
import { useDispatch, useSelector } from "react-redux";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import axios from "axios";
import { Visibility } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { setIsTokenExpired } from "actions/index";
import { conversionRate } from "views/LDocs/Functions/Functions";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import DescriptionIcon from "@material-ui/icons/Description";
import Row from "./Row";
import { useHistory } from "react-router-dom";
import Graph from "./Graph";
import { addZeroes, currentTracking, currentTrackingAr } from "../Functions/Functions";
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
  table: {
    minWidth: "100%",
  },
  itemName: {
    width: 300,
  },
  itemNumber: {
    width: "55%",
  },
};
const useStyles = makeStyles(styles);

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.action.hover,
    width: "7%",
  },
  body: {
    fontSize: 14,
    border: "1px solid lightgrey",
    width: "7%",
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.action.hover,
    width: "7%",
  },
  body: {
    fontSize: 14,
    border: "1px solid lightgrey",
    width: "7%",
  },
}))(TableRow);

export default function Invoice({ data, viewInvoice }) {
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
    const history = useHistory();
  const isAr =
    history.location.pathname.substring(
      history.location.pathname.lastIndexOf("/") + 1
    ) == "ar"
      ? true
      : false;
  const dispatch = useDispatch();
  const Check = require("is-null-empty-or-undefined").Check;

  const classes = useStyles();
  var currentStatus = currentTrackingAr(data.trackingStatus);
  let isCorrectionRequiredInWorkflow =
    data.workFlowStatus == "correctionRequired";
  return (
    <StyledTableRow key={0} style={{ width: "100%" }}>
      <StyledTableCell
        colSpan="2"
        style={{ minWidth: "20%" }}
        component="th"
        scope="row"
      >
        <DescriptionIcon fontSize="small" style={{ verticalAlign: "middle" }} />{" "}
        {data.invoiceId ? data.invoiceId : ""}
        <span style={{ float: "right" }}>
          {isAr ? (
            currentStatus.status == "rejected" ? (
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
            ) : currentStatus.status == "correctionRequired" &&
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
            ) : data.trackingStatus.paid.status == "partial" ? (
              <Tooltip title="PARTIALLY PAID">
                <Chip
                  variant="outlined"
                  size="small"
                  // avatar={<Avatar>M</Avatar>}
                  label="PARTIALLY PAID"
                  clickable
                  style={{
                    border: "lightgreen 1px solid",
                    color: "lightgreen",
                  }}
                />
              </Tooltip>
            ) : data.trackingStatus.paid.status == "completed" ? (
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
            ) : currentStatus.status == "readyToSend" ? (
              <Tooltip title="Ready to Sent">
                <Chip
                  variant="outlined"
                  size="small"
                  // avatar={<Avatar>M</Avatar>}
                  label="READY TO SENT"
                  clickable
                  style={{ border: "blue 1px solid", color: "blue" }}
                />
              </Tooltip>
            ) : currentStatus.status == "sent" ? (
              <Tooltip title="Sent">
                <Chip
                  variant="outlined"
                  size="small"
                  // avatar={<Avatar>M</Avatar>}
                  label="SENT TO CUSTOMER"
                  clickable
                  style={{ border: "orange 1px solid", color: "orange" }}
                />
              </Tooltip>
            ) : currentStatus.status == "acknowledged" ? (
              <Tooltip title="Sent & Acknowledged">
                <Chip
                  variant="outlined"
                  size="small"
                  // avatar={<Avatar>M</Avatar>}
                  label="ACKNOWLEDGED"
                  clickable
                  style={{ border: "green 1px solid", color: "green" }}
                />
              </Tooltip>
            ) : currentStatus.val == 0 ? (
              <Tooltip title="DRAFT INVOICE">
                <Chip
                  variant="outlined"
                  size="small"
                  // avatar={<Avatar>M</Avatar>}
                  label="DRAFT INVOICE"
                  clickable
                  style={{ border: "orange 1px solid", color: "orange" }}
                />
              </Tooltip>
            ) : currentStatus.val == 1 ? (
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
            ) : currentStatus.val == 2 ? (
              <Tooltip title="UNDER APPROVAL">
                <Chip
                  variant="outlined"
                  size="small"
                  // avatar={<Avatar>M</Avatar>}
                  label="UNDER APPROVE"
                  clickable
                  color="primary"
                />
              </Tooltip>
            ) : currentStatus.val == 3 ? (
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
            )
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
          ) : data.trackingStatus.paid.status == "partial" ? (
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
          ) : data.trackingStatus.paid.status == "completed" ? (
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
          ) : currentStatus.status == "readyToPay" ? (
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
          ) : currentStatus.val == 0 ? (
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
        </span>
      </StyledTableCell>

      <StyledTableCell align="right">
        <small>{data.LC_currency.Code}</small>
        {data["outstanding_bc"] ? +addZeroes(data["outstanding_bc"]) : 0} <br />
        {data.FC_currency.Code !== data.LC_currency.Code ? (
          <small>
            ({data.FC_currency.Code}{" "}
            {data["outstanding"] ? +addZeroes(data["outstanding"]) : 0})
          </small>
        ) : (
          ""
        )}
      </StyledTableCell>
      <StyledTableCell align="right">
        <small>{data.LC_currency.Code}</small>{" "}
        {data.totalAmtDue ? addZeroes(data.totalAmtDue) : 0} <br />
        {data.FC_currency.Code !== data.LC_currency.Code ? (
          <small>
            ({data.FC_currency.Code}{" "}
            {data.totalAmtDue ? addZeroes(data.totalAmtDue) : 0})
          </small>
        ) : (
          ""
        )}
      </StyledTableCell>
      <StyledTableCell align="right">
        <small>{data.LC_currency.Code}</small>{" "}
        {data["col-1-bc"] ? +addZeroes(data["col-1-bc"]) : 0} <br />
        {data.FC_currency.Code !== data.LC_currency.Code ? (
          <small>
            ({data.FC_currency.Code}{" "}
            {data["col-1"] ? +addZeroes(data["col-1"]) : 0})
          </small>
        ) : (
          ""
        )}
      </StyledTableCell>
      <StyledTableCell align="right">
        <small>{data.LC_currency.Code}</small>{" "}
        {data["col-2-bc"] ? addZeroes(data["col-2-bc"]) : 0}
        <br />
        {data.FC_currency.Code !== data.LC_currency.Code ? (
          <small>
            ({data.FC_currency.Code}{" "}
            {data["col-2"] ? +addZeroes(data["col-2"]) : 0})
          </small>
        ) : (
          ""
        )}
      </StyledTableCell>
      <StyledTableCell align="right">
        <small>{data.LC_currency.Code}</small>{" "}
        {data["col-3-bc"] ? addZeroes(data["col-3-bc"]) : 0}
        <br />
        {data.FC_currency.Code !== data.LC_currency.Code ? (
          <small>
            ({data.FC_currency.Code}{" "}
            {data["col-3"] ? +addZeroes(data["col-3"]) : 0})
          </small>
        ) : (
          ""
        )}
      </StyledTableCell>
      <StyledTableCell align="right">
        <small>{data.LC_currency.Code}</small>{" "}
        {data["col-4-bc"] ? addZeroes(data["col-4-bc"]) : 0}
        <br />
        {data.FC_currency.Code !== data.LC_currency.Code ? (
          <small>
            ({data.FC_currency.Code}{" "}
            {data["col-4"] ? +addZeroes(data["col-4"]) : 0})
          </small>
        ) : (
          ""
        )}
      </StyledTableCell>
      <StyledTableCell align="right">
        <small>{data.LC_currency.Code}</small>{" "}
        {data["col-4+-bc"] ? addZeroes(data["col-4+-bc"]) : 0}
        <br />
        {data.FC_currency.Code !== data.LC_currency.Code ? (
          <small>
            ({data.FC_currency.Code}{" "}
            {data["col-4+"] ? +addZeroes(data["col-4+"]) : 0})
          </small>
        ) : (
          ""
        )}
      </StyledTableCell>
      <StyledTableCell align="right">
        <Tooltip title="360&#176; View" aria-label="advanceDocumentView">
          <Button
            justIcon
            round
            simple
            icon={ViewModuleIcon}
            onClick={() => {
              viewInvoice({
                invoiceId: data.invoiceId,
                version: data.version,
                vendorId: data.vendorId,
                clientId:data.clientId
              });
            }}
            color="info"
            className="Edit"
          >
            <ViewModuleIcon />
          </Button>
        </Tooltip>
      </StyledTableCell>
    </StyledTableRow>
  );
}

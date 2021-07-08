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
  Button
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
import Collapse from '@material-ui/core/Collapse';
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
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import Row from "./Row";
import Graph from "./Graph";
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
    width:'7%',
  },
  body: {
    fontSize: 14,
    border: "1px solid lightgrey",
    width:'7%',
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.action.hover,
    width:'7%',
  },
  body: {
    fontSize: 14,
    border: "1px solid lightgrey",
    width:'7%',
  },
}))(TableRow);

export default function Invoices() {
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  const dispatch = useDispatch();
  const Check = require("is-null-empty-or-undefined").Check;

  const classes = useStyles();
  
  return (
            
          <StyledTableRow key={0} style={{width:'100%'}}>
        <StyledTableCell colSpan="2" style={{ minWidth: '20%' }} component="th" scope="row">
        <ArrowRightIcon style={{verticalAlign:'middle'}} /> INV-00001
        </StyledTableCell>

        <StyledTableCell align="right">$100.00</StyledTableCell>
        <StyledTableCell align="right">$200.00</StyledTableCell>
        <StyledTableCell align="right">$0.00</StyledTableCell>
        <StyledTableCell align="right">$0.00</StyledTableCell>
        <StyledTableCell align="right">$100.00</StyledTableCell>
        <StyledTableCell align="right">$100.00</StyledTableCell>
        <StyledTableCell align="right">$100.00</StyledTableCell>
        <StyledTableCell align="right">
        <Tooltip title='360&#176; View' aria-label='advanceDocumentView'>
                <Button
                  justIcon
                  round
                  simple
                  icon={ViewModuleIcon}
                  onClick={() => {
                    // viewQrView(prop);
                  }}
                  color='info'
                  className='Edit'
                >
                  <ViewModuleIcon />
                </Button>
              </Tooltip>
        </StyledTableCell>
      </StyledTableRow>
  );
}

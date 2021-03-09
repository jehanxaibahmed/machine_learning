import React from "react";
// @material-ui/core components
import {
  makeStyles,
  CircularProgress,
  LinearProgress,
  Typography,
  withStyles,
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import axios from "axios";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { Animated } from "react-animated-css";
import jwt from "jsonwebtoken";
import { useDispatch, useSelector } from "react-redux";

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
    minWidth: 650,
  },
};

const useStyles = makeStyles(styles);

function parseDate(str) {
  var mdy = str.split("/");
  return new Date(mdy[2], mdy[0] - 1, mdy[1]);
}

function datediff(first, second) {
  return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

const calculateTimimg = d => {
  let months = 0, years = 0, days = 0, weeks = 0;
  while(d){
     if(d >= 365){
        years++;
        d -= 365;
     }else if(d >= 30){
        months++;
        d -= 30;
     }else if(d >= 7){
        weeks++;
        d -= 7;
     }else{
        days++;
        d--;
     }
  };
      years =  years !== 0 ? `${years} Years - ` : '' ;
      months =  months !== 0 ? `${months} Months - ` : '' ;
      weeks =  weeks !== 0 ? `${weeks} Weeks - ` : '' ;
      return years + months + weeks + days;
};

export default function InvoiceAge(props) {
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  function createData(name, remainingDays, dueDate, invoiceDate) {
    return { name, remainingDays, dueDate, invoiceDate };
  }

  const rows = [
    createData("INV-00001", 10, "10/12/2023", "10/12/2020"),
    createData("INV-00002", 12, "03/08/2021", "10/12/2020"),
    createData("INV-00004", 18, "12/07/2024", "10/12/2020"),
    createData("INV-00005", 30, "12/05/2021", "10/12/2020"),
    createData("INV-00003", 12, "03/16/2021", "10/12/2020"),
  ];

  const BorderLinearProgress = withStyles((theme) => ({
    root: {
      height: 40,
      borderRadius: 5,
    },
    colorPrimary: {
      backgroundColor: "#1a90ff",
    },
    bar: {
      // borderRadius: 5,
      backgroundColor:  theme.palette.grey[400],
    },
  }))(LinearProgress);

  const classes = useStyles();
  return (
    <div>
      <Animated
        animationIn="bounceInRight"
        animationOut="bounceOutLeft"
        animationInDuration={1000}
        animationOutDuration={1000}
        isVisible={true}
      >
        <GridContainer>
          <GridItem xs={12}>
            <Card>
              <CardHeader color="info" icon>
                <CardIcon color="info">
                  <h4 className={classes.cardTitleText}>Invoice Age</h4>
                </CardIcon>
              </CardHeader>
              <CardBody>
                <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Invoice ID</TableCell>
                        <TableCell style={{ width: 600 }}></TableCell>
                        <TableCell align="right">Due Date</TableCell>
                        <TableCell align="right">Invoice Date</TableCell>
                        <TableCell align="right">Amount&nbsp;($)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => {
                        var remainingDays = datediff(new Date(), parseDate(row.dueDate));
                        var totalDays = datediff(
                          parseDate(row.invoiceDate),
                          parseDate(row.dueDate)
                        );
                        var percentage = remainingDays * 100 / totalDays;
                        console.log(percentage);
                        return (
                        <TableRow key={row.name}>
                          <TableCell component="th" scope="row">
                            {row.name}
                          </TableCell>
                          <TableCell style={{ width: 600 }}>
                            <div style={{ position: "relative" }}>
                              <BorderLinearProgress
                                style={{
                                  background: percentage > 0 ?  percentage < 15 ? '#ffa5009e' : '#008000bf' : '#ff0000b8'
                                }}
                                variant="determinate"
                                value={percentage}
                              />
                              <Typography
                              variant="body2"
                              component="h2"
                                style={{
                                  position: "absolute",
                                  color: "white",
                                  top: 10,
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                }}
                              >
                                {percentage > 0 ? `${calculateTimimg(remainingDays)} Days` : 'Over Due'}
                              </Typography>
                            </div>
                          </TableCell>
                          <TableCell align="right">{row.dueDate}</TableCell>
                          <TableCell align="right">{row.invoiceDate}</TableCell>
                          <TableCell align="right">
                            $&nbsp;{parseFloat(row.remainingDays).toFixed(2)}
                          </TableCell>
                        </TableRow>
                       )})}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </Animated>
    </div>
  );
}

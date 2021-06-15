import React from "react";
// @material-ui/core components
import {
  makeStyles,
  CircularProgress,
  LinearProgress,
  Typography,
  withStyles,
  Backdrop
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
import { addZeroes, formatDateTime } from "views/LDocs/Functions/Functions";

const styles = makeStyles((theme) => ({
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
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  }
})
)

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
  const [data, setData] = React.useState([]);
  const [isLoading , setIsLoading] = React.useState(true);
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  function createData(name, remainingDays, dueDate, invoiceDate) {
    return { name, remainingDays, dueDate, invoiceDate };
  }

  
  React.useEffect(()=>{
    const user = jwt.decode(Token);
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/invoice/invoiceAgeing/${user.orgDetail.organizationId}`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        var data = response.data;
        setData(data);
        setIsLoading(false);
        }).catch((err)=>{
        console.log(err);
        setData([]);
      })
  },[])
  const BorderLinearProgress = withStyles((theme) => ({
    root: {
      height: 40,
      borderRadius: 5,
    },
    colorPrimary: {
      backgroundColor:  theme.palette.grey[400],
    },
    bar: {
      backgroundColor:  '#5A2C66',
    }
  
  }))(LinearProgress);

  const classes = styles();
  return (
    <div>
      {!isLoading ?
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
                        <TableCell align="right">Invoice Date</TableCell>
                        <TableCell align="right">Due Date</TableCell>
                        <TableCell style={{ width: 600 }}></TableCell>
                        <TableCell align="right">Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((row) => {
                        var remainingDays = datediff(new Date(), new Date(row.dueDate))+2;
                        var totalDays = datediff(
                          new Date(row.createdDate),
                          new Date(row.dueDate)
                        );
                        var percentage = remainingDays * 100 / totalDays;
                        if(percentage < 100 && percentage > 0){
                          percentage = percentage;
                        }else{
                          percentage = 0
                        }
                        return (
                        <TableRow key={row.invoiceId}>
                          <TableCell component="th" scope="row">
                            {row.invoiceId}
                          </TableCell>
                          <TableCell align="right">{formatDateTime(row.createdDate)}</TableCell>
                          <TableCell align="right">{formatDateTime(row.dueDate)}</TableCell>
                          <TableCell style={{ width: 600 }}>
                            <div style={{ position: "relative" }}>
                              <BorderLinearProgress
                                style={{
                                  background: remainingDays < 0 ? '#ff0000b8' : ''
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
                                {remainingDays > 0 ? `${calculateTimimg(remainingDays)} Days` : 'Over Due'}
                              </Typography>
                            </div>
                          </TableCell>
                          <TableCell align="right">
                            SAR {addZeroes(row.netAmt)}
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
       :
        <Backdrop className={classes.backdrop} open={isLoading}>
          <CircularProgress  color="inherit" />
        </Backdrop>
        }
    </div>
  );
}

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// @material-ui/core components
import {
  makeStyles,
  CircularProgress,
  Slide,
  DialogContent,
  Dialog,
  Radio,
  RadioGroup,
  FormControlLabel,
  Grid,
  Divider,
} from "@material-ui/core";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import defaultAvatar from "assets/img/placeholder.jpg";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import Button from "components/CustomButtons/Button.js";
import { Animated } from "react-animated-css";
import jwt from "jsonwebtoken";
import Wizard from "./Wizard.js";
import Step1 from "./steps/level1";
import Step2 from "./steps/level2";
import axios from 'axios';
import { setIsTokenExpired } from "actions";


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

const useStyles = makeStyles(styles);
export default function Payable(props) {
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
    const dispatch = useDispatch();
  const decoded = jwt.decode(Token);
  const classes = useStyles();
  const [gridView, setGridView] = React.useState(true);
  const [loading, setIsLoading] = React.useState(true);
  const [componentState, setComponentState] = React.useState({
    overDueInvoices:0,
    fullPaid:0,
    partiallyPay:0,
    toBePaid:0,
    payments:[],
    invoices:[],
    currencyCode:''
  });

  React.useEffect(() => {
      let vendorID = props.vendor;
      let orgID = props.org;
      let filter = null;
    axios({
        method: "get", //you can set what request you want to be
        url:`${process.env.REACT_APP_LDOCS_API_URL}/invoice/GetInvoicePaymentDetails/${orgID}/${vendorID}/${filter}`,
        headers: {
          cooljwt: Token,
        },
      })
        .then((response) => {
            let data = response.data;
            console.log(data);
            setComponentState((componentState) => ({
                ...componentState,
                invoices:data.invoices,
                payments:data.payments,
                fullPaid:data.fullPaid[0]?data.fullPaid[0].totalAmount:0,
                overDueInvoices:data.overDueInvoices[0]?data.overDueInvoices[0].totalAmount:0,
                partiallyPay:data.partiallyPay[0]?data.partiallyPay[0].totalAmount:0,
                toBePaid:data.toBePaid[0]?data.toBePaid[0].totalAmount:0,
                currencyCode:data.invoices.length > 0 ? data.invoices[0].LC_currency.Code : "" 
              }));
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          if (error.response) {
             error.response.status == 401 && dispatch(setIsTokenExpired(true));
          }
          console.log(
            typeof error.response != "undefined"
              ? error.response.data
              : error.message
          );
          setIsLoading(false);
        });
  }, []);

  return (
    <div>
      {gridView ? (
        <Animated
          animationIn="bounceInRight"
          animationOut="bounceOutLeft"
          animationInDuration={1000}
          animationOutDuration={1000}
          isVisible={gridView}
        >
          <GridContainer>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card
                style={{
                  backgroundColor: "#56ab2f",
                  background:
                    "-webkit-linear-gradient(to right, #56ab2f, #a8e063)",
                  background: "linear-gradient(to right, #56ab2f, #a8e063)",
                  paddingLeft:20,
                  paddingTop:10,
                  paddingBottom:10,
                  paddingRight:20,
                  color:'white'
                }}
              >
                <h4 className={classes.cardCategory}>PAID</h4>
                    <Divider style={{background:'white'}} />
                <h5 className={classes.cardTitle}>{componentState.currencyCode}  {componentState.fullPaid}</h5>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card
                style={{
                  backgroundColor: "#ffb75e",
                  background:
                    "-webkit-linear-gradient(to right, #ffb75e, #ed8f03)",
                  background: "linear-gradient(to right, #ffb75e, #ed8f03)",
                  paddingLeft:20,
                  paddingTop:10,
                  paddingBottom:10,
                  paddingRight:20,
                  color:'white'
                }}
              >
                <h4 className={classes.cardCategory}>PENDING</h4>
                    <Divider style={{background:'white'}} />
                <h5 className={classes.cardTitle}>{componentState.currencyCode} {componentState.toBePaid}</h5>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card
                style={{
                  backgroundColor: "#f85032",
                  background:
                    "-webkit-linear-gradient(to right, #f85032, #e73827)",
                  background: "linear-gradient(to right, #f85032, #e73827)",
                  paddingLeft:20,
                  paddingTop:10,
                  paddingBottom:10,
                  paddingRight:20,
                  color:'white'
                }}
              >
                <h4 className={classes.cardCategory}>OVERDUE</h4>
                    <Divider style={{background:'white'}} />
                <h5 className={classes.cardTitle}>{componentState.currencyCode} {componentState.overDueInvoices}</h5>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card
                style={{
                  backgroundColor: "#005c97",
                  background:
                    "-webkit-linear-gradient(to right, #005c97, #363795)",
                  background: "linear-gradient(to right, #005c97, #363795)",
                  paddingLeft:20,
                  paddingTop:10,
                  paddingBottom:10,
                  paddingRight:20,
                  color:'white'
                }}
              >
                <h4 className={classes.cardCategory}>PARTIAL PAID</h4>
                    <Divider style={{background:'white'}} />
                <h5 className={classes.cardTitle}>{componentState.currencyCode} {componentState.partiallyPay}</h5>
              </Card>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card profile>
                <CardBody profile>
                  <Wizard
                    validate
                    steps={[
                      {
                        stepName: "Transactions",
                        stepComponent: Step1,
                        stepId: "transactions",
                      },
                      {
                        stepName: "Invoices",
                        stepComponent: Step2,
                        stepId: "invoices",
                      },
                    ]}
                    invoices={componentState.invoices}
                    transactions={componentState.payments}
                  />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </Animated>
      ) : (
        ""
      )}
    </div>
  );
}

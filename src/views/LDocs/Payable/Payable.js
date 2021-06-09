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
  TextField,
  withStyles,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  MenuItem,
  Avatar,
  Divider,
} from "@material-ui/core";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import defaultImage from "assets/img/image_placeholder.jpg";
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
import axios from "axios";
import { setIsTokenExpired } from "actions";


const useStyles  = makeStyles((theme) => ({
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
  cardTitleText: {
    color: "white",
  },
  buttonRight: {},
  textFieldColor: {
    color: "white",
  },
  large: {
    width: theme.spacing(18),
    height: theme.spacing(18),
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  img:{
    textAlign:'center',
    paddingTop:30,
    paddingBottom:30,
    width:'100%'
  }
}));

export default function Payable(props) {
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  const dispatch = useDispatch();
  const decoded = jwt.decode(Token);
  const isVendor = decoded.isVendor;
  const classes = useStyles();
  const [gridView, setGridView] = React.useState(true);
  const [loading, setIsLoading] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const [componentState, setComponentState] = React.useState({
    orgs: [],
    vendors: [],
    overDueInvoices: 0,
    fullPaid: 0,
    partiallyPay: 0,
    toBePaid: 0,
    payments: [],
    invoices: [],
    currencyCode: "",
    selectedVendor:null,
    selectedCustomer:null
  });

  

  const handleFilter = (event) => {
    event.preventDefault();
    setSelected(event.target.value);
  };

  const getCustomers = () => {
    axios({
      method: "get", //you can set what request you want to be
      url: `${process.env.REACT_APP_LDOCS_API_URL}/vendor/organizationByVender`,
      headers: {
        cooljwt: Token,
      },
    })
      .then((response) => {
        let orgs = response.data.organizations;
        setSelected(orgs[0].organizationId);
        setComponentState((componentState) => ({
          ...componentState,
          orgs: orgs,
          selectedCustomer: orgs.find(o=>o.organizationId == orgs[0].organizationId)
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getVendors = () => {
    decoded.orgDetail &&
      axios({
        method: "get", //you can set what request you want to be
        url: `${process.env.REACT_APP_LDOCS_API_URL}/vendor/vendorsByOrganization/${decoded.orgDetail.organizationId}`,
        headers: {
          cooljwt: Token,
        },
      })
        .then((response) => {
          let vendors = response.data;
          setSelected(vendors[0]._id);
          setComponentState((componentState) => ({
            ...componentState,
            vendors: vendors,
            selectedVendor:vendors.find(v=>v._id == vendors[0]._id)
          }));
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const getData = () => {
    setIsLoading(true);
    let vendorID = props.vendor
      ? props.vendor
      : isVendor
      ? decoded.id
      : selected;
    let orgID = props.org
      ? props.org
      : isVendor
      ? selected
      : decoded.orgDetail.organizationId;
    let filter = null;
    axios({
      method: "get", //you can set what request you want to be
      url: `${process.env.REACT_APP_LDOCS_API_URL}/invoice/GetInvoicePaymentDetails/${orgID}/${vendorID}/${filter}`,
      headers: {
        cooljwt: Token,
      },
    })
      .then((response) => {
        let data = response.data;
        setComponentState((componentState) => ({
          ...componentState,
          invoices: data.invoices,
          payments: data.payments,
          fullPaid: data.fullPaid[0] ? data.fullPaid[0].totalAmount : 0,
          overDueInvoices: data.overDueInvoices[0]
            ? data.overDueInvoices[0].totalAmount
            : 0,
          partiallyPay: data.partiallyPay[0]
            ? data.partiallyPay[0].totalAmount
            : 0,
          toBePaid: data.toBePaid[0] ? data.toBePaid[0].totalAmount : 0,
          currencyCode:
            data.invoices.length > 0 ? data.invoices[0].LC_currency.Code : "",
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
  };

  React.useEffect(() => {
    setIsLoading(true);
    let vendorID = props.vendor;
    let orgID = props.org;
    vendorID && orgID ? getData() : isVendor ? getCustomers() : getVendors();
  }, []);

  React.useEffect(() => {
    if(!isVendor){
      let selectedVendor = componentState.vendors.find(v=>v._id == selected);
      setComponentState((componentState) => ({
        ...componentState,
        selectedVendor:selectedVendor
      }));
      console.log('Selected Vendor', selectedVendor);
    }else{
      let selectedCustomer = componentState.orgs.find(o=>o.organizationId == selected);
      setComponentState((componentState) => ({
        ...componentState,
        selectedCustomer:selectedCustomer
      }));
      console.log('Selected Customer', selectedCustomer);
    }
    getData();
  }, [selected]);

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
          {/* {isVendor || decoded.orgDetail} */}
            <div>
              <GridContainer>
              {!props.vendor && !props.org ? 
                <GridItem xs={12} sm={6} md={6} lg={3}>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <Card
                        style={{
                           paddingLeft: 20,
                          paddingTop: 10,
                          paddingBottom: 10,
                          paddingRight: 20,
                          color: "white",
                        }}
                      >
                        <h4 className={classes.cardCategory} style={{color:'grey'}}>
                        {isVendor ? "CUSTOMER" : "VENDOR"}
                        </h4>
                        <Divider style={{ background: "grey" }} />
                        <TextField
                          className={classes.textField}
                          fullWidth={true}
                          label={isVendor ? "Select Customer" : "Select Vendor"}
                         
                          className={classes.root}
                          name="cusven"
                          onChange={(event) => {
                            handleFilter(event);
                          }}
                          style={{ marginTop: 5}}
                          select
                          value={selected || ""}
                        >
                          <MenuItem
                            disabled
                            classes={{
                              root: classes.selectMenuItem,
                            }}
                          >
                            {isVendor ? "Select Customer" : "Select Vendor"}
                          </MenuItem>
                          {isVendor
                            ? componentState.orgs.map((org, index) => {
                                return (
                                  <MenuItem
                                    key={index}
                                    value={org.organizationId}
                                  >
                                    {org.organizationName}
                                  </MenuItem>
                                );
                              })
                            : componentState.vendors.map((ven, index) => {
                                return (
                                  <MenuItem key={index} value={ven._id}>
                                    {ven.level1.displayName}
                                  </MenuItem>
                                );
                              })}
                        </TextField>
                      </Card>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12} lg={12}>
                      <Card>
                        {!isVendor ?
                        <CardBody>
                        <h4 className={classes.cardCategory} style={{color:'grey'}}>
                          VENDOR DETAILS
                        </h4>
                        <div className={classes.img}>
                        <Avatar alt="Remy Sharp" src={defaultAvatar} className={classes.large} />
                        </div>
                        <List>
                    {/* Auto Init Workflow */}
                    <ListItem style={{margin:0,padding:0}}>
                      <ListItemText
                        style={{ color: "black" }}
                        primary="Name"
                        secondary={
                          componentState.selectedVendor ?
                          componentState.selectedVendor.level1.vendorName:"..." 
                        }
                      />
                    </ListItem>
                    <Divider />
                    <ListItem style={{margin:0,padding:0}}>
                      <ListItemText
                        style={{ color: "black" }}
                        primary="Email"
                        secondary={
                          componentState.selectedVendor ?
                          componentState.selectedVendor.level1.email:"..." 
                        }
                      />
                    </ListItem>
                    <Divider />
                    <ListItem style={{margin:0,padding:0}}>
                      <ListItemText
                        style={{ color: "black" }}
                        primary="Contact"
                        secondary={
                          componentState.selectedVendor ?
                          componentState.selectedVendor.level1.contactNumber:"..." 
                        }
                      />
                    </ListItem>
                    <Divider />
                    <ListItem style={{margin:0,padding:0}}>
                      <ListItemText
                        style={{ color: "black" }}
                        primary="License Number"
                        secondary={
                          componentState.selectedVendor ?
                          componentState.selectedVendor.level1.licenseNumber:"..." 
                        }
                      />
                    </ListItem>
                    <Divider />
                    </List>
                      </CardBody>:
                      <CardBody>
                      <h4 className={classes.cardCategory} style={{color:'grey'}}>
                        CUSTOMER DETAILS
                      </h4>
                      <div className={classes.img}>
                      <Avatar alt="Remy Sharp" src={defaultAvatar} className={classes.large} />
                      </div>
                      <List>
                  {/* Auto Init Workflow */}
                  <ListItem style={{margin:0,padding:0}}>
                    <ListItemText
                      style={{ color: "black" }}
                      primary="Name"
                      secondary={
                        componentState.selectedCustomer ?
                        componentState.selectedCustomer.organizationName:"..." 
                      }
                    />
                  </ListItem>
                  <Divider />
                  <ListItem style={{margin:0,padding:0}}>
                    <ListItemText
                      style={{ color: "black" }}
                      primary="PBR Name"
                      secondary={
                        componentState.selectedCustomer ?
                        componentState.selectedCustomer.adminLoginName:"..." 
                      }
                    />
                  </ListItem>
                  <Divider />
                  <ListItem style={{margin:0,padding:0}}>
                    <ListItemText
                      style={{ color: "black" }}
                      primary="PBR Email"
                      secondary={
                        componentState.selectedCustomer ?
                        componentState.selectedCustomer.primaryBusinessRepresentativeEmail:"..." 
                      }
                    />
                  </ListItem>
                  <Divider />
                  <ListItem style={{margin:0,padding:0}}>
                    <ListItemText
                      style={{ color: "black" }}
                      primary="PBR Contact"
                      secondary={
                        componentState.selectedCustomer ?
                        componentState.selectedCustomer.primaryBusinessRepresentativeCellNumber:"..." 
                      }
                    />
                  </ListItem>
                  <Divider />
                  <ListItem style={{margin:0,padding:0}}>
                    <ListItemText
                      style={{ color: "black" }}
                      primary="Address"
                      secondary={
                        componentState.selectedCustomer ?
                        componentState.selectedCustomer.Address:"..." 
                      }
                    />
                  </ListItem>
                  <Divider />
                  </List>
                    </CardBody>
                      }
                      </Card>

                    </GridItem>
                  </GridContainer>
                </GridItem>
                :""}
                <GridItem xs={9} sm={9} md={9} lg={props.vendor && props.org ? 12 : 9}>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={4} lg={4}>
                      <Card
                        style={{
                          backgroundColor: "#56ab2f",
                          background:
                            "-webkit-linear-gradient(to right, #56ab2f, #a8e063)",
                          background:
                            "linear-gradient(to right, #56ab2f, #a8e063)",
                          paddingLeft: 20,
                          paddingTop: 10,
                          paddingBottom: 20,
                          paddingRight: 20,
                          color: "white",
                        }}
                      >
                        <h4 className={classes.cardCategory}>PAID</h4>
                        <Divider style={{ background: "white" }} />
                        <h5 className={classes.cardTitle}>
                          {componentState.currencyCode}{" "}
                          {componentState.fullPaid.toFixed(2)}
                        </h5>
                      </Card>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={4} lg={4}>
                      <Card
                        style={{
                          backgroundColor: "#ffb75e",
                          background:
                            "-webkit-linear-gradient(to right, #ffb75e, #ed8f03)",
                          background:
                            "linear-gradient(to right, #ffb75e, #ed8f03)",
                          paddingLeft: 20,
                          paddingTop: 10,
                          paddingBottom: 20,
                          paddingRight: 20,
                          color: "white",
                        }}
                      >
                        <h4 className={classes.cardCategory}>PENDING</h4>
                        <Divider style={{ background: "white" }} />
                        <h5 className={classes.cardTitle}>
                          {componentState.currencyCode}{" "}
                          {componentState.toBePaid.toFixed(2)}
                        </h5>
                      </Card>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={4} lg={4}>
                      <Card
                        style={{
                          backgroundColor: "#f85032",
                          background:
                            "-webkit-linear-gradient(to right, #f85032, #e73827)",
                          background:
                            "linear-gradient(to right, #f85032, #e73827)",
                          paddingLeft: 20,
                          paddingTop: 10,
                          paddingBottom: 20,
                          paddingRight: 20,
                          color: "white",
                        }}
                      >
                        <h4 className={classes.cardCategory}>OVERDUE</h4>
                        <Divider style={{ background: "white" }} />
                        <h5 className={classes.cardTitle}>
                          {componentState.currencyCode}{" "}
                          {componentState.overDueInvoices.toFixed(2)}
                        </h5>
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
                            loading={loading}
                            isVendor={isVendor}
                          />
                        </CardBody>
                      </Card>
                    </GridItem>
                  </GridContainer>
                </GridItem>
              </GridContainer>
            </div>
        </Animated>
      ) : (
        ""
      )}
    </div>
  );
}

import React from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { MenuItem, TextField, Switch } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Tooltip from "@material-ui/core/Tooltip";
// @material-ui/icon
import VisibilityIcon from "@material-ui/icons/Visibility";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import RegisterVendor from "./RegisterVendor";
import View from "./ViewVendor";
import {useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import Swal from 'sweetalert2'
import { successAlert, errorAlert, msgAlert }from "views/LDocs/Functions/Functions";
import { Animated } from "react-animated-css";
import AssessmentIcon from '@material-ui/icons/Assessment';
import jwt from "jsonwebtoken";
import ShowVendor from "./ShowVendor.js";
import { setIsTokenExpired } from "actions";
import Payable from "../Payable/Payable";
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
  statusImage:{
    width:50,
    height:50
  }
};

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function Vendor() {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const dispatch = useDispatch();
  const classes = useStyles();
  const [classicModal, setClassicModal] = React.useState(false);
  const [viewModal, setViewModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [Updating, setUpdating] = React.useState(false);
  const [vendorDetail, setVendorDetail] = React.useState();
  const [organizationFilter, setOrganizationFilter] = React.useState("");
  const [organizations, setOrganizations] = React.useState([]);
  const [updatingStatus, setUpdatingStatus] = React.useState();
  const [data, setData] = React.useState();
  const [viewComponentView, setViewComponentView] = React.useState(false);
  const [animateTableView, setAnimateTableView] = React.useState(true);
  const [viewComponent, setViewComponent] = React.useState(false);
  const [viewAnalyticsComponent, setViewAnalyticsComponent] = React.useState(false);
  const [analyticsComponent, setAnalyticsComponent] = React.useState(false);
  const [animateTable, setAnimateTable] = React.useState(true);
  const [vendorData, setVendorData] = React.useState();

  

   React.useEffect(() => {
    let userDetail = jwt.decode(Token);
    getOrganizations(userDetail);
   },[]);

   const setFilters = (org) => {
    setOrganizationFilter(org);
  }

 
  const handleChangeStatus = (prop, status) => {
    setUpdatingStatus(prop._id);
    var statusNew = status.status == "Active" ? "Inactive" : "Active";
    var bodyFormData = {
      tenantId:prop.tenantId,
      organizationId:status.organizationId,
      vendorId:prop._id,
      status:statusNew
    }
    axios({
      method: "put",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/vendor/updateVendorStatus`,
      data: bodyFormData,
      headers: { cooljwt:Token},
    })
      .then((response) => {
        let msg = "Supplier Status Changed Successfully!";
        successAlert(msg);
        getVendors(status.organizationId, true);
      }).catch((err)=>{
        console.log(err);
      })

  }

  const viewAnalytics = (row) => {
    setAnimateTable(false);
    setVendorData(row);
    setTimeout(function() {
      setAnimateTableView(false);
      setViewAnalyticsComponent(true);
      setAnalyticsComponent(true);
    }, 500);
  }

  const viewVendor = (row) => {
     setAnimateTable(false);
     setVendorData(row);
     setTimeout(function() {
       setAnimateTableView(false);
       setViewComponentView(true);
       setViewComponent(true);
     }, 500);
  }

  const handleOrgFilter = (event) => {
    const orgDetail = organizations.find(org => org.organizationName == event.target.value);
    setOrganizationFilter(orgDetail);
    getVendors(orgDetail._id);
  }

   const viewComp = (row) => {
     setVendorDetail(row);
     setUpdating(false);
     setViewModal(true);
   };

  const goBack = () => {
    setAnalyticsComponent(false);
    setViewComponent(false);
  setTimeout(function () {
    setViewAnalyticsComponent(false);
    setViewComponentView(false);
     setAnimateTableView(true);
    setAnimateTable(true);
  }, 500);
}

  const getOrganizations = (user) => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/organization/getAllOrgBytenant`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        if (response.data.length > 0) {
          if (user.isTenant) {
            const orgs = response.data;
            setOrganizations(orgs);
            setOrganizationFilter(orgs[0]);
            getVendors(orgs[0]._id);
          } else {
            const orgs =  response.data.filter(org => org._id == user.orgDetail.organizationId)
            setOrganizations(orgs);
            getVendors(orgs[0]._id);
            setOrganizationFilter(orgs[0]);
          } 
        }
      }, 500);
  }

  const getLookUp = async () => {
    return new Promise((res, rej) => {
       axios({
        method: "get", //you can set what request you want to be
        url: `${process.env.REACT_APP_LDOCS_API_URL}/lookup/GetAllCurrencies`,
        headers: {
          cooljwt: Token,
        },
      }).then(response=>{
          res(response.data);
      }).catch(err=>{
        console.log(err);
        rej([]);
      })
    })
  }

  const getVendors = (org,notLoading) => {
    notLoading ? setIsLoading(false): setIsLoading(true);
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/vendor/vendorsByOrganization/${org}`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        // setUpdatingStatus(null);
        getLookUp().then(res=>{
        setData(
          response.data.map((prop, index) => {
            let currency =  res.find(cu=>cu._id == prop.currency);
            var status  = prop.organizations.find(item=>item.organizationsId === org._id);
            return {
              id:  `V-00${index+1}`,
              vendorName: prop.level1.vendorName,
              //organizationName: prop.organizationName,
              currency: currency ? `${currency.Currency.toUpperCase()} ${currency.Code}` : prop.Currency_Base,
              licenseNumber: prop.level1.licenseNumber,
              email: prop.level1.email,
              referenceTicket: prop.level1.referenceTicket,
              contactNumber: prop.level1.contactNumber,
              invoiceCount:prop.level1.invoiceCount,
              status:(
                  //<img style={{width:30,height:30}} src={Pending} alt={prop.reviewedStatus}
                  updatingStatus == prop._id ?
                  <CircularProgress />:
                  <Switch
                    checked={status!== undefined ? status.status == 'Active' ? true : false : false}
                    onChange={()=>handleChangeStatus(prop, status)}
                    color="primary"
                    name="checkedB"
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
              ),
              actions: (
                <div className="actions-right">
                  <Tooltip title="Analytics" aria-label="analytics">
                   <Button
                     justIcon
                     round
                     simple
                     icon={AssessmentIcon}
                     onClick={() => viewAnalytics(prop)}
                     color="info"
                     className="View"
                   >
                     <AssessmentIcon />
                   </Button>
                 </Tooltip>
                  <Tooltip
                    title="View Supplier"
                    aria-label="viewvendor"
                  >
                    <Button
                      justIcon
                      round
                      simple
                      icon={VisibilityIcon}
                      onClick={() => viewVendor(prop)}
                      color="warning"
                      className="View"
                    >
                      <VisibilityIcon />
                    </Button>
                  </Tooltip>
                </div>
              ),
            };
          })
        );
        setIsLoading(false);
        });
      })
      .catch((error) => {
        if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        console.log(
          typeof error.response != "undefined"
            ? error.response.data
            : error.message
        );
        setIsLoading(false);
      });
  };

  return (
    <div>
       
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={12} className={classes.center}>
          <Dialog
            classes={{
              root: classes.center + " " + classes.modalRoot,
              paper: classes.modal,
            }}
            fullWidth={true}
            maxWidth={"md"}
            open={classicModal}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => setClassicModal(false)}
            aria-labelledby="classic-modal-slide-title"
            aria-describedby="classic-modal-slide-description"
          >
            <DialogContent
              id="classic-modal-slide-description"
              className={classes.modalBody}
            >
              <RegisterVendor
                closeModal={() => setClassicModal(false)}
                getVendors={getVendors}
                setFilters={setFilters}
              />
            </DialogContent>
          </Dialog>
          <Dialog
            classes={{
              root: classes.center + " " + classes.modalRoot,
              paper: classes.modal,
            }}
            fullWidth={true}
            maxWidth={"md"}
            open={viewModal}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => setViewModal(false)}
            aria-labelledby="view-modal-slide-title"
            aria-describedby="view-modal-slide-description"
          >
            <DialogContent
              id="view-modal-slide-description"
              className={classes.modalBody}
            >
              {viewModal ? (
                <View
                  closeModal={() => setViewModal(false)}
                  getVendors={getVendors}
                  vendDetail={vendorDetail}
                  Updating={Updating}
                />
              ) : (
                ""
              )}
            </DialogContent>
          </Dialog>
        </GridItem>
      </GridContainer>
      {animateTableView ? (
      <Animated
        animationIn="bounceInRight"
        animationOut="bounceOutLeft"
        animationInDuration={1000}
        animationOutDuration={1000}
        isVisible={animateTable}
      >
        <GridContainer>
        <GridItem xs={12} sm={12} md={12} lg={12}>
          <Card>
            <CardHeader color="info" icon>
              <CardIcon color="info">
                <h4 className={classes.cardTitleText}>Filter</h4>
              </CardIcon>
            </CardHeader>
            <CardBody>
              <GridItem
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ marginTop: "10px", marginBottom: "10px" }}
              >
                <TextField
                  className={classes.textField}
                  fullWidth={true}
                  label="Select Organization To See Vendors"
                  name="organizationFilter"
                  onChange={(event) => {
                    handleOrgFilter(event);
                  }}
                  select
                  value={organizationFilter.organizationName || ""}
                >
                  <MenuItem
                    disabled
                    classes={{
                      root: classes.selectMenuItem,
                    }}
                  >
                    Choose Organization
                      </MenuItem>
                  {/* {userDetails.isTenant ? (
                    <MenuItem value={'SHOW ALL'}>
                      SHOW ALL
                    </MenuItem>) : ''} */}
                  {organizations.map((org, index) => {
                    return (
                      <MenuItem key={index} value={org.organizationName}>
                        {org.organizationName}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </GridItem>
            </CardBody>
          </Card>
        </GridItem>
          <GridItem xs={12}>
            <Card>
              <CardHeader color="info" icon>
                <CardIcon color="info">
                  <h4 className={classes.cardTitleText}>Supplier List</h4>
                </CardIcon>
                <Button
                  color="danger"
                  round
                  className={classes.marginRight}
                  style={{ float: "right" }}
                  onClick={() => setClassicModal(true)}
                >
                  Add New Supplier
                </Button>
              </CardHeader>
              <CardBody>
                {isLoading ? (
                  <CircularProgress disableShrink />
                ) : (
                  <ReactTable
                    data={data}
                    sortable={false}
                    columns={[
                      {
                        Header: "Supplier ID",
                        accessor: "id",
                      },
                      {
                        Header: "Supplier Name",
                        accessor: "vendorName",
                      },
                      {
                        Header: "License Number",
                        accessor: "licenseNumber",
                      },
                      {
                        Header: "Email",
                        accessor: "email",
                      },
                      {
                        Header: "Currency",
                        accessor: "currency",
                      },
                      {
                        Header: "Contact Phone",
                        accessor: "contactNumber",
                      },
                      {
                        Header: "Status",
                        accessor: "status",
                      },
                      {
                        Header: "Actions",
                        accessor: "actions",
                      },
                    ]}
                    defaultPageSize={10}
                    showPaginationTop
                    showPaginationBottom={false}
                    className="-striped -highlight"
                  />
                )}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </Animated>
      ) : (
        ""
      )}
      {viewComponentView ? (
        <Animated
          animationIn="bounceInRight"
          animationOut="bounceOutLeft"
          animationInDuration={1000}
          animationOutDuration={1000}
          isVisible={viewComponent}
        >
          <ShowVendor
            goBack={goBack}
            vendorData={vendorData}
          />
        </Animated>
      ) : (
        ""
      )}



{analyticsComponent ? (
        <Animated
          animationIn="bounceInRight"
          animationOut="bounceOutLeft"
          animationInDuration={1000}
          animationOutDuration={1000}
          isVisible={viewAnalyticsComponent}
        >
          <Payable
            goBack={goBack}
            vendor={vendorData._id}
            org={organizationFilter._id}
          />
        </Animated>
      ) : (
        ""
      )}
    </div>
  );
}

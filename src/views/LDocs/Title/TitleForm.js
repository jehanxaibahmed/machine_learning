import React from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";

import { TextField, MenuItem } from "@material-ui/core";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Tooltip from "@material-ui/core/Tooltip";
// @material-ui/icons
import VisibilityIcon from "@material-ui/icons/Visibility";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import RegisterTitle from "./RegisterTitle";
import View from "./ViewTitle";
import axios from "axios";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { Animated } from "react-animated-css";
import jwt from "jsonwebtoken";
import { useDispatch, useSelector } from "react-redux";
import { setIsTokenExpired } from "actions";
import Refresh from "@material-ui/icons/Refresh";

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function Title() {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const dispatch = useDispatch();
  const classes = useStyles();
  const [classicModal, setClassicModal] = React.useState(false);
  const [viewModal, setViewModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [titleDetail, setTitleDetail] = React.useState();
  const [data, setData] = React.useState();
  const [organizationFilter, setOrganizationFilter] = React.useState("");
  const [compFilter, setCompFilter] = React.useState("");
  const [organizations, setOrganizations] = React.useState([]);
  const [companies, setCompanies] = React.useState([]);
  const [decoded, setDecoded] = React.useState(null);
  let userDetail = jwt.decode(localStorage.getItem("cooljwt"));


  React.useEffect(() => {
    userDetail = jwt.decode(localStorage.getItem("cooljwt"));
    setDecoded(userDetail);
    getOrganizations(userDetail);
  }, []);
  const viewTitle = (row) => {
    setTitleDetail(row);
    setViewModal(true);
  };
  const handleFilter = (event) => {
    if (event.target.name == 'organizationFilter') {
      var orgDetails = organizations.find(item => item.organizationName == event.target.value);
      setOrganizationFilter(orgDetails);
      getCompanies(orgDetails._id);
    } else if (event.target.name == 'compFilter') {
        var compDetails = companies.find(item => item.companyName == event.target.value);
        setCompFilter(compDetails);
        getTitle(compDetails._id);
    }
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
            getCompanies(orgs[0]._id);
          } else {
            const orgs = response.data.filter(org => org._id == user.orgDetail.organizationId);
            setOrganizations(orgs);
            getCompanies(orgs[0]._id);
            setOrganizationFilter(orgs[0]);
          }
        } else {
          setOrganizations([]);
        }
      }, 500);
  }
  const getCompanies = (org) => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/company/getCompaniesUnderOrg/${org}`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        if(response.data.length > 0){
          const companies = response.data;
          setCompanies(companies);
          setCompFilter(companies[0]);
          getTitle(companies[0]._id);
        }else{
          setCompanies([]);
        }
      })
      .catch((error) => {
        if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        console.log(`Unable to get Companies please contact at ${process.env.REACT_APP_LDOCS_CONTACT_MAIL}`)
      });
  };


  const setFilters = (org,comp) => {
    setOrganizationFilter(org);
    setCompFilter(comp);
  }

  const getTitle = (compId) => {
    setIsLoading(true);
    let url;
    if (compId == undefined) {
      url = `${process.env.REACT_APP_LDOCS_API_URL}/title/getTitleUnderTenant`
    } else {
      url = `${process.env.REACT_APP_LDOCS_API_URL}/title/getTitleUnderCompany/${compId}`
    }
    axios({
      method: "get",
      url: url,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        setData(
          response.data.map((prop, key) => {
            return {
              id: prop._id,
              titleName: prop.titleName,
              organizationName: prop.organizationName,
              companyName: prop.companyName,
              referenceTicket: prop.referenceTicket,
              actions: (
                <div className="actions-right">
                  <Tooltip title="View Team" aria-label="viewteam">
                    <Button
                      justIcon
                      round
                      simple
                      icon={VisibilityIcon}
                      onClick={() => viewTitle(prop)}
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
        <GridItem xs={12} sm={12} md={12} lg={12}>
          <Card>
            <CardHeader color="info" icon>
              <CardIcon color="info">
                <h4 className={classes.cardTitleText}>Filter</h4>
              </CardIcon>
            </CardHeader>
            <CardBody>
              <GridContainer justify="center">
                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    className={classes.textField}
                    fullWidth={true}
                    label="Select Organization To See Companies"
                    name="organizationFilter"
                    onChange={(event) => {
                      handleFilter(event);
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
                    {organizations.map((org, index) => {
                      return (
                        <MenuItem key={index} value={org.organizationName}>
                          {org.organizationName}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <TextField
                    className={classes.textField}
                    fullWidth={true}
                    label="Select Company To See Designations"
                    name="compFilter"
                    onChange={(event) => {
                      handleFilter(event);
                    }}
                    select
                    value={compFilter.companyName || ""}
                  >
                    <MenuItem
                      disabled
                      classes={{
                        root: classes.selectMenuItem,
                      }}
                    >
                      Choose Company
                      </MenuItem>
                    {companies.map((comp, index) => {
                      return (
                        <MenuItem key={index} value={comp.companyName}>
                          {comp.companyName}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
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
              <RegisterTitle
                closeModal={() => setClassicModal(false)}
                getTitle={getTitle}
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
                  titleDetail={titleDetail}
                />
              ) : (
                  ""
                )}
            </DialogContent>
          </Dialog>
        </GridItem>
      </GridContainer>
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
                  <h4 className={classes.cardTitleText}>Designation List</h4>
                </CardIcon>
                <Button
                  color="danger"
                  round
                  style={{ float: "right" }}
                  className={classes.marginRight}
                  onClick={() => setClassicModal(true)}
                >
                  Add New Designation
                </Button>
                <Tooltip
                  id="tooltip-top"
                  title="Refresh"
                  style={{ float: "right" }}
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                <Button onClick={()=>getOrganizations(userDetail)} simple color="info" justIcon>
                    <Refresh className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
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
                          Header: "Designation Name",
                          accessor: "titleName",
                        },
                        {
                          Header: "Organization Name",
                          accessor: "organizationName",
                        },
                        {
                          Header: "Company Name",
                          accessor: "companyName",
                        },
                        {
                          Header: "Remarks",
                          accessor: "referenceTicket",
                        },
                        {
                          Header: "Actions",
                          accessor: "actions",
                        },
                      ]}
                      defaultPageSize={10}
                      showPaginationTop
                      showPaginationBottom={false}
                      filterable={true}
                      className="-striped -highlight"
                    />
                  )}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </Animated>
    </div>
  );
}

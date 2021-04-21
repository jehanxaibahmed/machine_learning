import React from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { TextField, MenuItem } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Tooltip from "@material-ui/core/Tooltip";
// @material-ui/icon
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from '@material-ui/icons/Edit';
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import RegisterCompany from "./RegisterCompany";
import View from "./ViewComp";
import axios from "axios";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { Animated } from "react-animated-css";
import jwt from "jsonwebtoken";
import { useDispatch, useSelector } from "react-redux";
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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function Company() {
  const classes = useStyles();
  const [classicModal, setClassicModal] = React.useState(false);
  const [organizationFilter, setOrganizationFilter] = React.useState("");
  const [organizations, setOrganizations] = React.useState([]);
  const [viewModal, setViewModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [Updating, setUpdating] = React.useState(false);
  const [compDetail, setCompDetail] = React.useState();
  const [decoded, setDecoded] = React.useState(null);
  const [data, setData] = React.useState();
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const dispatch = useDispatch();
  React.useEffect(() => {
    let userDetail = jwt.decode(Token);
    setDecoded(userDetail);
    getOrganizations(userDetail);
  }, []);
  const viewComp = (row) => {
    setCompDetail(row);
    setUpdating(false);
    setViewModal(true);
  };
  const updateComp = (row) => {
    setCompDetail(row);
    setUpdating(true);
    setViewModal(true);
  }
  const setFilters = (org) => {
    setOrganizationFilter(org);
  }
  //Get Compaines
  const getCompanies = (org) => {
    setIsLoading(true);
    axios({
      method: "get",
      url: org !== undefined ?
        `${process.env.REACT_APP_LDOCS_API_URL}/company/getCompaniesUnderOrg/${org}` :
        `${process.env.REACT_APP_LDOCS_API_URL}/company/getAllcompaniesUnderTenant`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        setData(
          response.data.map((prop, key) => {
            return {
              id: prop._id,
              companyName: prop.companyName,
              organizationName: prop.organizationName,
              countryOfOrigin: prop.countryOfOrigin,
              primaryBusinessRepresentative: prop.primaryBusinessRepresentative,
              referenceTicket: prop.referenceTicket,
              actions: (
                <div className="actions-right">
                  <Tooltip title="Update Company" aria-label="updateCompany">
                    <Button
                      justIcon
                      round
                      simple
                      icon={EditIcon}
                      onClick={() => updateComp(prop)}
                      color="info"
                      className="View"
                    >
                      <EditIcon />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    title="View Company"
                    aria-label="viewcompany"
                  >
                    <Button
                      justIcon
                      round
                      simple
                      icon={VisibilityIcon}
                      onClick={() => viewComp(prop)}
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

 //Get Organization 
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
            setOrganizationFilter(orgs[0].organizationName);
            getCompanies(orgs[0]._id);
          } else {
            const orgs = response.data.filter(org => org._id == user.orgDetail.organizationId);
            setOrganizations(orgs);
            getCompanies(orgs[0]._id);
            setOrganizationFilter(orgs[0].organizationName);
          }
        } else {
          setIsLoading(false);
        }
      }, 500);
  }
  //handle Org Filter
  const handleOrgFilter = (event) => {
    setOrganizationFilter(event.target.value);
    var orgDetail = organizations.find(item => item.organizationName == event.target.value);
    getCompanies(orgDetail._id);
  }

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
                  label="Select Organization To See Companies"
                  name="organizationFilter"
                  onChange={(event) => {
                    handleOrgFilter(event);
                  }}
                  select
                  value={organizationFilter || ""}
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
              <RegisterCompany
                closeModal={() => setClassicModal(false)}
                getCompanies={getCompanies}
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
                  getCompanies={getCompanies}
                  compDetail={compDetail}
                  Updating={Updating}
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
                  <h4 className={classes.cardTitleText}>Company List</h4>
                </CardIcon>
                <Button
                  color="danger"
                  round
                  className={classes.marginRight}
                  style={{ float: "right" }}
                  onClick={() => setClassicModal(true)}
                >
                  Add New
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
                          Header: "Company Name",
                          accessor: "companyName",
                        },
                        {
                          Header: "Organization Name",
                          accessor: "organizationName",
                        },
                        {
                          Header: "PBR",
                          accessor: "primaryBusinessRepresentative",
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

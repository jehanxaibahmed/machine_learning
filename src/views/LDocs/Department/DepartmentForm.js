import React from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";
// @material-ui/core components
import { useDispatch, useSelector } from "react-redux";
import { TextField, MenuItem ,IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Tooltip from "@material-ui/core/Tooltip";
// @material-ui/icons
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from '@material-ui/icons/Edit';
import ViewListIcon from '@material-ui/icons/ViewList';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js"
import RegisterDepartment from "./RegisterDepartment";
import View from "./ViewDept";
import axios from "axios";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { Animated } from "react-animated-css";
import jwt from "jsonwebtoken";
import ColumnView from "./ColumnView";
import YoutubeSearchedForIcon from '@material-ui/icons/YoutubeSearchedFor';
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

export default function Department() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [classicModal, setClassicModal] = React.useState(false);
  const [viewModal, setViewModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [Updating, setUpdating] = React.useState(false);
  const [filterView, setFilterView] = React.useState(false);
  const [deptDetail, setDeptDetail] = React.useState();
  const [data, setData] = React.useState();
  const [organizationFilter, setOrganizationFilter] = React.useState("");
  const [compFilter, setCompFilter] = React.useState("");
  const [organizations, setOrganizations] = React.useState([]);
  const [companies, setCompanies] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [decoded, setDecoded] = React.useState(null);
  const [view, setView] = React.useState('grid');
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');


  React.useEffect(() => {
    let userDetail = jwt.decode(Token);
    setDecoded(userDetail);
    getOrganizations(userDetail);
  }, []);
  const handleFilter = (event) => {
    if (event.target.name == 'organizationFilter') {
      var orgDetails = organizations.find(item => item.organizationName == event.target.value);
      setOrganizationFilter(orgDetails);
      getCompanies(orgDetails._id);
    } else if (event.target.name == 'compFilter') {
      if (event.target.value == 'SHOW ALL') {
        setCompFilter({ companyName: 'SHOW ALL' });
        getDepartments(undefined)
      }
      else {
        var compDetails = companies.find(item => item.companyName == event.target.value);
        setCompFilter(compDetails);
        getDepartments(compDetails._id);
      }
    }
  }
  const viewDept = (row) => {
    setDeptDetail(row);
    setUpdating(false);
    setViewModal(true);
  };
  const updateDept = (row) => {
    setDeptDetail(row);
    setUpdating(true);
    setViewModal(true);
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
          setIsLoading(false);
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
          getDepartments(companies[0]._id);
        }else{
          setCompanies([]);
          setIsLoading(false);
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

  const getDepartments = (compId) => {
    setIsLoading(true);
    let url = `${process.env.REACT_APP_LDOCS_API_URL}/department/depList/${compId}`;
    axios({
      method: "get",
      url: url,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        setDepartments(response.data);
        setData(
          response.data.map((prop, key) => {
            return {
              id: prop._id,
              companyName: prop.companyName,
              organizationName: prop.organizationName,
              departmentName: prop.departmentName,
              referenceTicket: prop.referenceTicket,
              titleHead: prop.titleHead,
              actions: (
                <div className="actions-right">
                  <Tooltip title="Update Department" aria-label="updateDepartment">
                    <Button
                      justIcon
                      round
                      simple
                      icon={EditIcon}
                      onClick={() => updateDept(prop)}
                      color="info"
                      className="View"
                    >
                      <EditIcon />
                    </Button>
                  </Tooltip>
                  <Tooltip title="View Department" aria-label="viewdepartment">
                    <Button
                      justIcon
                      round
                      simple
                      icon={VisibilityIcon}
                      onClick={() => viewDept(prop)}
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
      {filterView ? 
      <Animated
          animationIn="bounceInRight"
          animationOut="bounceOutLeft"
          animationInDuration={1000}
          animationOutDuration={1000}
          isVisible={filterView}
      >
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
                    label="Select Company To See Departments"
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
      </GridContainer >
      </Animated>:''}
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
              <RegisterDepartment
                closeModal={() => setClassicModal(false)}
                getDepartments={getDepartments}
                setFilters={setFilters}
              />
            </DialogContent>
          </Dialog>
          <Dialog
            classes={{
              root: classes.center + " " + classes.modalRoot,
              paper: classes.modal,
            }}
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
                  getDepartments={getDepartments}
                  setFilters={setFilters}
                  deptDetail={deptDetail}
                  Updating={Updating}
                />
              ) : (
                  ""
                )}
            </DialogContent>
          </Dialog>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12}>   
        <IconButton onClick={()=>setFilterView(!filterView)} style={{ float: "right" }} color={filterView ? "primary" : ""} aria-label="Filters" component="span">
        <YoutubeSearchedForIcon   />
        </IconButton>
        <IconButton onClick={()=>setView('column')} style={{ float: "right" }} color={view == 'column' ? "primary" : ""} aria-label="Column View" component="span">
        <ViewColumnIcon   />
        </IconButton>
        <IconButton onClick={()=>setView('grid')} style={{ float: "right" }} color={view == 'grid' ? "primary" : ""} aria-label="Grid View" component="span">
        <ViewListIcon   />
        </IconButton>
        </GridItem>
        </GridContainer>
        {view == 'grid' ?
        <Animated
          animationIn="bounceInRight"
          animationOut="bounceOutLeft"
          animationInDuration={1000}
          animationOutDuration={1000}
          isVisible={view == 'grid' ? true : false}
        >
        <GridContainer>
          <GridItem xs={12}>
            <Card>
              <CardHeader color="info" icon>
                <CardIcon color="info">
                  <h4 className={classes.cardTitleText}>Department List</h4>
                </CardIcon>
                <Button
                  color="danger"
                  round
                  style={{ float: "right" }}
                  className={classes.marginRight}
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
                          Header: "Department Name",
                          accessor: "departmentName",
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
                          Header: "Title Head",
                          accessor: "titleHead",
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
      </Animated>:''}
      {view == 'column' ?
      <Animated
          animationIn="bounceInRight"
          animationOut="bounceOutLeft"
          animationInDuration={1000}
          animationOutDuration={1000}
          isVisible={view == 'column' ? true : false}
        >
        <GridContainer>
          <GridItem  xs={12}>
            <Card >
              <CardHeader color="info" icon>
                <CardIcon color="info">
                  <h4 className={classes.cardTitleText}>Assigned Workflows</h4>
                </CardIcon>
              </CardHeader>
              <CardBody >
                {isLoading ? (
                  <CircularProgress disableShrink />
                ) : (
                   <div>
                     <ColumnView departments={departments} />
                   </div>
                  )}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </Animated>:''}
    </div>
  );
}

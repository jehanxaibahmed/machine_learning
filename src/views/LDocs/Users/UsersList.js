import React, { useState, useEffect} from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { MenuItem, TextField } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Tooltip from "@material-ui/core/Tooltip";
// @material-ui/icons
import Edit from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import RegisterUser from "./RegisterUser";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { Animated } from "react-animated-css";
import UpdateUser from "./UpdateUser";
import axios from "axios";
import jwt from "jsonwebtoken";
import {useSelector, useDispatch } from "react-redux";
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
export default function UsersList() {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const dispatch = useDispatch();
  const classes = useStyles();
  const [classicModal, setClassicModal] = useState(false);
  const [userData, setUserData] = useState(false);
  const [animateTable, setAnimateTable] = useState(true);
  const [animateTableView, setAnimateTableView] = useState(true);
  const [editComponent, setEditComponent] = useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [editComponentView, setEditComponentView] = useState(false);
  const [organizationFilter, setOrganizationFilter] = React.useState("");
  const [compFilter, setCompFilter] = React.useState("");
  const [organizations, setOrganizations] = React.useState([]);
  const [companies, setCompanies] = React.useState([]);
  const [data, setData] = useState();

  const editUser = (row) => {
    setDisabledCheck(false);
    setAnimateTable(false);
    setUserData(row)
    setTimeout(function () {
      setAnimateTableView(false);
      setEditComponentView(true);
      setEditComponent(true);
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
            getCompanies(orgs[0]._id);
          } else {
            const orgs = response.data.filter(org => org._id === user.orgDetail.organizationId);
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
          getUsers(companies[0]._id);
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

  const deleteUser = (row) => {
      setEditComponent(false);
    setTimeout(function () {
      setEditComponentView(false);
       setAnimateTableView(true);
      setAnimateTable(true);
    }, 500);
  }

  const [disabledCheck, setDisabledCheck] = useState(false);
  const viewUser = (row) => {
    setDisabledCheck(true);
     setAnimateTable(false);
     setUserData(row);
     setTimeout(function() {
       setAnimateTableView(false);
       setEditComponentView(true);
       setEditComponent(true);
     }, 500);
  }
  const handleFilter = (event) => {
    if (event.target.name === 'organizationFilter') {
      var orgDetails = organizations.find(item => item.organizationName === event.target.value);
      setOrganizationFilter(orgDetails);
      getCompanies(orgDetails._id);
    } else if (event.target.name === 'compFilter') {
      if (event.target.value === 'SHOW ALL') {
        setCompFilter({ companyName: 'SHOW ALL' });
        getUsers(undefined)
      }
      else {
        var compDetails = companies.find(item => item.companyName === event.target.value);
        setCompFilter(compDetails);
        getUsers(compDetails._id);
      }
    }
  }
  const setFilters = (org,comp) => {
    setOrganizationFilter(org);
    setCompFilter(comp);
  }

  
   useEffect(() => {
    let userDetail = jwt.decode(localStorage.getItem("cooljwt"));
    getOrganizations(userDetail);
   },[]);

  const getUsers = (comp) => {
    setIsLoading(true);
         axios({
           method: "get",
           url: `${process.env.REACT_APP_LDOCS_API_URL}/user/getUsersbytenant`,
           headers: { cooljwt: Token },
         })
           .then((response) => {
             console.log(response.data);
             setData(
               response.data.filter(usr=>usr.level2.companyId === comp).map((prop, key) => {
                 return {
                   id: prop._id,
                   title: prop.level2.title,
                   email: prop.level3.email,
                   name: prop.level1.displayName,
                   role: prop.level3.roleName,
                   department: prop.level2.department,
                   actions: (
                     <div className="actions-right">
                       <Tooltip title="View User" aria-label="viewuser">
                         <Button
                           justIcon
                           round
                           simple
                           icon={VisibilityIcon}
                           onClick={() => viewUser(prop)}
                           color="warning"
                           className="View"
                         >
                           <VisibilityIcon />
                         </Button>
                       </Tooltip>
                       <Tooltip title="Edit User" aria-label="edituser">
                         <Button
                           justIcon
                           round
                           simple
                           icon={Edit}
                           onClick={() => editUser(prop)}
                           color="warning"
                           className="Edit"
                         >
                           <Edit />
                         </Button>
                       </Tooltip>
                       {/* <Tooltip title="Delete User" aria-label="deleteuser">
                         <Button
                           justIcon
                           round
                           simple
                           onClick={() => deleteUser(prop)}
                           color="danger"
                           className="remove"
                         >
                           <Close />
                         </Button>
                       </Tooltip> */}
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
  const updateUserData = (userObject) =>{
    setUserData(userObject);
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
                    label="Select Organization To See Locations"
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
                    label="Select Locations To See Users"
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
              <RegisterUser
                closeModal={() => setClassicModal(false)}
                  setFilters={setFilters}
                  getUser={getUsers}
              />
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
            <GridItem xs={12}>
              <Card>
                <CardHeader color="info" icon>
                  <CardIcon color="info">
                    <h4 className={classes.cardTitleText}>Users List</h4>
                  </CardIcon>
                  <Button
                    color="danger"
                    round
                    style={{ float: "right" }}
                    className={classes.marginRight}
                    onClick={() => setClassicModal(true)}
                  >
                    Add New User
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
                          Header: "Email",
                          accessor: "email",
                        },
                        {
                          Header: "Display Name",
                          accessor: "name",
                        },
                        {
                          Header: "Role",
                          accessor: "role",
                        },
                        {
                          Header: "Department",
                          accessor: "department",
                        },
                        {
                          Header: "Designation",
                          accessor: "title",
                        },
                        {
                          Header: "Actions",
                          accessor: "actions",
                        },
                      ]}
                      defaultPageSize={10}
                      showPaginationTop
                      showPaginationBottom={true}
                      filterable={true}
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
      {editComponentView ? (
        <Animated
          animationIn="bounceInRight"
          animationOut="bounceOutLeft"
          animationInDuration={1000}
          animationOutDuration={1000}
          isVisible={editComponent}
        >
          <UpdateUser
            goBack={deleteUser}
            userData={userData}
            updateUserData={updateUserData}
            disabledCheck={disabledCheck}
          />
        </Animated>
      ) : (
        ""
      )}
    </div>
  );
}

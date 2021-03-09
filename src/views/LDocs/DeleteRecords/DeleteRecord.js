/*eslint-disable*/
import React, { useState, useEffect } from "react";
// @material-ui/core components
import {
  makeStyles,
  CircularProgress,
} from "@material-ui/core";
import SweetAlert from "react-bootstrap-sweetalert";
import { useSelector, useDispatch } from "react-redux";
import { getOrganizations, getCompanies, getDepartments, getTeam, getTitles } from "actions";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import NavPills from "components/NavPills/NavPills.js";
// style for this view
import styles from "assets/jss/material-dashboard-pro-react/views/validationFormsStyle.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import DeleteOrg from "./DeleteOrg";
import DeleteComp from "./DeleteComp";
import DeleteDept from "./DeleteDept";
import DeleteTeam from "./DeleteTeam";
import DeleteTitle from "./DeleteTitle";

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

export default function DeleteRecord(props) {
  // Delete form
  const [isLoading, setisLoading] = useState(true);

  const dispatch = useDispatch();
  const organizations = useSelector((state) => state.userReducer.organizations);
  const companies = useSelector((state) => state.userReducer.companies);
  const departments = useSelector((state) => state.userReducer.departments);
  const teams = useSelector((state) => state.userReducer.teams);
  const titles = useSelector((state) => state.userReducer.titles);

  useEffect(()=>{
    if(organizations.length === 0){
      dispatch(getOrganizations());
    }
    if(companies.length === 0){
      dispatch(getCompanies());
    }
    if(departments.length === 0){
      dispatch(getDepartments());
    }
    if(teams.length === 0){
      dispatch(getTeam());
    }
    if(titles.length === 0){
      dispatch(getTitles());
    }
  },[]);
  useEffect(()=>{
    if(organizations.length > 0 || companies.length > 0 || departments.length > 0 || teams.length > 0 || titles.length > 0){
      setisLoading(false);
    }
  },[titles])
  
  const classes = useStyles();
  const sweetClass = sweetAlertStyle();
  const [alert, setAlert] = useState(null);
  const successAlert = (msg) => {
    setAlert(
      <SweetAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Success!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={sweetClass.button + " " + sweetClass.success}
      >
        {msg}
      </SweetAlert>
    );
  };
  const errorAlert = (msg) => {
    setAlert(
      <SweetAlert
        error
        style={{ display: "block", marginTop: "-100px" }}
        title="Error!"
        onConfirm={() => hideErrorAlert()}
        onCancel={() => hideErrorAlert()}
        confirmBtnCssClass={sweetClass.button + " " + sweetClass.danger}
      >
        {msg ? msg : "Unable To Register Title Please Contact {process.env.REACT_APP_LDOCS_CONTACT_MAIL}"}
      </SweetAlert>
    );
  };
  const hideAlert = () => {
    closeModal();
    setAlert(null);
  };
  const hideErrorAlert = () => {
    setAlert(null);
  };
  const closeModal = () => {
    props.closeModal();
  };
  
  return (
    <GridContainer>
      {alert}
      <GridItem xs={12} sm={12} md={12}>
              <GridContainer>
                <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                >
                  {isLoading ? <CircularProgress /> :
                 <NavPills
                color="info"
                tabs={[
                  {
                    tabButton: "Organization",
                    tabContent: organizations.length > 0 ? <DeleteOrg successAlert={successAlert} errorAlert={errorAlert} closeModal={props.closeModal} />:(
                      <span><p> No Data Found </p></span>
                    )
                  },
                  {
                    tabButton: "Company",
                    tabContent: companies.length > 0 ? <DeleteComp successAlert={successAlert} errorAlert={errorAlert} closeModal={props.closeModal} />:(
                      <span><p> No Data Found </p></span>
                    )
                  },
                  {
                    tabButton: "Department",
                    tabContent: departments.length > 0 ? <DeleteDept successAlert={successAlert} errorAlert={errorAlert} closeModal={props.closeModal} />:(
                      <span><p> No Data Found </p></span>
                    )
                  },
                  {
                    tabButton: "Team",
                    tabContent: teams.length > 0 ? <DeleteTeam successAlert={successAlert} errorAlert={errorAlert} closeModal={props.closeModal} />:(
                      <span><p> No Data Found </p></span>
                    )
                  },
                  {
                    tabButton: "Title",
                    tabContent: titles.length > 0 ? <DeleteTitle successAlert={successAlert} errorAlert={errorAlert} closeModal={props.closeModal} />:(
                      <span><p> No Data Found </p></span>
                    )
                  }
                ]}
              />
               }
                </GridItem>
              </GridContainer>
      </GridItem>
    </GridContainer>
  );
}

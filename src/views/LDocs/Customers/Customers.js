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
import {useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import Swal from 'sweetalert2'
import { successAlert, errorAlert, msgAlert }from "views/LDocs/Functions/Functions";
import { Animated } from "react-animated-css";
import AssessmentIcon from '@material-ui/icons/Assessment';
import jwt from "jsonwebtoken";
import { setIsTokenExpired } from "actions";
import Payable from "../Payable/Payable";
import { formatDateTime } from "../Functions/Functions";
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

export default function Customers() {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const dispatch = useDispatch();
  const classes = useStyles();

  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState();
  const [animateTableView, setAnimateTableView] = React.useState(true);
  const [viewComponent, setViewComponent] = React.useState(false);
  const [viewAnalyticsComponent, setViewAnalyticsComponent] = React.useState(false);
  const [analyticsComponent, setAnalyticsComponent] = React.useState(false);
  const [animateTable, setAnimateTable] = React.useState(true);
  const [orgData, setOrgData] = React.useState();
  let userDetail = jwt.decode(Token);

  

   React.useEffect(() => {
    getOrganizations();
   },[]);

  

  
  
  const viewAnalytics = (row) => {
    setAnimateTable(false);
    setOrgData(row);
    setTimeout(function() {
      setAnimateTableView(false);
      setViewAnalyticsComponent(true);
      setAnalyticsComponent(true);
    }, 500);
  }

  const goBack = () => {
    setAnalyticsComponent(false);
    setViewComponent(false);
  setTimeout(function () {
    setViewAnalyticsComponent(false);
     setAnimateTableView(true);
    setAnimateTable(true);
  }, 500);
}

  const getOrganizations = () => {
    axios({
      method: "get", //you can set what request you want to be
      url: `${process.env.REACT_APP_LDOCS_API_URL}/vendor/organizationByVender`,
      headers: {
        cooljwt: Token,
      },
    })
      .then((response) => {
        let orgs = response.data.organizations;
        console.log(orgs[0]);
        setData(
          orgs.map((prop, index) => {
            return {
              id:  `C-00${index+1}`,
              organizationName: prop.organizationName,
              addedDate: formatDateTime(prop.dateAdded),
              status:(
                prop.status == 'active' ? "ACTIVE" : "DISABLED"
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
                </div>
              ),
            };
          })
        );
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.response) {
           error.response.status == 401 && dispatch(setIsTokenExpired(true));
        }
        console.log(error);
      });
  }



  return (
    <div>
       
      <GridContainer justify="center">
       
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
                  <h4 className={classes.cardTitleText}>Customer List</h4>
                </CardIcon>
                {/* <Button
                  color="danger"
                  round
                  className={classes.marginRight}
                  style={{ float: "right" }}
                  onClick={() => setClassicModal(true)}
                >
                  Add New Supplier
                </Button> */}
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
                        Header: "Customer ID",
                        accessor: "id",
                      },
                      {
                        Header: "Customer Name",
                        accessor: "organizationName",
                      },
                      {
                        Header: "Added Date",
                        accessor: "addedDate",
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
            vendor={userDetail.id}
            org={orgData.organizationId}
          />
        </Animated>
      ) : (
        ""
      )}
    </div>
  );
}

import React from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Tooltip from "@material-ui/core/Tooltip";
// @material-ui/icons
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
import AddRole from "./AddRole";
import View from "./ViewRole";
import axios from "axios";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { Animated } from "react-animated-css";
import { useSelector, useDispatch } from "react-redux";
import { setIsTokenExpired } from "actions";
import Refresh from "@material-ui/icons/Refresh";
import { Checkbox } from "@material-ui/core";


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

export default function Roles() {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const dispatch = useDispatch();
  const classes = useStyles();
  const [classicModal, setClassicModal] = React.useState(false);
  const [viewModal, setViewModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [Updating, setUpdating] = React.useState(false);
  const [RoleDetail, setRoleDetail] = React.useState();
  const [currencyLookups, setCurrencyLookups] = React.useState([]);
  const [data, setData] = React.useState();
    React.useEffect(() => {
      getRoles();
    },[]);
  const viewRole = (row) => {
    setRoleDetail(row);
    setUpdating(false);
    setViewModal(true);
  }
  const updateRole = (row) => {
    setRoleDetail(row);
    setUpdating(true);
    setViewModal(true);
  }

  const getRoles = async () => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/user/getRoles`,
      headers: { cooljwt:Token},
    })
     .then(async(response) => {
       console.log("role Response", response);
        setData(
          response.data.map((prop, key) => {
           return {
             id: prop._id,
             name: prop.roleName,
             isAdmin: (<Checkbox checked={prop.isAdmin} disabled={true} />),
             createdBy: prop.createdBy,
             actions: (
               <div className="actions-right">
                 {!prop.isDefault ? 
                 <Tooltip title="Update Level 1" aria-label="updateRole">
                   <Button
                     justIcon
                     round
                     simple
                     icon={EditIcon}
                     onClick={() => updateRole(prop)}
                     color="info"
                     className="View"
                   >
                     <EditIcon />
                   </Button>
                 </Tooltip>:""}
                 <Tooltip title="View Level 1" aria-label="viewRole">
                   <Button
                     justIcon
                     round
                     simple
                     icon={VisibilityIcon}
                     onClick={() => viewRole(prop)}
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
}

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
              <AddRole
                closeModal={() => setClassicModal(false)}
                getRoles={getRoles}
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
                  getRoles={getRoles}
                  RoleDetail={RoleDetail}
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
                  <h4 className={classes.cardTitleText}>Role List</h4>
                </CardIcon>
                <Button
                  color="danger"
                  round
                  style={{ float: "right" }}
                  onClick={() => setClassicModal(true)}
                >
                  Add New
                </Button>
                <Tooltip
                  id="tooltip-top"
                  title="Refresh"
                  style={{ float: "right" }}
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button onClick={getRoles} simple color="info" justIcon>
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
                        Header: "Role Name",
                        accessor: "name",
                      },
                      {
                        Header: "Admin",
                        accessor: "isAdmin",
                      },
                      {
                        Header: "Created By",
                        accessor: "createdBy",
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

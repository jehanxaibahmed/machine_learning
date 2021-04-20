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
import RegisterOrganization from "./RegisterOrganization";
import View from "./ViewOrg";
import axios from "axios";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { Animated } from "react-animated-css";
import { useSelector, useDispatch } from "react-redux";
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

export default function Organization() {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const dispatch = useDispatch();
  const classes = useStyles();
  const [classicModal, setClassicModal] = React.useState(false);
  const [viewModal, setViewModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [Updating, setUpdating] = React.useState(false);
  const [orgDetail, setOrgDetail] = React.useState();
  const [currencyLookups, setCurrencyLookups] = React.useState([]);
  const [data, setData] = React.useState();
    React.useEffect(() => {
      getOrganizations();
    },[]);
  const viewOrg = (row) => {
    setOrgDetail(row);
    setUpdating(false);
    setViewModal(true);
  }
  const updateOrg = (row) => {
    setOrgDetail(row);
    setUpdating(true);
    setViewModal(true);
  }
  const getLookUp = async () => {
    return new Promise((res, rej) => {
       axios({
        method: "get", //you can set what request you want to be
        url: `${process.env.REACT_APP_LDOCS_API_URL}/lookup/getLookups/1`,
        headers: {
          cooljwt: Token,
        },
      }).then(response=>{
          res(response.data.result);
      }).catch(err=>{
        console.log(err);
        rej([]);
      })
    })
  }
  const getOrganizations = async () => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/organization/getAllOrgBytenant`,
      headers: { cooljwt:Token},
    })
     .then(async(response) => {
      getLookUp().then(res=>{
        setData(
          response.data.map((prop, key) => {
          let currency =  res.find(cu=>cu._id == prop.Currency_Base);
           return {
             id: prop._id,
             name: prop.organizationName,
             Address: prop.Address,
             tradeLicenseNumber: prop.tradeLicenseNumber,
             primaryBusinessRepresentative: prop.primaryBusinessRepresentative,
             referenceTicket: prop.referenceTicket,
             currency_Base: currency ? currency.Name.toUpperCase() : prop.Currency_Base ,
             actions: (
               <div className="actions-right">
                 <Tooltip title="Update Level 1" aria-label="updateOrganization">
                   <Button
                     justIcon
                     round
                     simple
                     icon={EditIcon}
                     onClick={() => updateOrg(prop)}
                     color="info"
                     className="View"
                   >
                     <EditIcon />
                   </Button>
                 </Tooltip>
                 <Tooltip title="View Level 1" aria-label="viewOrganization">
                   <Button
                     justIcon
                     round
                     simple
                     icon={VisibilityIcon}
                     onClick={() => viewOrg(prop)}
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
      error.response.status == 401 && dispatch(setIsTokenExpired(true));
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
              <RegisterOrganization
                closeModal={() => setClassicModal(false)}
                getOrganizations={getOrganizations}
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
                  getOrganizations={getOrganizations}
                  orgDetail={orgDetail}
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
                  <h4 className={classes.cardTitleText}>Organization List</h4>
                </CardIcon>
                <Button
                  color="danger"
                  round
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
                        Header: "Organization Name",
                        accessor: "name",
                      },
                      {
                        Header: "License Number",
                        accessor: "tradeLicenseNumber",
                      },
                      {
                        Header: "PBR",
                        accessor: "primaryBusinessRepresentative",
                      },
                      {
                        Header: "Currency",
                        accessor: "currency_Base",
                      },
                      {
                        Header: "Remarks",
                        accessor: "referenceTicket",
                      },
                      {
                        Header: "Address",
                        accessor: "Address",
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

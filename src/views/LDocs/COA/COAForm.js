import React from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { TextField, MenuItem, Checkbox } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Tooltip from "@material-ui/core/Tooltip";
// @material-ui/icon
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import View from "./ViewAccount";
import axios from "axios";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { Animated } from "react-animated-css";
import jwt from "jsonwebtoken";
import { useDispatch, useSelector } from "react-redux";
import { setIsTokenExpired } from "actions";
import Refresh from "@material-ui/icons/Refresh";
import AddAccount from "./addAccount";
import { addZeroes } from "../Functions/Functions";

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

export default function COA() {
  const classes = useStyles();
  const [classicModal, setClassicModal] = React.useState(false);
  const [organizationFilter, setOrganizationFilter] = React.useState("");
  const [organizations, setOrganizations] = React.useState([]);
  const [viewModal, setViewModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [Updating, setUpdating] = React.useState(false);
  const [AccDetail, setAccDetail] = React.useState();
  const [decoded, setDecoded] = React.useState(null);
  const [data, setData] = React.useState();
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  let userDetail = jwt.decode(Token);

  const dispatch = useDispatch();
  React.useEffect(() => {
    userDetail = jwt.decode(Token);
    setDecoded(userDetail);
    getCOA();
    // getOrganizations(userDetail);
  }, []);

  const viewAccount = (row) => {
    setAccDetail(row);
    setUpdating(false);
    setViewModal(true);
  };

  const updateAcc = (row) => {
    setAccDetail(row);
    setUpdating(true);
    setViewModal(true);
  };

  //Get COA
  const getCOA = () => {
    setIsLoading(true);
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/tenant/getAccounts`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        setData(
          response.data.map((prop, key) => {
            return {
              id: prop._id,
              Acc_NO: prop.Acc_NO,
              Acc_Opening_Balance: addZeroes(prop.Acc_Opening_Balance),
              Status: <Checkbox checked={prop.Status} />,
              Acc_Type: prop.Acc_Type,
              Acc_Ref_Remarks: prop.Acc_Ref_Remarks,
              Acc_Description:prop.Acc_Description,
              actions: (
                <div className="actions-right">
                  <Tooltip title="Update Account" aria-label="updateAccount">
                    <Button
                      justIcon
                      round
                      simple
                      icon={EditIcon}
                      onClick={() => updateAcc(prop)}
                      color="info"
                      className="View"
                    >
                      <EditIcon />
                    </Button>
                  </Tooltip>
                  <Tooltip title="View Account" aria-label="viewlocation">
                    <Button
                      justIcon
                      round
                      simple
                      icon={VisibilityIcon}
                      onClick={() => viewAccount(prop)}
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
              <AddAccount
                closeModal={() => setClassicModal(false)}
                getCOA={getCOA}
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
                  getCOA={getCOA}
                  AccDetail={AccDetail}
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
                  <h4 className={classes.cardTitleText}>Chart of Account</h4>
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
                {/* <Tooltip
                  id="tooltip-top"
                  title="Refresh"
                  style={{ float: "right" }}
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                <Button onClick={()=>getOrganizations(userDetail)} simple color="info" justIcon>
                    <Refresh className={classes.underChartIcons} />
                  </Button>
                </Tooltip> */}
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
                        Header: "Account Description",
                        accessor: "Acc_Description",
                      },
                      {
                        Header: "Account Number",
                        accessor: "Acc_NO",
                      },
                      {
                        Header: "Account Type",
                        accessor: "Acc_Type",
                      },
                      {
                        Header: "Opening Balance",
                        accessor: "Acc_Opening_Balance",
                      },
                      {
                        Header: "Status",
                        accessor: "Status",
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

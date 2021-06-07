import React from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import {
  MenuItem,
  TextField,
  Switch,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from "@material-ui/core";
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
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import SweetAlert from "react-bootstrap-sweetalert";
import { Animated } from "react-animated-css";
import jwt from "jsonwebtoken";
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
  statusImage: {
    width: 50,
    height: 50,
  },
};

const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function GeneralConfigrations() {
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  const userDetails = jwt.decode(Token);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [isLoading, setIsLoading] = React.useState(true);
  const [organizationFilter, setOrganizationFilter] = React.useState("");
  const [organizations, setOrganizations] = React.useState([]);
  const [data, setData] = React.useState();
  const [animateTableView, setAnimateTableView] = React.useState(true);
  const [animateTable, setAnimateTable] = React.useState(true);
  const [state, setState] = React.useState({
    currencies: [],
    editIndex: null,
    baseCurrency: null,
  });

  React.useEffect(() => {
    let userDetail = jwt.decode(Token);
  }, []);

  const sweetClass = sweetAlertStyle();
  const [alert, setAlert] = React.useState(null);
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
        {msg}
        <br />
        {process.env.REACT_APP_LDOCS_CONTACT_MAIL}
      </SweetAlert>
    );
  };

  const hideAlert = () => {
    setAlert(null);
  };
  const hideErrorAlert = () => {
    setAlert(null);
  };

  return (
    <div>
      {alert}
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
                    <h4 className={classes.cardTitleText}>
                      General Configrations
                    </h4>
                  </CardIcon>
                </CardHeader>
                <CardBody>
                  {/* "autoInitWorkFlow":true,
        "enableEmailNotify":false,
        "enablePayments":true, */}
                  <List>
                    {/* Auto Init Workflow */}
                    <ListItem>
                      <ListItemText
                        style={{ color: "black" }}
                        primary="Auto Init Workflow"
                        secondary={
                          "System will auto initialize workflow on invoices"
                        }
                      />
                      <ListItemSecondaryAction>
                        <Checkbox color="primary" />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                    {/* Enable Email Notifications */}
                    <ListItem>
                      <ListItemText
                        style={{ color: "black" }}
                        primary="Email Notifications"
                        secondary={
                          "System will sent Email Notification on Every Event"
                        }
                      />
                      <ListItemSecondaryAction>
                        <Checkbox color="primary" />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                    {/* Enables Payments */}
                    <ListItem>
                      <ListItemText
                        style={{ color: "black" }}
                        primary="Enable Payments"
                        secondary={
                          "System will allow you to pay Invoices through diffrent payment Gateways"
                        }
                      />
                      <ListItemSecondaryAction>
                        <Checkbox color="primary" />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </CardBody>
              </Card>
            </GridItem>

            <GridItem xs={12}>
              <Card>
                <CardHeader color="danger" icon>
                  <CardIcon color="danger">
                    <h4 className={classes.cardTitleText}>
                      SMTP Configrations
                    </h4>
                  </CardIcon>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={3}
                      lg={3}
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                    >
                      <TextField
                        className={classes.textField}
                        fullWidth={true}
                        label="SMTP Host"
                        name=""
                        //   onChange={(event) => {
                        //     handleOrgFilter(event);
                        //   }}
                        type="text"
                        value={"" || ""}
                      />
                    </GridItem>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={3}
                      lg={3}
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                    >
                      <TextField
                        className={classes.textField}
                        fullWidth={true}
                        label="Auth User"
                        name=""
                        //   onChange={(event) => {
                        //     handleOrgFilter(event);
                        //   }}
                        type="text"
                        value={"" || ""}
                      />
                    </GridItem>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={3}
                      lg={3}
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                    >
                      <TextField
                        className={classes.textField}
                        fullWidth={true}
                        label="Auth Pass"
                        name=""
                        //   onChange={(event) => {
                        //     handleOrgFilter(event);
                        //   }}
                        type="text"
                        value={"" || ""}
                      />
                    </GridItem>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={3}
                      lg={3}
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                    >
                      <TextField
                        className={classes.textField}
                        fullWidth={true}
                        label="Port"
                        name=""
                        //   onChange={(event) => {
                        //     handleOrgFilter(event);
                        //   }}
                        type="text"
                        value={"" || ""}
                      />
                    </GridItem>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      style={{ marginTop: "20px" }}
                    >
                      <List>
                        {/* Auto Init Workflow */}
                        <ListItem>
                          <ListItemText
                            style={{ color: "black" }}
                            primary="Secure"
                            secondary={
                              "Connection Security   (SSL ENABLED)"
                            }
                          />
                          <ListItemSecondaryAction>
                            <Checkbox color="primary" />
                          </ListItemSecondaryAction>
                        </ListItem>
                      </List>
                      <Divider />
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </Animated>
      ) : (
        ""
      )}
    </div>
  );
}

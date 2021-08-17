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
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import Swal from "sweetalert2";
import {
  successAlert,
  errorAlert,
  msgAlert,
} from "views/LDocs/Functions/Functions";
import { Animated } from "react-animated-css";
import jwt from "jsonwebtoken";
import { setIsTokenExpired } from "actions";
import TimezoneSelect from "react-timezone-select";

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

export default function InvoiceConfigrations() {
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
  const [selectedTimezone, setSelectedTimezone] = React.useState("");
  const [state, setState] = React.useState({
    initWorkflow: false,
    values: {
      paymentTerms: "",
      selectedTemplate:null
    },
    templates: [],
  });

  React.useEffect(() => {
    let userDetail = jwt.decode(Token);
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/tenant/getInvoiceConfig`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        let invoiceConfig = response.data.invoiceConfig;
        console.log('Invoice Config', invoiceConfig);
        setState((state) => ({
          ...state,
          values: {
            ...state.values,
            paymentTerms: invoiceConfig.paymentTermsInvoiceDate
              ? "invoiceDate"
              : invoiceConfig.paymentTermsDueDate
              ? "dueDate"
              : invoiceConfig.paymentTermsApprovalDate
              ? "approvalDate"
              : invoiceConfig.paymentTermsPaymentProcessDate
              ? "processDate"
              : "",
              selectedTemplate:invoiceConfig.templateId
          },
        }));
      })
      .catch((err) => {
        console.log(err);
      });

    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/invoice/getInvoiceTemplates`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        setState((state) => ({
          ...state,
          templates: response.data,
        }));
        console.log("Invoice Templates", response);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const saveConfigration = () => {
    let body = {
      invoiceConfig: {
        paymentTermsInvoiceDate:
          state.values.paymentTerms == "invoiceDate" ? true : false,
        paymentTermsDueDate:
          state.values.paymentTerms == "dueDate" ? true : false,
        paymentTermsApprovalDate:
          state.values.paymentTerms == "approvalDate" ? true : false,
        paymentTermsPaymentProcessDate:
          state.values.paymentTerms == "processDate" ? true : false,
        templateId:state.values.selectedTemplate,
        Default_template:"Default_template"
      },
    };
    axios({
      method: "post",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/tenant/invoiceConfig`,
      data: body,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        successAlert("Configration Updated");
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onChangeTemplate = (event) => {
    event.persist();
    let val = event.target.name;
    setState((state) => ({
      ...state,
      values: {
        ...state.values,
        selectedTemplate: val,
      },
    }));
  };
  const onChange = (event) => {
    event.persist();
    let name = event.target.name;
    console.log(name);
    setState((state) => ({
      ...state,
      values: {
        ...state.values,
        paymentTerms: name,
      },
    }));
  };


  return (
    <div>
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
                      Invoice Payment Terms
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
                        primary="Invoice Date"
                        secondary={
                          "Payment Terms will starts from Invoice Date"
                        }
                      />
                      <ListItemSecondaryAction>
                        <Checkbox
                          color="primary"
                          value={"invoiceDate"}
                          checked={
                            state.values.paymentTerms == "invoiceDate"
                              ? true
                              : false
                          }
                          name="invoiceDate"
                          onChange={onChange}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                    {/* Enable Email Notifications */}
                    <ListItem>
                      <ListItemText
                        style={{ color: "black" }}
                        primary="Due Date"
                        secondary={
                          "Manually input Due Date while creating or updating invoice"
                        }
                      />
                      <ListItemSecondaryAction>
                        <Checkbox
                          color="primary"
                          value={"dueDate"}
                          checked={
                            state.values.paymentTerms == "dueDate"
                              ? true
                              : false
                          }
                          name="dueDate"
                          onChange={onChange}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                    {/* Enables Payments */}
                    <ListItem>
                      <ListItemText
                        style={{ color: "black" }}
                        primary="Approval Date"
                        secondary={
                          "Payment Terms will starts from Invoice Approval Date"
                        }
                      />
                      <ListItemSecondaryAction>
                        <Checkbox
                          color="primary"
                          value={"approvalDate"}
                          checked={
                            state.values.paymentTerms == "approvalDate"
                              ? true
                              : false
                          }
                          name="approvalDate"
                          onChange={onChange}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                    {/* Enables Payments */}
                  </List>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={12}>
              <Card>
                <CardHeader color="info" icon>
                  <CardIcon color="info">
                    <h4 className={classes.cardTitleText}>Invoice Template</h4>
                  </CardIcon>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                  {state.templates.map((template, index) => (
                    <GridItem xs={2}>
                      <Card className={classes.root}>
                        <a
                          href={`${process.env.REACT_APP_LDOCS_API_URL}/${template.templateUrl}`}
                          target="_blank"
                        >
                          <img
                            style={{ width: "100%", height: 200 }}
                            src={`${process.env.REACT_APP_LDOCS_API_URL}/${template.templateUrl}`}
                          />
                        </a>
                        <CardActions>
                          <Checkbox
                            style={{ align: "right", marginTop: 10 }}
                            color="primary"
                            value={template._id}
                            checked={
                              state.values.selectedTemplate == template._id
                                ? true
                                : false
                            }
                            name={template._id}
                            onChange={onChangeTemplate}
                          />
                        </CardActions>
                      </Card>
                    </GridItem>
                  ))}
                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
          <Button
            color="info"
            className={classes.registerButton}
            style={{ float: "right", marginTop: 20 }}
            round
            type="button"
            onClick={saveConfigration}
          >
            Save Configration
          </Button>
        </Animated>
      ) : (
        ""
      )}
    </div>
  );
}

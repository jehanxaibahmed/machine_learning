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
  Typography,
} from "@material-ui/core";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";
import ChipInput from "material-ui-chip-input";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
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
  const [selectedTimezone, setSelectedTimezone] = React.useState("");
  const [state, setState] = React.useState({
    initWorkflow: false,
    emailNotification: false,
    payments: false,
    secure: false,
    values: {
      smtp: "",
      user: "",
      pass: "",
      port: "",
      cc: [],
      bcc: [],
      signature: "",
    },
  });

  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  // const htmlToDraftBlocks = (html) => {
  //   const blocksFromHtml = htmlToDraft(html);
  //   const { contentBlocks, entityMap } = blocksFromHtml;
  //   const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
  //   const editorState = EditorState.createWithContent(contentState);
  //   return editorState;
  //  }

  // const handleEditor = (editorState) => {
  //   let content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
  //   setState((state) => ({
  //     ...state,
  //     values: {
  //       ...state.values,
  //       signature: content,
  //     },
  //   }));
  // }

  React.useEffect(() => {
    let content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setState((state) => ({
      ...state,
      values: {
        ...state.values,
        signature: content,
      },
    }));
  }, [editorState]);

  React.useEffect(() => {
    let userDetail = jwt.decode(Token);
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/tenant/getTenantConfig`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        let tenantConfig = response.data.tenantConfig;
        setState((state) => ({
          ...state,
          initWorkflow: tenantConfig ? tenantConfig.autoInitWorkFlow : false,
          payments: tenantConfig ? tenantConfig.enablePayments : false,
          emailNotification: tenantConfig
            ? tenantConfig.enableEmailNotify
            : false,
          secure: tenantConfig.emailConfig
            ? tenantConfig.emailConfig.secure
            : false,
          values: {
            ...state.values,
            smtp: tenantConfig.emailConfig
              ? tenantConfig.emailConfig.SMTPHost
              : "",
            pass: tenantConfig.emailConfig
              ? tenantConfig.emailConfig.authPassword
              : "",
            user: tenantConfig.emailConfig
              ? tenantConfig.emailConfig.authUser
              : "",
            port: tenantConfig.emailConfig ? tenantConfig.emailConfig.port : "",
          },
        }));
        setSelectedTimezone(tenantConfig.timeZone ? tenantConfig.timeZone : "");
        console.log(tenantConfig);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const saveConfigration = () => {
    let body = {
      tenantConfig: {
        autoInitWorkFlow: state.initWorkflow,
        enableEmailNotify: state.emailNotification,
        enablePayments: state.payments,
        emailConfig: {
          SMTPHost: state.values.smtp,
          authUser: state.values.user,
          authPassword: state.values.pass,
          port: state.values.port,
          secure: state.secure,
          cc:state.values.cc,
          bcc:state.values.bcc,
          signature:state.values.signature
        },
        timeZone: selectedTimezone,
       
      },
    };
    axios({
      method: "post",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/tenant/saveTenantGeneralConfig`,
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

  const uploadImage = (image) => {
    return new Promise((resolve, reject) => {
      console.log("Uploaded Image", image);
      resolve({ data: { link: "https://via.placeholder.com/150" } });
    });
  };

  const onChange = (event) => {
    event.persist();
    let name = event.target.name;
    let checked;
    if (name == "initWorkflow") {
      checked = state.initWorkflow;
    }
    if (name == "payments") {
      checked = state.payments;
    }
    if (name == "emailNotification") {
      checked = state.emailNotification;
    }
    if (name == "secure") {
      checked = state.secure;
    }

    setState((state) => ({
      ...state,
      [event.target.name]: !checked,
    }));
  };

  const handleChips = (chip, type) => {
    let chips = type == 1 ? state.values.cc : state.values.bcc;
    let index = chip.length - 1;
    chips.push(chip[index]);
    let name = type === 1 ? "cc" : "bcc";

    console.log(chips, index, name);
    setState((state) => ({
      ...state,
      values: {
        ...state.values,
        [name]: chips,
      },
    }));
  };
  const handleDeleteChip = (chip, index, type) => {
    let chips = type == 1 ? state.values.cc : state.values.bcc;
    chips.splice(index, 1);
    let name = type === 1 ? "cc" : "bcc";
    setState((state) => ({
      ...state,
      values: {
        ...state.values,
        [name]: chips,
      },
    }));
  };

  const handleChange = (event) => {
    event.persist();
    setState((state) => ({
      ...state,
      values: {
        ...state.values,
        [event.target.name]: event.target.value,
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
                        <Checkbox
                          color="primary"
                          value={state.initWorkflow}
                          checked={state.initWorkflow}
                          name="initWorkflow"
                          onChange={onChange}
                        />
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
                        <Checkbox
                          color="primary"
                          value={state.emailNotification}
                          checked={state.emailNotification}
                          name="emailNotification"
                          onChange={onChange}
                        />
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
                        <Checkbox
                          color="primary"
                          checked={state.payments}
                          value={state.payments}
                          name="payments"
                          onChange={onChange}
                        />
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
                        name="smtp"
                        onChange={handleChange}
                        type="text"
                        value={state.values.smtp || ""}
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
                        name="user"
                        onChange={handleChange}
                        type="text"
                        value={state.values.user || ""}
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
                        name="pass"
                        id="auth_smtp_pass"
                        onChange={handleChange}
                        type="password"
                        value={state.values.pass || ""}
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
                        name="port"
                        onChange={handleChange}
                        type="text"
                        value={state.values.port || ""}
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
                            secondary={"Connection Security   (SSL ENABLED)"}
                          />
                          <ListItemSecondaryAction>
                            <Checkbox
                              color="primary"
                              value={state.secure}
                              checked={state.secure}
                              name="secure"
                              onChange={onChange}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      </List>
                      <Divider />
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem
              xs={12}
              sm={12}
              md={12}
              lg={12}
              style={{ marginTop: "10px", marginBottom: "10px" }}
            >
              <Card>
                <CardHeader color="info" icon>
                  <CardIcon color="info">
                    <h4 className={classes.cardTitleText}>
                      Email Configrations
                    </h4>
                  </CardIcon>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                    >
                      <ChipInput
                        label="Email CC"
                        id="tagElementInput"
                        value={state.values.cc}
                        style={{ width: "100%" }}
                        onChange={(chips) => handleChips(chips, 1)}
                        onDelete={(chip, index) =>
                          handleDeleteChip(chip, index, 1)
                        }
                      />
                    </GridItem>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                    >
                      <ChipInput
                        label="Email BCC"
                        id="tagElementInput"
                        value={state.values.bcc}
                        style={{ width: "100%" }}
                        onChange={(chips) => handleChips(chips, 2)}
                        onDelete={(chip, index) =>
                          handleDeleteChip(chip, index, 2)
                        }
                      />
                    </GridItem>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                    >
                      <>
                        <Typography>Email Signature</Typography>
                        <Card
                          style={{padding:5}}
                        >
                          <Editor
                            editorState={editorState}
                            onEditorStateChange={setEditorState}
                            toolbar={{
                              image: {
                                className: undefined,
                                component: undefined,
                                popupClassName: undefined,
                                urlEnabled: true,
                                uploadEnabled: true,
                                alignmentEnabled: true,
                                uploadCallback: uploadImage,
                                previewImage: true,
                                inputAccept:
                                  "image/gif,image/jpeg,image/jpg,image/png,image/svg",
                                alt: { present: false, mandatory: false },
                                defaultSize: {
                                  height: "auto",
                                  width: "auto",
                                },
                              },
                            }}
                          />
                        </Card>
                      </>
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12}>
              <Card>
                <CardHeader color="danger" icon>
                  <CardIcon color="danger">
                    <h4 className={classes.cardTitleText}>
                      Timezone Configration
                    </h4>
                  </CardIcon>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                    >
                      <TimezoneSelect
                        value={selectedTimezone}
                        onChange={setSelectedTimezone}
                      />
                    </GridItem>
                    {/* {JSON.stringify(selectedTimezone, null, 2)} */}
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

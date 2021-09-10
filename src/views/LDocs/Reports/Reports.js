import React from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";
// @material-ui/core components
import {
  makeStyles,
  MenuItem,
  TextField,
  CircularProgress,
  Slide,
  Dialog,
  DialogContent,
  Tooltip,
  CardActionArea,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Divider,
} from "@material-ui/core";
// @material-ui/icons
import VisibilityIcon from "@material-ui/icons/Visibility";
import RateReview from "@material-ui/icons/RateReview";
import Swal from "sweetalert2";
import {
  successAlert,
  errorAlert,
  msgAlert,
} from "views/LDocs/Functions/Functions";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import axios from "axios";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { Animated } from "react-animated-css";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import Iframe from "react-iframe";
import FileAdvanceView from "../Invoices/AdvanceView/FileAdvanceView";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import {
  validateInvoice,
  formatDateTime,
} from "views/LDocs/Functions/Functions";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import Validator from "../../Components/Timeline";
import { sendNotification, getNotification } from "actions";
import { useSelector, useDispatch } from "react-redux";
import Alert from "@material-ui/lab/Alert";
import { CallReceived, DoneAll } from "@material-ui/icons";
import { setIsTokenExpired } from "actions";
import { _IsAr } from "../Functions/Functions";
import Reports, {ArReports, ApReports} from "./ReportsPayload.js";
import { Link } from "react-router-dom";

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

export default function Requested() {
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  const isAr = useSelector((state) => state.userReducer.isAr);
  const classes = useStyles();
  const [data, setData] = React.useState(Reports);
  const dispatch = useDispatch();

  return (
    <div>
      <Animated
        animationIn="bounceInRight"
        animationOut="bounceOutLeft"
        animationInDuration={1000}
        animationOutDuration={1000}
        isVisible={true}
      >
        <h3>Analytics Reports</h3>
        <GridContainer>
          {Reports.map((report, index) => (
            <GridItem
              xs={12}
              sm={3}
              md={3}
              key={index}
              className={classes.center}
            >
              <Card className={classes.root}>
                <CardHeader color={report.id % 2 == 0 ? 'danger':'info'} style={{ textAlign: "center" }}>
                  <h5 className={classes.cardTitleText}>{report.name}</h5>
                </CardHeader>
                <Link to={report.link}>
                <CardActionArea>
                  <CardContent>
                    <GridContainer>
                      <GridItem
                        xs={4}
                        sm={4}
                        md={4}
                        className={classes.center}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: " center",
                        }}
                      >
                        {report.isImg ? (
                          <img style={{ width: "50px" }} src={report.icon} />
                        ) : (
                          report.icon
                        )}
                      </GridItem>
                      <GridItem xs={8} sm={8} md={8} className={classes.center}>
                        <Typography gutterBottom variant="body2" style={{fontWeight:"bolder"}} component="h2">
                          {report.title}
                        </Typography>
                      </GridItem>
                    </GridContainer>
                  </CardContent>
                </CardActionArea>
                </Link>
                <CardActions></CardActions>
              </Card>
            </GridItem>
          ))}
        </GridContainer>
        <Divider />
        <h3>AP Reports</h3>
        <GridContainer>
          {ApReports.map((report, index) => (
            <GridItem
              xs={12}
              sm={3}
              md={3}
              key={index}
              className={classes.center}
            >
              <Card className={classes.root}>
                <CardHeader color={report.id % 2 == 0 ? 'danger':'info'} style={{ textAlign: "center" }}>
                  <h5 className={classes.cardTitleText}>{report.name}</h5>
                </CardHeader>
                <Link to={report.link}>
                <CardActionArea>
                  <CardContent>
                    <GridContainer>
                      <GridItem
                        xs={4}
                        sm={4}
                        md={4}
                        className={classes.center}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: " center",
                        }}
                      >
                        {report.isImg ? (
                          <img style={{ width: "50px" }} src={report.icon} />
                        ) : (
                          report.icon
                        )}
                      </GridItem>
                      <GridItem xs={8} sm={8} md={8} className={classes.center}>
                        <Typography gutterBottom variant="body2" style={{fontWeight:"bolder"}} component="h2">
                          {report.title}
                        </Typography>
    
                      </GridItem>
                    </GridContainer>
                  </CardContent>
                </CardActionArea>
                </Link>
                <CardActions></CardActions>
              </Card>
            </GridItem>
          ))}
        </GridContainer>
        <Divider />
        <h3>AR Reports</h3>
        <GridContainer>
          {ArReports.map((report, index) => (
            <GridItem
              xs={12}
              sm={3}
              md={3}
              key={index}
              className={classes.center}
            >
              <Card className={classes.root}>
                <CardHeader color={report.id % 2 == 0 ? 'danger':'info'} style={{ textAlign: "center" }}>
                  <h5 className={classes.cardTitleText}>{report.name}</h5>
                </CardHeader>
                <Link to={report.link}>
                <CardActionArea>
                  <CardContent>
                    <GridContainer>
                      <GridItem
                        xs={4}
                        sm={4}
                        md={4}
                        className={classes.center}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: " center",
                        }}
                      >
                        {report.isImg ? (
                          <img style={{ width: "50px" }} src={report.icon} />
                        ) : (
                          report.icon
                        )}
                      </GridItem>
                      <GridItem xs={8} sm={8} md={8} className={classes.center}>
                        <Typography gutterBottom variant="body2" style={{fontWeight:"bolder"}} component="h2">
                          {report.title}
                        </Typography>
                        
                      </GridItem>
                    </GridContainer>
                  </CardContent>
                </CardActionArea>
                </Link>
                <CardActions></CardActions>
              </Card>
            </GridItem>
          ))}
        </GridContainer>
      </Animated>
    </div>
  );
}

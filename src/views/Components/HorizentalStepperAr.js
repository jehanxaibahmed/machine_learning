import React from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Check from "@material-ui/icons/Check";
import LocalAtmIcon from "@material-ui/icons/LocalAtm";
import StepConnector from "@material-ui/core/StepConnector";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import VisibilityIcon from "@material-ui/icons/Visibility";
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import { Tooltip } from "@material-ui/core";
import DeviceHubIcon from "@material-ui/icons/DeviceHub";
import SystemUpdateIcon from "@material-ui/icons/SystemUpdate";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MoneyIcon from "@material-ui/icons/Money";
import FindInPageIcon from "@material-ui/icons/FindInPage";

const useQontoStepIconStyles = makeStyles({
  root: {
    color: "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
  },
  active: {
    color: "#784af4",
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
  completed: {
    color: "#784af4",
    zIndex: 1,
    fontSize: 18,
  },
});

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? (
        <Check className={classes.completed} />
      ) : (
        <div className={classes.circle} />
      )}
    </div>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
};

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    "& $line": {
      backgroundImage:
        "linear-gradient( 95deg,rgb(9,83,146,1) 0%,rgb(9,83,146,1) 50%,rgb(9,83,146,1) 100%)",
    },
  },
  completed: {
    "& $line": {
      backgroundImage:
        "linear-gradient( 95deg,rgb(9,83,146,1) 0%,rgb(9,83,146,1) 50%,rgb(9,83,146,1) 100%)",
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(9,83,146,1) 0%, rgb(9,83,146,1) 50%, rgb(9,83,146,1) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  },
  completed: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(9,83,146,1) 0%, rgb(9,83,146,1) 50%, rgb(9,83,146,1) 100%)",
  },
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <SystemUpdateIcon />,
    2: <FindInPageIcon />,
    3: <DeviceHubIcon />,
    4: <QueryBuilderIcon />,
    5: <MoneyIcon />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export default function HorizentalteppersAr(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(null);
  const [steps, setSteps] = React.useState([
    {
      label: "Invoice Draft",
      remarks: props.fileData.trackingStatus.invoiceDraft
        ? props.fileData.trackingStatus.invoiceDraft.status == "completed"
          ? "Done"
          : ""
        : "",
      status: props.fileData.trackingStatus.invoiceDraft.status || null,
      comments: props.fileData.trackingStatus.invoiceDraft.comment || null,
    },
    {
      label: "Under Review",
      remarks: props.fileData.trackingStatus.underReview
        ? props.fileData.trackingStatus.underReview.status == "rejected"
          ? "Rejected"
          : props.fileData.trackingStatus.underReview.status ==
            "correctionRequired"
          ? "Correction Required"
          : props.fileData.trackingStatus.underReview.status == "completed"
          ? "Done"
          : props.fileData.trackingStatus.underReview.status == "inProgress"
          ? "In Process"
          : ""
        : "",
      status: props.fileData.trackingStatus.underReview.status || null,
      comments: props.fileData.trackingStatus.underReview.comment || null,
    },
    {
      label: "Under Approve",
      remarks: props.fileData.trackingStatus.underApprove
        ? props.fileData.trackingStatus.underApprove.status == "rejected"
          ? "Rejected"
          : props.fileData.trackingStatus.underApprove.status ==
            "correctionRequired"
          ? "Correction Required"
          : props.fileData.trackingStatus.underApprove.status == "completed"
          ? "Done"
          : props.fileData.trackingStatus.underApprove.status == "inProgress"
          ? "In Process"
          : ""
        : "",
      status: props.fileData.trackingStatus.underApprove.status || null,
      comments: props.fileData.trackingStatus.underApprove.comment || null,
    },
    {
      label: "Customer Status",
      remarks: props.fileData.trackingStatus.sentToClient
        ? props.fileData.trackingStatus.sentToClient.status == "readyToSend"
          ? "Ready To Send"
          : props.fileData.trackingStatus.sentToClient.status == "sent"
          ? "Sent"
          : props.fileData.trackingStatus.sentToClient.status == "acknowledged"
          ? "Sent & Acknowledged"
          : ""
        : "",
      status: props.fileData.trackingStatus.sentToClient.status || null,
      comments: props.fileData.trackingStatus.sentToClient.comment || null,
    },
    {
      label: "Payment",
      remarks: props.fileData.trackingStatus.paid
        ? props.fileData.trackingStatus.paid.status == "partial"
          ? "Partially Paid"
          : props.fileData.trackingStatus.paid.status == "completed"
          ? "Fully Paid"
          : props.fileData.trackingStatus.paid.status == "inProgress" ||
            props.fileData.trackingStatus.paid.status == "readyToPay"
          ? "In Process"
          : ""
        : "",
      status: props.fileData.trackingStatus.paid.status || null,
      comments: props.fileData.trackingStatus.paid.comment || null,
    },
  ]);

  React.useEffect(() => {
    let currentStatus;
    switch (props.fileData.trackingStatus.current_status) {
      case "invoiceDraft":
        currentStatus = props.fileData.trackingStatus.invoiceDraft.status;
        setActiveStep(0);
        break;
      case "underReview":
        currentStatus = props.fileData.trackingStatus.underReview.status;
        if (currentStatus && currentStatus !== "correctionRequired") {
          setActiveStep(1);
        } else {
          setActiveStep(0);
        }
        break;
      case "underApprove":
        currentStatus = props.fileData.trackingStatus.underApprove.status;
        if (currentStatus && currentStatus !== "correctionRequired") {
          setActiveStep(2);
        } else {
          setActiveStep(1);
        }
        break;
      case "sentToClient":
        currentStatus = props.fileData.trackingStatus.sentToClient.status;
        if (currentStatus && currentStatus !== "correctionRequired") {
          setActiveStep(3);
        } else {
          setActiveStep(2);
        }
        break;
      case "paid":
        currentStatus = props.fileData.trackingStatus.paid.status;
        if (currentStatus && currentStatus !== "correctionRequired") {
          setActiveStep(4);
        } else {
          setActiveStep(3);
        }
        break;
    }
  }, []);

  return (
    <div className={classes.root}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<ColorlibConnector />}
      >
        {steps.map((step, index) => (
          <Tooltip
            key={index}
            title={step.comments ? step.comments.toUpperCase() : "WAITING"}
          >
            <Step>
              <StepLabel StepIconComponent={ColorlibStepIcon}>
                <div>
                  {step.label}
                  <br />
                  <small
                    style={{
                      color:
                        step.remarks == "Correction Required"
                          ? "orange"
                          : step.remarks == "Rejected"
                          ? "red"
                          : step.remarks == "In Process"
                          ? "blue"
                          : step.remarks == "Sent"
                          ? "orange"
                          : step.remarks == "Ready To Send"
                          ? "blue"
                          : step.remarks == "Done" ||
                            "Paid" ||
                            "Ready to Pay" ||
                            "Sent & Acknowledged"
                          ? "green"
                          : "inherted",
                    }}
                  >
                    {step.remarks}
                  </small>
                </div>
              </StepLabel>
            </Step>
          </Tooltip>
        ))}
      </Stepper>
    </div>
  );
}

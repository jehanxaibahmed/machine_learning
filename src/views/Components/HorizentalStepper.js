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
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  completed: {
    "& $line": {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
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
      "linear-gradient( 136deg, rgb(90, 44, 102) 0%, rgb(158, 38, 84) 50%, rgb(90, 44, 102) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  },
  completed: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(90, 44, 102) 0%, rgb(158, 38, 84) 50%, rgb(90, 44, 102) 100%)",
  },
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <SystemUpdateIcon />,
    2: <DeviceHubIcon />,
    3: <LocalAtmIcon />,
    4: <QueryBuilderIcon />,
    5: <MoneyIcon />,
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

export default function Horizentalteppers(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(null);
  const [steps, setSteps] = React.useState([
    {
      label: "Invoice Creation",
      remarks:
        props.fileData.trackingStatus.received.status == "rejected"
          ? "Rejected"
          : props.fileData.trackingStatus.received.status ==
            "correctionRequired"
          ? "Correction Required"
          : props.fileData.trackingStatus.received.status == "completed"
          ? "Completed"
          :props.fileData.trackingStatus.received.status ==
            "inProgress"
          ?
          "In Progress": "",
      status: props.fileData.trackingStatus.received.status || null,
      comments: props.fileData.trackingStatus.received.comment || null,
    },
    {
      label: "Initial Review",
      remarks:
        props.fileData.trackingStatus.initialReview.status == "rejected"
          ? "Rejected"
          : props.fileData.trackingStatus.initialReview.status ==
            "correctionRequired"
          ? "Correction Required"
          : props.fileData.trackingStatus.initialReview.status == "completed"
          ? "Completed"
          :props.fileData.trackingStatus.initialReview.status ==
          "inProgress"
        ?
        "In Progress": "",
      status: props.fileData.trackingStatus.initialReview.status || null,
      comments: props.fileData.trackingStatus.initialReview.comment || null,
    },
    {
      label: "Account Review",
      remarks:
        props.fileData.trackingStatus.underReview.status == "rejected"
          ? "Rejected"
          : props.fileData.trackingStatus.underReview.status ==
            "correctionRequired"
          ? "Correction Required"
          : props.fileData.trackingStatus.underReview.status == "completed"
          ? "Completed"
          :props.fileData.trackingStatus.underReview.status ==
          "inProgress"
        ?
        "In Progress": "",
      status: props.fileData.trackingStatus.underReview.status || null,
      comments: props.fileData.trackingStatus.underReview.comment || null,
    },
    {
      label: "Acccount Approval",
      remarks:
        props.fileData.trackingStatus.underApprove.status == "rejected"
          ? "Rejected"
          : props.fileData.trackingStatus.underApprove.status ==
            "correctionRequired"
          ? "Correction Required"
          : props.fileData.trackingStatus.underApprove.status == "Completed"
          ? "Completed"
          :props.fileData.trackingStatus.underApprove.status ==
          "inProgress"
        ?
        "In Progress": "",
      status: props.fileData.trackingStatus.underApprove.status || null,
      comments: props.fileData.trackingStatus.underApprove.comment || null,
    },
    {
      label: "Payment",
      remarks:
        props.fileData.trackingStatus.paymentInProcess.status == "rejected"
          ? "Rejected"
          : props.fileData.trackingStatus.paymentInProcess.status ==
            "correctionRequired"
          ? "Correction Required"
          : props.fileData.trackingStatus.paymentInProcess.status ==
            "completed"
          ? "Completed"
          :props.fileData.trackingStatus.paymentInProcess.status ==
          "inProgress"
        ?
        "In Progress": "",
      status: props.fileData.trackingStatus.paymentInProcess.status || null,
      comments: props.fileData.trackingStatus.paymentInProcess.comment || null,
    },
    // {
    //   label: "Paid",
    //   status: props.fileData.trackingStatus.paid.status || null,
    //   comments: props.fileData.trackingStatus.paid.comment || null,
    // },
  ]);

  React.useEffect(() => {
    let currentStatus;
    switch (props.fileData.trackingStatus.current_status) {
      case "received":
        currentStatus = props.fileData.trackingStatus.received.status;
        setActiveStep(0);
        break;
      case "initialReview":
        currentStatus = props.fileData.trackingStatus.initialReview.status;
        if (currentStatus && currentStatus !== "correctionRequired") {
          setActiveStep(1);
        } else {
          setActiveStep(0);
        }
        break;
      case "underReview":
        currentStatus = props.fileData.trackingStatus.underReview.status;
        if (currentStatus && currentStatus !== "correctionRequired") {
          setActiveStep(2);
        } else {
          setActiveStep(1);
        }
        break;
      case "underApprove":
        currentStatus = props.fileData.trackingStatus.underApprove.status;
        if (currentStatus && currentStatus !== "correctionRequired") {
          setActiveStep(3);
        } else {
          setActiveStep(2);
        }
        break;
      case "paymentInProcess":
        currentStatus = props.fileData.trackingStatus.paymentInProcess.status;
        if (currentStatus && currentStatus !== "correctionRequired") {
          setActiveStep(4);
        } else {
          setActiveStep(3);
        }
        break;
      // case "paid":
      //   currentStatus = props.fileData.trackingStatus.paid.status;
      //   if (currentStatus) {
      //     setActiveStep(4);
      //   } else {
      //     setActiveStep(3);
      //   }
      //   break;
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
                          : step.remarks == "Completed"
                          ? "green" 
                          :
                          step.remarks == "In Progress"
                          ? "blue" 
                          :
                          "inherted",
                          
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

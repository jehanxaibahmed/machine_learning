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
import DeviceHubIcon from '@material-ui/icons/DeviceHub';
import SystemUpdateIcon from '@material-ui/icons/SystemUpdate';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

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
    1: <QueryBuilderIcon />,
    2: <SystemUpdateIcon />,
    3: <DeviceHubIcon />,
    4: <LocalAtmIcon />,
    5: <ExitToAppIcon />,
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
      label: "Pending",
      status: props.fileData.trackingStatus.pending.status || null,
      comments: props.fileData.trackingStatus.pending.comment || null,
    },
    {
      label: props.fileData.trackingStatus.received.status == 'rejected' ? "Rejected" : "Entered",
      status: props.fileData.trackingStatus.received.status || null,
      comments: props.fileData.trackingStatus.received.comment || null,
    },
    {
      label: props.fileData.trackingStatus.underReview.status == 'rejected' ? "Rejected" : "Initiated",
      status: props.fileData.trackingStatus.underReview.status || null,
      comments: props.fileData.trackingStatus.underReview.comment || null,
    },
    {
      label: "Ready For Payment",
      status: props.fileData.trackingStatus.readyForPayment.status || null,
      comments: props.fileData.trackingStatus.readyForPayment.comment || null,
    },
    {
      label: "Exported To Fusion",
      status: props.fileData.exported || null,
      comments:  null,
    },
  ]);

  React.useEffect(() => {
    if(props.fileData.exported){
      setActiveStep(4);
    }
    else
    {
    let currentStatus;
    switch (props.fileData.trackingStatus.current_status) {
      case "pending":
        currentStatus = props.fileData.trackingStatus.pending.status;
        setActiveStep(0);
        break;
      case "received":
        currentStatus = props.fileData.trackingStatus.received.status;
        if (currentStatus && currentStatus !== "inProgress" ) {
          setActiveStep(1);
        } else {
          setActiveStep(0);
        }
        break;
      case "underReview":
        currentStatus = props.fileData.trackingStatus.underReview.status;
        if (currentStatus) {
          setActiveStep(2);
        } else {
          setActiveStep(1);
        }
        break;
      case "readyForPayment":
        currentStatus = props.fileData.trackingStatus.readyForPayment.status;
        if (currentStatus) {
          setActiveStep(3);
        } else {
          setActiveStep(2);
        }
        break;
    }
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
                {step.label}
              </StepLabel>
            </Step>
          </Tooltip>
        ))}
      </Stepper>
    </div>
  );
}

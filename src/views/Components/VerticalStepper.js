import React, {useState, useEffect} from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import StepConnector from '@material-ui/core/StepConnector';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const useStyles = makeStyles((theme) => ({
root: {
width: '100%',
},
button: {
marginTop: theme.spacing(1),
marginRight: theme.spacing(1),
}
}));


const useRowStyles = makeStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
  });


const QontoConnector = withStyles({
    alternativeLabel: {
    top: 10,
    left: 'calc(-50% + 16px)',
    left: 'calc(50% + 16px)',
    },
    line: {
    borderColor: '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
    },
})(StepConnector);


export default function VerticalLinearStepper(props) {
const classes = useStyles();
const [activeStep, setActiveStep] = React.useState(0);
const [steps, setSteps] = useState([]);

function generate(element) {
    return [0, 1, 2].map((value) =>
      React.cloneElement(element, {
        key: value,
      }),
    );
  }

useEffect(()=>{
  console.log(props.data);
    setSteps(props.data.reverse());
},[])

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();
  
    return (
      <React.Fragment>
        {row.invoiceID  ? 
        //File
        <TableRow className={classes.root}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.invoiceID}
          </TableCell>
          {/* <TableCell style={{color:'#3f51b5'}} align="left"> {row.InvoiceHash}</TableCell> */}
          <TableCell align="left">{row.WorkflowID}</TableCell>
          <TableCell align="left">{row.InitBy}</TableCell>
          <TableCell align="left">{row.EventFor}</TableCell>
          <TableCell align="left">{row.EventStatus}</TableCell>
        </TableRow>
        :
        //Workflow 
        <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" style={{fontWeight:800}}>
          {row.WorkflowName}
        </TableCell>
        {/* <TableCell style={{color:'#3f51b5'}} align="left"> {row.WorkflowHash}</TableCell> */}
        <TableCell align="left">{row.WorkflowID}</TableCell>
        <TableCell align="left">{row.OrganizationName}</TableCell>
        <TableCell align="left">{row.CompanyName}</TableCell>
        <TableCell align="left">{row.ReviewStepsCount}</TableCell>
        <TableCell align="left">{row.ActionStepsCount}</TableCell>
        <TableCell align="left">{row.UpdatedBy !== "" || "NONE" ? row.UpdatedBy : row.CreatedBy}</TableCell>
        
      </TableRow>
        }
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                    <Typography variant="body2" gutterBottom component="div">
                    {row.invoiceID ? row.EventComments:row.ReferenceTicket}
                    </Typography>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

function getStepContentTable(step, ind) {
  console.log(step);
    return (
    <Box boxShadow={3} style={{padding:5,marginLeft:30*ind, background:'rgb(238 238 238)'}}>
        <Table aria-label="collapsible table">
            <TableHead>
            {step.invoiceID ? 
            <TableRow>
                <TableCell />
                <TableCell>Invoice ID</TableCell>
                {/* <TableCell align="left">Invoice Hash</TableCell> */}
                <TableCell align="left">Workflow ID</TableCell>
                <TableCell align="left">Inited By</TableCell>
                <TableCell align="left">Event For</TableCell>
                <TableCell align="left">Event Status</TableCell>
            </TableRow>
            :
            <TableRow>
                <TableCell />
                <TableCell>Workflow Name</TableCell>
                {/* <TableCell align="left">Block Hash</TableCell> */}
                <TableCell align="left">Workflow ID</TableCell>
                <TableCell align="left">Organization Name</TableCell>
                <TableCell align="left">Company Name</TableCell>
                <TableCell align="left">Review Steps Count</TableCell>
                <TableCell align="left">Approve Steps Count</TableCell>
                <TableCell align="left">Transaction By</TableCell>
            </TableRow>
            }
            </TableHead>
            <TableBody>
                <Row key={ind} row={step} />
            </TableBody>
        </Table>
      </Box>
    )
}


return (
<div className={classes.root}>
    <Stepper  orientation="vertical" connector={<QontoConnector />}>
    {steps.map((data, index) => {
        return <Step active={true}  key={index} >
            {/* <StepLabel >#{data.InvoiceHash ||data.WorkflowHash}</StepLabel> */}
            {data.Event ? <StepLabel >{data.Event ? `${data.Event.toUpperCase()} STEP`:''}</StepLabel>:''}
            <StepContent>                
                <div>{getStepContentTable(data, index)}</div>
            </StepContent>
        </Step>
      })}
    </Stepper>

</div>
);
}
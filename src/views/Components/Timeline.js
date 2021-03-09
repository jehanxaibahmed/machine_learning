import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Timeline } from '@material-ui/lab';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import dateFormat from "dateformat";



const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '6px 16px',
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default function Validator(props) {
  const validations = props.validation;
  const classes = useStyles();


  return (
    <Timeline >
        {Object.entries(validations).map(
        ([key, value]) => 
            (
            <TimelineItem>
                        <TimelineOppositeContent>
                        <Paper elevation={3} className={classes.paper}>
                            <Typography variant="h6" component="h2">
                            {key}
                            </Typography>
                            <Typography>{value.onChain}</Typography>
                        </Paper>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                        <TimelineDot>
                        {value.isSame ? <CheckCircleIcon style={{color:'green'}} fontSize="large"/> : <ErrorIcon style={{color:'red'}} fontSize="large"/> }
                        </TimelineDot>
                        <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                        <Paper elevation={3} className={classes.paper}>
                            <Typography variant="h6" component="h2">
                            {key}
                            </Typography>
                            <Typography>{value.offChain}</Typography>
                        </Paper>
                        </TimelineContent>
                    </TimelineItem>
        ))}
   
    </Timeline>
  );
}

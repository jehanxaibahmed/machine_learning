import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';
import { Card, Divider,IconButton,ListItem, ListItemText, Dialog,  Slide, LinearProgress} from '@material-ui/core';
import BlockchainAnimation from "../../../components/BlockchainAnimation/BlockChainAnimation";
import CardIcon from "components/Card/CardIcon.js";
import GridItem from "components/Grid/GridItem.js";
import CardHeader from '@material-ui/core/CardHeader';
import VisibilityIcon from '@material-ui/icons/Visibility';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Avatar from '@material-ui/core/Avatar';
import ViewWorkflow from '../Invoices/InitWorkflow/ViewWorkflow';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {isMobile} from 'react-device-detect';

const useStyles = makeStyles((theme) => ({
  scroll:{
    overflow: 'auto',
    whiteSpace: 'nowrap',
  },
  card:{
    minHeight:650,
    border:'#f5f5f5 solid 1px',
    display: 'inline-block',
    width: isMobile ? '70%': '24%',
    verticalAlign:'top'
  },
  item:{
    marginTop:'10px important',
    marginLeft:'10px !important',
    marginRight:'10px !important',
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  avatarGroup :{
    marginLeft:10
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
export default function ColumnView(props) {
  const classes = useStyles();
  const [filteredOrgs, setFilteredOrgs] = React.useState([]);
  const [assignedDepartments, setAssignedDepartments] = React.useState([]);
  const [steps, setSteps] = React.useState([]);
  const [step, setStep] = React.useState(null);
  const [viewStep, setViewStep] = React.useState(false);
  const [loading, setisLoading] = React.useState(false);
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');


  const showDetails = (step) => {
    setStep(step);
    setViewStep(true);
  }
  React.useEffect(()=>{
    setisLoading(true);
    const workflowId = props.workflow._id;
    let data = {
      workflowId: workflowId
    };
  axios({
      method: "post",
      url: `${process.env.REACT_APP_LDOCS_API_WORKFLOW_URL}/workflow/getDepByWorkFlow`,
      data: data,
      headers: {
          cooljwt: Token,
      },
  }).then((response) => {
         if(response.data !== undefined){
          setAssignedDepartments(response.data);
         }
      })
      .catch((error) => {
          console.log(
              typeof error.response != "undefined"
                     ? error.response.data
                      : error.message
          )
      });
    axios({
        method: "get",
        url: `${process.env.REACT_APP_LDOCS_API_WORKFLOW_URL}/workflow/getWorkflowDetailsById/${props.workflow._id}`,
        headers: { cooljwt: Token },
      })
        .then((response) => {
          setSteps(response.data.steps);
          setisLoading(false);
        })
        .catch((error) => {
          console.log(
            typeof error.response != "undefined"
              ? error.response.data
              : error.message
          );
        });
    let orgs = [];
    props.workflow.steps.map((s, index) => {
      if (orgs.find(o=>o.organizationId == s.organizationId) == undefined) {
      orgs.push({
        organizationId:s.organizationId,
        organizationName:s.organizationName
      });
      setFilteredOrgs(orgs);
      }
   });
  },[]);

  return (
    <div className={classes.root}>
       {viewStep ? 
          <Dialog
          classes={{
            root: classes.center + " " + classes.modalRoot,
            paper: classes.modal,
          }}
          fullWidth={true}
          maxWidth={"md"}
          open={viewStep}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setViewStep(false)}
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description"
        >
          <Card >
            <ViewWorkflow list={[step]} />
            </Card>
        </Dialog>
        :''
     }
      <div className={classes.scroll}>
        {filteredOrgs.map((org,index) => (
            <Card key={index} className={classes.card} >
              <CardHeader
                style={{border:'#f5f5f5 3px solid '}}
                title={
                    <React.Fragment>
                    <Typography
                      component="h2"
                      variant="h6"
                      className={classes.inline}
                      style={{color:'rgba(0, 0, 0, .7)'}}
                    >
                      {org.organizationName}
                    </Typography>
                    {/* <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      style={{color:'rgba(0, 0, 0, .6)'}}
                    >
                      {'Organization Steps :'+ props.workflow.steps.filter(s=>s.organizationId == org.organizationId).length}
                    </Typography> */}                    
                    {/* {assignedDepartments.filter(a=>a.organizationId == org.organizationId).map((dep,index) => (
                      <div key={index}>
                        <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        style={{color:'rgba(0, 0, 0, .6)'}}
                      >
                        {dep.departmentName}
                      </Typography>
                      </div>
                    ))} */}
                  </React.Fragment>
                }
                >
            </CardHeader>
            {loading ? <LinearProgress /> :''}
             <Divider/>
                {steps.filter(s=>s.organizationId == org.organizationId && s.event == 'reviewer').map((step,index)=>(
                    <Card key={index} style={{background:'#f5f5f5',border:'rgba(158, 38, 84, .5) 2px solid',margin:10}} >
                    <Typography style={{background:'#fff',color:'rgba(158, 38, 84, .7)',fontWeight:600 ,padding:10, marginBottom:5}} variant='body1' component='h2'>{step.designation}<span style={{float:'right'}}>Review - #{step.id}</span></Typography>
                    <AvatarGroup className={classes.avatarGroup}  max={2}>
                      {step.user !== null || undefined && step.user.length > 0 ? step.user.map(usr => 
                      <Avatar  style={{background:'rgba(158, 38, 84, .5)'}}  className={classes.small}>{usr.level3.email.charAt(0).toUpperCase()}</Avatar>
                      ):''}
                    </AvatarGroup>
                    <IconButton onClick={()=>showDetails(step)}  style={{ float: "right" }}  component="span"><VisibilityIcon style={{color:'rgba(90, 44, 102, .5)'}} fontSize="small" /></IconButton>
                    </Card>
                ))}
              <Divider/>
                {steps.filter(s=>s.organizationId == org.organizationId && s.event == 'approver').map((step,index)=>(
                    <Card key={index} style={{background:'#f5f5f5',border:'rgba(90, 44, 102, .5) 2px solid',margin:10}} >
                    <Typography style={{background:'#fff',color:'rgba(90, 44, 102, .7)',fontWeight:600 ,padding:10, marginBottom:5}} variant='body1' component='h2'>{step.designation} <span style={{float:'right'}}>Approve - #{step.id}</span> </Typography>
                    <AvatarGroup className={classes.avatarGroup}  max={2}>
                      {step.user !== null || undefined && step.user.length > 0 ? step.user.map(usr => 
                      <Avatar style={{background:'rgba(90, 44, 102, .5)'}}  className={classes.small}>{usr.level3.email.charAt(0).toUpperCase()}</Avatar>
                      ):''}
                    </AvatarGroup>
                    <IconButton  onClick={()=>showDetails(step)} style={{ float: "right" }}  component="span"><VisibilityIcon style={{color:'rgba(90, 44, 102, .5)'}} fontSize="small" /></IconButton>
                    </Card>
                ))}
            </Card>
        ))}
      </div>
    </div>
  );
}


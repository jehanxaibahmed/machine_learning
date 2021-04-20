import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
import VisibilityIcon from '@material-ui/icons/Visibility';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ViewWorkflow from '../Invoices/InitWorkflow/ViewWorkflow';
import { Card, Divider,IconButton,ListItem, ListItemText, Dialog,  Slide} from '@material-ui/core';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setIsTokenExpired } from 'actions';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden'
    },
  gridList: {
    flexWrap: 'nowrap',
    width:'100%',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
    paddingBottom:'50px !important'
},
  gridListItem:{
    paddingLeft:'10px !important',
    paddingRight:'10px !important',
    minHeight:650
  },
  card:{
    minHeight:650,
    border:'#f5f5f5 solid 1px',
    
  },
  item:{
    marginTop:'10px important',
    marginLeft:'10px !important',
    marginRight:'10px !important',
  }
}));
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
export default function ColumnView(props) {
  const [workflow, setWorkflow] = React.useState(null);
  const [viewWorkflow, setViewWorkflow] = React.useState(false);
  const dispatch = useDispatch();
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');

  const showDetails = (workflow) => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_WORKFLOW_URL}/workflow/getWorkflowDetailsById/${workflow.id}`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        setWorkflow(response.data);
        setViewWorkflow(true);       
      })
      .catch((error) => {
        error.response.status == 401 && dispatch(setIsTokenExpired(true));
        console.log(
          typeof error.response != "undefined"
            ? error.response.data
            : error.message
        );
      });
  }

  const classes = useStyles();

  return (
    <div className={classes.root}>
       {viewWorkflow ? 
          <Dialog
          classes={{
            root: classes.center + " " + classes.modalRoot,
            paper: classes.modal,
          }}
          fullWidth={true}
          maxWidth={"md"}
          scroll="body"
          open={viewWorkflow}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setViewWorkflow(false)}
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description"
        >
          <Card >
            <ViewWorkflow list={workflow.steps}  />
          </Card>
        </Dialog>
        :''
     }
      <GridList className={classes.gridList} cols={5}>
        {props.departments.map((dep,index) => (
          <GridListTile className={classes.gridListItem} key={index}>
            <Card className={classes.card} >
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
                      {dep.departmentName}
                    </Typography>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      style={{color:'rgba(0, 0, 0, .6)'}}
                    >
                      {'Total Assigned Workflows :'+ dep.workFlows.length}
                    </Typography>
                  </React.Fragment>
                }
                >
                <h4 className={classes.cardTitleText}>Assigned Workflows</h4>
            </CardHeader>
             <Divider/>
                {dep.workFlows.map((workflow,index)=>(
                    <Card style={{background:'#f5f5f5',border:'rgba(158, 38, 84, .5) 2px solid',margin:10}} >
                    <Typography style={{background:'#fff',color:'rgba(158, 38, 84, .7)',fontWeight:600 ,padding:10, marginBottom:5}} variant='body1' component='h2'>{workflow.name}</Typography>
                    {/* <IconButton  style={{ float: "right" }}  component="span"><HighlightOffIcon fontSize="small" /></IconButton> */}
                    <IconButton onClick={()=>showDetails(workflow)} style={{ float: "right" }}  component="span"><VisibilityIcon fontSize="small" /></IconButton>
                    </Card>
                ))}
                    {/* <Card style={{textAlign: "center" ,border:'rgba(158, 38, 84, .5) 2px solid',margin:10}} >
                    <IconButton  component="span"><AddCircleOutlineIcon  /></IconButton>
                    </Card> */}
               
            </Card>
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}


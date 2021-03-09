import React, {useEffect, useState} from 'react';
import RLDD from 'react-list-drag-and-drop/lib/RLDD';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import Button from "components/CustomButtons/Button.js";




const useStyles = makeStyles({
    table: {
      minWidth: '100%',
      border:1
    },
    TableCell:{
        width:'10%'
    },
    TableRow:{
        cursor:'pointer',
        background:'white',
        border:1, width:'100%'
    }
  });

export default function DragAndDrop(props){
    const classes = useStyles();
    const [list , setList]= useState(props.list);
    const [isEdit, setIsEdit] = useState(false);
    const isViewing = props.isViewing;
    const handleChange = (event) => {
        setIsEdit(!isEdit);
      };

    const removeFromList = (i) => {
        var arr = list.filter(function(value, index, arr){
            return index !== i;
        });
        setList(arr);
    }

    const handleRLDDChange = (reorderedItems) => {
        setList(reorderedItems);
     }

    useEffect(()=>{
       props.onChange(list);
    },[list]);

    const itemRenderer = (item, index) => {
        return (
            <Table>
            <TableBody>
            <TableRow hover key={item.id} className={classes.TableRow}>
                <TableCell className={classes.TableCell}><MoreVertIcon/></TableCell>
                <TableCell className={classes.TableCell}>{index+1}</TableCell>
                <TableCell className={classes.TableCell}>{item.designation}</TableCell>
                <TableCell className={classes.TableCell}>{item.organizationName}</TableCell>
                <TableCell className={classes.TableCell}>{item.companyName}</TableCell>
                <TableCell className={classes.TableCell}>{item.event}</TableCell>
                <TableCell className={classes.TableCell}>{item.rejectionBehaviour}</TableCell>
                <TableCell className={classes.TableCell}>{item.timeoutPeriod}</TableCell>
                <TableCell className={classes.TableCell}>{item.notificationsPeriod}</TableCell>
                {!isViewing ?
                    <TableCell className={classes.TableCell}>
                    <IconButton onClick={()=>removeFromList(index)} aria-label="delete" color="primary">
                    <DeleteIcon />
                    </IconButton>
                    </TableCell>
                : ''} 
            </TableRow>
            </TableBody>
            </Table>
        );
    }



    return (
        <GridContainer>
        <GridItem xs={12}>
        <Card>
        <CardHeader color="info" icon>
            <CardIcon color="info">
            <h4 className={classes.cardTitleText}>Workflow Steps / Sequence </h4>
            </CardIcon>
            {!isViewing ?  
             <Button
             color="danger"
             round
             className={classes.marginRight}
             style={{ float: "right" }}
             onClick={handleChange}
           >
             {!isEdit? 'Edit':'Save'}
           </Button>
           :''}
        </CardHeader>
        <CardBody>
        {isEdit ? 
              <RLDD
                cssClasses="example"
                items={list}
                itemRenderer={itemRenderer.bind(this)}
                onChange={handleRLDDChange.bind(this)}
            />  
            :
            <TableContainer>
            <Table className={classes.table} aria-label="simple table">
            <TableHead>
                    <TableRow className={classes.TableRow}>
                    <TableCell className={classes.TableCell}>Step #</TableCell>
                    <TableCell className={classes.TableCell}>Designation</TableCell>
                    <TableCell className={classes.TableCell}>Organization</TableCell>
                    <TableCell className={classes.TableCell}>Company</TableCell>
                    <TableCell className={classes.TableCell}>Role</TableCell>
                    <TableCell className={classes.TableCell}>Review Action</TableCell>
                    <TableCell className={classes.TableCell}>Action Time </TableCell>
                    <TableCell className={classes.TableCell}>Reminder Interval (h)</TableCell>
                    {!isViewing ?
                    <TableCell className={classes.TableCell}>Actions</TableCell>
                    :""}
                </TableRow>
            </TableHead>
            <TableBody style={{paddingBottom:5}}>         
                {list.map((item, index)=>{
                    return (
                    <TableRow key={item.id}>
                        <TableCell className={classes.TableCell}>{index+1}</TableCell>
                        <TableCell className={classes.TableCell}>{item.designation}</TableCell>
                        <TableCell className={classes.TableCell}>{item.organizationName}</TableCell>
                        <TableCell className={classes.TableCell}>{item.companyName}</TableCell>
                        <TableCell className={classes.TableCell}>{item.event.charAt(0).toUpperCase() + item.event.slice(1)}</TableCell>
                        <TableCell className={classes.TableCell}>{item.rejectionBehaviour == 'stepBack' ? 'Step Back': 'To Initiator' }</TableCell>
                        <TableCell className={classes.TableCell}>{item.timeoutPeriod}</TableCell>
                        <TableCell className={classes.TableCell}>{item.notificationsPeriod}</TableCell>
                        {!isViewing ?
                            <TableCell className={classes.TableCell}>
                            <IconButton  aria-label="delete"  color="primary" disabled={!isEdit}>
                            <DeleteIcon />
                            </IconButton>
                            </TableCell>
                        :""}
                    </TableRow>
                )}
                )}
            </TableBody>
            </Table>
            </TableContainer>
            }
            </CardBody>
            </Card>
        </GridItem>
        </GridContainer>     
    );
  

}


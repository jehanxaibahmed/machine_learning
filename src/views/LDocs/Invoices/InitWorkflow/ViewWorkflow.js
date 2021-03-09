import React, {useEffect, useState} from 'react';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles } from '@material-ui/core/styles';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";



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

export default function ViewWorkflow(props){
    const classes = useStyles();
    const [list , setList]= useState(props.list);  
    
    
    useEffect(()=>{
      setList(props.list);
    },[props.list])
    return (
        <Paper style={{padding:10}}>
            <GridContainer>
                {props.isTitle ?
            <GridItem xs={9}>
                <Typography variant="h5">Workflow Sequence</Typography>
            </GridItem>
                :''}
        <GridItem xs={12}>
            <TableContainer>
            <Table className={classes.table} aria-label="simple table">
            <TableHead>
                    <TableRow className={classes.TableRow}>
                    <TableCell className={classes.TableCell}>ID</TableCell>
                    <TableCell className={classes.TableCell}>Designation</TableCell>
                    <TableCell className={classes.TableCell}>Organization</TableCell>
                    <TableCell className={classes.TableCell}>Company</TableCell>
                    <TableCell className={classes.TableCell}>Role</TableCell>
                    <TableCell className={classes.TableCell}>Reject Behavior</TableCell>
                    <TableCell className={classes.TableCell}>Time Out</TableCell>
                    <TableCell className={classes.TableCell}>Notification</TableCell>
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
                        <TableCell className={classes.TableCell}>{item.event}</TableCell>
                        <TableCell className={classes.TableCell}>{item.rejectionBehaviour}</TableCell>
                        <TableCell className={classes.TableCell}>{item.timeoutPeriod}</TableCell>
                        <TableCell className={classes.TableCell}>{item.notificationsPeriod}</TableCell>

                    </TableRow>
                )}
                )}
            </TableBody>
            </Table>
            </TableContainer>
        </GridItem>
        </GridContainer>     
      </Paper>
    );
  

}


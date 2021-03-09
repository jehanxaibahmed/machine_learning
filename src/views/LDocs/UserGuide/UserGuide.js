import React from "react";

// @material-ui/core components
import {
  makeStyles, ListItemText, ListItem, List, Divider, AppBar, Toolbar, Typography
} from "@material-ui/core";
import Button from "components/CustomButtons/Button.js";
// @material-ui/icons
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import styles from "assets/jss/material-dashboard-pro-react/components/adminNavbarLinksStyle.js";
import image1 from "assets/img/UserGuide/org1.jpg";
import image2 from "assets/img/UserGuide/org2.jpg";

var Token = localStorage.getItem("cooljwt");
const guideListMaster = [
    {
        id: "1",
        Title: "How to create new organization?",
        SubTitle: "New organization",
        Description: (<p>Click on <Button color="info" round>ADD NEW ORGANIZATION</Button> and fill in all the details and hit register button</p>),
        Image1: image1,
        Image2: image2,
    },
    {
        id: "2",
        Title: "How to create new company?",
        SubTitle: "New company",
        Description: (<p>Click on  <Button color="info" round>ADD NEW COMPANY</Button> and fill in all the details and hit register button</p>),
        Image1: image1,
        Image2: image2,
    },
    {
        id: "3",
        Title: "How to create new department?",
        SubTitle: "New department",
        Description: (<p>Click on <Button color="info" round>ADD NEW DEPARTMENT</Button> and fill in all the details and hit register button</p>),
        Image1: image1,
        Image2: image2,
    },
    {
        id: "4",
        Title: "How to create new team?",
        SubTitle: "New team",
        Description: (<p>Click on <Button color="info" round>ADD NEW TEAM</Button> and fill in all the details and hit register button</p>),
        Image1: image1,
        Image2: image2,
    },
    {
        id: "5",
        Title: "How to create new title?",
        SubTitle: "New title",
        Description: (<p>Click on <Button color="info" round>ADD NEW TITLE</Button> and fill in all the details and hit register button</p>),
        Image1: image1,
        Image2: image2,
    },
    {
        id: "6",
        Title: "How to create new workflow?",
        SubTitle: "New workflow",
        Description: (<p>Click on <Button color="info" round>CREATE WORKFLOW</Button> and fill in all the details and hit register button</p>),
        Image1: image1,
        Image2: image2,
    },
    {
        id: "7",
        Title: "How to register new user?",
        SubTitle: "User registration",
        Description: (<p>Click on <Button color="info" round>ADD NEW USER</Button> and fill in all the details and hit register button</p>),
        Image1: image1,
        Image2: image2,
    },
    {
        id: "8",
        Title: "How to upload file?",
        SubTitle: "File upload",
        Description: (<p>Click on <Button color="info" round>UPLOAD FILE</Button> and fill in all the details and hit register button</p>),
        Image1: image1,
        Image2: image2,
    },
    {
        id: "9",
        Title: "How to send file for review?",
        SubTitle: "Send for review",
        Description: (<p>Right click on the file and open context menu and choose <Button color="info" round>Send for review</Button> and if you have a workflow assigned then you can send it for Review to your assigned user but if you ahve a permission to overide a your reviewer you can do that as well</p>),
        Image1: image1,
        Image2: image2,
    },
    {
        id: "10",
        Title: "How to review file?",
        SubTitle: "Review file",
        Description: (<p>Click on <Button color="info" round>REVIEW FILE</Button> action in the list and review file with diferent statuses and comments</p>),
        Image1: image1,
        Image2: image2,
    },
    {
        id: "11",
        Title: "How to send file for approval?",
        SubTitle: "Send for approval",
        Description: (<p>Right click on the file and open context menu and choose <Button color="info" round>Send for approval</Button> and if you have a workflow assigned then you can send it for approval to your assigned user but if you ahve a permission to overide a your approver you can do that as well</p>),
        Image1: image1,
        Image2: image2,
        
    },
    {
        id: "12",
        Title: "How to approve file?",
        SubTitle: "Approve file",
        Description: (<p>Click on <Button color="info" round>APPROVE FILE</Button> action in the list and approve file with diferent statuses and comments</p>),
        Image1: image1,
        Image2: image2,
    },
]
const guideListDetail = []
const useStyles = makeStyles(styles);

export default function UserGuide(props) {
  const classes = useStyles();
  const [listMasterData, setListMasterData] = React.useState({});
  const handleClose = () => {
    props.handleClose();
  };
  const handleListClick = (listMaster) => {
    setListMasterData(listMaster);
  }
  const handleBackClick = () => {
    setListMasterData({});
  }
  return (
    <div>
            <AppBar className={classes.appBar}>
          <Toolbar>
          {typeof listMasterData.id == "undefined" ?
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            :<IconButton edge="start" color="inherit" onClick={handleBackClick} aria-label="close">
            <ArrowBackIosIcon />
            </IconButton>}
            <Typography variant="h6" className={classes.title}>
            {typeof listMasterData.id == "undefined" ? "User Guide" : listMasterData.Title}
            </Typography>
          </Toolbar>
        </AppBar>
        {typeof listMasterData.id == "undefined" ?
            <List>
                {guideListMaster.map(item => {
          return (<React.Fragment key={item.id}>
                    <ListItem button onClick={()=>handleListClick(item)}>
                        <ListItemText primary={item.Title} secondary={item.SubTitle} />
                        <ArrowForwardIosIcon />
                    </ListItem>
                    <Divider />
                </React.Fragment>)
        })}
        </List>
        : ""}
        {typeof listMasterData.id != "undefined" ? 
        <List> 
            <ListItem button>
                <ListItemText primary={listMasterData.Description}/>
            </ListItem>
            <Divider />
            <GridContainer>
            <GridItem
            xs={12}
            sm={12}
            md={6}
            lg={6}
            style={{ marginTop: "10px", marginBottom: "10px" }}
            >
                    <Typography variant="h6" className={classes.title} style={{textAlign: "center"}}>
                    Figure 1
                </Typography>
                <img src={listMasterData.Image1} />
            </GridItem>
                <GridItem
                xs={12}
                sm={12}
                md={6}
                lg={6}
                style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                    <Typography variant="h6" className={classes.title} style={{textAlign: "center"}}>
                        Figure 2
                    </Typography>
                    <img src={listMasterData.Image2} />
                </GridItem>
            </GridContainer>
                    
        </List>
             : ""}
    </div>
  );
}


import React, {useState, useEffect} from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { TextField, CircularProgress } from "@material-ui/core";
// @material-ui/icons
import SearchIcon from '@material-ui/icons/Search';

// core components
import Chip from "@material-ui/core/Chip";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import axios from "axios";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { Animated } from "react-animated-css";
import defaultAvatar from "assets/img/avatar-2.png";
import Timeline from "../Invoices/RecieveInvoice/TagsTimeline";
import ChipInput from "material-ui-chip-input";

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
  cardTitleText: {
    color: "white",
  },
  buttonRight: {},
};

const useStyles = makeStyles(styles);

export default function Tags(props) {
  const classes = useStyles();
  const [widgetStories, setWidgetStories] = useState(null);
  const setTimeline = () => {
    if(typeof props.file.fileTags !== "undefined" && props.file.fileTags.length > 0){
      let timelineData = props.file.fileTags.map((item, index) => {
        let profileImage = defaultAvatar;
        if (item.img != "" || typeof item.img != "undefined") {
          var base64Flag = `data:${item.imgtype};base64,`;
          profileImage = base64Flag + item.img;
        }
        return {
          // First story
          inverted: true,
          badgeColor: "info",
          badgeIcon: profileImage,
          title: item.loginName,
          titleColor: "info",
          body: item.tag.map((tg, index) => {
            return (
                <Chip key={index} label={tg} />
            );
          }),
        };
      });
      setWidgetStories(timelineData);
    }else{
      setWidgetStories("0");
    }
  }
  useEffect(() => {
    setTimeline();
  }, []);
  return (
    <div>
      <Animated
        animationIn="bounceInRight"
        animationOut="bounceOutLeft"
        animationInDuration={1000}
        animationOutDuration={1000}
        isVisible={true}
         >
            <GridContainer>
                <GridItem lg={12} md={12} sm={12} xs={12}>
                    {widgetStories !== null && widgetStories !== "0" ? <Timeline simple stories={widgetStories} /> : widgetStories == "0" ? "No Tags Available ":<CircularProgress />}
                </GridItem>
            </GridContainer>
        </Animated>
    </div>
  );
}

import React from "react";
import Brightness1Icon from '@material-ui/icons/Brightness1';
// @material-ui/core components
import {
  Avatar,
  makeStyles,
  Paper,
  Grid,
  Typography
} from "@material-ui/core";
import {
    withScriptjs,
    withGoogleMap,
    MarkerWithLabel,
    GoogleMap,
    Marker
  } from "react-google-maps";


  const useStyles = makeStyles((theme) => ({

    orange: {
      color: 'white',
      backgroundColor: 'orange',
      width: theme.spacing(3),
      height: theme.spacing(3),
      fontSize:8
    },
    green: {
      color: 'white',
      backgroundColor: 'green',
      width: theme.spacing(3),
      height: theme.spacing(3),
      fontSize:8
    },
    greenColor: {
      color: 'green'
    },
    orangeColor: {
      color: 'orange'
    },
    wrapIcon: {
      verticalAlign: 'middle',
      display: 'inline-flex',
      margin:5
     }
  }));  
  
  
  
  export default function Map(props) {
    const classes = useStyles();
    const locationDocs = [
      {
        locationID:1,
        latitude:25.34513,
        longitude:55.38619,
        pendingApprovalCount:4,
        approvedCount:2
      },
      {
        locationID:2,
        latitude:25.204849,
        longitude:55.270782,
        pendingApprovalCount:4,
        approvedCount:2
      },
      {
        locationID:3,
        latitude:24.48818,
        longitude:54.35495,
        pendingApprovalCount:7,
        approvedCount:5
      }
    ]
    const { MarkerWithLabel } = require("react-google-maps/lib/components/addons/MarkerWithLabel");
    const RegularMap = withScriptjs(
        withGoogleMap(() => (
          <GoogleMap
            defaultZoom={8.8}
            defaultCenter={{ lat:  24.8867, lng:  54.8848 }}
            defaultOptions={{
              scrollwheel: false
            }}
          >
          {locationDocs.map(loc=>{
            return (
            // <Marker
            //   key={loc.locationID}
            //   position={{ lat:  loc.latitude, lng:  loc.longitude  }}
            //   icon={{
            //     url: '../document.png',
            //     anchor: new window.google.maps.Point(17, 26),
            //     scaledSize: new window.google.maps.Size(27, 27)
            //   }}
            //   title={loc.documentCount}
            // />
            <MarkerWithLabel
              key={loc.locationID}
              position={{ lat:  loc.latitude, lng:  loc.longitude  }}
              labelAnchor={new window.google.maps.Point(0, 0)}
              icon={{
                url: '../transparent.png',
                anchor: new window.google.maps.Point(10, 10),
                scaledSize: new window.google.maps.Size(22, 22)
              }}
              labelStyle={{backgroundColor: "transparent"}}
              >
             <Grid container justify="center" spacing={0}>
                  <Avatar className={classes.orange}>{loc.pendingApprovalCount}</Avatar>
                  <Avatar className={classes.green}>{loc.approvedCount}</Avatar>
            </Grid>
            </MarkerWithLabel>
            )
          })}
          </GoogleMap>
        ))
      );
      return (
        <div>
          <Typography variant="body1" className={classes.wrapIcon}>
              <Brightness1Icon className={classes.orangeColor}/>Pending
          </Typography>
          <Typography variant="body1" className={classes.wrapIcon}>
          <Brightness1Icon className={classes.greenColor}/>Approved
          </Typography>
          <RegularMap
          googleMapURL={process.env.REACT_APP_LDOCS_GOOGLE_MAP_API}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={
            <div
              style={{
                height: `500px`,
                borderRadius: "6px",
                overflow: "hidden"
              }}
            />
          }
          mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
       )


  }
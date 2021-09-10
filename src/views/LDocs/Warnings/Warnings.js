import React, { useEffect } from "react";
import MaterialTable from "material-table";
// @material-ui/core components
import GridContainer from "components/Grid/GridContainer.js";

import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
//Redux
import { useSelector, useDispatch } from "react-redux";
//ReduxActions
import { getEvents } from "actions";
import { Animated } from "react-animated-css";

export default function Warnings() {
  const dispatch = useDispatch();

  const events = useSelector((state) => state.userReducer.events);

  // const handleMarkeventRead = (event_id, status) =>{
  //   let Token = localStorage.getItem("cooljwt");
  //   axios({
  //     method: "put",
  //     url: `${process.env.REACT_APP_LDOCS_API_URL}/notify/updateSysNotify`,
  //     data: {
  //       "_id":event_id,
  //       "status":status
  //     },
  //     headers: { "Content-Type": "application/json",
  //     cooljwt: Token
  //   },
  //   })
  //     .then((response) => {
  //       dispatch(getEvents());
  //     });
  //   //setevents(events);
  //   //handleCloseevent();
  // }
  useEffect(() => {
    dispatch(getEvents());
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
          <GridItem xs={12} sm={12} md={12}>
            {/* <Card profile>
              <CardHeader color="info" icon>
                <CardIcon color="info">
                  <h4 className={classes.cardTitle}>Events</h4>
                </CardIcon>
              </CardHeader>
              <CardBody profile> */}
                <MaterialTable
                  detailPanel={(rowData) => {
                    return (
                      <div style={{ textAlign: "center" }}>
                        <h6>{rowData.fileId}</h6>
                        <p>{rowData.fileOwner}</p>
                      </div>
                    );
                  }}
                  title="ACTIVITY LOGS"
                  columns={[
                    {
                      title: "Event By",
                      field: "eventBy",
                      //customFilterAndSearch: (term, rowData) => term == rowData.name.length
                    },
                    { title: "Event Type", field: "eventType" },
                    {
                      title: "Event Time",
                      field: "eventTime",
                      type: "datetime",
                    },
                    {
                      title: "Event Module",
                      field: "eventModule",
                      lookup: { "File System": "File System" },
                    },
                  ]}
                  data={events}
                  options={{
                    filtering: true,
                  }}
                />
              {/* </CardBody>
            </Card> */}
          </GridItem>
        </GridContainer>
      </Animated>
    </div>
  );
}

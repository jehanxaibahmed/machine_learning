import React, {useEffect, useState} from "react";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import { Typography } from "@material-ui/core";
import axios from "axios";

export default function AcknowledgedClient(props) {
  const logo = require("assets/img/logo_color.png");
    const [response, setResponse] = useState(null);
    //Get URl Params
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
          var results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
      }
  useEffect(()=>{
    let tenantId = getParameterByName('tenantId') ;
    let organizationId = getParameterByName('organizationId') ;
    let clientId = getParameterByName('clientId') ;
    let invoiceId =getParameterByName('invoiceId') ;
    let version = getParameterByName('version');
    var body = {
        clientId,
        organizationId,
        invoiceId,
        version,
        tenantId
        };

        axios({
        method: "post",
        url: `${process.env.REACT_APP_LDOCS_API_URL}/AR/invoiceAcknowledge`,
        data: body,
      })
        .then((response) => {
            setResponse(true);
        }).catch((err)=>{
            setResponse(false);
        })
  },[])
  return (
    <div>
      <GridContainer justify="center" style={{textAlign: 'center'}}>
        <GridItem sm={12} style={{marginBottom:20}}>
          <img src={logo} width={300} />
        </GridItem>
        {response !== null || 'null' ? 
        <GridItem sm={12} style={{marginBottom:20}}>
        <Typography variant="h2" component="h6">
            {response === true ?  "Acknowledged !" : response === false ? "Oops !":""}
          </Typography>
          <Typography variant="h6" component="h4">
          {response === true ? "Invoice" + invoiceId + "has been Acknowledged ." : response === false ? "Sorry, There is Some issue in Acknowledge Invoice . ":""}
          </Typography>
          <Typography variant="span" component="body2">
            For More Information Contact at : info@matesol.net
          </Typography>
        </GridItem>
        :""}
      </GridContainer>
    </div>
  );
}

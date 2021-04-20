import React from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";

// @material-ui/core components
import {
  makeStyles,
  CircularProgress,
  Slide,
  Tooltip,
} from "@material-ui/core";
// @material-ui/icons
import VisibilityIcon from "@material-ui/icons/Visibility";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import axios from "axios";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { Animated } from "react-animated-css";
import jwt from "jsonwebtoken";
import Pending from "assets/img/statuses/Pending.png";
import Success from "assets/img/statuses/Success.png";
import Rejected from "assets/img/statuses/Rejected.png";
import NoStatus from "assets/img/statuses/NoStatus.png";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { useSelector, useDispatch } from "react-redux";
import { setIsTokenExpired } from "actions";


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

export default function MyReviews() {
  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const classes = useStyles();
  const [pdfModalData, setPdfModalData] = React.useState(false);
  const [animateTable, setAnimateTable] = React.useState(true);
  const [animatePdf, setAnimatePdf] = React.useState(false);
  const [isViewing, setIsViewing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [pdfUrl, setPdfUrl] = React.useState(false);
  const [data, setData] = React.useState();
  const dispatch = useDispatch();

  React.useEffect(() => {
    getRequests();
  }, []);
  const viewFile = (row) => {
    setIsViewing(false);
    setPdfModalData(row);
    setPdfUrl(
      `${process.env.REACT_APP_LDOCS_API_URL}/igobgftgsftp/${row.fileOwner}/${row.fileId}`
    );

    setAnimateTable(false);
    setIsViewing(true);
    setAnimatePdf(true);
  };
  const getRequests = () => {
    setIsLoading(true);
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/invoiceApprove/approvePending`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        setData(
          response.data.map((prop, key) => {
            return {
              id: prop._id,
              fileName: prop.InvoiceId,
              requestedBy: prop.requestedBy,
              reviewedBy: prop.reviewedBy,
              status:
                prop.status == "pending" ? (
                  <div className="fileinput text-center">
                    <div className="thumbnail img-circle2">
                      <img src={Pending} alt={prop.status} />
                    </div>
                  </div>
                ) : prop.status == "reviewed" ? (
                  <div className="fileinput text-center">
                    <div className="thumbnail img-circle2">
                      <img src={Success} alt={prop.status} />
                    </div>
                  </div>
                ) : prop.status == "rejected" ? (
                  <div className="fileinput text-center">
                    <div className="thumbnail img-circle2">
                      <img src={Rejected} alt={prop.status} />
                    </div>
                  </div>
                ) : (
                  <div className="fileinput text-center">
                    <div className="thumbnail img-circle2">
                      <img src={NoStatus} alt={prop.status} />
                    </div>
                  </div>
                ),
                version: prop.version,
                actions: (
                <div className="actions-right">
                  <Tooltip title="View Invoice" aria-label="viewfile">
                    <Button
                      justIcon
                      round
                      simple
                      icon={VisibilityIcon}
                      onClick={() => viewFile(prop)}
                      color="warning"
                      className="View"
                    >
                      <VisibilityIcon />
                    </Button>
                  </Tooltip>
                </div>
              ),
            };
          })
        );
        setIsLoading(false);
      })
      .catch((error) => {
        error.response.status == 401 && dispatch(setIsTokenExpired(true));        ;
        console.log(
          typeof error.response != "undefined"
            ? error.response.data
            : error.message
        );
        setIsLoading(false);
      });
  };
  const goBack = () => {
    setPdfUrl();
    setIsViewing(false);
    setAnimateTable(true);
    setAnimatePdf(false);
    setPdfModalData("");
  };

  return (
    <div>
      {isViewing ? (
        <Animated
          animationIn="bounceInRight"
          animationOut="bounceOutLeft"
          animationInDuration={1000}
          animationOutDuration={1000}
          isVisible={animatePdf}
        >
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12} className={classes.center}>
              <Card>
                <CardHeader color="info" icon>
                  <CardIcon color="info">
                    <h4 className={classes.cardTitleText}>
                      Invoice : {pdfModalData.InvoiceId}
                    </h4>
                  </CardIcon>
                  <Button
                    color="info"
                    round
                    style={{ float: "right" }}
                    className={classes.marginRight}
                    onClick={() => goBack()}
                  >
                    Go Back
                  </Button>
                </CardHeader>
                <CardBody>
                  
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </Animated>
      ) : (
        ""
      )}
      <Animated
        animationIn="bounceInRight"
        animationOut="bounceOutLeft"
        animationInDuration={1000}
        animationOutDuration={1000}
        isVisible={animateTable}
      >
        <GridContainer>
          <GridItem xs={12}>
            <Card>
              <CardHeader color="info" icon>
                <CardIcon color="info">
                  <h4 className={classes.cardTitleText}>
                    Invoice Send For Approval
                  </h4>
                </CardIcon>
              </CardHeader>
              <CardBody>
                {isLoading ? (
                  <CircularProgress disableShrink />
                ) : (
                  <ReactTable
                    data={data}
                    sortable={false}
                    columns={[
                      {
                        Header: "Invoice ID",
                        accessor: "fileName",
                      },
                      {
                        Header: "Version",
                        accessor: "version",
                      },
                      {
                        Header: "Requested By",
                        accessor: "requestedBy",
                      },
                      {
                        Header: "Approved By",
                        accessor: "approvedBy",
                      },
                      {
                        Header: "Status",
                        accessor: "status",
                      },
                     
                      {
                        Header: "Actions",
                        accessor: "actions",
                      },
                    ]}
                    defaultPageSize={10}
                    showPaginationTop
                    showPaginationBottom={false}
                    className="-striped -highlight"
                  />
                )}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </Animated>
    </div>
  );
}

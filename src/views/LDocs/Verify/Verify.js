
import React, {useState, useEffect} from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { TextField, CircularProgress } from "@material-ui/core";

// @material-ui/icons
import SearchIcon from '@material-ui/icons/Search';
import SelectAllIcon from '@material-ui/icons/SelectAll';
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import NavPills from "components/NavPills/NavPills.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import Table from "components/Table/Table.js";
import CardHeader from "components/Card/CardHeader.js";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { Animated } from "react-animated-css";
import BlockChain from "./BlockChain";
import VerticalLinearStepper from "../../Components/VerticalStepper";
import Tags from "./Tags";
import Approval from "./Approval";
import Review from "./Review";
import Autocomplete from '@material-ui/lab/Autocomplete';
import dateFormat from "dateformat";
import axios from "axios";
import jwt from "jsonwebtoken";
import { useDispatch, useSelector } from "react-redux";
import FileAdvanceView from "../Invoices/AdvanceView/FileAdvanceView";
import { addZeroes, formatDate, formatDateTime } from "../Functions/Functions";
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

  function sleep(delay = 0) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }
export default function Verify() {
    const isAr = useSelector((state) => state.userReducer.isAr);
    const[animateFileInfo, setAnimateFileInfo] = useState(false);
    const[disabledSearch, setDisabledSearch] = useState(true);
    const[isSearching, setIsSearching] = useState(false);
    const [fileName, setFileName] = React.useState(null);
    const [Selected, setSelected] = React.useState(null);
    const [fileData, setFileData] = React.useState([]);
    const [blockChainData, setBlockChainData] = React.useState(null);
    const [file, setFile] = React.useState(null);
    //   Test Data
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const [invoices, setInvoices] = React.useState([]);
    const [inputValue, setInputValue] = React.useState('');
    const loading = open && options.length === 0;

    const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
    const dispatch = useDispatch();
    const userDetails = jwt.decode(Token);
    
    
    const selectFile = (fileObject,index) => {
        // document.getElementById("selectFile"+index).setAttribute("color","black")
        if(Selected == index){
          setSelected(null);
          setFile(null);
          setBlockChainData(null);
        }else{
          const Check = require("is-null-empty-or-undefined").Check;
          if(typeof fileObject.fileId !== "undefined" && !Check(fileObject.fileId)){
            axios({
              method: "get", //you can set what request you want to be
              url: `${process.env.REACT_APP_LDOCS_API_BOOKCHAIN_URL}/api/queryhistory/${fileObject.fileId}`
              //url: `${process.env.REACT_APP_LDOCS_API_BOOKCHAIN_URL}/api/queryhistory/4b41a3475132bd861b30a878e30aa56a-waqas-sample_pdf_27.pdf`
            })
              .then((response) => {
                setBlockChainData(response.data)
                setSelected(index);
              setFile(fileObject);
              })
              .catch((error) => {
                if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
                setSelected(index);
              setFile(fileObject);
                setBlockChainData(null)
                console.log(
                  typeof error.response != "undefined"
                    ? error.response.data
                    : error.message
                );
              });
          }else{
            setSelected(index);
              setFile(fileObject);
              setBlockChainData(null);
          }
        }
        
        
    }

    const classes = useStyles();

    const getFile = () => {
        const selectedOption = invoices.find(i=>i.invoiceId == fileName.name);
        setBlockChainData(null);
        setSelected(null);
        setFile(null);
        setAnimateFileInfo(false);
        setIsSearching(true);
        axios({
          method: "post", //you can set what request you want to be
          url: isAr ? `${process.env.REACT_APP_LDOCS_API_URL}/AR/invoiceFullSearchOrgAR`  : userDetails.isTenant ? `${process.env.REACT_APP_LDOCS_API_URL}/invoice/invoiceFullSearch` : `${process.env.REACT_APP_LDOCS_API_URL}/invoice/invoiceFullSearchOrg` ,
          data: userDetails.isTenant ?
          {
            invoiceId:selectedOption.invoiceId,
            version:selectedOption.version
          }:
          {
              organizationId:userDetails.orgDetail.organizationId,
              invoiceId:selectedOption.invoiceId,
              version:selectedOption.version
          },
          headers: { cooljwt:Token},
        })
          .then((response) => {
            setFileData(response.data);
            setAnimateFileInfo(true);
            setIsSearching(false);
          })
          .catch((error) => {
            if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
            setFileData([]);
            console.log(
              typeof error.response != "undefined"
                ? error.response.data
                : error.message
            );
            setAnimateFileInfo(true);
            setIsSearching(false);
          });
    };

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
        if(options.length <= 0){
          axios({
            method: "post",
            url: isAr ? `${process.env.REACT_APP_LDOCS_API_URL}/AR/invoicePartialSearchOrgAR` :  userDetails.isTenant ? `${process.env.REACT_APP_LDOCS_API_URL}/invoice/invoicePartialSearch` : `${process.env.REACT_APP_LDOCS_API_URL}/invoice/invoicePartialSearchOrg`,
            data: userDetails.isTenant ? 
            {
              query : inputValue,
            }:{
              query : inputValue,
              organizationId:userDetails.orgDetail.organizationId,
            },
            headers: { cooljwt:Token},
          })
            .then(async (response) => {
              await sleep(130);
              const result = await response.data.result;
              setInvoices(result);
              setOptions(result.map((item) =>{ return {name: item.invoiceId} } ));
            }).catch(err=>{
              console.log(err);
            });
          }
        })();

    return () => {
      active = false;
    };
  }, [inputValue]);
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
          <GridItem xs={12}>
            <Card>
              <CardHeader color="info" icon>
                <CardIcon color="info">
                  <h4 className={classes.cardTitleText}>Search Invoice</h4>
                </CardIcon>
              </CardHeader>
              <CardBody>
                  <GridContainer>
                    <GridItem
                        xs={12}
                        sm={12}
                        md={10}
                        lg={10}
                        style={{ marginTop: "10px", marginBottom: "10px" }}
                        >
                            <Autocomplete
                                id="documentname"
                                value={fileName}
                                onChange={(event, newValue) => {
                                    setFileName(newValue);
                                    if(newValue !== null){
                                        setDisabledSearch(false)
                                    }else{
                                        setDisabledSearch(true)
                                    }
                                }}
                                open={open}
                                onOpen={() => {
                                    setOpen(true);
                                }}
                                onClose={() => {
                                    setOpen(false);
                                }}
                                getOptionSelected={(option, value) => option.name === value.name}
                                getOptionLabel={(option) => option.name}
                                options={options}
                                loading={loading}
                                inputValue={inputValue}
                                onInputChange={(event, newInputValue) => {
                                  setInputValue(newInputValue);
                                }}
                                renderInput={(params) => (
                                    <TextField   
                                    {...params}
                                    label="Invoice ID"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                        <React.Fragment>
                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                            
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                        ),
                                    }}
                                    />
                                )}
                                />
                            </GridItem>
                        <GridItem
                            xs={12}
                            sm={12}
                            md={2}
                            lg={2}
                            style={{ marginTop: "10px", marginBottom: "10px" }}
                        >
                            <Button
                                color="danger"
                                className={classes.registerButton}
                                type="submit"
                                size="sm"
                                round
                                block
                                onClick={getFile}
                                disabled={disabledSearch}
                            >
                                {isSearching ? <CircularProgress color="inherit" size={20} /> : <SearchIcon />}
                            </Button>
                        </GridItem>
                    </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        </Animated>
        <Animated
        animationIn="bounceInUp"
        animationOut="bounceOutDown"
        animationInDuration={1000}
        animationOutDuration={1000}
        isVisible={animateFileInfo}
      >
        <GridContainer>
            <GridItem xs={12}>
            <GridContainer>
                <GridItem lg={12} md={12} sm={12} xs={12}>
                <Card>
                <CardHeader color="danger" icon>
                    <CardIcon color="danger">
                    <h4 className={classes.cardTitleText}>Invoice Info</h4>
                    </CardIcon>
                </CardHeader>
                <CardBody>
                {fileData.length > 0 ? 
                <Table
                    hover
                    tableHeaderColor="info"
                    tableShopping={true}
                    tableHead={[
                      "Invoice ID", "Submit Date", "Due Date", isAr ? "Customer Name" :"Vendor Name", "Amount", "Version","Action"
                    ]}
                    tableData={fileData.map((file,index)=>{return [file.invoiceId, formatDateTime(file.invoiceDate), formatDate(file.dueDate) ,isAr ? file.clientName :file.vendorName,`${file.FC_currency.Code}${addZeroes(file.netAmt)}`,file.version,(<Button
                        round
                        color={Selected == index ? "danger" : "info"}
                        className="Edit"
                        id={"selectFile"+index}
                        name={"selectFile"+index}
                        onClick={()=>selectFile(file,index)}
                        size="sm"
                      >
                        {/* <SelectAllIcon /> */}
                        {Selected == index ? "Selected" : "select"}
                      </Button>)]}) }
                    />
                    :""}
                </CardBody>
                </Card>
            </GridItem>
            {file !== null ? 
            <GridItem lg={12} md={12} sm={12} xs={12}>
                 <Card>
                 <CardHeader color="info" icon>
                    <CardIcon color="info">
                    <h4 className={classes.cardTitleText}>360&#176; View</h4>
                    </CardIcon>
                </CardHeader>
                <CardBody>
                    <GridContainer justify="center">
                    <GridItem xs={12} sm={12} md={12} className={classes.center}>
                      {file !== null ? 
                      <FileAdvanceView fileData={fileData[0]} />
                      :
                      file == null ? "Please select a file" : "No Data Available"}
                    </GridItem>
                    </GridContainer>
                    </CardBody>
                  </Card>
                </GridItem>
                :''}
            </GridContainer>
            </GridItem>
        </GridContainer>
        </Animated>
    </div>
  );
}

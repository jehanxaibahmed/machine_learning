import React, { useEffect } from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";

// @material-ui/core components
import {
  makeStyles,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Slide,
  CircularProgress,
  Tooltip, 
  Dialog,
  Typography,
  FormGroup,
} from "@material-ui/core";
import SweetAlert from "react-bootstrap-sweetalert";
// @material-ui/icons
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from '@material-ui/icons/Edit';
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import axios from "axios";
import ClearAllIcon from '@material-ui/icons/ClearAll';
import { Animated } from "react-animated-css";
import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import BlockchainAnimation from "../../../components/BlockchainAnimation/BlockChainAnimation";
import OtpCheck from "../Authorization/OtpCheck";
import Switch from '@material-ui/core/Switch';
import DragAndDropList from "./DragAndDropList";
import jwt from "jsonwebtoken";
import VerticalLinearStepper  from "../../Components/VerticalStepper";
import { useSelector, useDispatch } from "react-redux";
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import ColumnView from "./ColumnView";
import { setIsTokenExpired } from "actions";




const useStyles = makeStyles(styles);
const sweetAlertStyle = makeStyles(styles2);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function Workflow() {

  const Token = useSelector(state => state.userReducer.Token) || localStorage.getItem('cooljwt');
  const dispatch = useDispatch();
  const userDetails = jwt.decode(Token);
  const classes = useStyles();
  const [animateTable, setAnimateTable] = React.useState(true);
  const [tableView, setTableView] = React.useState(true);
  const [animateForm, setAnimateForm] = React.useState(false);
  const [formView, setFormView] = React.useState(false);
  const [animateColumn, setAnimateColumn] = React.useState(false);
  const [columnView, setColumnView] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [reviewerCheck, setReviewerCheck] = React.useState(false);
  const [approverCheck, setApproverCheck] = React.useState(false);
  const [workflows, setWorkflows] = React.useState([]);
  const [organizationFilter, setOrganizationFilter] = React.useState("");
  const [disabledCheck, setDisabledCheck] = React.useState(false);
  const [animateBlockChain, setAnimateBlockChain] = React.useState(false);
  const [isViewing, setIsViewing] = React.useState(false);
  const [Updating, setUpdating] = React.useState(false);
  const [isViewingBlockChainView, setIsViewingBlockChainView] = React.useState(false);
  const [blockChainData, setBlockChainData] = React.useState(null);
  const [otpModal, setotpModal] = React.useState(false);
  const [steps, setSteps] = React.useState([]);
  const [workflow, setWorkflow] = React.useState([]);
  const [OTP, setOTP] = React.useState("");
  const [isSavingData, setIsSavingData] = React.useState(false);
  const [getUpdateDescription, setGetUpdateDescription] = React.useState(false);
  
  
  useEffect(() => {
    if (!otpModal) {
      const Check = require("is-null-empty-or-undefined").Check;
      if (!Check(OTP)) {
        createWorkflow();
      }
    }
  }, [otpModal])
  const setOtpValue = (value) => {
    setOTP(value);
    setotpModal(false);  
  }
  const [outSideOrg, setoutSideOrg] = React.useState(false);
  const [formState, setFormState] = React.useState({
    orgs: [],
    comp: [],
    titles: [],
    values: {
      workflowId:"",
      workflowName: "",
      referrenceTicket: "",
      organizationName: "",
      companyName: "",
      companyId: "",
      outSideOrganizationName: "",
      outsideCompanyName: "",
      outsideCompanyId: "",
      designation:"",
      rejectBehavior:"",
      notificationHour:"",
      timeOut:"",
      role:true,
      comments: "",
      createdBy:"",
      workflowDescription:""
    },
    errors: {
      workflowName: "",
      referrenceTicket: "",
      organizationName: "",
      companyName: "",
      companyId: "",
      outSideOrganizationName: "",
      outsideCompanyName: "",
      outsideCompanyId: "",
      designation:"",
      rejectBehavior:"",
      notificationHour:"",
      timeOut:"",
      role:"",
      workflowDescription:""
    },
  });

  const viewBlockChainView = (row) => {
    setIsViewingBlockChainView(false);
    // axios({
    //   method: "get", //you can set what request you want to be
    //   url: `${process.env.REACT_APP_LDOCS_API_WORKFLOW_URL}/workflow/getworkflowhash/${row._id}`
    // })
    //   .then((response) => {
        axios({
          method: "get", //you can set what request you want to be
          //url: `${process.env.REACT_APP_LDOCS_API_BOOKCHAIN_URL}/api/historyworkflow/${row._id}`
          url: `${process.env.REACT_APP_LDOCS_API_BOOKCHAIN_URL}/api/workflow/get-workflow/${row._id}`
        })
          .then((response) => {
            if(response.data.length !== 0){
            setBlockChainData(response.data);
            setIsViewingBlockChainView(true);
            setAnimateTable(false);
            setAnimateBlockChain(true);
          }
          })
     // })




  };


  const updateWorkflow = (row) => {
    setOTP("");
    setUpdating(true);
    getCompanies(row.organizationId);
  setFormState((formState) => ({
    ...formState,
    values: {
      ...formState.values,
      workflowId: row._id,
      workflowName: row.workflowName,
      referrenceTicket: row.referenceTicket,
      organizationName: row.organizationName,
      companyName: row.companyName,
      companyId: row.companyId,
      comments: row.comments,
      createdBy: row.createdBy,
      role:true,
      workflowDescription:''
    },
  }));
  setSteps(row.steps);
  setAnimateTable(false);
  setDisabledCheck(true);
  setTimeout(function() {
  setTableView(false);
  setFormView(true);
  setAnimateForm(true);
  }, 500);
};


const viewWorkflow = (row) => {
  setOTP("");
  getCompanies(row.organizationId);
  setSteps(row.steps);
  setFormState((formState) => ({
    ...formState,
    values: {
      ...formState.values,
      workflowName: row.workflowName,
      referrenceTicket: row.referrenceTicket,
      organizationName: row.organizationName,
      companyName: row.companyName,
      companyId: row.companyId,
      comments: row.comments,
      role:true
    },
  }));
  setAnimateTable(false);
  setDisabledCheck(true);
  setIsViewing(true);
  setUpdating(false);
  setTimeout(function() {
    setTableView(false);
    setFormView(true);
    setAnimateForm(true);
  }, 500);
};

const viewWorkflowColumnView = (row) => {
  setWorkflow(row);
  setAnimateTable(false);
  setTimeout(function() {
    setTableView(false);
    setColumnView(true);
    setAnimateColumn(true);
  }, 500);
};

  const handleOrgFilter = (event) => {
    const org = formState.orgs.find(org=>org.organizationName == event.target.value);
    setOrganizationFilter(org);
    getMyWorkflows(org._id);
  }




  const getMyWorkflows = (Org) => {
    setIsLoading(true);
       axios({
         method: "get",
         url: `${process.env.REACT_APP_LDOCS_API_WORKFLOW_URL}/workflow/getworkflowbyorganization/${Org}`,
         headers: { cooljwt: Token },
       })
         .then((response) => {
           setWorkflows(
             response.data.map((prop, key) => {
               return {
                 id: prop._id,
                 workflowName: prop.workflowName,
                 organizationName: prop.organizationName,
                 comments: prop.comments,
                 actions: (
                   <div className="actions-right">
                     <Tooltip title="Update Invoice Workflow" aria-label="updateWorkflow">
                      <Button
                        justIcon
                        round
                        simple
                        icon={EditIcon}
                        onClick={() => 
                          updateWorkflow(prop)
                        }
                        color="info"
                        className="View"
                      >
                        <EditIcon />
                      </Button>
                    </Tooltip>
                     <Tooltip title="View Invoice Process" aria-label="viewworkflow">
                       <Button
                         justIcon
                         round
                         simple
                         icon={VisibilityIcon}
                         onClick={() => 
                          viewWorkflow(prop)
                        }
                         color="warning"
                         className="View"
                       >
                         <VisibilityIcon />
                       </Button>
                     </Tooltip>
                     <Tooltip title="View Column View" aria-label="viewColumnworkflow">
                       <Button
                         justIcon
                         round
                         simple
                         icon={ViewColumnIcon}
                         onClick={() => 
                          viewWorkflowColumnView(prop)
                        }
                         color="info"
                         className="View"
                       >
                         <ViewColumnIcon />
                       </Button>
                     </Tooltip>
                     <Tooltip title="BlockChain View" aria-label="blockChainView">
                      <Button
                        justIcon
                        round
                        simple
                        icon={ClearAllIcon}
                        onClick={() => {
                          viewBlockChainView(prop);
                        }}
                        color="info"
                        className="Edit"
                      >
                        <ClearAllIcon />
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
          if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
           console.log(
             typeof error.response != "undefined"
               ? error.response.data
               : error.message
           );
           setIsLoading(false);
         });
     };

    const handleNameChange = (event) => {
      event.persist();
      setFormState((formState) => ({
        ...formState,
        values: {
          ...formState.values,
          [event.target.name]: event.target.value.toUpperCase(),
        },
      }));
    };

    
    const handleChange = (event) => {
      event.persist();
  if (event.target.name == "organizationName") {
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value.toUpperCase(),
        companyName: "",
        designation: "",
     }})
    );
    getCompanies(formState.orgs.find(org=>org.organizationName == event.target.value)._id);
    getMyWorkflows(formState.orgs.find(org=>org.organizationName == event.target.value)._id);
  }
  else if (event.target.name == "outSideOrganizationName") {
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value.toUpperCase(),
        outsideCompanyName: "",
        designation: ""
     }})
    );
    getCompanies(formState.orgs.find(org=>org.organizationName == event.target.value)._id);
  }
  else if (event.target.name == "companyName") {
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value.toUpperCase(),
        designation: ""
      },
    }));
    getTitles(formState.comp.find(com=>com.companyName == event.target.value)._id);

  }
  else if (event.target.name == "outsideCompanyName") {
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value.toUpperCase(),
        designation:''
      },
    }));
    getTitles(formState.comp.find(com=>com.companyName == event.target.value)._id);
  }
  else if (event.target.name == "role") {
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: !formState.values.role
      },
    }));
  }
  else {
      setFormState((formState) => ({
        ...formState,
        values: {
          ...formState.values,
          [event.target.name]: event.target.value.toUpperCase(),
        },
      }));
     }
  };
  
    const handleTitleChange = (event) => {
      event.persist();
         setFormState((formState) => ({
           ...formState,
           values: {
             ...formState.values,
             [event.target.name]: event.target.value,
           },
         }));
    };
  // const getTitles = (org) => {
  //     setIsLoading(true);
  //     axios({
  //       method: "get",
  //       url: `${process.env.REACT_APP_LDOCS_API_WORKFLOW_URL}/gettitleid/${org}`,
  //       headers: { cooljwt: Token },
  //     })
  //       .then((response) => {
  //         setFormState((formState) => ({
  //           ...formState,
  //           titles: response.data,
  //         }));
  //         setIsLoading(false);
  //       })
  //       .catch((error) => {
  // if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
  //         console.log(
  //           typeof error.response != "undefined"
  //             ? error.response.data
  //             : error.message
  //         );
  //         setIsLoading(false);
  //       });
  //   };
  const getOrganizations = () => {
    setIsLoading(true);
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/organization/getAllOrgBytenant`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        if (response.data.length > 0) {
          setTimeout(function() {
          let orgs;
          if (userDetails.isTenant) {
            orgs = response.data;
          } else {
            orgs =  response.data.filter(org => org._id == userDetails.orgDetail.organizationId)
          }
          setFormState((formState) => ({
            ...formState,
            orgs: orgs,
          }));
          setOrganizationFilter(orgs[0]);
          getMyWorkflows(orgs[0]._id);
        }, 500);
        }
        else {
          setFormState((formState) => ({
            ...formState,
            orgs: [],
          }));
        }
      },500)
      .catch((error) => {
        if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        console.log(
          typeof error.response != "undefined"
            ? error.response.data
            : error.message
        );
        setIsLoading(false);
      });;
  }
  
    const getCompanies = (org) => {
      axios({
        method: "get",
        //url: `${process.env.REACT_APP_LDOCS_API_URL}/company/getCompaniesUnderOrg/${org}`,
        url: `${process.env.REACT_APP_LDOCS_API_URL}/company/getAllcompaniesUnderTenant`,
        headers: { cooljwt: Token },
      })
        .then((response) => {
          setFormState((formState) => ({
            ...formState,
            comp: response.data,
          }));
        })
        .catch((error) => {
          if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
          setFormState((formState) => ({
            ...formState,
            isError: true,
            message:
              "Unable to get Companies please contact ", //typeof error.response != "undefined"  ? error.response.data : error.message
          }));
        });
    };
    const getTitles = (comp) => {
      let url = `${process.env.REACT_APP_LDOCS_API_URL}/title/getTitleUnderCompany/${comp}`;
      axios({
        method: "get",
        url: url,
        headers: { cooljwt: Token },
      })
        .then((response) => {
          setFormState((formState) => ({
            ...formState,
            titles: response.data
          }));
        })
        .catch((error) => {
          if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
          console.log(
            typeof error.response != "undefined"
              ? error.response.data
              : error.message
          );
        });
    };
      React.useEffect(() => {
        getOrganizations();
      }, []);

    const handleToggle = (name) => {
        if (name == "reviewerCheck") {
            setReviewerCheck(!reviewerCheck);
        } else if (name == "approverCheck") {
            setApproverCheck(!approverCheck);
        }
    };
    const sweetClass = sweetAlertStyle();
    const [alert, setAlert] = React.useState(null);
    const successAlert = (msg) => {
      setAlert(
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title="Success!"
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnCssClass={sweetClass.button + " " + sweetClass.success}
        >
          {msg}
        </SweetAlert>
      );
    };
    const errorAlert = (msg) => {
      setAlert(
        <SweetAlert
          error
          style={{ display: "block", marginTop: "-100px" }}
          title="Error!"
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnCssClass={sweetClass.button + " " + sweetClass.danger}
        >
          {msg ? msg : `Unable To Register  Please Contact ${process.env.REACT_APP_LDOCS_CONTACT_MAIL}`}
        </SweetAlert>
      );
    };
    const hideAlert = () => {
      setAlert(null);
    };



const createWorkflow = () => {
  let workflowName;
  let referrenceTicket;
  let organizationName;
  let companyName;

  const Check = require("is-null-empty-or-undefined").Check;
  var error = false;

  if (!Check(formState.values.workflowName)) {
    workflowName = "success";
  } else {
    workflowName = "error";
    error = true;
  }
  if (!Check(formState.values.organizationName)) {
    organizationName = "success";
  } else {
    organizationName = "error";
    error = true;
  }
  if (!Check(formState.values.companyName)) {
    companyName = "success";
  } else {
    companyName = "error";
    error = true;
  }
  // if (!Check(formState.values.referrenceTicket)) {
  //   referrenceTicket = "success";
  // }
  // else {
  //   referrenceTicket = "error";
  //   error = true;
  // }
  if (steps.length == 0){
    error = true;
  }
  setFormState((formState) => ({
    ...formState,
    errors: {
      ...formState.errors,
      workflowName: workflowName,
      referrenceTicket: referrenceTicket,
      organizationName: organizationName,
      companyName: companyName,
    },
  }));
  if (error) {
    setFormState((formState) => ({
      ...formState,
      isRegistering: false,
    }));
    setIsSavingData(false);
    steps.length != 0 ? 
    errorAlert("Invalid Details!") : 
    errorAlert("Please Add Steps .....");
    return false;
  } else {
  if(Updating){
      if(!OTP){
        setotpModal(true);
        return false;
      }
    }
    setIsSavingData(true);
    setFormState((formState) => ({
      ...formState,
      isRegistering: true,
    }));
    let decoded = jwt.decode(Token);
    const userEmail = decoded.email;
    let data = {
      tenantId:formState.orgs.find(org=>org.organizationName = formState.values.organizationName).tenantId,
      workflowName:formState.values.workflowName,
      referenceTicket:formState.values.workflowId,
      organizationName:formState.values.organizationName,
      organizationId: formState.orgs.find(org=>org.organizationName = formState.values.organizationName)._id,
      companyName:formState.values.companyName,
      companyId:formState.comp.find(comp=>comp.companyName = formState.values.companyName)._id,
      comments:formState.values.comments,
      created:new Date(Date.now()),
      createdBy:userEmail,
      steps :steps
    };
    let msg = "";
    let url = `${process.env.REACT_APP_LDOCS_API_WORKFLOW_URL}/workflow/createworkflow`;
    let method = "post";
    if(Updating){
      url = `${process.env.REACT_APP_LDOCS_API_WORKFLOW_URL}/workflow/updateWorkFlow`;
      method = "put";
      data.otp = OTP;
      data.workflowId =  formState.values.workflowId;
    }
    axios({
      method: method,
      url: url,
      data: data,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        setIsSavingData(false);
        setOTP("");
        setIsLoading(false);
            msg = "Invoice Workflow Created Successfully!";
          if(Updating){
            msg = "Invoice Workflow Updated Successfully!";
          }
          successAlert(msg); 
          getMyWorkflows(formState.orgs.find(org=>org.organizationName = formState.values.organizationName)._id);
          goBack();
      })
      .catch((error) => {
        if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        setIsSavingData(false);
        setOTP("");
        setIsLoading(false);
        msg =
          typeof error.response != "undefined"
            ? error.response.data
            : error.message;
        errorAlert(msg);
      });
  }
  };

  const addStep = () => {
  let outSideOrganizationName;
  let outsideCompanyName;
  let designation;
  let notificationHour;
  let timeOut;
  let rejectBehavior;

  const Check = require("is-null-empty-or-undefined").Check;
  var error = false;
  if(outSideOrg){
  if (!Check(formState.values.outSideOrganizationName)) {
    outSideOrganizationName = "success";
  } else {
    outSideOrganizationName = "error";
    error = true;
  }
  if (!Check(formState.values.outsideCompanyName)) {
    outsideCompanyName = "success";
  } else {
    outsideCompanyName = "error";
    error = true;
  }
  }
  if (!Check(formState.values.designation)) {
    designation = "success";
  } else {
    designation = "error";
    error = true;
  }
  if (!Check(formState.values.notificationHour)) {
    notificationHour = "success";
  } else {
    notificationHour = "error";
    error = true;
  }
  if (!Check(formState.values.timeOut)) {
    timeOut = "success";
  } else {
    timeOut = "error";
    error = true;
  }
  if (!Check(formState.values.rejectBehavior)) {
    rejectBehavior = "success";
  } else {
    rejectBehavior = "error";
    error = true;
  }
  
  setFormState((formState) => ({
    ...formState,
    errors: {
      ...formState.errors,
      outsideCompanyName: outsideCompanyName,
      outSideOrganizationName: outSideOrganizationName,
      designation: designation,
      timeOut: timeOut,
      notificationHour: notificationHour,
      rejectBehavior:rejectBehavior
    },
  }));
  if (error) {
    errorAlert("Invalid Details!");
    return false;
  } else {
    var step = {
      id:steps.length+1,
      sequenceId:steps.length+1,
      designation:formState.values.designation,
      organizationId:outSideOrg ? formState.orgs.find(org=>org.organizationName == formState.values.outSideOrganizationName)._id : formState.orgs.find(org=>org.organizationName == formState.values.organizationName)._id,
      companyId:outSideOrg ? formState.comp.find(comp=>comp.companyName == formState.values.outsideCompanyName)._id : formState.comp.find(comp=>comp.companyName == formState.values.companyName)._id,
      event:formState.values.role?'reviewer':'approver',
      rejectionBehaviour:formState.values.rejectBehavior,
      timeoutPeriod:formState.values.timeOut,
      notificationsPeriod:formState.values.notificationHour,
      IsExternalOrg:outSideOrg?true:false,
      IsActive:true,
      organizationName:outSideOrg ? formState.values.outSideOrganizationName : formState.values.organizationName,
      companyName:outSideOrg ? formState.values.outsideCompanyName : formState.values.companyName
    }; 
    steps.push(step);
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        designation:"",
        notificationHour:"",
        outSideOrganizationName:"",
        outsideCompanyId:"",
        outsideCompanyName:"",
        rejectBehavior:"",
        timeOut:"",
        role:true
      },
    }));
    setoutSideOrg(false);
  }
  }

  const goToForm = () => {
    setUpdating(false);
    setOTP("");
    setReviewerCheck(false);
    setApproverCheck(false);
    setFormState((formState) => ({
      ...formState,
      isRegistering: false,
      values: {
        ...formState.values,
        workflowName: "",
        organizationName: "",
        companyName: "",
        companyId: "",
        designation:"",
        notificationHour:"",
        outSideOrganizationName:"",
        outsideCompanyId:"",
        outsideCompanyName:"",
        referrenceTicket:"",
        rejectBehavior:"",
        role:true,
        timeOut:"",
        comments: "",
      },
    }));
    setAnimateTable(false);
    setDisabledCheck(false);
    setTimeout(function () {
      setTableView(false);
      setFormView(true);
      setAnimateForm(true)
    }, 500);
  }
  const reOrderSteps = (steps) => {
    setSteps(steps);
  }
  const outSideOrgHandler = () => {
    setoutSideOrg(!outSideOrg);
    getTitles(formState.values.companyId);
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        designation:"",
        notificationHour:"",
        outSideOrganizationName:"",
        outsideCompanyId:"",
        outsideCompanyName:"",
        rejectBehavior:"",
        timeOut:""
      }
      }));
  }
  const update = () => {
  let workflowDescription;
  const Check = require("is-null-empty-or-undefined").Check;
  var error = false;
 
  if (!Check(formState.values.workflowDescription)) {
    workflowDescription = "success";
  } else {
    workflowDescription = "error";
    error = true;
  }
  
  setFormState((formState) => ({
    ...formState,
    errors: {
      ...formState.errors,
      workflowDescription:workflowDescription
    },
  }));
  if (error) {
    errorAlert("Please Add Some Uppdate Description !");
    return false;
  } else {
    setGetUpdateDescription(false);
    createWorkflow();
  }
  }
  const goBack = () => {
    setOTP("");
    setAnimateForm(false);
    setFormState((formState) => ({
      ...formState,
      isRegistering: false,
      values: {
        ...formState.values,
        workflowName: "",
        organizationName: "",
        companyName: "",
        companyId: "",
        designation:"",
        notificationHour:"",
        outSideOrganizationName:"",
        outsideCompanyId:"",
        outsideCompanyName:"",
        referrenceTicket:"",
        rejectBehavior:"",
        role:"",
        timeOut:"",
        comments: "",
        workflowDescription:""
      },
    }));
    setSteps([]);
    setTimeout(function () {
      setTableView(true);
      setFormView(false);
      setIsViewing(false);
      setColumnView(false);
      setIsViewingBlockChainView(false);
     setAnimateTable(true);
    }, 500);
  };
  return (
    <div>
      {alert}
      {isSavingData ? 
       <Dialog
       classes={{
         root: classes.center + " " + classes.modalRoot,
         paper: classes.modal,
       }}
       fullWidth={true}
       maxWidth={"md"}
       open={isSavingData}
       TransitionComponent={Transition}
       keepMounted
       onClose={() => setIsSavingData(false)}
       aria-labelledby="classic-modal-slide-title"
       aria-describedby="classic-modal-slide-description"
     >
      <GridItem xs={12} sm={12} md={12} >
        <Card >
          <CardHeader color="info" icon>
            <CardIcon color="info">
              <h4 className={classes.cardTitle}>
                {'MOVING TO BLOCKCHIAN'}
              </h4>
            </CardIcon>
          </CardHeader>
         <BlockchainAnimation  />
         </Card>
         </GridItem> 
     </Dialog>
      :''
      }
      {otpModal ?
        <Dialog
            classes={{
              root: classes.center + " " + classes.modalRoot,
              paper: classes.modal,
            }}
            fullWidth={true}
            maxWidth={"xs"}
            open={otpModal}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => setotpModal(false)}
            aria-labelledby="classic-modal-slide-title"
            aria-describedby="classic-modal-slide-description"
          >
              <OtpCheck setOtpValue={setOtpValue} /> 
          </Dialog>
        : ""}

      {getUpdateDescription ?
        <Dialog
            classes={{
              root: classes.center + " " + classes.modalRoot,
              paper: classes.modal,
            }}
            fullWidth={true}
            maxWidth={"md"}
            open={getUpdateDescription}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => setGetUpdateDescription(false)}
            aria-labelledby="classic-modal-slide-title"
            aria-describedby="classic-modal-slide-description"
          >
            <Animated
          animationIn="bounceInRight"
          animationOut="bounceOutLeft"
          animationInDuration={1000}
          animationOutDuration={1000}
          isVisible={getUpdateDescription}
        >
            <GridItem xs={12} sm={12} md={12} className={classes.center}>
              <Card>
                <CardHeader color="info" icon>
                  <CardIcon color="info">
                    <h4 className={classes.cardTitleText}>
                     Workflow Update Description
                    </h4>
                  </CardIcon>
                </CardHeader>
                <CardBody>
                <TextField
                        fullWidth={true}
                        multiline
                        rows={4}
                        error={formState.errors.workflowDescription === "error"}
                        helperText={
                          formState.errors.workflowDescription === "error"
                            ? "Valid Description is required"
                            : null
                        }
                        label="Update Description"
                        id="updateDetails"
                        name="workflowDescription"
                        onChange={(event) => {
                          handleChange(event);
                        }}
                        type="text"
                        value={formState.values.workflowDescription || ""}
                      />

                  <Button
                    color="info"
                    round
                    style={{ float: "right", marginTop:20 }}
                    className={classes.marginRight}
                    onClick={() => update()}
                  >
                    Save
                  </Button>
                  <Button
                    color="danger"
                    round
                    style={{ float: "right", marginTop:20 }}
                    className={classes.marginRight}
                    onClick={() => setGetUpdateDescription(false)}
                  >
                    Close
                  </Button> 
                </CardBody>
              </Card>
            </GridItem>
        </Animated>
          </Dialog>
        : ""}

        {isViewingBlockChainView ? (
        <Animated
          animationIn="bounceInRight"
          animationOut="bounceOutLeft"
          animationInDuration={1000}
          animationOutDuration={1000}
          isVisible={animateBlockChain}
        >
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12} className={classes.center}>
              <Card>
                <CardHeader color="info" icon>
                  <CardIcon color="info">
                    <h4 className={classes.cardTitleText}>
                    Blockchain View
                    </h4>
                  </CardIcon>
                  <Button
                    color="danger"
                    round
                    style={{ float: "right" }}
                    className={classes.marginRight}
                    onClick={() => goBack()}
                  >
                    Go Back
                  </Button>
                </CardHeader>
                <CardBody>
                <VerticalLinearStepper data={blockChainData} />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </Animated>
      ) : (
        ""
      )}
      {columnView ? (
        <Animated
          animationIn="bounceInRight"
          animationOut="bounceOutLeft"
          animationInDuration={1000}
          animationOutDuration={1000}
          isVisible={animateColumn}
        >
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12} className={classes.center}>
              <Card>
                <CardHeader color="info" icon>
                  <CardIcon color="info">
                    <h4 className={classes.cardTitleText}>
                     Column View
                    </h4>
                  </CardIcon>
                  <Button
                    color="danger"
                    round
                    style={{ float: "right" }}
                    className={classes.marginRight}
                    onClick={() => goBack()}
                  >
                    Go Back
                  </Button>
                </CardHeader>
                <CardBody>
                <ColumnView workflow={workflow} />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </Animated>
      ) : (
        ""
      )}
      {formView ? (
        <Animated
          animationIn="bounceInRight"
          animationOut="bounceOutLeft"
          animationInDuration={1000}
          animationOutDuration={1000}
          isVisible={animateForm}
        >
          <GridContainer>
            <GridItem xs={12}>
              <Card>
                <CardHeader color="info" icon>
                  <CardIcon color="info">
                    <h4 className={classes.cardTitleText}>{!isViewing || !Updating ? 'Create Workflow ': 'Workflow' }  </h4>
                  </CardIcon>
                  <Button
                    color="danger"
                    round
                    style={{ float: "right" }}
                    className={classes.marginRight}
                    onClick={() => goBack()}
                  >
                    Go Back
                  </Button>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={6}
                      lg={6}
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                    >
                      <TextField
                        fullWidth={true}
                        error={formState.errors.workflowName === "error"}
                        helperText={
                          formState.errors.workflowName === "error"
                            ? "Valid Invoice Workflow name is required"
                            : null
                        }
                        label="Invoice Workflow Name"
                        id="workflowName"
                        name="workflowName"
                        onChange={(event) => {
                          handleNameChange(event);
                        }}
                        type="text"
                        disabled={disabledCheck}
                        value={formState.values.workflowName || ""}
                      />
                    </GridItem>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={6}
                      lg={6}
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                    >
                      <TextField
                        fullWidth={true}
                        error={formState.errors.referrenceTicket === "error"}
                        helperText={
                          formState.errors.referrenceTicket === "error"
                            ? "Valid Workflow ID is required"
                            : null
                        }
                        label="Workflow ID"
                        id="referrenceTicket"
                        name="referrenceTicket"
                        onChange={(event) => {
                          handleNameChange(event);
                        }}
                        type="text"
                        disabled={true}
                        value={formState.values.referrenceTicket || `W-00${workflows.length+1}`}
                      />
                    </GridItem>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={6}
                      lg={6}
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                    >
                    
                      <TextField
                        className={classes.textField}
                        error={formState.errors.organizationName === "error"}
                        fullWidth={true}
                        helperText={
                          formState.errors.organizationName === "error"
                            ? "Organization name is required"
                            : null
                        }
                        label="Organization Name"
                        name="organizationName"
                        onChange={(event) => {
                          handleChange(event);
                        }}
                        select
                        disabled={disabledCheck}
                        value={formState.values.organizationName || ""}
                      >
                        <MenuItem
                          disabled
                          classes={{ 
                            root: classes.selectMenuItem,
                          }}
                        >
                          Choose Organization
                        </MenuItem>
                        {formState.orgs.map((org, index) => {
                          return (
                            <MenuItem key={index} value={org.organizationName}>
                              {org.organizationName}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    </GridItem>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={6}
                      lg={6}
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                    >
                      <TextField
                        className={classes.textField}
                        error={formState.errors.companyName === "error"}
                        fullWidth={true}
                        helperText={
                          formState.errors.companyName === "error"
                            ? "Company name is required"
                            : null
                        }
                        label="Company Name"
                        name="companyName"
                        onChange={(event) => {
                          handleChange(event);
                        }}
                        select
                        disabled={disabledCheck}
                        value={formState.values.companyName || ""}
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem,
                          }}
                        >
                          Choose Company
                        </MenuItem>
                        {formState.comp.map((com, index) => {
                            return formState.values.organizationName ==
                              com.organizationName ? (
                              <MenuItem
                                key={index}
                                value={com.companyName.toUpperCase()}
                              >
                                {com.companyName.toUpperCase()}
                              </MenuItem>
                            ) : (
                              ""
                            );
                          })}
                      </TextField>
                    </GridItem>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                    >
                      <TextField
                        fullWidth={true}
                        label="Invoice Workflow Description"
                        id="comments"
                        name="comments"
                        onChange={(event) => {
                          handleChange(event);
                        }}
                        multiline
                        rows={4}
                        // type="text"
                        value={formState.values.comments || ""}
                      />
                    </GridItem>
                    </GridContainer>
                    </CardBody>
                    </Card>
                    </GridItem>
                    {!isViewing ? 
                    <GridItem
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      style={{ marginTop: "10px", marginBottom: "10px"}}
                    >
                    <Card>
                    <CardHeader color="info" icon>
                      <CardIcon color="info">
                        <h4 className={classes.cardTitleText}>Invoice Workflow Step </h4>
                      </CardIcon>
                    </CardHeader>
                    <CardBody>
                    <GridContainer style={{ paddingLeft: "20px", paddingRight: "20px"}}>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      style={{ marginTop: "10px", marginBottom: "10px"}}
                    >
                    <GridContainer >
                    <GridItem
                         xs={12}
                         sm={12}
                         md={6}
                         lg={6}
                         style={{ marginTop: "20px", marginBottom: "10px" }}
                        >
                        <FormGroup row>
                          <FormControlLabel
                            onChange={(event) => {
                              handleChange(event);
                            }}
                            value="reviewer"
                            control={<Checkbox name="role" color="info" />}
                            label="Review"
                            name="role"
                            checked={formState.values.role?true : false}
                          />
                          <FormControlLabel
                            onChange={(event) => {
                              handleChange(event);
                            }}
                            value="approver"
                            control={<Checkbox name="role" color="info" />}
                            label="Approve"
                            name="role"
                            checked={formState.values.role?false : true}
                          />
                          </FormGroup>
                        </GridItem>
                      <GridItem
                            xs={12}
                            sm={12}
                            md={6}
                            lg={6}
                            style={{ marginTop: "10px", marginBottom: "10px" }}
                      >
                        <FormControlLabel
                            control={
                            <Switch
                                checked={outSideOrg}
                                onChange={outSideOrgHandler}
                                name="edit"
                                color="info"
                            />
                        }
                        label={outSideOrg ? 'External Organization (In case external organization involves in review/approval)': 'Internal Organization'}
                        />
                      </GridItem>
                      {outSideOrg ? 
                       <GridItem
                       xs={12}
                       sm={12}
                       md={12}
                       lg={12}
                       style={{ marginTop: "10px", marginBottom: "10px" }}
                     >
                      <GridContainer>
                      <GridItem
                      xs={12}
                      sm={12}
                      md={6}
                      lg={6}
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                    >
                      <TextField
                        className={classes.textField}
                        error={formState.errors.outSideOrganizationName === "error"}
                        fullWidth={true}
                        helperText={
                          formState.errors.outSideOrganizationName === "error"
                            ? "Organization name is required"
                            : null
                        }
                        label="Organization Name"
                        name="outSideOrganizationName"
                        onChange={(event) => {
                          handleChange(event);
                        }}
                        select
                        value={formState.values.outSideOrganizationName || ""}
                      >
                        <MenuItem
                          disabled
                          classes={{ 
                            root: classes.selectMenuItem,
                          }}
                        >
                          Choose Organization
                        </MenuItem>
                        {formState.orgs.map((org, index) => {
                          return (
                            <MenuItem key={index} value={org.organizationName}>
                              {org.organizationName}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    </GridItem>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={6}
                      lg={6}
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                    >
                    
                      <TextField
                        className={classes.textField}
                        error={formState.errors.outsideCompanyName === "error"}
                        fullWidth={true}
                        helperText={
                          formState.errors.outsideCompanyName === "error"
                            ? "Company Name is required"
                            : null
                        }
                        label="Compnay Name"
                        name="outsideCompanyName"
                        onChange={(event) => {
                          handleChange(event);
                        }}
                        select
                        value={formState.values.outsideCompanyName || ""}
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem,
                          }}
                        >
                          Choose Company
                        </MenuItem>
                        {formState.comp.map((com, index) => {
                            return formState.values.outSideOrganizationName ==
                              com.organizationName ? (
                              <MenuItem
                                key={index}
                                value={com.companyName.toUpperCase()}
                              >
                                {com.companyName.toUpperCase()}
                              </MenuItem>
                            ) : (
                              ""
                            );
                          })}
                      </TextField>
                        </GridItem>
                        </GridContainer>
                        </GridItem> :''}
                        <GridItem
                          xs={12}
                          sm={12}
                          md={6}
                          lg={6}
                          style={{ marginTop: "10px", marginBottom: "10px" }}
                        >
                         <TextField
                          className={classes.textField}
                          error={formState.errors.designation === "error"}
                          fullWidth={true}
                          helperText={
                            formState.errors.designation === "error"
                              ? "Designation is required"
                              : null
                          }
                          label="Designation (Who will Review/Approve this step)"
                          name="designation"
                          onChange={(event) => {
                            handleTitleChange(event);
                          }}
                          select
                          value={formState.values.designation || ""}
                        >
                          <MenuItem
                            disabled
                            classes={{
                              root: classes.selectMenuItem,
                            }}
                          >
                            Choose Designation
                          </MenuItem>
                          {formState.titles.map((tit, index) => {
                            if(outSideOrg){
                              return (
                              formState.values.outsideCompanyName
                              ==
                              tit.companyName ? <MenuItem key={index} value={tit.titleName.toUpperCase()}>
                                  {tit.titleName.toUpperCase()}
                                </MenuItem>
                                :""
                              )
                            }else{
                              return (
                                formState.values.companyName
                                ==
                                tit.companyName ? <MenuItem key={index} value={tit.titleName.toUpperCase()}>
                                    {tit.titleName.toUpperCase()}
                                  </MenuItem>
                                  :""
                                )
                            }
                        }
                           )}
                        </TextField>
                        </GridItem>
                        <GridItem
                          xs={12}
                          sm={12}
                          md={6}
                          lg={6}
                          style={{ marginTop: "10px", marginBottom: "10px" }}
                        >
                         <TextField
                          className={classes.textField}
                          error={formState.errors.rejectBehavior === "error"}
                          fullWidth={true}
                          helperText={
                            formState.errors.rejectBehavior === "error"
                              ? "Review Action is required"
                              : null
                          }
                          label="Review Action"
                          // label="Review Action (In case of Objection / Not Approved )"
                          name="rejectBehavior"
                          onChange={(event) => {
                            handleTitleChange(event);
                          }}
                          select
                          value={formState.values.rejectBehavior || ""}
                        >
                          <MenuItem
                            disabled
                            classes={{
                              root: classes.selectMenuItem,
                            }}
                          >
                            Choose Review Action
                          </MenuItem>
                          <MenuItem  value={'stepBack'}>
                                  Step Back
                          </MenuItem>
                          <MenuItem  value={'toInitiator'}>
                                  To Initiator
                          </MenuItem>
                        </TextField>
                        </GridItem>
                        <GridItem
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          style={{ marginTop: "10px", marginBottom: "10px" }}
                        >
                          <Typography>
                            Escalation Steps
                          </Typography>
                        </GridItem>
                        <GridItem
                          xs={12}
                          sm={12}
                          md={6}
                          lg={6}
                          style={{ marginTop: "10px", marginBottom: "10px" }}
                        >
                          <TextField
                            className={classes.textField}
                            error={formState.errors.timeOut === "error"}
                            fullWidth={true}
                            helperText={
                              formState.errors.timeOut === "error"
                                ? "Action Date is required"
                                : null
                            }
                            // label="Action Due Time (If no action taken by user in specified hours) "
                            label="Action Due Time (If no action taken by user in specified hours) "
                            name="timeOut"
                            onChange={(event) => {
                              handleChange(event);
                            }}
                            value={formState.values.timeOut || ""}
                      />
                        </GridItem>
                        <GridItem
                          xs={12}
                          sm={12}
                          md={6}
                          lg={6}
                          style={{ marginTop: "10px", marginBottom: "10px" }}
                        >
                          <TextField
                            className={classes.textField}
                            error={formState.errors.notificationHour === "error"}
                            fullWidth={true}
                            helperText={
                              formState.errors.notificationHour === "error"
                                ? "Reminder (h) is required"
                                : null
                            }
                            label="Reminder Interval (Notify every X hour to user)"
                            name="notificationHour"
                            onChange={(event) => {
                              handleChange(event);
                            }}
                            value={formState.values.notificationHour || ""}
                      />
                        </GridItem>
                    </GridContainer>
                    <React.Fragment>
                      <Button
                        color="info"
                        style={{ float: "right" }}
                        round
                        onClick={addStep}
                      >
                        {"Add Step"}
                      </Button>
                    </React.Fragment>
                    </GridItem>
                    </GridContainer>
                   
                </CardBody>
              </Card>
            </GridItem>
             : ''}
            <GridItem
              xs={12}
              sm={12}
              md={12}
              lg={12}
              style={{ marginTop: "10px", marginBottom: "10px" }}
            >
            {steps.length !== 0 ? <DragAndDropList list={steps} isViewing={isViewing} onChange={reOrderSteps} /> :'' }
            </GridItem>
            <GridItem
              xs={12}
              sm={12}
              md={12}
              lg={12}
              style={{ marginTop: "10px", marginBottom: "10px" }}
            >
            <Button
              onClick={goBack}
              >BACK
              </Button>
                  {!isViewing ?
                    <React.Fragment>
                      <Button
                        color="info"
                        style={{ float: "right" }}
                        round
                        onClick={!Updating ? createWorkflow : ()=>setGetUpdateDescription(true)}
                      >
                        {!Updating ? "Create  Workflow":'Update WorkfLow'}
                      </Button>
                      {isLoading ? <CircularProgress disableShrink /> : ""}
                    </React.Fragment>
                  :''}
          </GridItem>
          </GridContainer>
        </Animated>
      ) : (
        ""
      )}
      {tableView ? (
        <Animated
          animationIn="bounceInRight"
          animationOut="bounceOutLeft"
          animationInDuration={1000}
          animationOutDuration={1000}
          isVisible={animateTable}
        >
          <GridContainer>
            <GridItem xs={12} sm={12} md={12} lg={12}>
              <Card>
                <CardHeader color="info" icon>
                  <CardIcon color="info">
                    <h4 className={classes.cardTitleText}>Filter</h4>
                  </CardIcon>
                </CardHeader>
                <CardBody>
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <TextField
                      className={classes.textField}
                      fullWidth={true}
                      label="Select Organization To See Invoice Processes"
                      name="organizationFilter"
                      onChange={(event) => {
                        handleOrgFilter(event);
                      }}
                      select
                      value={organizationFilter.organizationName || ""}
                    >
                      <MenuItem
                        disabled
                        classes={{
                          root: classes.selectMenuItem,
                        }}
                      >
                        Choose Organization
                      </MenuItem>
                      {formState.orgs.map((org, index) => {
                        return (
                          <MenuItem key={index} value={org.organizationName}>
                            {org.organizationName}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  </GridItem>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={12} lg={12}>
              <Card>
                <CardHeader color="info" icon>
                  <CardIcon color="info">
                    <h4 className={classes.cardTitleText}>Workflow List</h4>
                  </CardIcon>
                  <Button
                    color="danger"
                    round
                    style={{ float: "right" }}
                    className={classes.marginRight}
                    onClick={() => goToForm(true)}
                  >
                    Create Workflow
                  </Button>
                </CardHeader>
                <CardBody>
                  {isLoading ? (
                    <CircularProgress />
                  ) : (
                    <ReactTable
                      data={workflows}
                      sortable={false}
                      columns={[
                        {
                          Header: "Workflow Name",
                          accessor: "workflowName",
                        },
                        {
                          Header: "Organization",
                          accessor: "organizationName",
                        },
                        {
                          Header: "Description",
                          accessor: "comments",
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
      ) : (
        ""
      )}
    </div>
  );
}

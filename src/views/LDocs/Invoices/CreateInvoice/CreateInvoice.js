import React, { useState } from "react";
// @material-ui/core components
import {
  TextField,
  MenuItem,
  makeStyles,
  Slide,
  Dialog,
  DialogContent,
  CircularProgress,
  Typography,
  LinearProgress,
  Tooltip,
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Backdrop,
} from "@material-ui/core";
import Swal from "sweetalert2";
import swal from "sweetalert";
import { Redirect } from "react-router-dom";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import Button from "components/CustomButtons/Button.js";
import axios from "axios";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { Animated } from "react-animated-css";
import jwt from "jsonwebtoken";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import { useDispatch, useSelector } from "react-redux";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Iframe from "react-iframe";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ScanningDocumentAnimation from "components/ScanningDocumentAnimation/ScanningDocumentAnimation";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import Attachments from "./Attachments";
import Items from "./Items";
import { useHistory } from "react-router-dom";

import {
  addZeroes,
  conversionRate,
  successAlert,
  errorAlert,
  msgAlert,
  formatDateTime,
} from "views/LDocs/Functions/Functions";
import { Add, Person, Visibility, VisibilityOff } from "@material-ui/icons";
import Step1 from "../../Vendor/steps/level1";
import { defaultCurrency, VendorSites } from "./GlobalValues";
import FileReceived from "../RecieveInvoice/FileReceived";
import { Autocomplete } from "@material-ui/lab";
import { setIsTokenExpired } from "actions";

const sweetAlertStyle = makeStyles(styles2);

const styles = makeStyles((theme) => ({
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
  cardTitleText: {
    color: "white",
  },
  buttonRight: {},
  table: {
    minWidth: "100%",
  },
  itemName: {
    width: 400,
  },
  itemNumber: {
    width: "55%",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

let pdfInput = React.createRef();

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const getDateFormet = (date) => {
  var today = new Date(date);
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;
  return today;
};

export default function CreateInvoice(props) {
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  const history = useHistory();
  const isAr =
    history.location.pathname.substring(
      history.location.pathname.lastIndexOf("/") + 1
    ) == "ar"
      ? true
      : false;
  const dispatch = useDispatch();
  const { edit, fileData, closeModal } = props;
  const [pdfModal, setPdfModal] = useState(false);
  const [isMarked, setIsMarked] = useState(false);
  const [vendorModal, setVendorModal] = useState(false);
  const [viewFile, setViewFile] = useState(false);
  const [items, setItems] = useState([]);
  const [addingItem, setAddingItem] = useState(false);
  const [file, setFile] = useState(null);
  const [isCreateInvoice, setIsCreateInvoice] = useState(edit ? false : true);
  const [isLoading, setIsLoading] = useState(false);
  const sweetClass = sweetAlertStyle();
  const [editIndex, setEditIndex] = useState(null);
  const [selectedFileModel, setSelectedFileModel] = useState(false);
  const [selectedFile, setSelectedFile] = useState([]);
  const [isSavingInvoice, setIsSavingInvoice] = useState(false);
  const [discountModel, setIsDiscountModel] = useState(false);
  const [taxModal, setIsTaxModal] = useState(false);
  const [category, setCategory] = useState(1);
  const [currencyLookups, setCurrencyLookups] = useState([]);
  const [pos, setPos] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [po, setPO] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [poModal, setPoModal] = useState(false);
  const [receiptModal, setReceiptModal] = useState(false);
  const [showVendor, setShowVendor] = useState(false);
  const [currency, setCurrency] = useState(defaultCurrency);
  const [markAsReceivedModel, setMarkAsReceivedModel] = useState(false);
  const [createPOModel, setCreatePOModel] = useState(false);
  let duedate = new Date();
  let today = new Date();
  let plusDays = 0;
  duedate = duedate.setDate(today.getDate() + plusDays);
  const userDetails = jwt.decode(Token);
  const isVendor = userDetails.isVendor;
  let initialState = {
    conversionRate: 0,
    vendors: [],
    organizations: [],
    attachments: [],
    expenseTypes: [],
    isPo: true,
    isReceipt: false,
    isPeetyCash: false,
    isPrePayment: true,
    isExpense: false,
    selectedOrg: null,
    selectedVendor: null,
    values: {
      invoiceDate: getDateFormet(today),
      InvoiceNumber: "INV-",
      dueDate: getDateFormet(duedate),
      poNumber: "",
      paymentTerms: "NET-",
      currency: "",
      itemName: "",
      inlineExpenseType: "",
      unitCost: 0,
      quantity: 0,
      discount: 0,
      amount: 0,
      additionalDetails: "",
      overallDiscount: 0,
      overallTax: 0,
      notes: "",
      selectedVendor: "",
      subtotal: 0,
      total: 0,
      fileTitle: "",
      fileDescription: "",
      discountType: 1,
      taxType: 1,
      poInline: "",
      expenseType: "",
      receiptNumber: [],
      site: "",
      organizationId: "",
    },
    errors: {
      invoiceDate: "",
      InvoiceNumber: "",
      dueDate: "",
      paymentTerms: "",
      currency: "",
      poNumber: "",
      itemName: "",
      inlineExpenseType: "",
      unitCost: "",
      quantity: "",
      discount: "",
      amount: "",
      site: "",
      additionalDetails: "",
      notes: "",
      selectedVendor: "",
      vendor: "",
      items: "",
      fileTitle: "",
      fileDescription: "",
      poInline: "",
      expenseType: "",
      receiptNumber: "",
      organizationId: "",
    },
  };
  const [formState, setFormState] = useState(initialState);
  const [baseCurrency, setBaseCurrency] = useState(
    !isVendor
      ? userDetails.currency.Currency_Base
      : formState.selectedOrg
      ? formState.selectedOrg.currency
      : ""
  );

  const getLookUp = () => {
    const organizationId = edit
      ? fileData.organizationId
      : !isVendor
      ? userDetails.orgDetail.organizationId
      : formState.values.organizationId;
    //Get Currencies
    if (organizationId) {
      axios({
        method: "get", //you can set what request you want to be
        url: `${process.env.REACT_APP_LDOCS_API_URL}/lookup/GetOrgCurrencies/${organizationId}`,
        headers: {
          cooljwt: Token,
        },
      })
        .then((res) => {
          if (typeof res.data == "object") {
            setCurrencyLookups(res.data.filter((c) => c.isEnabled == true));
          }
        })
        .catch((error) => {
          if (error.response) {
            error.response.status == 401 && dispatch(setIsTokenExpired(true));
          }
          console.log(error);
        });
    }
    //Get ExpenseTypes
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/tenant/getAccounts`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        let account_types = (payload) => {
          return response.data.filter((type) => 
          type.Acc_Type == payload
        )};

        setFormState((formState) => ({
          ...formState,
          expenseTypes: !isAr ? account_types("Expenses").concat(account_types("Liabilities")) : account_types("Revenue").concat(account_types("Assets")),
        }));
      })
      .catch((error) => {
        if (error.response) {
          error.response.status == 401 && dispatch(setIsTokenExpired(true));
        }
        console.log(error);
      });

    // axios({
    //   method: "get", //you can set what request you want to be
    //   url: `${process.env.REACT_APP_LDOCS_API_URL}/lookup/getLookups/3`,
    //   headers: {
    //     cooljwt: Token,
    //   },
    // })
    //   .then((response) => {
    //     setFormState((formState) => ({
    //       ...formState,
    //       expenseTypes: response.data.result,
    //     }));
    //   })
    //   .catch((error) => {
    //     if (error.response) {
    //       error.response.status == 401 && dispatch(setIsTokenExpired(true));
    //     }
    //     console.log(error);
    //   });
  };
  const getPos = (orgId) => {
    const userDetails = jwt.decode(Token);
    axios({
      method: "post", //you can set what request you want to be
      url: isAr
        ? `${process.env.REACT_APP_LDOCS_API_URL}/po/getPoAR`
        : `${process.env.REACT_APP_LDOCS_API_URL}/po/getPoc`,
      data: {
        organizationId: isVendor
          ? formState.selectedOrg
            ? formState.selectedOrg.organizationId
            : orgId
          : userDetails.orgDetail.organizationId,
        vendorId: isVendor ? userDetails.id : formState.selectedVendor,
      },
      headers: {
        cooljwt: Token,
      },
    })
      .then((res) => {
        setPos(res.data.result ? res.data.result : res.data ? res.data : []);
      })
      .catch((error) => {
        if (error.response) {
          error.response.status == 401 && dispatch(setIsTokenExpired(true));
        }
        console.log(error);
        setPos([]);
      });
  };

  const getReceipts = (p) => {
    //p = PO Number
    const userDetails = jwt.decode(Token);
    axios({
      method: "post", //you can set what request you want to be
      url: isAr
        ? `${process.env.REACT_APP_LDOCS_API_URL}/po/getReceiptsAr`
        : `${process.env.REACT_APP_LDOCS_API_URL}/po/getReceipts`,
      data: {
        poNumber: p,
        organizationId: isVendor
          ? formState.selectedOrg.organizationId || null
          : userDetails.orgDetail.organizationId,
        vendorId: isVendor ? userDetails.id : formState.selectedVendor,
        clientId: isVendor ? userDetails.id : formState.selectedVendor,
      },
      headers: {
        cooljwt: Token,
      },
    })
      .then((res) => {
        setReceipts(res.data);
      })
      .catch((error) => {
        if (error.response) {
          error.response.status == 401 && dispatch(setIsTokenExpired(true));
        }
        console.log(error);
        setReceipts([]);
      });
  };
  const classes = styles();
  const handleChange = (event) => {
    event.persist();
    if (event.target.name == "invoiceType") {
      if (event.target.value == "isReceipt") {
        setFormState((formState) => ({
          ...formState,
          isReceipt: true,
          isPrePayment: false,
          isPeetyCash: false,
        }));
      }
      if (event.target.value == "isPeetyCash") {
        setFormState((formState) => ({
          ...formState,
          isReceipt: false,
          isPrePayment: false,
          isPeetyCash: true,
          isPo: false,
          isExpense: false,
        }));
      }
      if (event.target.value == "isPrePayment") {
        setFormState((formState) => ({
          ...formState,
          isReceipt: false,
          isPrePayment: true,
          isPeetyCash: false,
        }));
      }
    }
    if (event.target.name == "isPo") {
      setFormState((formState) => ({
        ...formState,
        isPo: event.target.value == "isPo" && !formState.isPo,
        isExpense: event.target.value == "isExpense" && !formState.isExpense,
      }));
    }
    if (event.target.name == "poNumber") {
      let po = pos.find((po) => po.poNumber == event.target.value);
      if (po) {
        setFormState((formState) => ({
          ...formState,
          values: {
            ...formState.values,
            paymentTerms: `NET-${po.paymentTerm.split(" ")[1]}`,
          },
        }));
      }
      if (!isVendor) {
        getReceipts(event.target.value);
      }
    }

    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value,
      },
    }));
  };

  const createReceipts = () => {
    const Check = require("is-null-empty-or-undefined").Check;
    if (Check(formState.selectedVendor) || Check(formState.values.poNumber)) {
      errorAlert(
        `Please Select Valid ${isAr ? "Customer" : "Vendor"} and PO Number`
      );
    } else {
      const userDetails = jwt.decode(Token);
      axios({
        method: "post", //you can set what request you want to be
        url: isAr
          ? `${process.env.REACT_APP_LDOCS_API_URL}/po/submitReceiptAR`
          : `${process.env.REACT_APP_LDOCS_API_URL}/po/submitReceipt`,
        data: {
          receiptDate: new Date(),
          organizationId: userDetails.orgDetail.organizationId,
          vendorId: formState.selectedVendor,
          clientId: formState.selectedVendor,
          poNumber: formState.values.poNumber,
          receivedBy: userDetails.email,
        },
        headers: {
          cooljwt: Token,
        },
      })
        .then((res) => {
          setReceipts(res.data);

          successAlert("Receipt Has Been Generated");
        })
        .catch((error) => {
          if (error.response) {
            error.response.status == 401 && dispatch(setIsTokenExpired(true));
          }
          console.log(error);
          errorAlert("Unable To Generate RECEIPT.");
        });
    }
  };

  const createPO = () => {
    const Check = require("is-null-empty-or-undefined").Check;
    if (Check(formState.selectedVendor) || Check(formState.values.poNumber)) {
      errorAlert(
        `Please Select Valid ${isAr ? "Customer" : "Vendor"} and PO Number`
      );
    } else {
      const userDetails = jwt.decode(Token);
      // axios({
      //   method: "post", //you can set what request you want to be
      //   url: `${process.env.REACT_APP_LDOCS_API_URL}/po/submitReceipt`,
      //   data: {
      //     receiptDate: new Date(),
      //     organizationId: userDetails.orgDetail.organizationId,
      //     vendorId: formState.selectedVendor,
      //     poNumber: formState.values.poNumber,
      //     receivedBy: userDetails.email,
      //   },
      //   headers: {
      //     cooljwt: Token,
      //   },
      // })
      //   .then((res) => {
      //     setReceipts(res.data);

      successAlert("PO Has Been Generated");
      // })
      // .catch((error) => {
      //   if (error.response) {
      //     error.response.status == 401 && dispatch(setIsTokenExpired(true));
      //   }
      //   console.log(error);
      //   errorAlert("Unable To Generate RECEIPT.");
      // });
    }
  };

  const closeMarkAsReceivedModel = async () => {
    setIsSavingInvoice(false);
    const userData = jwt.decode(Token);
    await setMarkAsReceivedModel(false);
    if (props.loadFiles) {
      await props.loadFiles(userData, false);
    }
    // setIsMarked(true);
  };
  const removeAttachment = (fileIndex) => {
    let attachments = formState.attachments.filter(
      (a, index) => index !== fileIndex
    );
    setFormState((formState) => ({
      ...formState,
      attachments: attachments,
    }));
  };
  const removeItem = (itemIndex) => {
    let item = items.filter((a, index) => index !== itemIndex);
    setItems(item);
  };
  const handleEditItem = (item, index) => {
    setEditIndex(index);
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        itemName: item.itemName,
        unitCost: item.unitCost,
        quantity: item.quantity,
        discount: item.discount,
        poInline: item.poInline,
        inlineExpenseType: item.expenseType,
        receiptNumber: item.receiptNumber,
        additionalDetails: item.additionalDetails,
      },
    }));
    setCategory(item.category || 1);
  };
  const getFileDetails = () => {
    Object.entries(selectedFile).map(async ([key, value]) => {
      if (value.type == "image/png" || "image/jpeg" || "application/pdf") {
        let reader = new FileReader();
        reader.onloadend = () => {
          setFormState((formState) => ({
            ...formState,
            attachments: [
              ...formState.attachments,
              {
                name: value.name,
                base64: reader.result,
                type: value.type,
                attachmentTitle: formState.values.fileTitle,
                attachmentPath: "",
                file: value,
                title: formState.values.fileTitle,
                description: formState.values.fileDescription,
              },
            ],
          }));
          setSelectedFileModel(false);
          successAlert("File Added Successfully.");
        };
        reader.readAsDataURL(value);
        setTimeout(() => {
          setFormState((formState) => ({
            ...formState,
            values: {
              ...formState.values,
              fileTitle: "",
              fileDescription: "",
            },
          }));
        }, 500);
      }
    });
  };
  const handleAttachmentChange = (e) => {
    e.preventDefault();
    let files = e.target.files;
    setSelectedFile(files);
    setSelectedFileModel(true);
  };
  const handlePdfChange = (e) => {
    console.log(e);
    e.preventDefault();
    setPdfModal(true);
    let file = e.target.files[0];
    let formData = new FormData();
    formData.append("file", file);
    formData.append("document_type_name", "app_template");
    formData.append("line_items", true);
    axios({
      method: "POST",
      url: "https://developers.typless.com/api/document-types/extract-data/",
      data: formData,
      headers: {
        "Content-Type": "multipartform-data",
        Authorization: "Token 502d48bcf4d44915b41e2c4c53b30794",
      },
    })
      .then(async (result) => {
        if (result.details) {
          errorAlert(result.details);
        } else {
          setPdfModal(false);
          let invoice_number = "",
            invoice_date = {},
            invoice_duedate = "",
            invoice_companyname = "",
            invoice_companyowner = "",
            invoice_companyaddress = "",
            invoice_companycity = "",
            invoice_companycountry = "",
            invoice_customername = "",
            invoice_customeraddress = "",
            invoice_customeraddress2 = "",
            invoice_customercity = "",
            invoice_customercountry = "",
            invoice_lineitems = [],
            invoice_subtotal = "0",
            invoice_total = "0",
            invoice_tax = "0",
            invoice_supplier = "";

          result.data.extracted_fields &&
            result.data.extracted_fields.forEach((item, index) => {
              switch (item.name) {
                case "invoice_companyname":
                  invoice_companyname = item.values[0].value
                    ? item.values[0].value
                    : "";
                  break;

                case "invoice_customername":
                  invoice_customername = item.values[0].value
                    ? item.values[0].value
                    : "";
                  break;

                case "invoice_customercity":
                  invoice_customercity = item.values[0].value
                    ? item.values[0].value
                    : "";
                  break;

                case "invoice_companyowner":
                  invoice_companyowner = item.values[0].value
                    ? item.values[0].value
                    : "";
                  break;

                case "invoice_customercountry":
                  invoice_customercountry = item.values[0].value
                    ? item.values[0].value
                    : "";
                  break;

                case "invoice_number":
                  invoice_number = item.values[0].value
                    ? item.values[0].value
                    : "";
                  break;

                case "invoice_companycity":
                  invoice_companycity = item.values[0].value
                    ? item.values[0].value
                    : "";
                  break;

                case "invoice_customeraddress":
                  invoice_customeraddress = item.values[0].value
                    ? item.values[0].value
                    : "";
                  break;

                case "invoice_companyaddress":
                  invoice_companyaddress = item.values[0].value
                    ? item.values[0].value
                    : "";
                  break;

                case "invoice_tax":
                  invoice_tax = item.values[0].value
                    ? item.values[0].value
                    : "";
                  break;

                case "invoice_date":
                  invoice_date = item.values[0].value
                    ? item.values[0].value
                    : "";
                  break;

                case "invoice_companycountry":
                  invoice_companycountry = item.values[0].value
                    ? item.values[0].value
                    : "";
                  break;

                case "invoice_duedate":
                  invoice_duedate = item.values[0].value
                    ? item.values[0].value
                    : "";
                  break;

                case "invoice_subtotal":
                  invoice_subtotal = item.values[0].value
                    ? item.values[0].value
                    : "";
                  break;

                case "Supplier":
                  invoice_supplier = item.values[0].value
                    ? item.values[0].value
                    : "";
                  break;

                default:
                  break;
              }
            });

          invoice_total = (
            parseFloat(invoice_subtotal) + parseFloat(invoice_tax)
          ).toString();
          invoice_customeraddress2 = invoice_customercity
            ? invoice_customercity
            : "" + ", " + invoice_customercountry
            ? invoice_customercountry
            : "";

          //Getting Line Items
          result.data.line_items &&
            result.data.line_items.forEach((item, index) => {
              let obj = {
                key: Date.now() + Math.floor(Math.random() * 9999),
                itemName: item[0].values[0].value
                  ? item[0].values[0].value
                  : "",
                quantity: item[1].values[0].value
                  ? item[1].values[0].value
                  : "",
                unitCost: item[2].values[0].value
                  ? addZeroes(item[2].values[0].value)
                  : "",
                unitCost_bc: conversionRate(
                  formState.values.currency,
                  baseCurrency,
                  currencyLookups,
                  item[2].values[0].value ? item[2].values[0].value : 0,
                  true
                ),
                amount: item[3].values[0].value
                  ? addZeroes(item[3].values[0].value)
                  : "",
                amount_bc: conversionRate(
                  formState.values.currency,
                  baseCurrency,
                  currencyLookups,
                  item[3].values[0].value ? item[3].values[0].value : 0,
                  true
                ),
                originalamount: item[3].values[0].value
                  ? item[3].values[0].value
                  : "",
                discount: "0",
                additionalDetails: "",
                receiptNumber: [],
              };
              invoice_lineitems.push(obj);
            });

          if (
            invoice_number == "" ||
            invoice_duedate == "" ||
            invoice_total == ""
          ) {
            errorAlert(
              "The Picture/Document is not a valid Invoice. Please try with correct Invoice"
            );
          } else {
            const userData = jwt.decode(Token);
            let invoice_data = {
              invoiceData: result,
              invoice_number: invoice_number,
              invoice_date: invoice_date,
              invoice_duedate: invoice_duedate,
              invoice_companyname: invoice_companyname,
              invoice_companyowner: invoice_companyowner,
              invoice_companyaddress: invoice_companyaddress,
              invoice_companycity: invoice_companycity,
              invoice_companycountry: invoice_companycountry,
              invoice_customername: invoice_customername,
              invoice_customeraddress: invoice_customeraddress,
              invoice_customeraddress2: invoice_customeraddress2,
              invoice_customercity: invoice_customercity,
              invoice_customercountry: invoice_customercountry,
              invoice_lineitems: invoice_lineitems,
              invoice_subtotal: invoice_subtotal,
              invoice_total: invoice_total,
              invoice_tax: invoice_tax,
              invoice_supplier: invoice_supplier,
            };
            let vendor = formState.vendors
              ? formState.vendors.find(
                  (v) => v.level1.vendorName == invoice_companyowner
                )
              : null;
            let vendorId = !isVendor
              ? vendor
                ? vendor._id
                : null
              : userData.id;
            setFormState((formState) => ({
              ...formState,
              selectedVendor: !isVendor ? vendorId || null : null,
              values: {
                ...formState.values,
                invoiceDate: invoice_date,
                dueDate: invoice_duedate,
                overallTax: addZeroes(invoice_tax),
                selectedVendor: !isVendor && vendor ? vendor : null,
              },
            }));

            //AddFileInAttachments
            let reader = new FileReader();
            reader.onloadend = () => {
              setFormState((formState) => ({
                ...formState,
                attachments: [
                  ...formState.attachments,
                  {
                    name: file.name,
                    base64: reader.result,
                    type: file.type,
                    attachmentTitle: "ORIGNAL INVOICE",
                    attachmentPath: "",
                    file: file,
                    title: "ORIGNAL INVOICE",
                    description: "OCR FILE USED FOR DATA EXTRACTING..",
                  },
                ],
              }));
            };
            reader.readAsDataURL(file);
            setItems(invoice_lineitems);
            //Get PO's
            getPos();
            successAlert("Extracted Data Successfully.");
          }
        }
      })
      .catch((error) => {
        // if (error.response) {  error.response.status == 401 && dispatch(setIsTokenExpired(true)) };
        console.log(error);
        errorAlert("There is some issue in Api");
        setPdfModal(false);
      });
  };

  const selectVendor = () => {
    let selectedVendor;
    let site;
    let organizationId;
    const Check = require("is-null-empty-or-undefined").Check;
    var error = false;
    if (!isVendor) {
      if (!Check(formState.selectedVendor)) {
        selectedVendor = "success";
      } else {
        selectedVendor = "error";
        error = true;
      }
      if (!Check(formState.values.site)) {
        site = "success";
      } else {
        site = "error";
        error = true;
      }
      setFormState((formState) => ({
        ...formState,
        errors: {
          ...formState.errors,
          selectedVendor: selectedVendor,
          site: site,
        },
      }));
    } else {
      if (!Check(formState.values.organizationId)) {
        organizationId = "success";
      } else {
        organizationId = "error";
        error = true;
      }
    }
    if (error) {
      return false;
    } else {
      getLookUp();
      getPos();
      setBaseCurrency(
        !isVendor
          ? userDetails.currency.Currency_Base
          : formState.selectedOrg.currency
      );
      setVendorModal(false);
      console.log(formState.selectedOrg);
      if (isVendor) {
        setFormState((formState) => ({
          ...formState,
          values: {
            ...formState.values,
            currency: formState.selectedOrg.currency,
          },
        }));
      }
    }
  };

  const updateTotal = () => {
    let grossAmt = items.reduce(function(sum, current) {
      return sum + parseFloat(current.amount);
    }, 0);
    let totalAmt =
      parseFloat(
        items.reduce(function(sum, current) {
          return sum + parseFloat(current.amount);
        }, 0)
      ) +
      parseFloat(
        formState.values.taxType === 1
          ? formState.values.overallTax
          : (grossAmt * formState.values.overallTax) / 100
      ) -
      parseFloat(
        formState.values.discountType === 1
          ? formState.values.overallDiscount
          : (grossAmt * formState.values.overallDiscount) / 100
      );
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        total: totalAmt,
        subtotal: grossAmt,
      },
    }));
  };
  //On Currency Currency
  React.useEffect(() => {
    const choosedCurrency =
      currencyLookups.find((l) => l._id == formState.values.currency) ||
      defaultCurrency;
    setCurrency(choosedCurrency);
    if (!edit) {
      const UItems = items.map((i) => {
        let j = {
          ...i,
          amount_bc: conversionRate(
            formState.values.currency,
            baseCurrency,
            currencyLookups,
            parseFloat(i.amount),
            false
          ),
          unitCost_bc: conversionRate(
            formState.values.currency,
            baseCurrency,
            currencyLookups,
            parseFloat(i.unitCost),
            false
          ),
          discountAmt_bc: conversionRate(
            formState.values.currency,
            baseCurrency,
            currencyLookups,
            parseFloat(i.discount),
            false
          ),
        };
        return j;
      });
      setItems(UItems);
    }
  }, [formState.values.currency, currencyLookups]);
  //Update Total
  React.useEffect(() => {
    updateTotal();
  }, [
    items,
    formState.values.overallDiscount,
    formState.values.overallTax,
    formState.values.taxType,
    formState.values.discountType,
  ]);
  //On Change Vendor
  React.useEffect(() => {
    if (
      formState.values.selectedVendor &&
      typeof formState.values.selectedVendor === "object" &&
      !edit &&
      !isVendor
    ) {
      setFormState((formState) => ({
        ...formState,
        values: {
          ...formState.values,
          InvoiceNumber: `INV-${formState.values.selectedVendor.invoiceCount +
            1}`,
        },
      }));
    }
  }, [formState.values.selectedVendor]);

  const getData = (is_ar) => {
    setIsLoading(true);
    window.scrollTo(0, 0);
    const userDetails = jwt.decode(Token);
    if (!isVendor) {
      const userCurrency = userDetails.currency.Currency_Base;
      axios({
        method: "get",
        url: is_ar
          ? `${process.env.REACT_APP_LDOCS_API_URL}/AR/clientByOrganization/${userDetails.orgDetail.organizationId}`
          : `${process.env.REACT_APP_LDOCS_API_URL}/vendor/vendorsByOrganization/${userDetails.orgDetail.organizationId}`,
        headers: { cooljwt: Token },
      })
        .then(async (response) => {
          setFormState((formState) => ({
            ...formState,
            selectedVendor: "",
            vendors: response.data,
            values: {
              ...formState.values,
              selectedVendor: "",
              site: "",
              currency: userCurrency,
            },
          }));
          if (edit) {
            setInvoice(null, response.data);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          if (error.response) {
            error.response.status == 401 && dispatch(setIsTokenExpired(true));
          }
          console.log(error);
        });
    } else {
      if (!edit) {
        axios({
          method: "get", //you can set what request you want to be
          url: `${process.env.REACT_APP_LDOCS_API_URL}/vendor/getInvoiceCount`,
          headers: {
            cooljwt: Token,
          },
        })
          .then((response) => {
            setFormState((formState) => ({
              ...formState,
              values: {
                ...formState.values,
                InvoiceNumber: `INV-${response.data.result.invoiceCount + 1}`,
              },
            }));
          })
          .catch((error) => {
            if (error.response) {
              error.response.status == 401 && dispatch(setIsTokenExpired(true));
            }
            console.log(error);
          });
      }
      axios({
        method: "get", //you can set what request you want to be
        url: `${process.env.REACT_APP_LDOCS_API_URL}/vendor/organizationByVender`,
        headers: {
          cooljwt: Token,
        },
      })
        .then((response) => {
          let orgs = response.data.organizations;
          setFormState((formState) => ({
            ...formState,
            organizations: orgs,
          }));
          setInvoice(orgs, null);
        })
        .catch((error) => {
          if (error.response) {
            error.response.status == 401 && dispatch(setIsTokenExpired(true));
          }
          console.log(error);
        });
    }
    getLookUp();
  };

  //On Load Component
  React.useEffect(() => {
    getData(isAr);
  }, []);

  const setInvoice = (orgs, vendors) => {
    if (edit) {
      orgs = orgs ? orgs : formState.organizations;
      vendors = vendors ? vendors : formState.vendors;
      let org = orgs.find((o) => o.organizationId == fileData.organizationId);
      let client = isVendor
        ? null
        : vendors.find((v) => v._id == fileData.clientId);
      let vendor = isVendor
        ? null
        : vendors.find((v) => v._id == fileData.vendorId);
      getLookUp();
      setFormState((formState) => ({
        ...formState,
        selectedVendor: isAr ? fileData.clientId : fileData.vendorId,
        isPo: fileData.isPo,
        isReceipt: fileData.isReceipt,
        isPeetyCash: fileData.isPettyCash,
        isPrePayment: fileData.isPrePayment,
        isExpense: fileData.isExpense,
        values: {
          ...formState.values,
          InvoiceNumber: fileData.invoiceId,
          site: isAr ? fileData.clientSite : fileData.vendorSite,
          invoiceDate: getDateFormet(fileData.createdDate),
          notes: fileData.description,
          taxType: 1,
          overallTax: fileData.taxAmt,
          isExpense: fileData.isExpense,
          discountType: 1,
          overallDiscount: fileData.discountAmt,
          organizationId: fileData.organizationId,
          paymentTerms: `NET-${fileData.paymentTerms}`,
          poNumber: fileData.po,
          selectedVendor: isAr ? client : vendor,
          expenseType: fileData.expenseType,
          currency: fileData.FC_currency._id || "",
        },
        selectedOrg: isVendor ? org || null : null,
        conversionRate: fileData.conversionRate || 0,
      }));

      var invoice_items = fileData.items.map((item) => {
        const i = {
          additionalDetails: item.additionalDetails,
          amount: item.amount,
          amount_bc: item.amount_bc,
          discount: item.discount,
          discount_bc: item.discount_bc,
          itemName: item.itemName,
          quantity: item.quantity,
          unitCost: item.unitCost,
          unitCost_bc: item.unitCost_bc,
          receiptNumber: item.receiptNumber,
          category: parseInt(item.category),
          poInline: item.poInline,
          expenseType: item.expenseType,
        };
        return i;
      });
      setItems(invoice_items);
      var invoice_attachments = fileData.attachments.map((att) => {
        const a = {
          name: att.name,
          base64: `${process.env.REACT_APP_LDOCS_API_URL}/${att.attachmentPath}`,
          type: att.attachmentPath.split(".").pop(),
          attachmentTitle: att.attachmentTitle,
          attachmentPath: `${process.env.REACT_APP_LDOCS_API_URL}/${att.attachmentPath}`,
          file: null,
          title: att.fileTitle,
          description: att.fileDescription,
        };
        return a;
      });

      setFormState((formState) => ({
        ...formState,
        attachments: invoice_attachments,
      }));
      setBaseCurrency(fileData.LC_currency._id);
      // setCurrency(currencyLookups.find(c=>c._id == fileData.FC_currency._id ));
      getPos(fileData.organizationId);
      if (!isVendor) {
        getReceipts(fileData.po);
      }
      setIsCreateInvoice(true);
    }
  };
  const viewPO = () => {
    let po = pos.find(
      (po) =>
        po.poNumber == formState.values.poInline || formState.values.poNumber
    );
    if (po) {
      setPO([
        { name: "Date of Issue", value: formatDateTime(po.dateOfIssue) },
        { name: "Payment Terms", value: po.paymentTerm },
        { name: "Date of Expiry", value: formatDateTime(po.dateOfExpiry) },
        {
          name: "PO Amount:",
          value: `${"SAR" + addZeroes(po.poAmount)}`,
        },
        { name: "Partial Delivery:", value: po.partialDelivery ? "YES" : "NO" },
      ]);
      setPoModal(true);
    }
  };

  const viewReceipt = () => {
    let receipt = receipts.find(
      (re) => re.receiptNumber == formState.values.receiptNumber
    );
    if (receipt) {
      setReceipt([
        { name: "Receipt Number", value: receipts.receiptNumber },
        { name: "Vendor ID", value: receipts.vendorId },
        { name: "Organization ID", value: receipts.organizationId },
        { name: "Receipt Date", value: formatDateTime(receipts.receiptDate) },
        { name: "PO Number", value: formatDateTime(receipts.poNumber) },
        { name: "Request By", value: formatDateTime(receipts.receivedBy) },
      ]);
      setReceiptModal(true);
    }
  };

  const openVendorModal = () => {
    setFormState((formState) => ({
      ...formState,
      selectedVendor: "",
      selectedOrg: "",
      values: {
        ...formState.values,
        selectedVendor: "",
        site: "",
        organizationId: "",
      },
    }));
    setVendorModal(true);
  };
  const closepdfModal = () => {
    setPdfModal(false);
  };
  const handleVendorChange = (event) => {
    event.persist();
    if (isVendor) {
      let selectedOrg = formState.organizations.find(
        (o) => o.organizationId == event.target.value
      );
      setFormState((formState) => ({
        ...formState,
        selectedOrg: selectedOrg,
        values: {
          ...formState.values,
          organizationId: event.target.value,
          currency: selectedOrg.currency,
        },
      }));
    } else {
      let selectedVendor = formState.vendors.find(
        (v) => v._id == event.target.value
      );
      setFormState((formState) => ({
        ...formState,
        selectedVendor: event.target.value,
        values: {
          ...formState.values,
          selectedVendor: selectedVendor,
        },
      }));
    }
  };
  const viewFileHandler = (file) => {
    console.log(file);
    setIsCreateInvoice(false);
    setFile(file);
    setViewFile(true);
  };
  const closeViewFile = () => {
    setViewFile(false);
    setFile(null);
    setIsCreateInvoice(true);
  };
  const addInvoiceItem = () => {
    //Clearing State
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        itemName: "",
        unitCost: 0,
        quantity: 0,
        inlineExpenseType: "",
        receiptNumber: [],
        poInline: "",
        discount: 0,
        amount: 0,
        additionalDetails: "",
      },
      errors: {
        ...formState.errors,
        itemName: "",
        unitCost: "",
        quantity: "",
        discount: "",
        amount: "",
        inlineExpenseType: "",
        receiptNumber: "",
        poInline: "",
        additionalDetails: "",
      },
    }));
    //Open Inline Model ...
    setAddingItem(true);
  };
  const addItem = () => {
    //Adding Item to Invoice
    let itemName;
    let unitCost;
    let quantity;
    let discount;
    let additionalDetails;
    let expenseType;
    let receiptNumber;
    let poInline;
    const Check = require("is-null-empty-or-undefined").Check;
    var error = false;

    if (!Check(formState.values.itemName)) {
      itemName = "success";
    } else {
      itemName = "error";
      error = true;
    }
    if (!Check(formState.values.unitCost)) {
      unitCost = "success";
    } else {
      unitCost = "error";
      error = true;
    }
    if (!Check(formState.values.quantity)) {
      quantity = "success";
    } else {
      quantity = "error";
      error = true;
    }
    // if (!Check(formState.values.discount)) {
    //   discount = "success";
    // } else {
    //   discount = "error";
    //   error = true;
    // }
    if (formState.isPeetyCash) {
      if (!Check(formState.values.inlineExpenseType)) {
        expenseType = "success";
      } else {
        expenseType = "error";
        error = true;
      }
    }
    if (!isVendor && formState.isReceipt && formState.isPo) {
      if (!Check(formState.values.receiptNumber)) {
        receiptNumber = "success";
      } else {
        receiptNumber = "error";
        error = true;
      }
    }

    setFormState((formState) => ({
      ...formState,
      errors: {
        ...formState.errors,
        itemName: itemName,
        unitCost: unitCost,
        quantity: quantity,
        discount: discount,
        inlineExpenseType: expenseType,
        // poInline: poInline,
        receiptNumber: receiptNumber,
        additionalDetails: additionalDetails,
      },
    }));
    if (error) {
      return false;
    } else {
      const amount =
        parseFloat(formState.values.unitCost) *
          parseFloat(formState.values.quantity) -
        parseFloat(
          (formState.values.unitCost * formState.values.discount) / 100
        ) *
          formState.values.quantity;
      const item = {
        itemName: formState.values.itemName,
        unitCost: formState.values.unitCost,
        quantity: formState.values.quantity,
        discount: formState.values.discount,
        poInline: formState.values.poInline,
        expenseType: formState.values.inlineExpenseType,
        category: category,
        receiptNumber: formState.values.receiptNumber,
        unitCost_bc: conversionRate(
          formState.values.currency,
          baseCurrency,
          currencyLookups,
          parseFloat(formState.values.unitCost),
          true,
          edit,
          formState.conversionRate
        ),
        amount_bc: conversionRate(
          formState.values.currency,
          baseCurrency,
          currencyLookups,
          parseFloat(amount),
          true,
          edit,
          formState.conversionRate
        ),
        amount: amount,
        additionalDetails: formState.values.additionalDetails,
      };
      //Editing
      if (editIndex !== null) {
        let newItems = items;
        newItems[editIndex] = item;
        setItems(newItems);
        setEditIndex(null);
        updateTotal();
      } else {
        setItems([...items, item]);
        setAddingItem(false);
      }
    }
  };

  const openPopup = () => {
    let invoiceDate;
    let InvoiceNumber;
    let dueDate;
    let vendor;
    let item;
    let currency;
    let poNumber;
    let receiptNumber;
    let paymentTerms;
    const Check = require("is-null-empty-or-undefined").Check;
    var error = false;

    if (!Check(formState.values.invoiceDate)) {
      invoiceDate = "success";
    } else {
      invoiceDate = "error";
      error = true;
    }
    if (!Check(formState.values.InvoiceNumber)) {
      InvoiceNumber = "success";
    } else {
      InvoiceNumber = "error";
      error = true;
    }
    if (!Check(formState.values.dueDate)) {
      dueDate = "success";
    } else {
      dueDate = "error";
      error = true;
    }
    // if (!Check(formState.values.poNumber)) {
    //   poNumber = "success";
    // } else {
    //   poNumber = "error";
    //   error = true;
    // }
    if (!isVendor && formState.isPo && formState.isReceipt) {
      if (items.filter((i) => i.receiptNumber.length < 1).length > 0) {
        item = "error";
        error = true;
      } else {
        item = "success";
      }
    }
    if (isVendor) {
      if (!Check(formState.values.organizationId)) {
        vendor = "success";
      } else {
        vendor = "error";
        error = true;
      }
    } else {
      if (!Check(formState.selectedVendor)) {
        vendor = "success";
      } else {
        vendor = "error";
        error = true;
      }
    }
    if (!Check(formState.values.currency)) {
      currency = "success";
    } else {
      currency = "error";
      error = true;
    }
    if (formState.isPo) {
      if (!Check(formState.values.paymentTerms.split("-")[1])) {
        paymentTerms = "success";
      } else {
        paymentTerms = "error";
        error = true;
      }
    }

    setFormState((formState) => ({
      ...formState,
      errors: {
        ...formState.errors,
        invoiceDate: invoiceDate,
        InvoiceNumber: InvoiceNumber,
        dueDate: dueDate,
        vendor: vendor,
        items: item,
        // receiptNumber: receiptNumber,
        poNumber: poNumber,
        currency: currency,
        paymentTerms: paymentTerms,
      },
    }));
    if (error) {
      if (item == "error") {
        errorAlert("There is Something Missing in Line Items ..");
      } else {
        errorAlert("Missing Data ..");
      }
      setIsSavingInvoice(false);
      return false;
    } else {
      if (edit && !isVendor && !isAr) {
        setMarkAsReceivedModel(true);
      } else {
        createInvoice();
      }
    }
  };

  const createInvoice = () => {
    return new Promise((res, rej) => {
      //Creating Invoice
      setIsSavingInvoice(true);
      const isEdit = props.editHandler == 1 ? true : false;
      const userData = jwt.decode(Token);
      let userCurrency;
      if (isVendor && formState.selectedOrg) {
        userCurrency = currencyLookups.find(
          (l) => l._id == formState.selectedOrg.currency
        );
      } else if (userData.currency && !isVendor) {
        userCurrency = currencyLookups.find(
          (l) => l._id == userData.currency.Currency_Base
        );
      } else {
        userCurrency = defaultCurrency;
      }
      let po = pos.find((po) => po.poNumber == formState.values.poNumber);
      let taxPercent =
        formState.values.taxType === 1
          ? (formState.values.overallTax * 100) / formState.values.subtotal
          : formState.values.overallTax;
      let discountPercent =
        formState.values.discountType === 1
          ? (formState.values.overallDiscount * 100) / formState.values.subtotal
          : formState.values.overallDiscount;
      let taxAmt =
        formState.values.taxType === 2
          ? (formState.values.subtotal * formState.values.overallTax) / 100
          : formState.values.overallTax;
      let discountAmt =
        formState.values.discountType === 2
          ? (formState.values.subtotal * formState.values.overallDiscount) / 100
          : formState.values.overallDiscount;
      let formData = {
        invoiceId: formState.values.InvoiceNumber,
        invoiceDate: formState.values.invoiceDate,
        dueDate: formState.values.dueDate,
        grossAmt: formState.values.subtotal,
        discountPercent: discountPercent,
        discountAmt: discountAmt,
        taxAmt: taxAmt,
        taxPercent: taxPercent,
        invoice_details: formState.values.notes,
        netAmt: formState.values.total,
        ref: formState.values.poNumber,
        tenantId: isVendor ? formState.selectedOrg.tenantId : userData.tenantId,
        organizationId: isVendor
          ? formState.selectedOrg.organizationId
          : userData.orgDetail.organizationId,
        organizationName: isVendor
          ? formState.selectedOrg.organizationName
          : userData.orgDetail.organization,
        contactPerson: isVendor
          ? null
          : formState.values.selectedVendor.level1.contactPerson,
        createdBy:
          edit && isVendor
            ? userData.email
            : edit
            ? fileData.createdBy
            : userData.email,
        balanceDue: conversionRate(
          formState.values.currency,
          baseCurrency,
          currencyLookups,
          parseFloat(formState.values.total),
          true,
          edit,
          formState.conversionRate
        ),
        items: items,
        attachments: formState.attachments,
        vendorName: isAr
          ? null
          : isVendor
          ? userData.name
          : formState.values.selectedVendor.level1.vendorName,
        vendorId: isAr
          ? null
          : isVendor
          ? userData.id
          : formState.values.selectedVendor._id,
        vendorSite: isAr ? null : isVendor ? "" : formState.values.site,
        clientName: isAr
          ? formState.values.selectedVendor.level1.clientName
          : null,
        clientId: isAr ? formState.values.selectedVendor._id : null,
        clientSite: formState.values.site,
        version: fileData ? fileData.version : "",
        isAR: isAr,
        invoicePath: fileData ? fileData.invoicePath : "",
        FC_currency: currencyLookups.find(
          (l) => l._id == formState.values.currency
        ),
        LC_currency: userCurrency,
        conversionRate: currencyLookups.find(
          (l) => l._id == formState.values.currency
        ).conversionRate,
        description: formState.values.notes,
        createdByVendor: edit
          ? fileData.createdByVendor
          : isVendor
          ? true
          : false,
        po: formState.values.poNumber,
        // receiptNumber: formState.values.receiptNumber,
        paymentTerms: formState.values.paymentTerms.split("-")[1],
        isPo: isAr ? formState.isPo : po ? formState.isPo : false,
        isReceipt: formState.isPo ? formState.isReceipt : false,
        requesterId: isVendor ? (po ? po.requesterId : null) : userData.email,
        expenseType: formState.values.expenseType,
        isPettyCash: formState.isPeetyCash,
        isPrePayment: formState.isPrePayment,
        isExpense: formState.isExpense,
        createdDate: new Date()
          .toLocaleString()
          .replace(/t/, " ")
          .replace(/\..+/, ""),
        grossAmt_bc: conversionRate(
          formState.values.currency,
          baseCurrency,
          currencyLookups,
          parseFloat(formState.values.subtotal),
          true,
          edit,
          formState.conversionRate
        ),
        discountAmt_bc: conversionRate(
          formState.values.currency,
          baseCurrency,
          currencyLookups,
          parseFloat(discountAmt),
          true,
          edit,
          formState.conversionRate
        ),
        taxAmt_bc: conversionRate(
          formState.values.currency,
          baseCurrency,
          currencyLookups,
          parseFloat(taxAmt),
          true,
          edit,
          formState.conversionRate
        ),
        netAmt_bc: conversionRate(
          formState.values.currency,
          baseCurrency,
          currencyLookups,
          parseFloat(formState.values.total),
          true,
          edit,
          formState.conversionRate
        ),
      };
      //Axios Call
      axios({
        method: "post",
        url: isEdit
          ? isAr
            ? `${process.env.REACT_APP_LDOCS_API_URL}/AR/updateInvoiceAR`
            : `${process.env.REACT_APP_LDOCS_API_URL}/invoice/updateInvoice`
          : isAr
          ? `${process.env.REACT_APP_LDOCS_API_URL}/AR/submitInvoiceAR`
          : `${process.env.REACT_APP_LDOCS_API_URL}/invoice/submitInvoice`,
        data: formData,
        headers: {
          //"Content-Type": "multipart/form-data",
          cooljwt: Token,
        },
      })
        .then((response) => {
          if (edit && !isVendor && !isAr) {
            setIsSavingInvoice(true);
          } else {
            setIsSavingInvoice(false);
            successAlert("Invoice Submited SuccessFully.");
          }
          if (!edit) {
            getData(isAr);
            setItems([]);
            setFormState({
              selectedVendor: null,
              selectedOrg: null,
              isReceipt: false,
              isPo: true,
              values: {
                invoiceDate: getDateFormet(today),
                InvoiceNumber: "INV-",
                dueDate: getDateFormet(duedate),
                poNumber: "",
                itemName: "",
                unitCost: 0,
                receiptNumber: "",
                paymentTerms: "NET-",
                quantity: 0,
                discount: 0,
                amount: 0,
                additionalDetails: "",
                overallDiscount: 0,
                overallTax: 0,
                notes: "",
                selectedVendor: "",
                subtotal: 0,
                total: 0,
                fileTitle: "",
                fileDescription: "",
                currency: "",
                organizationId: "",
              },
              attachments: [],
              errors: {
                invoiceDate: "",
                InvoiceNumber: "",
                dueDate: "",
                poNumber: "",
                itemName: "",
                unitCost: "",
                quantity: "",
                discount: "",
                amount: "",
                additionalDetails: "",
                notes: "",
                selectedVendor: "",
                vendor: "",
                currency: "",
                items: "",
                fileTitle: "",
                fileDescription: "",
                organizationId: "",
              },
            });
          } else {
            if (props.loadFiles) {
              props.loadFiles(userData, false);
            }
          }
          res("success");
        })
        .catch(async (error) => {
          rej("error");
          if (error.response) {
            error.response.status == 401 && dispatch(setIsTokenExpired(true));
          }
          await closeMarkAsReceivedModel();
          setIsSavingInvoice(false);
          errorAlert(
            error.message
              ? error.message
              : "There is some Issue In Create Invoice"
          );
        });
    });
  };
  return (
    <div>
      {/* {isMarked ? <Redirect exact to="/invoice/received" /> : ''} */}
      {isCreateInvoice ? (
        <Animated
          animationIn="bounceInRight"
          animationOut="bounceOutLeft"
          animationInDuration={1000}
          animationOutDuration={1000}
          isVisible={isCreateInvoice}
        >
          <GridContainer>
            {pdfModal ? (
              <Dialog
                classes={{
                  root: classes.center + " " + classes.modalRoot,
                  paper: classes.modal,
                }}
                fullWidth={true}
                maxWidth={"sm"}
                open={pdfModal}
                TransitionComponent={Transition}
                keepMounted
                onClose={closepdfModal}
                aria-labelledby="pdf-modal-slide-title"
                aria-describedby="pdf-modal-slide-description"
              >
                <DialogContent id="pdfupload" className={classes.modalBody}>
                  <Card>
                    <CardHeader color="info" icon>
                      <CardIcon color="info">
                        <h4 className={classes.cardTitleText}>
                          Extracting Data from File
                        </h4>
                      </CardIcon>
                    </CardHeader>
                    <CardBody>
                      <ScanningDocumentAnimation />
                    </CardBody>
                  </Card>
                </DialogContent>
              </Dialog>
            ) : (
              ""
            )}
            {selectedFileModel ? (
              <Dialog
                classes={{
                  root: classes.center + " " + classes.modalRoot,
                  paper: classes.modal,
                }}
                fullWidth={true}
                maxWidth={"md"}
                open={selectedFileModel}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setSelectedFileModel(false)}
                aria-labelledby="selected-modal-slide-title"
                aria-describedby="selected-modal-slide-description"
              >
                <DialogContent
                  id="selected-Select"
                  className={classes.modalBody}
                >
                  <Card>
                    <CardHeader color="info" icon>
                      <CardIcon color="info">
                        <h4 className={classes.cardTitleText}>File Details</h4>
                      </CardIcon>
                    </CardHeader>
                    <CardBody>
                      <GridContainer>
                        <GridItem
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          style={{ marginTop: "10px", marginBottom: "10px" }}
                        >
                          <TextField
                            error={formState.errors.fileTitle === "error"}
                            helperText={
                              formState.errors.fileTitle === "error"
                                ? "Valid File Title is required"
                                : null
                            }
                            className={classes.textField}
                            fullWidth={true}
                            label="File Title"
                            name="fileTitle"
                            onChange={(event) => {
                              handleChange(event);
                            }}
                            value={formState.values.fileTitle || ""}
                          />
                        </GridItem>
                        <GridItem
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          style={{ marginTop: "10px", marginBottom: "10px" }}
                        >
                          <TextField
                            error={formState.errors.fileDescription === "error"}
                            helperText={
                              formState.errors.fileDescription === "error"
                                ? "Valid File Description is required"
                                : null
                            }
                            className={classes.textField}
                            fullWidth={true}
                            label="File Description"
                            name="fileDescription"
                            onChange={(event) => {
                              handleChange(event);
                            }}
                            value={formState.values.fileDescription || ""}
                          />
                        </GridItem>
                        <GridItem
                          style={{
                            display: "flex",
                            alignItems: "right",
                            justifyContent: "flex-end",
                            marginTop: "20px",
                          }}
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                        >
                          <Button
                            color="danger"
                            size="small"
                            onClick={() => setSelectedFileModel(false)}
                            round
                          >
                            Close
                          </Button>
                          <Button
                            color="info"
                            size="small"
                            onClick={() => getFileDetails()}
                            round
                          >
                            Add File
                          </Button>
                        </GridItem>
                      </GridContainer>
                    </CardBody>
                  </Card>
                </DialogContent>
              </Dialog>
            ) : (
              ""
            )}
            {discountModel ? (
              <Dialog
                fullWidth={true}
                maxWidth={"sm"}
                disableBackdropClick
                disableEscapeKeyDown
                open={discountModel}
                onClose={() => setIsDiscountModel(false)}
              >
                <DialogContent>
                  <Card>
                    <CardHeader color="info" icon>
                      <CardIcon color="info">
                        <h4 className={classes.cardTitleText}>Discount</h4>
                      </CardIcon>
                    </CardHeader>
                    <CardBody>
                      <GridContainer>
                        <GridItem xs={6} sm={6} md={6} lg={6}>
                          <TextField
                            error={formState.errors.overallDiscount === "error"}
                            helperText={
                              formState.errors.overallDiscount === "error"
                                ? "Valid Discount is required"
                                : null
                            }
                            className={classes.textField}
                            fullWidth={true}
                            label="Discount"
                            type="number"
                            name="overallDiscount"
                            onChange={(event) => {
                              handleChange(event);
                            }}
                            value={formState.values.overallDiscount || ""}
                          />
                        </GridItem>
                        <GridItem xs={6} sm={6} md={6} lg={6}>
                          <TextField
                            labelId="demo-dialog-select-label"
                            id="demo-dialog-select"
                            label="Discount Type"
                            name="discountType"
                            onChange={(event) => {
                              handleChange(event);
                            }}
                            value={formState.values.discountType || ""}
                            fullWidth={true}
                            select
                          >
                            <MenuItem value={1}>
                              Amount ({currency.Code || "$"})
                            </MenuItem>
                            <MenuItem value={2}>Percentage (%)</MenuItem>
                          </TextField>
                        </GridItem>
                        <GridItem
                          style={{
                            display: "flex",
                            alignItems: "right",
                            justifyContent: "flex-end",
                            marginTop: "20px",
                          }}
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                        >
                          <Button
                            color="danger"
                            size="small"
                            onClick={() => setIsDiscountModel(false)}
                            round
                          >
                            Close
                          </Button>
                          <Button
                            color="info"
                            size="small"
                            onClick={() => setIsDiscountModel(false)}
                            round
                          >
                            Save
                          </Button>
                        </GridItem>
                      </GridContainer>
                    </CardBody>
                  </Card>
                </DialogContent>
              </Dialog>
            ) : (
              ""
            )}
            {taxModal ? (
              <Dialog
                fullWidth={true}
                maxWidth={"sm"}
                disableBackdropClick
                disableEscapeKeyDown
                open={taxModal}
                onClose={() => setIsTaxModal(false)}
              >
                <DialogContent>
                  <Card>
                    <CardHeader color="info" icon>
                      <CardIcon color="info">
                        <h4 className={classes.cardTitleText}>Tax/VAT</h4>
                      </CardIcon>
                    </CardHeader>
                    <CardBody>
                      <GridContainer>
                        <GridItem xs={6} sm={6} md={6} lg={6}>
                          <TextField
                            error={formState.errors.overallTax === "error"}
                            helperText={
                              formState.errors.overallTax === "error"
                                ? "Valid Tax is required"
                                : null
                            }
                            className={classes.textField}
                            fullWidth={true}
                            label="Tax / VAT"
                            type="number"
                            name="overallTax"
                            onChange={(event) => {
                              handleChange(event);
                            }}
                            value={formState.values.overallTax || ""}
                          />
                        </GridItem>
                        <GridItem xs={6} sm={6} md={6} lg={6}>
                          <TextField
                            labelId="demo-dialog-select-label"
                            id="demo-dialog-select"
                            label="Tax Type"
                            name="taxType"
                            onChange={(event) => {
                              handleChange(event);
                            }}
                            value={formState.values.taxType || ""}
                            fullWidth={true}
                            select
                          >
                            <MenuItem value={1}>
                              Amount ({currency.Code || "$"})
                            </MenuItem>
                            <MenuItem value={2}>Percentage (%)</MenuItem>
                          </TextField>
                        </GridItem>
                        <GridItem
                          style={{
                            display: "flex",
                            alignItems: "right",
                            justifyContent: "flex-end",
                            marginTop: "20px",
                          }}
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                        >
                          <Button
                            color="danger"
                            size="small"
                            onClick={() => setIsTaxModal(false)}
                            round
                          >
                            Close
                          </Button>
                          <Button
                            color="info"
                            size="small"
                            onClick={() => setIsTaxModal(false)}
                            round
                          >
                            Save
                          </Button>
                        </GridItem>
                      </GridContainer>
                    </CardBody>
                  </Card>
                </DialogContent>
              </Dialog>
            ) : (
              ""
            )}
            {createPOModel ? (
              <Dialog
                fullWidth={true}
                maxWidth={"md"}
                disableBackdropClick
                disableEscapeKeyDown
                open={createPOModel}
                onClose={() => setCreatePOModel(false)}
              >
                <DialogContent>
                  <Card>
                    <CardHeader color="info" icon>
                      <CardIcon color="info">
                        <h4 className={classes.cardTitleText}>Create PO</h4>
                      </CardIcon>
                    </CardHeader>
                    <CardBody>
                      <GridContainer>
                        <GridItem xs={6} sm={6} md={6} lg={6}>
                          <TextField
                            error={formState.errors.overallDiscount === "error"}
                            helperText={
                              formState.errors.overallDiscount === "error"
                                ? "Valid Discount is required"
                                : null
                            }
                            className={classes.textField}
                            fullWidth={true}
                            label="Discount"
                            type="number"
                            name="overallDiscount"
                            onChange={(event) => {
                              handleChange(event);
                            }}
                            value={formState.values.overallDiscount || ""}
                          />
                        </GridItem>
                        <GridItem xs={6} sm={6} md={6} lg={6}>
                          <TextField
                            labelId="demo-dialog-select-label"
                            id="demo-dialog-select"
                            label="Discount Type"
                            name="discountType"
                            onChange={(event) => {
                              handleChange(event);
                            }}
                            value={formState.values.discountType || ""}
                            fullWidth={true}
                            select
                          >
                            <MenuItem value={1}>
                              Amount ({currency.Code || "$"})
                            </MenuItem>
                            <MenuItem value={2}>Percentage (%)</MenuItem>
                          </TextField>
                        </GridItem>
                        <GridItem
                          style={{
                            display: "flex",
                            alignItems: "right",
                            justifyContent: "flex-end",
                            marginTop: "20px",
                          }}
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                        >
                          <Button
                            color="danger"
                            size="small"
                            onClick={() => setCreatePOModel(false)}
                            round
                          >
                            Close
                          </Button>
                          <Button
                            color="info"
                            size="small"
                            onClick={() => createPO()}
                            round
                          >
                            Create PO
                          </Button>
                        </GridItem>
                      </GridContainer>
                    </CardBody>
                  </Card>
                </DialogContent>
              </Dialog>
            ) : (
              ""
            )}

            {markAsReceivedModel ? (
              <Dialog
                classes={{
                  root: classes.center + " " + classes.modalRoot,
                  paper: classes.modal,
                }}
                fullWidth={true}
                maxWidth={"sm"}
                open={markAsReceivedModel}
                TransitionComponent={Transition}
                keepMounted
                onClose={closeMarkAsReceivedModel}
                aria-labelledby="tag-modal-slide-title"
                aria-describedby="tag-modal-slide-description"
              >
                <DialogContent
                  id="tag-modal-slide-description"
                  className={classes.modalBody}
                >
                  <FileReceived
                    closeFileReceivedModal={closeMarkAsReceivedModel}
                    fileData={fileData}
                    createInvoice={createInvoice}
                  />
                </DialogContent>
              </Dialog>
            ) : (
              ""
            )}
            {poModal ? (
              <Dialog
                classes={{
                  root: classes.center + " " + classes.modalRoot,
                  paper: classes.modal,
                }}
                fullWidth={true}
                maxWidth={"sm"}
                open={poModal}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setPoModal(false)}
                aria-labelledby="vendor-modal-slide-title"
                aria-describedby="vendor-modal-slide-description"
              >
                <DialogContent id="vendorSelect" className={classes.modalBody}>
                  <Card>
                    <CardHeader color="info" icon>
                      <CardIcon color="info">
                        <h4 className={classes.cardTitleText}>
                          Purchase Order
                        </h4>
                      </CardIcon>
                    </CardHeader>
                    <CardBody>
                      <Table>
                        <TableBody>
                          {po.map((val, index) => (
                            <TableRow key={index}>
                              <TableCell>{val.name}</TableCell>
                              <TableCell>{val.value}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardBody>
                  </Card>
                </DialogContent>
              </Dialog>
            ) : (
              ""
            )}
            {receiptModal ? (
              <Dialog
                classes={{
                  root: classes.center + " " + classes.modalRoot,
                  paper: classes.modal,
                }}
                fullWidth={true}
                maxWidth={"sm"}
                open={receiptModal}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setReceiptModal(false)}
                aria-labelledby="vendor-modal-slide-title"
                aria-describedby="vendor-modal-slide-description"
              >
                <DialogContent id="vendorSelect" className={classes.modalBody}>
                  <Card>
                    <CardHeader color="info" icon>
                      <CardIcon color="info">
                        <h4 className={classes.cardTitleText}>
                          Purchase Order
                        </h4>
                      </CardIcon>
                    </CardHeader>
                    <CardBody>
                      <Table>
                        <TableBody>
                          {receipt.map((val, index) => (
                            <TableRow key={index}>
                              <TableCell>{val.name}</TableCell>
                              <TableCell>{val.value}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardBody>
                  </Card>
                </DialogContent>
              </Dialog>
            ) : (
              ""
            )}
            {vendorModal ? (
              <Dialog
                classes={{
                  root: classes.center + " " + classes.modalRoot,
                  paper: classes.modal,
                }}
                fullWidth={true}
                maxWidth={"md"}
                open={vendorModal}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setVendorModal(false)}
                aria-labelledby="vendor-modal-slide-title"
                aria-describedby="vendor-modal-slide-description"
              >
                <DialogContent id="vendorSelect" className={classes.modalBody}>
                  <Card>
                    <CardHeader color="info" icon>
                      <CardIcon color="info">
                        <h4 className={classes.cardTitleText}>
                          {isVendor
                            ? "Select Customer"
                            : isAr
                            ? "Select Customer"
                            : "Select Supplier"}
                        </h4>
                      </CardIcon>
                    </CardHeader>
                    <CardBody>
                      <GridContainer>
                        {!isVendor ? (
                          <React.Fragment>
                            <GridItem
                              xs={12}
                              sm={12}
                              md={11}
                              lg={11}
                              style={{
                                marginTop: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              <TextField
                                error={
                                  formState.errors.selectedVendor === "error"
                                }
                                helperText={
                                  formState.errors.selectedVendor === "error"
                                    ? isAr
                                      ? "Valid Customer Name is required"
                                      : "Valid Supplier Name is required"
                                    : null
                                }
                                className={classes.textField}
                                fullWidth={true}
                                label={
                                  isAr ? "Select Customer" : "Select Supplier"
                                }
                                name="selectedVendor"
                                onChange={(event) => {
                                  handleVendorChange(event);
                                }}
                                select
                                value={formState.selectedVendor || ""}
                              >
                                <MenuItem
                                  disabled
                                  classes={{
                                    root: classes.selectMenuItem,
                                  }}
                                >
                                  {isAr ? "Choose Customer" : "Choose Supplier"}
                                </MenuItem>
                                {formState.vendors
                                  ? formState.vendors.map((vendor, index) => {
                                      return (
                                        <MenuItem
                                          key={index}
                                          value={vendor._id}
                                        >
                                          {isAr
                                            ? vendor.level1.clientName
                                            : vendor.level1.vendorName}
                                        </MenuItem>
                                      );
                                    })
                                  : ""}
                              </TextField>
                            </GridItem>
                            <GridItem
                              xs={12}
                              sm={12}
                              md={1}
                              lg={1}
                              style={{
                                marginTop: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              <IconButton
                                disabled={
                                  formState.values.selectedVendor == null ||
                                  undefined ||
                                  ""
                                    ? true
                                    : false
                                }
                                onClick={() => setShowVendor(!showVendor)}
                              >
                                {!showVendor ? (
                                  <Visibility fontSize="small" />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </GridItem>
                            {formState.selectedVendor ? (
                              <GridItem
                                xs={12}
                                sm={12}
                                md={12}
                                lg={12}
                                style={{
                                  marginTop: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                {showVendor ? (
                                  <Step1
                                    vendorData={formState.values.selectedVendor}
                                  />
                                ) : (
                                  <TextField
                                    error={formState.errors.site === "error"}
                                    helperText={
                                      formState.errors.site === "error"
                                        ? isAr
                                          ? "Valid Customer Site is required"
                                          : "Valid Supplier Site is required"
                                        : null
                                    }
                                    className={classes.textField}
                                    fullWidth={true}
                                    label={
                                      isAr
                                        ? "Select Customer Site"
                                        : "Select Supplier Site"
                                    }
                                    name="site"
                                    onChange={(event) => {
                                      handleChange(event);
                                    }}
                                    select
                                    value={formState.values.site || ""}
                                  >
                                    <MenuItem
                                      disabled
                                      classes={{
                                        root: classes.selectMenuItem,
                                      }}
                                    >
                                      {isAr
                                        ? "Choose Customer Site"
                                        : "Choose Supplier Site"}
                                    </MenuItem>
                                    {VendorSites.map((site, index) => {
                                      return (
                                        <MenuItem key={index} value={site}>
                                          {site}
                                        </MenuItem>
                                      );
                                    })}
                                  </TextField>
                                )}
                              </GridItem>
                            ) : (
                              ""
                            )}
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <GridItem
                              xs={12}
                              sm={12}
                              md={11}
                              lg={11}
                              style={{
                                marginTop: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              <TextField
                                error={
                                  formState.errors.selectedVendor === "error"
                                }
                                helperText={
                                  formState.errors.selectedVendor === "error"
                                    ? "Valid Customer Name is required"
                                    : null
                                }
                                className={classes.textField}
                                fullWidth={true}
                                label="Select Customer"
                                name="organizationId"
                                onChange={(event) => {
                                  handleVendorChange(event);
                                }}
                                select
                                value={formState.values.organizationId || ""}
                              >
                                <MenuItem
                                  disabled
                                  classes={{
                                    root: classes.selectMenuItem,
                                  }}
                                >
                                  Choose Customer
                                </MenuItem>
                                {formState.organizations
                                  ? formState.organizations.map(
                                      (org, index) => {
                                        return (
                                          <MenuItem
                                            key={index}
                                            value={org.organizationId}
                                          >
                                            {org.organizationName}
                                          </MenuItem>
                                        );
                                      }
                                    )
                                  : ""}
                              </TextField>
                            </GridItem>
                            <GridItem
                              xs={12}
                              sm={12}
                              md={1}
                              lg={1}
                              style={{
                                marginTop: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              <IconButton
                                disabled={
                                  formState.values.organization == null ||
                                  undefined ||
                                  ""
                                    ? true
                                    : false
                                }
                                //onClick={() => setShowVendor(!showVendor)}
                              >
                                {!showVendor ? (
                                  <Visibility fontSize="small" />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </GridItem>
                            {formState.values.organizationId ? (
                              <GridItem
                                xs={12}
                                sm={12}
                                md={12}
                                lg={12}
                                style={{
                                  marginTop: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                {showVendor ? (
                                  <Step1
                                    vendorData={formState.values.selectedVendor}
                                  />
                                ) : (
                                  ""
                                )}
                              </GridItem>
                            ) : (
                              ""
                            )}
                          </React.Fragment>
                        )}
                        <GridItem
                          style={{
                            display: "flex",
                            alignItems: "right",
                            justifyContent: "flex-end",
                            marginTop: "20px",
                          }}
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                        >
                          <Button
                            color="danger"
                            size="small"
                            onClick={() => setVendorModal(false)}
                            round
                          >
                            Close
                          </Button>
                          <Button
                            color="info"
                            size="small"
                            onClick={() => selectVendor()}
                            round
                          >
                            {isVendor
                              ? "Select Customer"
                              : isAr
                              ? "Select Customer"
                              : "Select Supplier"}
                          </Button>
                        </GridItem>
                      </GridContainer>
                    </CardBody>
                  </Card>
                </DialogContent>
              </Dialog>
            ) : (
              ""
            )}
            <GridItem xs={12}>
              {/* {isLoading ? <LinearProgress /> : ""} */}
              <Card>
                <CardHeader color="info" icon>
                  <CardIcon color="info">
                    <h4 className={classes.cardTitleText}>
                      {edit ? "Resubmit Invoice" : "Create Invoice"}
                    </h4>
                  </CardIcon>
                  <Button
                    color="danger"
                    round
                    style={{ float: "right" }}
                    className={classes.marginRight}
                    onClick={() =>
                      edit ? closeModal() : pdfInput.current.click()
                    }
                  >
                    {edit ? "Close" : "Upload PDF / Image"}
                  </Button>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={6}
                      lg={6}
                      style={{ marginTop: "-10px", marginBottom: "10px" }}
                    >
                      <Card
                        style={{
                          height: "15vh",
                          maxWidth: "70%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: edit ? "" : "pointer",
                          border:
                            formState.errors.vendor === "error"
                              ? "2px red solid"
                              : "none",
                          background: "#f5f5f5",
                        }}
                        onClick={
                          edit
                            ? () => console.log("Can't Do..")
                            : openVendorModal
                        }
                      >
                        {isVendor ? (
                          <GridContainer>
                            <GridItem
                              xs="3"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "left",
                              }}
                            >
                              <Person
                                fontSize="large"
                                style={{ width: "100%", height: "100%" }}
                              />
                            </GridItem>
                            <GridItem
                              xs="9"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                paddingLeft: 50,
                                // justifyContent: "left",
                              }}
                            >
                              {formState.values.organizationId != "" ||
                              null ||
                              undefined ? (
                                <div>
                                  <Typography variant="h6" component="h2">
                                    {formState.selectedOrg.organizationName ||
                                      "Customer Name"}
                                  </Typography>
                                  <Typography variant="h6" component="h2">
                                    {formState.selectedOrg.address || ""}
                                  </Typography>
                                </div>
                              ) : (
                                <div>
                                  <Typography variant="h6" component="h2">
                                    Customer Name
                                  </Typography>
                                </div>
                              )}
                            </GridItem>
                          </GridContainer>
                        ) : (
                          <GridContainer>
                            <GridItem
                              xs="3"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "left",
                              }}
                            >
                              {formState.values.selectedVendor &&
                              formState.values.selectedVendor.level1.logoUrl ? (
                                <img
                                  src={
                                    formState.values.selectedVendor.level1
                                      .logoUrl
                                  }
                                  style={{ width: "100px", marginLeft: 10 }}
                                />
                              ) : (
                                <Person
                                  fontSize="large"
                                  style={{ width: "100%", height: "100%" }}
                                />
                              )}
                            </GridItem>
                            <GridItem
                              xs="9"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                paddingLeft: 50,
                                // justifyContent: "left",
                              }}
                            >
                              {formState.values.selectedVendor ? (
                                <div>
                                  <Typography variant="h6" component="h2">
                                    {formState.values.selectedVendor.level1
                                      .vendorName ||
                                      formState.values.selectedVendor.level1
                                        .clientName}
                                  </Typography>
                                  <Typography variant="body2" component="h2">
                                    {formState.values.site || ""}
                                  </Typography>
                                </div>
                              ) : (
                                <div>
                                  <Typography variant="h6" component="h2">
                                    {isAr ? "Customer Name" : "Supplier Name"}
                                  </Typography>
                                  <Typography variant="body2" component="h2">
                                    {isAr ? "Customer Site" : "Supplier Site"}
                                  </Typography>
                                </div>
                              )}
                            </GridItem>
                          </GridContainer>
                        )}
                      </Card>
                      <GridItem
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        style={{ marginTop: "10px", marginBottom: "10px" }}
                      >
                        <FormGroup row>
                          <React.Fragment>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formState.isPrePayment}
                                  onChange={handleChange}
                                  value="isPrePayment"
                                  color="primary"
                                  name="invoiceType"
                                />
                              }
                              label="Pre-Payment"
                            />
                            {!isVendor ? (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={formState.isReceipt}
                                    onChange={handleChange}
                                    name="invoiceType"
                                    value="isReceipt"
                                    color="primary"
                                  />
                                }
                                label="With Receipt"
                              />
                            ) : (
                              ""
                            )}
                          </React.Fragment>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formState.isPeetyCash}
                                onChange={handleChange}
                                value="isPeetyCash"
                                name="invoiceType"
                                color="primary"
                              />
                            }
                            label="Petty Cash"
                          />
                        </FormGroup>
                      </GridItem>
                    </GridItem>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={6}
                      lg={6}
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
                            fullWidth={true}
                            error={formState.errors.invoiceDate === "error"}
                            helperText={
                              formState.errors.invoiceDate === "error"
                                ? "Valid Invoice Date is required"
                                : null
                            }
                            label="Invoice Date *"
                            disabled={edit}
                            id="invoiceDate"
                            name="invoiceDate"
                            onChange={(event) => {
                              handleChange(event);
                            }}
                            type="date"
                            // variant="outlined"
                            value={formState.values.invoiceDate || ""}
                            className={classes.textField}
                            InputLabelProps={{
                              shrink: true,
                            }}
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
                            error={formState.errors.InvoiceNumber === "error"}
                            helperText={
                              formState.errors.InvoiceNumber === "error"
                                ? "Valid Invoice Number is required"
                                : null
                            }
                            label="Invoice Number *"
                            id="InvoiceNumber"
                            name="InvoiceNumber"
                            onChange={(event) => {
                              handleChange(event);
                            }}
                            type="text"
                            disabled={true}
                            // variant="outlined"
                            value={formState.values.InvoiceNumber}
                            className={classes.textField}
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
                            error={formState.errors.dueDate === "error"}
                            helperText={
                              formState.errors.dueDate === "error"
                                ? "Valid Due Date is required"
                                : null
                            }
                            label="Due Date *"
                            id="duedate"
                            name="dueDate"
                            onChange={(event) => {
                              handleChange(event);
                            }}
                            type="date"
                            // variant="outlined"
                            value={formState.values.dueDate || ""}
                            className={classes.textField}
                            InputLabelProps={{
                              shrink: true,
                            }}
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
                            error={formState.errors.currency === "error"}
                            helperText={
                              formState.errors.currency === "error"
                                ? "Valid Invoice Currency is required"
                                : null
                            }
                            disabled={edit}
                            label="Currency"
                            id="currency"
                            name="currency"
                            onChange={(event) => {
                              handleChange(event);
                            }}
                            type="text"
                            // variant="outlined"
                            value={formState.values.currency || ""}
                            select
                          >
                            <MenuItem
                              disabled
                              classes={{
                                root: classes.selectMenuItem,
                              }}
                            >
                              Choose Currency Base
                            </MenuItem>
                            {currencyLookups.map((cu) => (
                              <MenuItem key={cu._id} value={cu._id}>
                                {`${cu.Currency.toUpperCase()} (${cu.Code})`}
                              </MenuItem>
                            ))}
                          </TextField>
                        </GridItem>
                        <GridItem
                          xs={12}
                          sm={12}
                          md={6}
                          lg={6}
                          style={{ marginTop: "10px", marginBottom: "10px" }}
                        >
                          <FormGroup row>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  disabled={formState.isPeetyCash}
                                  checked={formState.isPo}
                                  onChange={handleChange}
                                  value="isPo"
                                  name="isPo"
                                  color="primary"
                                />
                              }
                              label="Purchase Order"
                            />
                            {!isVendor ? (
                              <React.Fragment>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={formState.isExpense}
                                      onChange={handleChange}
                                      name="isPo"
                                      disabled={formState.isPeetyCash}
                                      color="primary"
                                      value="isExpense"
                                    />
                                  }
                                  label={isAr ? "Revenue" : "Expense"}
                                />
                                {/* <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={formState.isPeetyCash}
                                      onChange={handleChange}
                                      value="isPeetyCash"
                                      name="invoiceType"
                                      color="primary"
                                    />
                                  }
                                  label="Peety Cash"
                                /> */}
                              </React.Fragment>
                            ) : (
                              ""
                            )}
                          </FormGroup>
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
                            label="Conversion Rate"
                            id="conversionRate"
                            name="conversionrate"
                            disabled={true}
                            type="text"
                            // variant="outlined"
                            value={
                              formState.values.currency
                                ? `${currency.Code ? currency.Code : ""} 1 ≈ ${
                                    currencyLookups.find(
                                      (c) => c._id == baseCurrency
                                    )
                                      ? currencyLookups.find(
                                          (c) => c._id == baseCurrency
                                        ).Code
                                      : ""
                                  } ${
                                    currency.conversionRate
                                      ? parseFloat(
                                          !edit
                                            ? currency.conversionRate
                                            : formState.conversionRate
                                        ).toFixed(4)
                                      : "?"
                                  }`
                                : "" || ""
                            }
                            className={classes.textField}
                          />
                        </GridItem>
                        {!formState.isPeetyCash &&
                        !formState.isExpense &&
                        formState.isPo ? (
                          !isAr ? (
                            <React.Fragment>
                              <GridItem
                                xs={10}
                                sm={10}
                                md={5}
                                lg={5}
                                style={{
                                  marginTop: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                <TextField
                                  fullWidth={true}
                                  // error={formState.errors.poNumber}
                                  // helperText={
                                  //   formState.errors.poNumber == "error"
                                  //     ? "Valid PO Number is required"
                                  //     : null
                                  // }
                                  label={`PO Number`}
                                  id="poNumber"
                                  name="poNumber"
                                  disabled={formState.isPeetyCash}
                                  onChange={(event) => {
                                    handleChange(event);
                                  }}
                                  value={formState.values.poNumber || ""}
                                  select
                                >
                                  <MenuItem key={""} disabled={true}>
                                    PO NUMBER
                                  </MenuItem>
                                  {pos.map((po, index) => (
                                    <MenuItem key={index} value={po.poNumber}>
                                      {po.poNumber}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              </GridItem>
                              <GridItem
                                xs={2}
                                sm={2}
                                md={1}
                                lg={1}
                                style={{
                                  marginTop: "15px",
                                  marginBottom: "10px",
                                }}
                              >
                                {/* {formState.values.poNumber ? */}
                                <Tooltip title="View PO">
                                  <IconButton
                                    style={{ background: "lightgrey" }}
                                    onClick={() => viewPO()}
                                  >
                                    {poModal ? (
                                      <VisibilityOff fontSize="small" />
                                    ) : (
                                      <Visibility fontSize="small" />
                                    )}
                                  </IconButton>
                                </Tooltip>
                                {
                                  // : <Tooltip title="Create PO">
                                  //   <IconButton
                                  //     style={{ background: "lightgrey" }}
                                  //     onClick={() => setCreatePOModel(true)}
                                  //   >
                                  //       <AddCircleOutlineIcon fontSize="small" />
                                  //   </IconButton>
                                  // </Tooltip>
                                }
                              </GridItem>
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <GridItem
                                xs={12}
                                sm={12}
                                md={6}
                                lg={6}
                                style={{
                                  marginTop: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                <TextField
                                  fullWidth={true}
                                  // error={formState.errors.poNumber}
                                  // helperText={
                                  //   formState.errors.poNumber == "error"
                                  //     ? "Valid PO Number is required"
                                  //     : null
                                  // }
                                  label={`PO Number`}
                                  id="poNumber"
                                  name="poNumber"
                                  disabled={formState.isPeetyCash}
                                  onChange={(event) => {
                                    handleChange(event);
                                  }}
                                  value={formState.values.poNumber || ""}
                                />
                              </GridItem>
                            </React.Fragment>
                          )
                        ) : (
                          ""
                        )}
                        {formState.isExpense &&
                        !formState.isPeetyCash &&
                        !formState.isPo ? (
                          <GridItem
                            xs={12}
                            sm={12}
                            md={6}
                            lg={6}
                            style={{
                              marginTop: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            <TextField
                              fullWidth={true}
                              error={formState.errors.expenseType === "error"}
                              helperText={
                                formState.errors.expenseType === "error"
                                  ? isAr
                                    ? "Valid Revenue Type is required"
                                    : "Valid Expense Type is required"
                                  : null
                              }
                              label={isAr ? "Revenue Type" : "Expense Type"}
                              id="expenseType"
                              disabled={formState.isPeetyCash}
                              name="expenseType"
                              value={formState.values.expenseType}
                              onChange={(event) => {
                                handleChange(event);
                              }}
                              select
                            >
                              {formState.expenseTypes
                                ? formState.expenseTypes.map((exp, index) => (
                                    <MenuItem
                                      key={index}
                                      value={exp.Acc_Description}
                                    >
                                      {exp.Acc_Description}
                                    </MenuItem>
                                  ))
                                : ""}
                            </TextField>
                          </GridItem>
                        ) : (
                          ""
                        )}
                        <GridItem
                          xs={12}
                          sm={12}
                          md={6}
                          lg={6}
                          style={{ marginTop: "10px", marginBottom: "10px" }}
                        >
                          <TextField
                            fullWidth={true}
                            error={formState.errors.paymentTerms === "error"}
                            helperText={
                              formState.errors.paymentTerms === "error"
                                ? "Valid Payment Terms required"
                                : null
                            }
                            label="Payment Terms"
                            id="paymentTerms"
                            name="paymentTerms"
                            disabled={formState.isPeetyCash}
                            onChange={(event) => {
                              handleChange(event);
                            }}
                            type="text"
                            // variant="outlined"
                            value={formState.values.paymentTerms || ""}
                            className={classes.textField}
                          />
                        </GridItem>
                        {/* <GridItem
                          xs={10}
                          sm={10}
                          md={3}
                          lg={3}
                          style={{ marginTop: "10px", marginBottom: "10px" }}
                        >
                          <Autocomplete
                            id="free-solo-demo"
                            freeSolo
                            options={receipts.map((option) => option.receiptNumber                              )}
                            renderInput={(params) => (
                              <TextField
                                fullWidth={true}
                                error={
                                  formState.errors.receiptNumber === "error"
                                }
                                helperText={
                                  formState.errors.receiptNumber === "error"
                                    ? "Valid Receipt Number required"
                                    : null
                                }
                                label="Receipt Number"
                                id="receiptNumber"
                                name="receiptNumber"
                                onChange={(event) => {
                                  handleChange(event);
                                }}
                                type="text"
                                // variant="outlined"
                                value={formState.values.receiptNumber || ""}
                                className={classes.textField}
                                {...params}
                              />
                            )}
                          />
                        </GridItem> 
                        <GridItem
                          xs={2}
                          sm={2}
                          md={1}
                          lg={1}
                          style={{ marginTop: "15px", marginBottom: "10px" }}
                        >
                          <Tooltip title="View Receipt">
                            <IconButton
                              style={{ background: "lightgrey" }}
                              onClick={() => viewReceipt()}
                            >
                              {receiptModal ? (
                                <VisibilityOff fontSize="small" />
                              ) : (
                                <div>
                                {receipts.length  < 1 ? 
                                  <Add  fontSize="small" /> :
                                  <Visibility fontSize="small" />
                                }
                                </div>
                              )}
                            </IconButton>
                          </Tooltip>
                        </GridItem>
                        */}
                      </GridContainer>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem
                      style={{
                        marginBottom: "40px",
                        marginTop: "10px",
                      }}
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                    >
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-label="Expand"
                          aria-controls="additional-actions3-content"
                          id="additional-actions3-header"
                          style={{ background: "#f5f5f5" }}
                        >
                          <Typography
                            color="textSecondary"
                            component="h2"
                            variant="body2"
                            style={{
                              color: "#000000",
                              fontWeight: 500,
                              lineHeight: "1.5rem",
                            }}
                          >
                            Invoice Description
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth={true}
                            label="Description"
                            id="notes"
                            name="notes"
                            onChange={(event) => {
                              handleChange(event);
                            }}
                            // variant="outlined"
                            multiline
                            rows={4}
                            type="text"
                            value={formState.values.notes || ""}
                          />
                        </AccordionDetails>
                      </Accordion>
                    </GridItem>
                    <Items
                      formState={formState}
                      items={items}
                      baseCurrency={fileData ? fileData.LC_currency._id : null}
                      handleChange={handleChange}
                      addZeroes={addZeroes}
                      handleEditItem={handleEditItem}
                      removeItem={removeItem}
                      editIndex={editIndex}
                      setEditIndex={setEditIndex}
                      addingItem={addingItem}
                      addInvoiceItem={addInvoiceItem}
                      addItem={addItem}
                      setAddingItem={setAddingItem}
                      editItem={addItem}
                      setCategory={setCategory}
                      category={category}
                      currency={currency || {}}
                      viewPO={viewPO}
                      receipts={receipts}
                      pos={pos}
                      isVendor={isVendor}
                      createReceipts={createReceipts}
                      currencyLookups={currencyLookups}
                      userData={userDetails}
                      edit={edit}
                      isAr={isAr}
                    />

                    <GridItem
                      style={{
                        marginTop: "40px",
                      }}
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                    >
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-label="Expand"
                          aria-controls="additional-actions3-content"
                          id="additional-actions3-header"
                          style={{ background: "#f5f5f5" }}
                        >
                          <Typography
                            color="textSecondary"
                            component="h2"
                            variant="body2"
                            style={{
                              color: "#000000",
                              fontWeight: 500,
                              lineHeight: "1.5rem",
                            }}
                          >
                            Attachments
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {/* View Attachments */}
                          <Attachments
                            attachments={formState.attachments}
                            viewFileHandler={viewFileHandler}
                            removeAttachment={removeAttachment}
                            handleAttachmentChange={handleAttachmentChange}
                          />
                        </AccordionDetails>
                      </Accordion>
                    </GridItem>
                    {items.length > 0 ? (
                      <GridItem
                        style={{
                          display: "flex",
                          alignItems: "right",
                          justifyContent: "flex-end",
                          marginTop: "20px",
                        }}
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                      >
                        <Table
                          style={{ maxWidth: 400, textAlign: "right" }}
                          size="medium"
                          aria-label="a dense table"
                        >
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                Sub Total
                                <br />
                                {conversionRate(
                                  formState.values.currency,
                                  baseCurrency,
                                  currencyLookups,
                                  parseFloat(formState.values.subtotal),
                                  false,
                                  edit,
                                  formState.conversionRate
                                )}
                              </TableCell>
                              <TableCell>
                                <TextField
                                  label={`Sub Total(${currency.Code || "$"})`}
                                  id="subtotal"
                                  name="subtotal"
                                  disabled={true}
                                  type="number"
                                  variant="outlined"
                                  value={
                                    addZeroes(formState.values.subtotal) || ""
                                  }
                                  className={classes.textField}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                style={{ cursor: "pointer" }}
                                onClick={() => setIsDiscountModel(true)}
                              >
                                Discount
                                <br />
                                {conversionRate(
                                  formState.values.currency,
                                  baseCurrency,
                                  currencyLookups,
                                  parseFloat(
                                    formState.values.discountType == 1
                                      ? formState.values.overallDiscount
                                      : (formState.values.subtotal *
                                          formState.values.overallDiscount) /
                                          100
                                  ),
                                  false,
                                  edit,
                                  formState.conversionRate
                                )}
                              </TableCell>
                              <TableCell>
                                <TextField
                                  label={`Discount(${currency.Code || "$"})`}
                                  id="discount"
                                  name="overallDiscount"
                                  onChange={(event) => {
                                    handleChange(event);
                                  }}
                                  disabled={true}
                                  type="number"
                                  variant="outlined"
                                  value={
                                    addZeroes(
                                      formState.values.discountType == 1
                                        ? formState.values.overallDiscount
                                        : (formState.values.subtotal *
                                            formState.values.overallDiscount) /
                                            100
                                    ) || ""
                                  }
                                  className={classes.textField}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                style={{ cursor: "pointer" }}
                                onClick={() => setIsTaxModal(true)}
                              >
                                Tax / VAT
                                <br />
                                {conversionRate(
                                  formState.values.currency,
                                  baseCurrency,
                                  currencyLookups,
                                  parseFloat(
                                    formState.values.taxType == 1
                                      ? formState.values.overallTax
                                      : (formState.values.subtotal *
                                          formState.values.overallTax) /
                                          100
                                  ),
                                  false,
                                  edit,
                                  formState.conversionRate
                                )}
                              </TableCell>
                              <TableCell>
                                <TextField
                                  label={`Tax(${currency.Code || "$"})`}
                                  id="tax"
                                  name="overallTax"
                                  onChange={(event) => {
                                    handleChange(event);
                                  }}
                                  type="number"
                                  disabled={true}
                                  variant="outlined"
                                  value={
                                    addZeroes(
                                      formState.values.taxType == 1
                                        ? formState.values.overallTax
                                        : (formState.values.subtotal *
                                            formState.values.overallTax) /
                                            100
                                    ) || ""
                                  }
                                  className={classes.textField}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell component="th" scope="row">
                                Total
                                <br />
                                {conversionRate(
                                  formState.values.currency,
                                  baseCurrency,
                                  currencyLookups,
                                  parseFloat(formState.values.total),
                                  false,
                                  edit,
                                  formState.conversionRate
                                )}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                <TextField
                                  label={`Total(${currency.Code || "$"})`}
                                  id="total"
                                  name="total"
                                  disabled={true}
                                  type="text"
                                  variant="outlined"
                                  value={
                                    addZeroes(formState.values.total) || ""
                                  }
                                  className={classes.textField}
                                />
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </GridItem>
                    ) : (
                      ""
                    )}
                    <GridItem
                      style={{
                        display: "flex",
                        alignItems: "right",
                        justifyContent: "flex-end",
                        marginTop: "20px",
                      }}
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                    >
                      <Button
                        color="info"
                        size="small"
                        disabled={items.length == 0 ? true : false}
                        onClick={openPopup}
                        round
                      >
                        {isSavingInvoice ? (
                          <CircularProgress style={{ color: "white" }} />
                        ) : (
                          "Save Invoice"
                        )}
                      </Button>
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem
              style={{
                marginTop: "20px",
              }}
              xs={12}
              sm={12}
              md={12}
              lg={12}
            >
              <div className="fileinput text-center">
                <input
                  type="file"
                  accept="image/png, image/jpeg ,application/pdf "
                  onChange={handlePdfChange}
                  ref={pdfInput}
                />
              </div>
            </GridItem>
          </GridContainer>
        </Animated>
      ) : (
        <Backdrop
          className={classes.backdrop}
          open={!isCreateInvoice && !viewFile}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {viewFile ? (
        <Animated
          animationIn="bounceInRight"
          animationOut="bounceOutLeft"
          animationInDuration={1000}
          animationOutDuration={1000}
          isVisible={viewFile}
        >
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={12} className={classes.center}>
              <Card>
                <CardHeader color="info" icon>
                  <CardIcon color="info">
                    <h4 className={classes.cardTitleText}>
                      {file.attachmentTitle}
                    </h4>
                  </CardIcon>
                  <Button
                    color="danger"
                    round
                    style={{ float: "right" }}
                    className={classes.marginRight}
                    onClick={() => closeViewFile()}
                  >
                    Go Back
                  </Button>
                </CardHeader>
                <CardBody>
                  {file.type == "application/pdf" || "pdf" ? (
                    <Iframe
                      url={file.base64}
                      width="100%"
                      id="myId"
                      className="myClassname"
                      height={window.screen.height}
                    />
                  ) : (
                    <img width="100%" src={file.base64} />
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

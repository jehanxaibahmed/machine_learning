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
} from "@material-ui/core";
import SweetAlert from "react-bootstrap-sweetalert";
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
import { addZeroes } from "../../Functions/Functions";
import { Person } from "@material-ui/icons";

const sweetAlertStyle = makeStyles(styles2);

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
  table: {
    minWidth: "100%",
  },
  itemName: {
    width: 400,
  },
  itemNumber: {
    width: "55%",
  },
};

let pdfInput = React.createRef();

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const useStyles = makeStyles(styles);
const getDateFormet = (date) => {
  var today = new Date(date);
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;
  return today;
};
export default function CreateInvoice(props) {
  const { edit, fileData, closeModal } = props;
  const [pdfModal, setPdfModal] = useState(false);
  const [vendorModal, setVendorModal] = useState(false);
  const [viewFile, setViewFile] = useState(false);
  const [items, setItems] = useState([]);
  const [addingItem, setAddingItem] = useState(false);
  const [file, setFile] = useState(null);
  const [isCreateInvoice, setIsCreateInvoice] = useState(true);
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
  const [currency, setCurrency] = useState({
    _id: "602a2d12f31966419864e43c",
    lookup_Id: 1,
    Name: "dollor",
    sign: "$",
  });
  let duedate = new Date();
  let today = new Date();
  duedate = duedate.setDate(today.getDate() + 15);
  const [formState, setFormState] = useState({
    vendors: [],
    selectedVendor: null,
    values: {
      invoiceDate: getDateFormet(today),
      InvoiceNumber: "INV-00",
      dueDate: getDateFormet(duedate),
      currency: "",
      itemName: "",
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
      receiptNumber: "",
    },
    attachments: [],
    errors: {
      invoiceDate: "",
      InvoiceNumber: "",
      dueDate: "",
      currency: "",
      itemName: "",
      unitCost: "",
      quantity: "",
      discount: "",
      amount: "",
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
    },
  });
  const getLookUp = () => {
    axios({
      method: "get", //you can set what request you want to be
      url: `${process.env.REACT_APP_LDOCS_API_URL}/lookup/getLookups/1`,
      headers: {
        cooljwt: Token,
      },
    })
      .then((res) => {
        if (typeof res.data.result == "object") {
          setCurrencyLookups(res.data.result);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
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
        onConfirm={() => hideErrorAlert()}
        onCancel={() => hideErrorAlert()}
        confirmBtnCssClass={sweetClass.button + " " + sweetClass.danger}
      >
        {msg ? msg : ""}
      </SweetAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };
  const hideErrorAlert = () => {
    setAlert(null);
  };
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  const classes = useStyles();
  const handleChange = (event) => {
    event.persist();
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value,
      },
    }));
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
        expenseType: item.expenseType,
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
                amount: item[3].values[0].value
                  ? addZeroes(item[3].values[0].value)
                  : "",
                originalamount: item[3].values[0].value
                  ? item[3].values[0].value
                  : "",
                discount: "0",
                additionalDetails: "",
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
            setFormState((formState) => ({
              ...formState,
              selectedVendor:
                formState.vendors.find(
                  (v) => v.level1.vendorName == invoice_companyowner
                )._id || null,
              values: {
                ...formState.values,
                invoiceDate: invoice_date,
                dueDate: invoice_duedate,
                overallTax: addZeroes(invoice_tax),
                selectedVendor:
                  formState.vendors.find(
                    (v) => v.level1.vendorName == invoice_companyowner
                  ) || null,
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
                    attachmentTitle: formState.values.fileTitle,
                    attachmentPath: "",
                    file: file,
                    title: "OCR",
                    description: "OCR FILE USED FOR DATA EXTRACTING..",
                  },
                ],
              }));
            };
            reader.readAsDataURL(file);
            setItems(invoice_lineitems);
            successAlert("Extracted Data Successfully.");
          }
        }
      })
      .catch((err) => {
        console.log(err);
        errorAlert("There is some issue in Api");
        setPdfModal(false);
      });
  };

  const selectVendor = () => {
    let selectedVendor;
    const Check = require("is-null-empty-or-undefined").Check;
    var error = false;

    if (!Check(formState.selectedVendor)) {
      selectedVendor = "success";
    } else {
      selectedVendor = "error";
      error = true;
    }
    setFormState((formState) => ({
      ...formState,
      errors: {
        ...formState.errors,
        selectedVendor: selectedVendor,
      },
    }));
    if (error) {
      return false;
    } else {
      setVendorModal(false);
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
  React.useEffect(() => {
    setCurrency(
      currencyLookups.find((l) => l._id == formState.values.currency)
    );
  }, [formState.values.currency, currencyLookups]);
  React.useEffect(() => {
    updateTotal();
  }, [items, formState.values.overallDiscount, formState.values.overallTax]);
  React.useEffect(() => {
    if (typeof formState.values.selectedVendor == "object") {
      setFormState((formState) => ({
        ...formState,
        values: {
          ...formState.values,
          InvoiceNumber: `INV-00${formState.values.selectedVendor.invoiceCount +
            1}`,
        },
      }));
    }
  }, [formState.values.selectedVendor]);
  React.useEffect(() => {
    setIsLoading(true);
    window.scrollTo(0, 0);
    const userDetails = jwt.decode(Token);
    const userCurrency = userDetails.currency.Currency_Base;
    getLookUp();
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_URL}/vendor/vendorsByOrganization/${userDetails.orgDetail.organizationId}`,
      headers: { cooljwt: Token },
    })
      .then((response) => {
        setFormState((formState) => ({
          ...formState,
          selectedVendor: "",
          vendors: response.data,
          values: {
            ...formState.values,
            selectedVendor: "",
            currency: userCurrency,
          },
        }));
        if (edit) {
          setInvoice();
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const setInvoice = () => {
    if (edit) {
      console.log(fileData);
      setFormState((formState) => ({
        ...formState,
        selectedVendor: fileData.vendorId,
        values: {
          ...formState.values,
          InvoiceNumber: fileData.invoiceId,
          invoiceDate: getDateFormet(fileData.createdDate),
          notes: fileData.ref,
          currency:fileData.FC_currency._id,
          selectedVendor:
            formState.vendors.find((v) => v._id == fileData.vendorId) || null,
        },
      }));
      var invoice_items = fileData.items.map((item) => {
        const i = {
          additionalDetails: item.additionalDetails,
          amount: item.amount,
          discount: item.discount,
          itemName: item.itemName,
          quantity: item.quantity,
          unitCost: item.unitCost,
          receiptNumber: item.receiptNumber,
          category: parseInt(item.category),
          poInline: item.poInline,
          expenseType: item.expenseType,
        };
        return i;
      });
      setItems(invoice_items);
    }
  };
  const openVendorModal = () => {
    setFormState((formState) => ({
      ...formState,
      selectedVendor: "",
      values: {
        ...formState.values,
        selectedVendor: "",
      },
    }));
    setVendorModal(true);
  };
  const closepdfModal = () => {
    setPdfModal(false);
  };
  const handleVendorChange = (event) => {
    event.persist();
    let selectedVendor = formState.vendors.find(
      (v) => v._id == event.target.value
    );
    console.log(selectedVendor);
    setFormState((formState) => ({
      ...formState,
      selectedVendor: event.target.value,
      values: {
        ...formState.values,
        selectedVendor: selectedVendor,
      },
    }));
  };
  const viewFileHandler = (file) => {
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
        expenseType: "",
        receiptNumber: "",
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
        expenseType: "",
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
    if (!Check(formState.values.discount)) {
      discount = "success";
    } else {
      discount = "error";
      error = true;
    }
    if (category == 1) {
      if (!Check(formState.values.poInline)) {
        poInline = "success";
      } else {
        poInline = "error";
        error = true;
      }
    } else {
      if (!Check(formState.values.expenseType)) {
        expenseType = "success";
      } else {
        expenseType = "error";
        error = true;
      }
    }
    if (!Check(formState.values.receiptNumber)) {
      receiptNumber = "success";
    } else {
      receiptNumber = "error";
      error = true;
    }

    setFormState((formState) => ({
      ...formState,
      errors: {
        ...formState.errors,
        itemName: itemName,
        unitCost: unitCost,
        quantity: quantity,
        discount: discount,
        poInline: poInline,
        expenseType: expenseType,
        receiptNumber: receiptNumber,
        additionalDetails: additionalDetails,
      },
    }));
    if (error) {
      return false;
    } else {
      const item = {
        itemName: formState.values.itemName,
        unitCost: formState.values.unitCost,
        quantity: formState.values.quantity,
        discount: formState.values.discount,
        poInline: formState.values.poInline,
        expenseType: formState.values.expenseType,
        category: category,
        receiptNumber: formState.values.receiptNumber,
        amount:
          parseFloat(formState.values.unitCost) *
            parseFloat(formState.values.quantity) -
          parseFloat(
            (formState.values.unitCost * formState.values.discount) / 100
          ) *
            formState.values.quantity,
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

  const createInvoice = () => {
    //Creating Invoice
    setIsSavingInvoice(true);
    const userData = jwt.decode(Token);
    const userCurrency = currencyLookups.find(
      (l) => l._id == userData.currency.Currency_Base
    );
    let invoiceDate;
    let InvoiceNumber;
    let dueDate;
    let vendor;
    let item;
    let currency;
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
    if (!Check(formState.selectedVendor)) {
      vendor = "success";
    } else {
      vendor = "error";
      error = true;
    }
    if (!Check(formState.values.currency)) {
      currency = "success";
    } else {
      currency = "error";
      error = true;
    }
    if (
      items.filter((i) => Check(i.poInline) && Check(i.expenseType) == true)
        .length > 0
    ) {
      item = "error";
      error = true;
    } else {
      item = "success";
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
        currency: currency,
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
      // let FC_currency = {
      //   currency_id:f_currency._id,
      //   name:f_currency.name,
      //   symbol:f_currency.sign,
      //   _id:f_currency._id,
      //   sign:f_currency.sign
      // }
      // let LC_currency = {
      //   currency_id:userCurrency._id,
      //   name:userCurrency.name,
      //   symbol:userCurrency.sign,
      //   _id:userCurrency._id,
      //   sign:userCurrency.sign
      // }
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
        tenantId: userData.tenantId,
        organizationId: userData.orgDetail.organizationId,
        organizationName: userData.orgDetail.organization,
        contactPerson: formState.values.selectedVendor.level1.contactPerson,
        createdBy: userData.email,
        balanceDue: formState.values.total,
        items: JSON.stringify(items),
        attachments: formState.attachments,
        vendorName: formState.values.selectedVendor.level1.vendorName,
        vendorId: formState.values.selectedVendor._id,
        vendorSite: formState.values.selectedVendor.site,
        FC_currency: currencyLookups.find(
          (l) => l._id == formState.values.currency
        ),
        LC_currency: userCurrency,
        description: formState.values.notes,
      };
      //Axios Call
      axios({
        method: edit ? "put" : "post",
        url: edit
          ? `${process.env.REACT_APP_LDOCS_API_URL}/invoice/updateInvoice`
          : `${process.env.REACT_APP_LDOCS_API_URL}/invoice/submitInvoice`,
        //url: `https://api.matesol.net/invoice/submitInvoice`,
        data: formData,
        headers: {
          //"Content-Type": "multipart/form-data",
          cooljwt: Token,
        },
      })
        .then((response) => {
          setIsSavingInvoice(false);
          successAlert(
            edit
              ? "Invoice Updated SuccessFully."
              : "Invoice Submited SuccessFully."
          );
          if (!edit) {
            setItems([]);
            setFormState({
              selectedVendor: null,
              values: {
                invoiceDate: getDateFormet(today),
                InvoiceNumber: "INV-00",
                dueDate: getDateFormet(duedate),
                poNumber: "",
                itemName: "",
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
                currency: "",
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
              },
            });
          }else{
            props.loadFiles(userData, false);
          }
        })
        .catch((err) => {
          console.log(err);
          setIsSavingInvoice(false);
          errorAlert("There is some Issue.");
        });
    }
  };
  return (
    <div>
      {alert}
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
                              Amount ({currency.sign})
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
                        <h4 className={classes.cardTitleText}>Tax</h4>
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
                            label="Tax"
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
                              Amount ({currency.sign})
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
                          Select Supplier
                        </h4>
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
                            error={formState.errors.selectedVendor === "error"}
                            helperText={
                              formState.errors.selectedVendor === "error"
                                ? "Valid Supplier Name is required"
                                : null
                            }
                            className={classes.textField}
                            fullWidth={true}
                            label="Select Supplier"
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
                              Choose Supplier
                            </MenuItem>
                            {formState.vendors.map((vendor, index) => {
                              return (
                                <MenuItem key={index} value={vendor._id}>
                                  {vendor.level1.vendorName}
                                </MenuItem>
                              );
                            })}
                          </TextField>
                        </GridItem>
                        {/* {formState.selectedVendor !== null ? 
                      <GridItem
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                      >
                      <BuildNetwork
                        goBack={()=>console.log('x')}
                        vendorData={formState.vendors.find(v=>v._id==formState.selectedVendor)}
                      />
                      </GridItem>:''} */}
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
                            Select Supplier
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
                      {edit ? "Edit Invoice" : "Create Invoice"}
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
                              style={{ width: 120, height: 120 }}
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
                            {formState.values.selectedVendor != "" ||
                            null ||
                            undefined ? (
                              <div>
                                <Typography variant="h6" component="h2">
                                  {formState.values.selectedVendor.level1
                                    .vendorName || "Supplier Name"}
                                </Typography>
                                <Typography variant="body2" component="h2">
                                  {formState.values.selectedVendor.level1
                                    .site || "Supplier Site"}
                                </Typography>
                              </div>
                            ) : (
                              <div>
                                <Typography variant="h6" component="h2">
                                  Supplier Name
                                </Typography>
                                <Typography variant="body2" component="h2">
                                  Supplier Site
                                </Typography>
                              </div>
                            )}
                          </GridItem>
                        </GridContainer>
                      </Card>
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
                                {cu.Name.toUpperCase()}
                              </MenuItem>
                            ))}
                          </TextField>
                        </GridItem>
                      </GridContainer>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <Items
                      formState={formState}
                      items={items}
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
                            variant="body1"
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
                    {!edit ? (
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
                              variant="body1"
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
                    ) : (
                      ""
                    )}
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
                              <TableCell>Sub Total</TableCell>
                              <TableCell>
                                <TextField
                                  label={`Sub Total(${currency.sign})`}
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
                              </TableCell>
                              <TableCell>
                                <TextField
                                  label={`Discount(${currency.sign})`}
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
                                Tax
                              </TableCell>
                              <TableCell>
                                <TextField
                                  label={`Tax(${currency.sign})`}
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
                              </TableCell>
                              <TableCell component="th" scope="row">
                                <TextField
                                  label={`Total(${currency.sign})`}
                                  id="total"
                                  name="total"
                                  disabled={true}
                                  type="number"
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
                        onClick={createInvoice}
                        round
                      >
                        {isSavingInvoice ? (
                          <CircularProgress color="primary" />
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
        ""
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
                    <h4 className={classes.cardTitleText}>{file.title}</h4>
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
                  {file.file.type == "application/pdf" ? (
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

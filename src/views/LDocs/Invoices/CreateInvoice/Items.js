import React, { useState } from "react";
// @material-ui/core components
import {
  TextField,
  makeStyles,
  Tooltip,
  IconButton,
  withStyles,
  MenuItem,
  Typography,
  Select,
  Input,
} from "@material-ui/core";
// core components
import GridItem from "components/Grid/GridItem.js";
import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import CreateIcon from "@material-ui/icons/Create";
import { useDispatch, useSelector } from "react-redux";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import axios from "axios";
import { Visibility } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { setIsTokenExpired } from "actions/index";
import { conversionRate } from "views/LDocs/Functions/Functions";
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
    width: 300,
  },
  itemNumber: {
    width: "55%",
  },
};
const useStyles = makeStyles(styles);

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.action.hover,
    // color: theme.palette.common.black,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    // "&:nth-of-type(odd)": {
    //   backgroundColor: theme.palette.action.hover,
    // },
  },
}))(TableRow);

export default function Items(props) {
  const Token =
    useSelector((state) => state.userReducer.Token) ||
    localStorage.getItem("cooljwt");
  const dispatch = useDispatch();
  const Check = require("is-null-empty-or-undefined").Check;

  let {
    formState,
    items,
    addZeroes,
    handleChange,
    handleEditItem,
    removeItem,
    addInvoiceItem,
    addItem,
    editIndex,
    editItem,
    addingItem,
    setAddingItem,
    setCategory,
    setEditIndex,
    category,
    currency,
    viewPO,
    pos,
    isVendor,
    createReceipts,
    receipts,
    currencyLookups,
    baseCurrency,
    userData,
    edit,
    isAr
  } = props;
  const classes = useStyles();
  const [lookups, setLookups] = useState([]);
  const [baseCurr, setBaseCurr] = useState();
  
  //getLookups
  const getLookUp = async () => {
    return new Promise((res, rej) => {
      axios({
        method: "get", //you can set what request you want to be
        url: `${process.env.REACT_APP_LDOCS_API_URL}/lookup/getLookups/3`,
        headers: {
          cooljwt: Token,
        },
      })
        .then((response) => {
          setLookups(response.data.result);
        })
        .catch((error) => {
          if (error.response) {
             error.response.status == 401 && dispatch(setIsTokenExpired(true));
          }
          console.log(error);
          rej([]);
        });
    });
  };

  React.useEffect(() => {
    getLookUp();
  }, []);

  React.useEffect(()=>{
    setBaseCurr(baseCurrency ? baseCurrency : !isVendor ? userData.currency.Currency_Base : formState.selectedOrg ? formState.selectedOrg.currency : '');
  },[formState])

  return (
    <GridItem xs={12} sm={12} md={12} lg={12}>
      <TableContainer
        component={Paper}
        style={{
          borderBottom:
            formState.errors.items === "error" ? "2px red solid" : "none",
        }}
      >
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>#</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell align="right">
                Unit Cost ({currency.Code || "$"})
              </StyledTableCell>
              <StyledTableCell align="right">Quantity</StyledTableCell>
              <StyledTableCell align="right">Discount (%)</StyledTableCell>
              <StyledTableCell align="right">
                Amount ({currency.Code || "$"})
              </StyledTableCell>
              <StyledTableCell> </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((row, index) =>
              editIndex == index ? (
                <React.Fragment>
                  <StyledTableRow key={"AddingItem"}>
                    <StyledTableCell style={{ width: 100 }}>
                      <TextField
                        fullWidth={true}
                        label="ID "
                        type="number"
                        disabled={true}
                        value={index + 1 || ""}
                        className={classes.textField}
                      />
                    </StyledTableCell>
                    <StyledTableCell
                      style={{ minWidth: 300 }}
                      component="th"
                      scope="row"
                    >
                      <TextField
                        fullWidth={true}
                        error={formState.errors.itemName === "error"}
                        helperText={
                          formState.errors.itemName === "error"
                            ? "Valid Item Name is required"
                            : null
                        }
                        label="Item Name "
                        id="item"
                        name="itemName"
                        onChange={(event) => {
                          handleChange(event);
                        }}
                        type="text"
                        value={formState.values.itemName || ""}
                        className={classes.itemName}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <TextField
                        fullWidth={true}
                        error={formState.errors.unitCost === "error"}
                        helperText={
                          formState.errors.unitCost === "error"
                            ? "Valid Unit Cost is required"
                            : null
                        }
                        label="Unit Cost"
                        id="unitcost"
                        name="unitCost"
                        onChange={(event) => {
                          handleChange(event);
                        }}
                        type="number"
                        value={formState.values.unitCost || ""}
                        className={classes.textField}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <TextField
                        fullWidth={true}
                        error={formState.errors.quantity === "error"}
                        helperText={
                          formState.errors.quantity === "error"
                            ? "Valid Quantity is required"
                            : null
                        }
                        label="Quantity"
                        id="quantity"
                        name="quantity"
                        onChange={(event) => {
                          handleChange(event);
                        }}
                        type="number"
                        value={formState.values.quantity || ""}
                        className={classes.textField}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <TextField
                        fullWidth={true}
                        error={formState.errors.discount === "error"}
                        helperText={
                          formState.errors.discount === "error"
                            ? "Valid Discount is required"
                            : null
                        }
                        label="Discount "
                        id="discount"
                        name="discount"
                        onChange={(event) => {
                          handleChange(event);
                        }}
                        type="number"
                        value={addZeroes(formState.values.discount) || 0.0}
                        className={classes.textField}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <TextField
                        fullWidth={true}
                        label="Amount"
                        id="item"
                        name="amount"
                        onChange={(event) => {
                          handleChange(event);
                        }}
                        disabled={true}
                        type="number"
                        value={
                          addZeroes(
                            parseFloat(formState.values.unitCost) *
                              parseFloat(formState.values.quantity) -
                              parseFloat(
                                (formState.values.unitCost *
                                  formState.values.discount) /
                                  100
                              ) *
                                formState.values.quantity
                          ) || 0.0
                        }
                        className={classes.textField}
                      />
                    </StyledTableCell>
                    <StyledTableCell style={{ width: 100 }} align="right">
                      <Tooltip title="Save Chnages" aria-label="save">
                        <IconButton onClick={() => editItem(index)}>
                          <CheckCircleOutlineIcon
                            style={{ color: "green" }}
                            size="small"
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Close" aria-label="close">
                        <IconButton onClick={() => setEditIndex(null)}>
                          <HighlightOffIcon
                            style={{ color: "red" }}
                            size="small"
                          />
                        </IconButton>
                      </Tooltip>
                    </StyledTableCell>
                  </StyledTableRow>
                  {/* <StyledTableRow key={"Item"}>
                    <StyledTableCell colSpan="2">
                      <TextField
                        fullWidth={true}
                        // error={Check(row.receiptNumber)}
                        // helperText={
                        //   formState.errors.receiptNumber === "error"
                        //     ? "Valid Receipt Number is required"
                        //     : null
                        // }
                        label="Receipt Number"
                        id="receiptNumber"
                        name="receiptNumber"
                        onChange={(event) => {
                          handleChange(event);
                        }}
                        disabled={true}
                        type="text"
                        value={formState.values.receiptNumber || ""}
                      />
                    </StyledTableCell>
                    <StyledTableCell colSpan="2">
                      <TextField
                        fullWidth={true}
                        label="Category"
                        id="cat"
                        name="cat"
                        defaultValue="1"
                        disabled={true}
                        value={category}
                        onChange={(event) => {
                          setCategory(event.target.value);
                        }}
                        select
                      >
                        
                        <MenuItem value={1}>Purchase Order</MenuItem>
                        <MenuItem disabled={isVendor} value={2}>Expense</MenuItem>
                      </TextField>
                    </StyledTableCell>
                    <StyledTableCell colSpan={category == 1 && formState.values.poInline ? "2" : "3"}>
                      {category == 1 ? (
                        <TextField
                          fullWidth={true}
                          // error={Check(row.poInline)}
                          // helperText={
                          //   formState.errors.poInline === "error"
                          //     ? "Valid PO Number is required"
                          //     : null
                          // }
                          label={`PO Number`}
                          id="poInline"
                          name="poInline"
                          disabled={true}
                          onChange={(event) => {
                            handleChange(event);
                          }}
                          value={formState.values.poNumber || ""}
                          select
                        >
                          {pos.map((po, index) => (
                            <MenuItem key={index} value={po.poNumber}>
                             {po.poNumber}
                            </MenuItem>
                          ))}
                        </TextField>
                      ) : (
                        <TextField
                          fullWidth={true}
                          // error={Check(row.expenseType)}
                          // helperText={
                          //   formState.errors.expenseType === "error"
                          //     ? "Valid Expense Type is required"
                          //     : null
                          // }
                          // label="Expense Type"
                          id="expenseType"
                          disabled={true}
                          name="expenseType"
                          value={formState.values.expenseType}
                          onChange={(event) => {
                            handleChange(event);
                          }}
                          select
                        >
                          {lookups.map((lookup, index) => (
                            <MenuItem key={index} value={lookup._id}>
                              {lookup.Name}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    </StyledTableCell>
                    {category == 1 && formState.values.poInline ? 
                    <StyledTableCell style={{ width: 100 }} align="right" colSpan="1">
                      <Tooltip title="View PO">
                    <IconButton onClick={()=> viewPO()}>
                      <Visibility />
                    </IconButton>
                    </Tooltip>
                    </StyledTableCell>
                    :""}
                  </StyledTableRow> */}
                  <StyledTableRow key={"AddingItem1"}>
                    {!isVendor && formState.isReceipt && formState.isPo ? (
                      <React.Fragment>
                        <StyledTableCell colSpan="2">
                          <Select
                            className={classes.textField}
                            multiple
                            fullWidth={true}
                            error={formState.errors.receiptNumber === "error"}
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
                            // variant="outlined"
                            value={formState.values.receiptNumber || []}
                            input={<Input />}
                            // MenuProps={MenuProps}
                            select
                          >
                            <MenuItem disabled={true} key={"disabled"}>
                              Receipt Number
                            </MenuItem>
                            {receipts.map((r, index) => {
                              return (
                                <MenuItem key={index} value={r.receiptNumber}>
                                  {r.receiptNumber}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </StyledTableCell>
                        <StyledTableCell style={{ paddingTop: 30 }} colSpan="1">
                          <Tooltip title="Create Receipt">
                            <IconButton
                              onClick={createReceipts}
                              style={{ background: "lightgrey" }}
                            >
                              <AddCircleOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </StyledTableCell>
                      </React.Fragment>
                    ) : (
                      ""
                    )}
                    {formState.isPeetyCash ? (
                      <StyledTableCell style={{ paddingTop: 30 }} colSpan="3">
                        <TextField
                          className={classes.textField}
                          fullWidth={true}
                          error={formState.errors.inlineExpenseType === "error"}
                          helperText={
                            formState.errors.inlineExpenseType === "error"
                              ? "Valid Expense Type required"
                              : null
                          }
                          label="ExpenseType"
                          id="inlineExpenseType"
                          name="inlineExpenseType"
                          onChange={(event) => {
                            handleChange(event);
                          }}
                          // variant="outlined"
                          value={formState.values.inlineExpenseType}
                          // MenuProps={MenuProps}
                          select
                        >
                          <MenuItem disabled={true} key={"disabled"}>
                            Expense Type
                          </MenuItem>
                          {formState.expenseTypes
                            ? formState.expenseTypes.map((exp, index) => (
                              <MenuItem key={index} value={exp.Acc_Description}>
                              {exp.Acc_Description}
                            </MenuItem>
                              ))
                            : ""}
                        </TextField>
                      </StyledTableCell>
                    ) : (
                      ""
                    )}
                    <StyledTableCell
                      colSpan={
                        (!isVendor && formState.isPo) || formState.isPeetyCash
                          ? formState.isPrePayment && formState.isPo
                            ? "8"
                            : "5"
                          : "8"
                      }
                    >
                      <TextField
                        fullWidth={true}
                        error={formState.errors.additionalDetails === "error"}
                        helperText={
                          formState.errors.additionalDetails === "error"
                            ? "Valid Additional Details is required"
                            : null
                        }
                        label="Additonal Details"
                        id="additionaldetails"
                        name="additionalDetails"
                        onChange={(event) => {
                          handleChange(event);
                        }}
                        multiline
                        rows={1}
                        type="text"
                        value={formState.values.additionalDetails || ""}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <StyledTableRow key={row.itemName}>
                    <StyledTableCell style={{ width: 100 }}>
                      {row.receiptNumber.length < 1 &&
                      !isVendor &&
                      formState.isReceipt &&
                      formState.isPo ? (
                        <Tooltip
                          title="Receipt Number is Missing.."
                          aria-label="edit"
                        >
                          <IconButton
                            onClick={() => handleEditItem(row, index)}
                          >
                            <ErrorOutlineIcon
                              fontSize="small"
                              style={{ color: "orange" }}
                            />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        index + 1
                      )}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{ width: 400 }}
                      component="th"
                      scope="row"
                    >
                      {row.itemName}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {`${currency.Code} `} 
                      {addZeroes(row.unitCost)}
                      <br />
                      {currency._id != baseCurr &&  conversionRate(
                        currency._id,
                        baseCurr,
                        currencyLookups,
                        row.unitCost,
                        false,
                        edit,
                        formState.conversionRate ? formState.conversionRate : 0 
                      )}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {addZeroes(row.quantity)}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {addZeroes(row.discount)}%
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {`${currency.Code} `} 
                      {addZeroes(row.amount)}
                      <br />
                      {currency._id != baseCurr && conversionRate(
                        currency._id,
                        baseCurrency ? baseCurrency : !isVendor ? userData.currency.Currency_Base : formState.selectedOrg ? formState.selectedOrg.currency : '',
                        currencyLookups,
                        row.amount,
                        false,
                        edit,
                        formState.conversionRate ? formState.conversionRate : 0 
                      )}
                    </StyledTableCell>
                    <StyledTableCell style={{ width: 100 }} align="right">
                      <Tooltip title="Edit Item" aria-label="edit">
                        <IconButton onClick={() => handleEditItem(row, index)}>
                          <CreateIcon
                            style={{ color: "orange" }}
                            size="small"
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remove Item" aria-label="add">
                        <IconButton onClick={() => removeItem(index)}>
                          <HighlightOffIcon
                            style={{ color: "red" }}
                            size="small"
                          />
                        </IconButton>
                      </Tooltip>
                    </StyledTableCell>
                  </StyledTableRow>
                </React.Fragment>
              )
            )}
            {addingItem ? (
              <React.Fragment>
                <StyledTableRow key={"AddingItem"}>
                  <StyledTableCell style={{ width: 100 }}>
                    <TextField
                      fullWidth={true}
                      label="ID "
                      type="number"
                      disabled={true}
                      value={items.length + 1 || ""}
                      className={classes.textField}
                    />
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ minWidth: 300 }}
                    component="th"
                    scope="row"
                  >
                    <TextField
                      fullWidth={true}
                      error={formState.errors.itemName === "error"}
                      helperText={
                        formState.errors.itemName === "error"
                          ? "Valid Item Name is required"
                          : null
                      }
                      label="Item Name "
                      id="item"
                      name="itemName"
                      onChange={(event) => {
                        handleChange(event);
                      }}
                      type="text"
                      value={formState.values.itemName || ""}
                      className={classes.itemName}
                    />
                  </StyledTableCell>

                  <StyledTableCell align="right">
                    <TextField
                      fullWidth={true}
                      error={formState.errors.unitCost === "error"}
                      helperText={
                        formState.errors.unitCost === "error"
                          ? "Valid Unit Cost is required"
                          : null
                      }
                      label="Unit Cost"
                      id="unitcost"
                      name="unitCost"
                      onChange={(event) => {
                        handleChange(event);
                      }}
                      type="number"
                      value={formState.values.unitCost || ""}
                      className={classes.textField}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <TextField
                      fullWidth={true}
                      error={formState.errors.quantity === "error"}
                      helperText={
                        formState.errors.quantity === "error"
                          ? "Valid Quantity is required"
                          : null
                      }
                      label="Quantity"
                      id="quantity"
                      name="quantity"
                      onChange={(event) => {
                        handleChange(event);
                      }}
                      type="number"
                      value={formState.values.quantity || ""}
                      className={classes.textField}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <TextField
                      fullWidth={true}
                      error={formState.errors.discount === "error"}
                      helperText={
                        formState.errors.discount === "error"
                          ? "Valid Discount is required"
                          : null
                      }
                      label="Discount "
                      id="discount"
                      name="discount"
                      onChange={(event) => {
                        handleChange(event);
                      }}
                      type="number"
                      value={formState.values.discount || 0.0}
                      className={classes.textField}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <TextField
                      fullWidth={true}
                      label="Amount"
                      id="item"
                      name="amount"
                      onChange={(event) => {
                        handleChange(event);
                      }}
                      disabled={true}
                      type="number"
                      value={
                        addZeroes(
                          parseFloat(formState.values.unitCost) *
                            parseFloat(formState.values.quantity) -
                            parseFloat(
                              (formState.values.unitCost *
                                formState.values.discount) /
                                100
                            ) *
                              formState.values.quantity
                        ) || 0.0
                      }
                      className={classes.textField}
                    />
                  </StyledTableCell>
                  <StyledTableCell style={{ width: 100 }} align="right">
                    <Tooltip title="Save Chnages" aria-label="save">
                      <IconButton onClick={addItem}>
                        <CheckCircleOutlineIcon
                          style={{ color: "green" }}
                          size="small"
                        />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove Item" aria-label="remove">
                      <IconButton onClick={() => setAddingItem(false)}>
                        <HighlightOffIcon
                          style={{ color: "red" }}
                          size="small"
                        />
                      </IconButton>
                    </Tooltip>
                  </StyledTableCell>
                </StyledTableRow>
                {/* <StyledTableRow key={"Item"}>
                  <StyledTableCell colSpan="2">
                    <TextField
                      fullWidth={true}
                      // error={formState.errors.receiptNumber === "error"}
                      // helperText={
                      //   formState.errors.receiptNumber === "error"
                      //     ? "Valid Receipt Number is required"
                      //     : null
                      // }
                      label="Receipt Number"
                      id="receiptNumber"
                      name="receiptNumber"
                      disabled={true}
                      onChange={(event) => {
                        handleChange(event);
                      }}
                      type="text"
                      value={formState.values.receiptNumber || ""}
                    />
                  </StyledTableCell>
                  <StyledTableCell colSpan="2">
                    <TextField
                      fullWidth={true}
                      label="Category"
                      id="cat"
                      name="cat"
                      value={category}
                      disabled={true}
                      onChange={(event) => {
                        setCategory(event.target.value);
                      }}
                      select
                    >
                      <MenuItem value={1}>Purchase Order</MenuItem>
                      <MenuItem disabled={isVendor} value={2}>Expense</MenuItem>
                    </TextField>
                  </StyledTableCell>
                  <StyledTableCell colSpan={category == 1 && formState.values.poInline ? "2" : "3"}>
                    {category == 1 ? (
                      <TextField
                        fullWidth={true}
                        // error={formState.errors.poInline === "error"}
                        // helperText={
                        //   formState.errors.poInline === "error"
                        //     ? "Valid PO Number is required"
                        //     : null
                        // }
                        label="PO Number"
                        id="poInline"
                        name="poInline"
                        disabled={true}
                        onChange={(event) => {
                          handleChange(event);
                        }}
                        value={formState.values.poNumber || ""}
                        select
                        >
                          {pos.map((po, index) => (
                            <MenuItem key={index} value={po.poNumber}>
                              {po.poNumber}
                            </MenuItem>
                          ))}
                        </TextField>
                    ) : (
                      <TextField
                        fullWidth={true}
                        error={formState.errors.expenseType === "error"}
                        helperText={
                          formState.errors.expenseType === "error"
                            ? "Valid Expense Type is required"
                            : null
                        }
                        label="Expense Type"
                        id="expenseType"
                        disabled={true}
                        name="expenseType"
                        value={formState.values.expenseType}
                        onChange={(event) => {
                          handleChange(event);
                        }}
                        select
                      >
                        {lookups.map((lookup, index) => (
                          <MenuItem key={index} value={lookup._id}>
                            {lookup.Name}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  </StyledTableCell>
                  {category  == 1 && formState.values.poInline ? 
                    <StyledTableCell style={{ width: 100 }} align="right" colSpan="1">
                      <Tooltip title="View PO">
                    <IconButton onClick={()=> viewPO()}>
                      <Visibility fontSize="small" />
                    </IconButton>
                    </Tooltip>
                    </StyledTableCell>
                    :""}
                </StyledTableRow> */}
                <StyledTableRow key={"AddingItem1"}>
                  {!isVendor && formState.isReceipt && formState.isPo ? (
                    <React.Fragment>
                      <StyledTableCell style={{ paddingTop: 30 }} colSpan="2">
                        <Select
                          className={classes.textField}
                          multiple
                          fullWidth={true}
                          error={formState.errors.receiptNumber === "error"}
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
                          // variant="outlined"
                          value={formState.values.receiptNumber || []}
                          input={<Input />}
                          // MenuProps={MenuProps}
                          select
                        >
                          <MenuItem disabled={true} key={"disabled"}>
                            Receipt Number
                          </MenuItem>
                          {receipts.map((r, index) => {
                            return (
                              <MenuItem key={index} value={r.receiptNumber}>
                                {r.receiptNumber}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </StyledTableCell>
                      <StyledTableCell style={{ paddingTop: 30 }} colSpan="1">
                        <Tooltip
                          onClick={createReceipts}
                          title="Create Receipt"
                        >
                          <IconButton style={{ background: "lightgrey" }}>
                            <AddCircleOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </StyledTableCell>
                    </React.Fragment>
                  ) : (
                    ""
                  )}
                  {formState.isPeetyCash ? (
                    <StyledTableCell style={{ paddingTop: 30 }} colSpan="3">
                      <TextField
                        className={classes.textField}
                        fullWidth={true}
                        error={formState.errors.inlineExpenseType === "error"}
                        helperText={
                          formState.errors.inlineExpenseType === "error"
                            ? "Valid Expense Type required"
                            : null
                        }
                        label={isAr ? "Revenue Type" : "Expense Type"}
                        id="inlineExpenseType"
                        name="inlineExpenseType"
                        onChange={(event) => {
                          handleChange(event);
                        }}
                        // variant="outlined"
                        value={formState.values.inlineExpenseType}
                        // MenuProps={MenuProps}
                        select
                      >
                        <MenuItem disabled={true} key={"disabled"}>
                          {isAr ? "Revenue Type" : "Expense Type"}
                        </MenuItem>
                        {formState.expenseTypes
                          ? formState.expenseTypes.map((exp, index) => (
                            <MenuItem key={index} value={exp.Acc_Description}>
                            {exp.Acc_Description}
                          </MenuItem>
                            ))
                          : ""}
                      </TextField>
                    </StyledTableCell>
                  ) : (
                    ""
                  )}
                  <StyledTableCell
                    colSpan={
                      (!isVendor && formState.isPo) || formState.isPeetyCash
                        ? formState.isPrePayment && formState.isPo
                          ? "8"
                          : "5"
                        : "8"
                    }
                  >
                    <TextField
                      fullWidth={true}
                      error={formState.errors.additionalDetails === "error"}
                      helperText={
                        formState.errors.additionalDetails === "error"
                          ? "Valid Additional Details is required"
                          : null
                      }
                      label="Additonal Details"
                      id="additionaldetails"
                      name="additionalDetails"
                      onChange={(event) => {
                        handleChange(event);
                      }}
                      multiline
                      rows={1}
                      type="text"
                      value={formState.values.additionalDetails || ""}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              </React.Fragment>
            ) : (
              ""
            )}
            {!addingItem && editIndex == null ? (
              <StyledTableRow key={"AddItem"}>
                <StyledTableCell colSpan="8" align="center">
                  <Tooltip title="Add Item" aria-label="add">
                    {/* <Fab color="secoundry" className={classes.fab}> */}
                    <IconButton onClick={addInvoiceItem}>
                      <AddCircleOutlineIcon />
                    </IconButton>
                    {/* </Fab> */}
                  </Tooltip>
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              ""
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </GridItem>
  );
}

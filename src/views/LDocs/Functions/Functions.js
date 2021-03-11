import React from "react";
// @material-ui/icons
import { makeStyles } from "@material-ui/core";

import SweetAlert from "react-bootstrap-sweetalert";
import styles2 from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import axios from "axios";
import dateFormat from "dateformat";

// const sweetAlertStyle = makeStyles(styles2);
// const sweetClass = sweetAlertStyle();

// export const successAlert = (msg) => {
//        <SweetAlert
//          success
//          style={{ display: "block", marginTop: "-100px" }}
//          title="Success!"
//          confirmBtnCssClass={sweetClass.button + " " + sweetClass.success}
//        >
//          {msg}
//        </SweetAlert>
//    };
// export const errorAlert = (msg) => {
//        <SweetAlert
//          error
//          style={{ display: "block", marginTop: "-100px" }}
//          title="Error!"
//          confirmBtnCssClass={sweetClass.button + " " + sweetClass.danger}
//        >
//          {msg}<br />
//          Unable To Update Level 1 Please Contact {process.env.REACT_APP_LDOCS_CONTACT_MAIL}
//        </SweetAlert>
//    };



export function addZeroes(num) {
  num = typeof num == 'string' ? num : num.toString();
  var value = Number(num);
  var res = num.toString().split(".");
  if (res.length == 1 || res[1].length < 1) {
    value = value.toFixed(2);
  }
  return value;
}

export const formatDateTime = (date) => {
  return dateFormat(date, "dd/mm/yyyy hh:mm:ss")
}

export const validateInvoice = (row, Token) => {
  return new Promise((res, rej) => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_LDOCS_API_BOOKCHAIN_URL}/api/validate-invoice/18-ORGONE-1`,
    })
      .then((blockchainRes) => {
        const blockchain = JSON.parse(blockchainRes.data.Record);
        axios({
          method: "get", //you can set what request you want to be
          url: `${process.env.REACT_APP_LDOCS_API_URL}/invoice/getInvoiceOrg/${row.organizationId}`,
          data: { pagination: "1", page: "1" },
          headers: {
            cooljwt: Token,
          },
        })
          .then((invoiceRes) => {
            if (invoiceRes.data !== null || undefined) {
              const invoice = invoiceRes.data.find(
                (invoice) =>
                  invoice.invoiceId == "18-ORGONE" &&
                  invoice.version == row.version
              );
              let isInvoiceDateSame;
              let isVendorIDSame;
              let isItemCountSame;
              let isGrossAmtSame;
              let isOrganizationIDSame;
              let isDiscountPercentageSame;
              let isTaxAmtSame;
              let isNetAmtSame;
              let isTenantIDSame;
              let isCreatedDateSame;
              let isCreatedBySame;
              let isValidate;
              if (
                new Date(invoice.invoiceDate).getTime() ==
                new Date(blockchain.InvoiceDate).getTime()
              ) {
                isInvoiceDateSame = true;
              } else {
                isInvoiceDateSame = false;
              }
              if (invoice.vendorId == blockchain.VendorID) {
                isVendorIDSame = true;
              } else {
                isVendorIDSame = false;
              }
              if (invoice.items.length == blockchain.ItemCount) {
                isItemCountSame = true;
              } else {
                isItemCountSame = false;
              }
              if (invoice.grossAmt == blockchain.GrossAmt) {
                isGrossAmtSame = true;
              } else {
                isGrossAmtSame = false;
              }
              if (invoice.organizationId == blockchain.OrganizationID) {
                isOrganizationIDSame = true;
              } else {
                isOrganizationIDSame = false;
              }
              if (invoice.taxAmt == blockchain.TaxAmt) {
                isTaxAmtSame = true;
              } else {
                isTaxAmtSame = false;
              }
              if (invoice.discountPercent == blockchain.DiscountPercentage) {
                isDiscountPercentageSame = true;
              } else {
                isDiscountPercentageSame = false;
              }
              if (invoice.netAmt == blockchain.NetAmt) {
                isNetAmtSame = true;
              } else {
                isNetAmtSame = false;
              }
              if (invoice.tenantId == blockchain.TenantID) {
                isTenantIDSame = true;
              } else {
                isTenantIDSame = false;
              }
              if (
                new Date(invoice.createdDate).getTime() ==
                new Date(blockchain.CreatedDate).getTime()
              ) {
                isCreatedDateSame = true;
              } else {
                isCreatedDateSame = false;
              }
              if (invoice.createdBy == blockchain.CreatedBy) {
                isCreatedBySame = true;
              } else {
                isCreatedBySame = false;
              }
              if (
                !isInvoiceDateSame ||
                !isVendorIDSame ||
                !isItemCountSame ||
                !isGrossAmtSame ||
                !isOrganizationIDSame ||
                !isDiscountPercentageSame ||
                !isTaxAmtSame ||
                !isNetAmtSame ||
                !isTenantIDSame ||
                !isCreatedDateSame ||
                !isCreatedBySame
              ) {
                isValidate = false;
              } else {
                isValidate = true;
              }
              const ValidationData = {
                InvoiceDate: {
                  onChain: dateFormat(blockchain.InvoiceDate, "dd/mm/yyyy"),
                  offChain: dateFormat(invoice.invoiceDate, "dd/mm/yyyy"),
                  isSame: isInvoiceDateSame,
                },
                VendorID: {
                  onChain: blockchain.VendorID,
                  offChain: invoice.vendorId,
                  isSame: isVendorIDSame,
                },
                ItemCount: {
                  onChain: blockchain.ItemCount,
                  offChain: invoice.items.length,
                  isSame: isItemCountSame,
                },
                GrossAmt: {
                  onChain: blockchain.GrossAmt,
                  offChain: invoice.grossAmt,
                  isSame: isGrossAmtSame,
                },
                OrganizationID: {
                  onChain: blockchain.OrganizationID,
                  offChain: invoice.organizationId,
                  isSame: isOrganizationIDSame,
                },
                DiscountPercentage: {
                  onChain: blockchain.DiscountPercentage,
                  offChain: invoice.discountPercent,
                  isSame: isDiscountPercentageSame,
                },
                TaxAmt: {
                  onChain: blockchain.TaxAmt,
                  offChain: invoice.taxAmt,
                  isSame: isTaxAmtSame,
                },
                NetAmt: {
                  onChain: blockchain.NetAmt,
                  offChain: invoice.netAmt,
                  isSame: isNetAmtSame,
                },
                TenantID: {
                  onChain: blockchain.TenantID,
                  offChain: invoice.tenantId,
                  isSame: isTenantIDSame,
                },
                CreatedDate: {
                  onChain: dateFormat(blockchain.CreatedDate, "dd/mm/yyyy"),
                  offChain: dateFormat(invoice.createdDate, "dd/mm/yyyy"),
                  isSame: isCreatedDateSame,
                },
                CreatedBy: {
                  onChain: blockchain.CreatedBy,
                  offChain: invoice.createdBy,
                  isSame: isCreatedBySame,
                },
                IsValidate: {
                  isSame: isValidate,
                },
              };
              res(ValidationData);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

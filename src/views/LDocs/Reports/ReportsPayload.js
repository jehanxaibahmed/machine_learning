import ReceivableAnalyticsImage from "assets/img/aging/chart-2-512 (1).png";
import ReceivableAgingImage from "assets/img/aging/AR_Aging-512.png";
import PayableAnalyticsImage from "assets/img/aging/chart-512 (2).png";
import PayableAgingImage from "assets/img/aging/AP_Aging-2-512.png";

import CashflowImage from "assets/img/aging/cash-2-512.png";



export const ArReports = (permissions) => {
  console.log("AR", permissions);
  return [
    permissions?.arAnalytics?.enable ?
    {
      "id": 1,
      "name": "Receivable Analytics",
      "title": "Analytical Summary of Accounts Receivable ",
      "link": "../default/financeDashboard/ar",
      "icon": ReceivableAnalyticsImage,
      "isImg": true
    }:{},
    permissions?.invoiceAging?.enable ?
    {
      "id": 2,
      "name": "Receivable Aging",
      "title": "Aging Report of Accounts Receivable",
      "link": "../default/invoice-aging/ar",
      "icon": ReceivableAgingImage,
      "isImg": true,
    }:{},
    permissions?.invoiceAging?.enable ?
    {
      "id": 3,
      "name": "Customer 360",
      "title": "Ledger Report of a Customer",
      "link": "../default/clientledger/ar",
      "icon": ReceivableAgingImage,
      "isImg": true,
    }:{},

  ];
}

export const ApReports = (permissions) => {
  console.log("AP", permissions);

  return [
    permissions?.apAnalytics?.enable ?
    {
      "id": 4,
      "name": "Payable Analytics",
      "title": "Analytical Summary of Accounts Payable ",
      "link": "../default/financeDashboard/ap",
      "icon": PayableAnalyticsImage,
      "isImg": true,
    }:{},
    permissions?.invoiceAging?.enable ?
    {
      "id": 5,
      "name": "Payable Aging",
      "title": "Aging Report of Accounts Payable",
      "link": "../default/invoice-aging/ap",
      "icon": PayableAgingImage,
      "isImg": true,
    }:{},
    permissions?.invoiceAging?.enable ?
    {
      "id": 6,
      "name": "Supplier 360",
      "title": "Ledger Report of Vendor",
      "link": "../default/supplierledger/ap",
      "icon": PayableAgingImage,
      "isImg": true,
    }:{},
  ];

}
const Reports = [

  {
    "id": 7,
    "name": "Cashflow",
    "title": "An overview of the Receivable and Payable Cash Flows",
    "link": "../default/cashflow",
    "icon": CashflowImage,
    "isImg": true
  }
]


export default Reports;
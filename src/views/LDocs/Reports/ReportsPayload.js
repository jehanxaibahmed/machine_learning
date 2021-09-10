import ReceivableAnalyticsImage from "assets/img/aging/chart-2-512 (1).png";
import ReceivableAgingImage from "assets/img/aging/AR_Aging-512.png";
import PayableAnalyticsImage from "assets/img/aging/chart-512 (2).png";
import PayableAgingImage from "assets/img/aging/AP_Aging-2-512.png";

import CashflowImage from "assets/img/aging/cash-2-512.png";



export const ArReports = [
  {
    "id": 1,
    "name": "Receivable Analytics",
    "title":"Analytical Summary of Accounts Receivable ",
    "link": "./financeDashboard/ar",
    "icon":ReceivableAnalyticsImage,
    "isImg":true
  },
  {
    "id": 2,
    "name": "Receivable Aging",
    "title":"Aging Report of Accounts Receivable",
    "link": "./invoice-aging/ar",
    "icon":ReceivableAgingImage,
    "isImg":true,
  },
  
];


export const ApReports = [
  {
    "id": 3,
    "name": "Payable Analytics",
    "title":"Analytical Summary of Accounts Payable ",
    "link": "./financeDashboard/ap",
    "icon":PayableAnalyticsImage,
    "isImg":true,
  },
  
  {
    "id": 4,
    "name": "Payable Aging",
    "title":"Aging Report of Accounts Payable",
    "link": "./invoice-aging/ap",
    "icon":PayableAgingImage,
    "isImg":true,
  },
  ];

  
const Reports = [
  
  {
    "id": 5,
    "name": "Cashflow",
    "title":"An overview of the Receivable and Payable Cash Flows",
    "link": "./cashflow",
    "icon":CashflowImage,
    "isImg":true
  }
]


export default Reports;
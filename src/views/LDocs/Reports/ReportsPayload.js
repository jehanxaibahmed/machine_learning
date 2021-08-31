import ArImage from "assets/img/icons/ar.png";
import ApImage from "assets/img/icons/ap.png";


export const ArReports = [
  {
    "id": 1,
    "name": "Receivable Analytics",
    "title":"Analytical Summary of Accounts Receivable ",
    "link": "./financeDashboard/ar",
    "icon":ArImage,
    "isImg":true
  },
  {
    "id": 2,
    "name": "Receivable Aging",
    "title":"Aging Report of Accounts Receivable",
    "link": "./invoice-aging/ar",
    "icon":ArImage,
    "isImg":true,
  },
  
];


export const ApReports = [
  {
    "id": 3,
    "name": "Payable Analytics",
    "title":"Analytical Summary of Accounts Payable ",
    "link": "./financeDashboard/ap",
    "icon":ApImage,
    "isImg":true,
  },
  
  {
    "id": 4,
    "name": "Payable Aging",
    "title":"Aging Report of Accounts Payable",
    "link": "./invoice-aging/ap",
    "icon":ApImage,
    "isImg":true,
  },
  ];

  
const Reports = [
  
  {
    "id": 5,
    "name": "Cashflow",
    "title":"An overview of the Receivable and Payable Cash Flows",
    "link": "./cashflow",
    "icon":ArImage,
    "isImg":true
  }
]


export default Reports;
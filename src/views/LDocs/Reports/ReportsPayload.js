import ArImage from "assets/img/icons/ar.png";
import ApImage from "assets/img/icons/ap.png";


export const ArReports = [
  {
    "id": 1,
    "name": "AR ANALYTICS",
    "title":"Account Receivable Report",
    "link": "./financeDashboard/ar",
    "icon":ArImage,
    "isImg":true
  },
  {
    "id": 2,
    "name": "AR AGING",
    "title":"Account Receviable Aging Report",
    "link": "./invoice-aging/ar",
    "icon":ArImage,
    "isImg":true,
  },
  
];


export const ApReports = [
  {
    "id": 3,
    "name": "AP ANALYTICS",
    "title":"Account Payable Report",
    "link": "./financeDashboard/ap",
    "icon":ApImage,
    "isImg":true,
  },
  
  {
    "id": 4,
    "name": "AP AGING",
    "title":"Account Payable Aging Report",
    "link": "./invoice-aging/ap",
    "icon":ApImage,
    "isImg":true,
  },
  ];

  
const Reports = [
  
  {
    "id": 5,
    "name": "CASHFLOW",
    "title":"Receivables | Payable (Cash Flows)",
    "link": "./cashflow",
    "icon":ArImage,
    "isImg":true
  }
]


export default Reports;
// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import SystemUpdateIcon from "@material-ui/icons/SystemUpdate";
import WrapTextIcon from "@material-ui/icons/WrapText";
import DescriptionIcon from "@material-ui/icons/Description";
import FingerprintIcon from "@material-ui/icons/Fingerprint";
import EqualizerIcon from '@material-ui/icons/Equalizer';
import AssignmentLateIcon from "@material-ui/icons/AssignmentLate";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import ApprovalRequested from "views/LDocs/Approvals/Requested";

//Components

import FilesList from "views/LDocs/Invoices/RecieveInvoice/FilesList";
import Dashboard from "views/LDocs/Dashboard/Dashboard";
import FinanceDashboard from "views/LDocs/Dashboard/FinanceDashboard";
import Notifications from "views/LDocs/Notifications/Notifications";
import SignatureStamp from "views/LDocs/SignatureStamp/SignatureStamp";
import Verify from "views/LDocs/Verify/Verify";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import CreateInvoice from "views/LDocs/Invoices/CreateInvoice/CreateInvoice";
import InvoiceTracking from "views/LDocs/Invoices/InvoiceTracking/InvoiceTracking";
import ExportList from "views/LDocs/Invoices/ExportInvoices/FilesList";
import InvoiceAge from "views/LDocs/Invoices/InvoiceAge/InvoiceAge";
import Requested from "views/LDocs/Reviews/Requested";
import jwt from "jsonwebtoken";
const Token = localStorage.getItem('cooljwt');
let decoded = jwt.decode(Token);
console.log(decoded);


var invoiceRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: DashboardIcon,
    component: Dashboard,
    layout: "/invoice",
  },
  {
    collapse: true,
    name: "Invoice Desk",
    rtlName: "المكونات",
    icon: InsertDriveFileIcon,
    state: "InvoiceDeskCollapse",
    views: [
      {
        path: "/create",
        name: "Create Invoice",
        rtlName: "عالتسعير",
        icon: NoteAddIcon,
        rtlMini: "ع",
        component: CreateInvoice,
        layout: "/invoice",
      },
      {
        path: "/received",
        name: "Received Invoice",
        rtlName: "عالتسعير",
        icon: SystemUpdateIcon,
        rtlMini: "ع",
        component: FilesList,
        layout: "/invoice",
      },
      {
        path: "/aging",
        name: "Invoice Aging",
        rtlName: "عالتسعير",
        icon: DescriptionIcon,
        rtlMini: "ع",
        component: InvoiceAge,
        layout: "/invoice",
      },
    ],
  },
  {
    collapse: true,
    name: "Action Desk",
    rtlName: "المكونات",
    icon: AssignmentIndIcon,
    state: "ActionDeskCollapse",
    views: [
      {
        path: "/my-requests",
        name: "Review Tasks",
        rtlName: "انهيار متعدد المستويات",
        rtlMini: "ر",
        component: Requested,
        layout: "/invoice",
        icon: AssignmentLateIcon,
      }
      ,
      {
        path: "/approvals",
        name: "Approval Tasks",
        rtlName: "انهيار متعدد المستويات",
        rtlMini: "ر",
        icon: AssignmentTurnedInIcon,
        component: ApprovalRequested,
        layout: "/invoice",
      }
    ]
  },
  {
    collapse: true,
    name: "Finance Desk",
    rtlName: "المكونات",
    icon: LocalAtmIcon,
    state: "FinanceDeskCollapse",
    views: [
      {
        path: "/financeDashboard",
        name: "AP ANALYTICS",
        rtlName: "انهيار متعدد المستويات",
        rtlMini: "ر",
        icon: EqualizerIcon,
        component: FinanceDashboard,
        layout: "/invoice",
      },
      {
        path: "/export",
        name: "Export Invoices",
        rtlName: "انهيار متعدد المستويات",
        rtlMini: "ر",
        icon: SystemUpdateIcon,
        component: ExportList,
        layout: "/invoice",
      }
    ]}
  ,{
    path: "/verifier",
    name: "Tracking & Validate",
    rtlName: "أشكال عادية",
    rtlMini: "صو",
    icon: VerifiedUserIcon,
    component: Verify,
    layout: "/invoice",
  },
  {
    path: "/notifications",
    name: "Notifications",
    rtlName: "لوحة القيادة",
    icon: NotificationsActiveIcon,
    component: Notifications,
    layout: "/invoice",
  },
  {
    path: "/signature-stamp",
    name: "Signature / Stamp",
    rtlName: "أشكال عادية",
    rtlMini: "صو",
    icon: FingerprintIcon,
    component: SignatureStamp,
    layout: "/invoice",
  },
];
export default invoiceRoutes;

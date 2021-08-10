// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import SystemUpdateIcon from "@material-ui/icons/SystemUpdate";
import WrapTextIcon from "@material-ui/icons/WrapText";
import DescriptionIcon from "@material-ui/icons/Description";
import FingerprintIcon from "@material-ui/icons/Fingerprint";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import AssignmentLateIcon from "@material-ui/icons/AssignmentLate";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import LocalAtmIcon from "@material-ui/icons/LocalAtm";
import ApprovalRequested from "views/LDocs/Approvals/Requested";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import ReceiptIcon from "@material-ui/icons/Receipt";
//Components

import FilesList from "views/LDocs/Invoices/RecieveInvoice/FilesList";
import FilesListAr from "views/LDocs/Invoices/RecieveInvoice/FileListAr";
import Dashboard from "views/LDocs/Dashboard/Dashboard";
import FinanceDashboard from "views/LDocs/Dashboard/FinanceDashboard";
import Notifications from "views/LDocs/Notifications/Notifications";
import SignatureStamp from "views/LDocs/SignatureStamp/SignatureStamp";
import Verify from "views/LDocs/Verify/Verify";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import CreateInvoice from "views/LDocs/Invoices/CreateInvoice/CreateInvoice";
import InvoiceTracking from "views/LDocs/Invoices/InvoiceTracking/InvoiceTracking";
import SentList from "views/LDocs/Invoices/SentInvoices/FilesList";
import ExportList from "views/LDocs/Invoices/ExportInvoices/FilesList";
import PaymentList from "views/LDocs/Invoices/PayInvoices/FilesList";
import InvoiceAge from "views/LDocs/Invoices/InvoiceAge/InvoiceAge";
import Requested from "views/LDocs/Reviews/Requested";
import jwt from "jsonwebtoken";
import Payable from "views/LDocs/Payable/Payable";
import AgingReport from "views/LDocs/Aging/AgingReport";
import TimerIcon from "@material-ui/icons/Timer";
import Receivable from "views/LDocs/Receivable/Receivable";

const Token = localStorage.getItem("cooljwt");
let decoded = jwt.decode(Token);

export const invoiceApRoutes = [
  {
    path: "/dashboard/ap",
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
        path: "/create/ap",
        name: "Create Invoice",
        rtlName: "عالتسعير",
        icon: NoteAddIcon,
        rtlMini: "ع",
        component: CreateInvoice,
        layout: "/invoice",
      },
      {
        path: "/invoices/ap",
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
        path: "/my-requests/ap",
        name: "Review Tasks",
        rtlName: "انهيار متعدد المستويات",
        rtlMini: "ر",
        component: Requested,
        layout: "/invoice",
        icon: AssignmentLateIcon,
      },
      {
        path: "/approvals/ap",
        name: "Approval Tasks",
        rtlName: "انهيار متعدد المستويات",
        rtlMini: "ر",
        icon: AssignmentTurnedInIcon,
        component: ApprovalRequested,
        layout: "/invoice",
      },
    ],
  },
  {
    collapse: true,
    name: "Finance Desk",
    rtlName: "المكونات",
    icon: AccountBalanceIcon,
    state: "FinanceDeskCollapse",
    views: [
      {
        path: "/financeDashboard",
        name: "AP Analytics",
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
      },
      {
        path: "/payment",
        name: "Invoice Payments",
        rtlName: "انهيار متعدد المستويات",
        rtlMini: "ر",
        icon: LocalAtmIcon,
        component: PaymentList,
        layout: "/invoice",
      },
      {
        path: "/supplierledger",
        name: "Supplier 360",
        rtlName: "لوحة القيادة",
        icon: ReceiptIcon,
        component: Payable,
        layout: "/invoice",
      },
      {
        path: "/invoice-aging",
        name: "Invoice Aging",
        rtlName: "لوحة القيادة",
        icon: TimerIcon,
        component: AgingReport,
        layout: "/invoice",
      },
    ],
  },
  
];


export const invoiceArRoutes = [
  {
    path: "/dashboard/ar",
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
    state: "InvoiceDeskCollapsear",
    views: [
      {
        path: "/create/ar",
        name: "Create Invoice",
        rtlName: "عالتسعير",
        icon: NoteAddIcon,
        rtlMini: "ع",
        component: CreateInvoice,
        layout: "/invoice",
      },
      {
        path: "/invoices/ar",
        name: "Sent Invoice",
        rtlName: "عالتسعير",
        icon: SystemUpdateIcon,
        rtlMini: "ع",
        component: FilesListAr,
        layout: "/invoice",
      },
      {
        path: "/aging_ar",
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
    state: "ActionDeskCollapsear",
    views: [
      {
        path: "/my-requests/ar",
        name: "Review Tasks",
        rtlName: "انهيار متعدد المستويات",
        rtlMini: "ر",
        component: Requested,
        layout: "/invoice",
        icon: AssignmentLateIcon,
      },
      {
        path: "/approvals/ar",
        name: "Approval Tasks",
        rtlName: "انهيار متعدد المستويات",
        rtlMini: "ر",
        icon: AssignmentTurnedInIcon,
        component: ApprovalRequested,
        layout: "/invoice",
      },
    ],
  },
  {
    collapse: true,
    name: "Finance Desk",
    rtlName: "المكونات",
    icon: AccountBalanceIcon,
    state: "FinanceDeskCollapsear",
    views: [
      {
        path: "/financeDashboardar",
        name: "AR Analytics",
        rtlName: "انهيار متعدد المستويات",
        rtlMini: "ر",
        icon: EqualizerIcon,
        component: FinanceDashboard,
        layout: "/invoice",
      },
      {
        path: "/send_invoices",
        name: "Send Invoices",
        rtlName: "انهيار متعدد المستويات",
        rtlMini: "ر",
        icon: SystemUpdateIcon,
        component: SentList,
        layout: "/invoice",
      },
      {
        path: "/paymentar",
        name: "Invoice Payments",
        rtlName: "انهيار متعدد المستويات",
        rtlMini: "ر",
        icon: LocalAtmIcon,
        component: PaymentList,
        layout: "/invoice",
      },
      {
        path: "/clientledger",
        name: "Client 360",
        rtlName: "لوحة القيادة",
        icon: ReceiptIcon,
        component: Receivable,
        layout: "/invoice",
      },
      {
        path: "/invoice-aging/ar",
        name: "Invoice Aging",
        rtlName: "لوحة القيادة",
        icon: TimerIcon,
        component: AgingReport,
        layout: "/invoice",
      },
    ],
  },
];



export const invoiceDefaultRoutes = [
  {
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
  }
]

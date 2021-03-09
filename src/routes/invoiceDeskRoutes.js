// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import SystemUpdateIcon from '@material-ui/icons/SystemUpdate';
import WrapTextIcon from '@material-ui/icons/WrapText';
import DescriptionIcon from '@material-ui/icons/Description';
import FingerprintIcon from '@material-ui/icons/Fingerprint';


//Components

import FilesList from "views/LDocs/Invoices/RecieveInvoice/FilesList";
import Dashboard from "views/LDocs/Dashboard/Dashboard";
import Notifications from "views/LDocs/Notifications/Notifications";
import SignatureStamp from "views/LDocs/SignatureStamp/SignatureStamp";
import Verify from "views/LDocs/Verify/Verify";
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import CreateInvoice from "views/LDocs/Invoices/CreateInvoice/CreateInvoice";
import InvoiceTracking from "views/LDocs/Invoices/InvoiceTracking/InvoiceTracking";
import InvoiceAge from "views/LDocs/Invoices/InvoiceAge/InvoiceAge";




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
        icon:NoteAddIcon,
        rtlMini: "ع",
        component: CreateInvoice,
        layout: "/invoice",
      },
      {
        path: "/received", 
        name: "Received Invoice",
        rtlName: "عالتسعير",
        icon:SystemUpdateIcon,
        rtlMini: "ع",
        component: FilesList,
        layout: "/invoice",
      },
      {
        path: "/aging",
        name: "Invoice Aging",
        rtlName: "عالتسعير",
        icon:DescriptionIcon,
        rtlMini: "ع",
        component: InvoiceAge,
        layout: "/invoice",
      }
    ]
  },
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
  },
];
export default invoiceRoutes;

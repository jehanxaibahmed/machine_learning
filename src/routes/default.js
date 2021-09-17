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
import PieChartIcon from '@material-ui/icons/PieChart';
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
import PaymentListAr from "views/LDocs/Invoices/PayInvoices/FileListAr";
import InvoiceAge from "views/LDocs/Invoices/InvoiceAge/InvoiceAge";
import Requested from "views/LDocs/Reviews/Requested";
import jwt from "jsonwebtoken";
import Payable from "views/LDocs/Payable/Payable";
import AgingReport from "views/LDocs/Aging/AgingReport";
import TimerIcon from "@material-ui/icons/Timer";
import Receivable from "views/LDocs/Receivable/Receivable";
import Reports from "views/LDocs/Reports/Reports";
import Cashflow from "views/LDocs/Cashflow/Cashflow";

const Token = localStorage.getItem("cooljwt");
let decoded = jwt.decode(Token);

export const apRoutes = (permissions) => {
    const { ap, ar } = permissions || {};
    const { actionDesk, financeDesk, others, invoiceDesk } = ap || {};

    const isAllRouteDisabled = (rts) => {
        let all = [];
        Object.keys(rts)
            .map(item => {
                if (item != "name" && item != "enable" && typeof rts[item] == "object") {
                    all.push(rts[item]?.enable ? true : false);
                }
            });
        return all.every(item => item == false);
    }


    let isInvoiceDeskDisable = isAllRouteDisabled(invoiceDesk);
    let isActionDeskDisable = isAllRouteDisabled(actionDesk);
    let isfinanceDeskDisable = isAllRouteDisabled(financeDesk);



    return [
        {
            path: "/dashboard/ap",
            name: "Dashboard",
            rtlName: "لوحة القيادة",
            icon: DashboardIcon,
            component: Dashboard,
            layout: "/default",
        },
        !isInvoiceDeskDisable &&
        {
            collapse: true,
            name: "Invoice Desk",
            rtlName: "المكونات",
            icon: InsertDriveFileIcon,
            state: "InvoiceDeskCollapse",
            views: [
                invoiceDesk?.createInvoice?.enable && {
                    path: "/create/ap",
                    name: "Create Invoice",
                    rtlName: "عالتسعير",
                    icon: NoteAddIcon,
                    rtlMini: "ع",
                    component: CreateInvoice,
                    layout: "/default",
                },
                invoiceDesk?.receivedInvoice?.enable &&
                {
                    path: "/invoices/ap",
                    name: "Received Invoice",
                    rtlName: "عالتسعير",
                    icon: SystemUpdateIcon,
                    rtlMini: "ع",
                    component: FilesList,
                    layout: "/default",
                }
            ],
        },
        !isActionDeskDisable &&
        {
            collapse: true,
            name: "Action Desk",
            rtlName: "المكونات",
            icon: AssignmentIndIcon,
            state: "ActionDeskCollapse",
            views: [
                actionDesk?.reviewTasks?.enable &&
                {
                    path: "/my-requests/ap",
                    name: "Review Tasks",
                    rtlName: "انهيار متعدد المستويات",
                    rtlMini: "ر",
                    component: Requested,
                    layout: "/default",
                    icon: AssignmentLateIcon,
                },
                actionDesk?.approvalTasks?.enable &&
                {
                    path: "/approvals/ap",
                    name: "Approval Tasks",
                    rtlName: "انهيار متعدد المستويات",
                    rtlMini: "ر",
                    icon: AssignmentTurnedInIcon,
                    component: ApprovalRequested,
                    layout: "/default",
                },
            ],
        },
        !isfinanceDeskDisable &&
        {
            collapse: true,
            name: "Finance Desk",
            rtlName: "المكونات",
            icon: AccountBalanceIcon,
            state: "FinanceDeskCollapse",
            views: [
                financeDesk?.apAnalytics?.enable &&
                {
                    path: "/financeDashboard/ap",
                    name: "AP Analytics",
                    rtlName: "انهيار متعدد المستويات",
                    rtlMini: "ر",
                    icon: EqualizerIcon,
                    component: FinanceDashboard,
                    layout: "/default",
                },
                financeDesk?.exportInvoices?.enable &&
                {
                    path: "/export/ap",
                    name: "Export Invoices",
                    rtlName: "انهيار متعدد المستويات",
                    rtlMini: "ر",
                    icon: SystemUpdateIcon,
                    component: ExportList,
                    layout: "/default",
                },
                financeDesk?.invoicePayments?.enable &&
                {
                    path: "/payment/ap",
                    name: "Invoice Payments",
                    rtlName: "انهيار متعدد المستويات",
                    rtlMini: "ر",
                    icon: LocalAtmIcon,
                    component: PaymentList,
                    layout: "/default",
                },
                financeDesk?.supplier360?.enable &&
                {
                    path: "/supplierledger/ap",
                    name: "Supplier 360",
                    rtlName: "لوحة القيادة",
                    icon: ReceiptIcon,
                    component: Payable,
                    layout: "/default",
                },
                financeDesk?.invoiceAging?.enable &&
                {
                    path: "/invoice-aging/ap",
                    name: "Invoice Aging",
                    rtlName: "لوحة القيادة",
                    icon: TimerIcon,
                    component: AgingReport,
                    layout: "/default",
                },
            ],
        },
        others?.trackingValidation?.enable &&
        {
            path: "/verifier/ap",
            name: "Tracking & Validate",
            rtlName: "أشكال عادية",
            rtlMini: "صو",
            icon: VerifiedUserIcon,
            component: Verify,
            layout: "/default",
        },
        //Removed Name just to not show in Sidebar
        {
            path: "/cashflow/ap",
            rtlName: "لوحة القيادة",
            // name:"Cashflow"
            icon: PieChartIcon,
            component: Cashflow,
            layout: "/default",
        },
        others?.reports?.enable &&
        {
            path: "/reports/ap",
            name: "Reports",
            rtlName: "لوحة القيادة",
            icon: PieChartIcon,
            component: Reports,
            layout: "/default",
        },
        {
            path: "/notifications/ap",
            name: "Notifications",
            rtlName: "لوحة القيادة",
            icon: NotificationsActiveIcon,
            component: Notifications,
            layout: "/default",
        },
        others?.signatureStamp?.enable &&
        {
            path: "/signature-stamp/ap",
            name: "Signature / Stamp",
            rtlName: "أشكال عادية",
            rtlMini: "صو",
            icon: FingerprintIcon,
            component: SignatureStamp,
            layout: "/default",
        }
    ]
};


export const arRoutes = (permissions) => {
    const { ap, ar } = permissions || {};
    const { actionDesk, financeDesk, others, invoiceDesk } = ar || {};
    const isAllRouteDisabled = (rts) => {
        let all = [];
        Object.keys(rts)
            .map(item => {
                if (item != "name" && item != "enable" && typeof rts[item] == "object") {
                    all.push(rts[item]?.enable ? true : false);
                }
            });
        return all.every(item => item == false);
    }


    let isInvoiceDeskDisable = isAllRouteDisabled(invoiceDesk);
    let isActionDeskDisable = isAllRouteDisabled(actionDesk);
    let isfinanceDeskDisable = isAllRouteDisabled(financeDesk);


    return [
        {
            path: "/dashboard/ar",
            name: "Dashboard",
            rtlName: "لوحة القيادة",
            icon: DashboardIcon,
            component: Dashboard,
            layout: "/default",
        },

        !isInvoiceDeskDisable &&
        {
            collapse: true,
            name: "Invoice Desk",
            rtlName: "المكونات",
            icon: InsertDriveFileIcon,
            state: "InvoiceDeskCollapsear",
            views: [
                invoiceDesk?.createInvoice?.enable &&
                {
                    path: "/create/ar",
                    name: "Create Invoice",
                    rtlName: "عالتسعير",
                    icon: NoteAddIcon,
                    rtlMini: "ع",
                    component: CreateInvoice,
                    layout: "/default",
                },
                invoiceDesk?.invoices?.enable &&
                {
                    path: "/invoices/ar",
                    name: "Invoices",
                    rtlName: "عالتسعير",
                    icon: SystemUpdateIcon,
                    rtlMini: "ع",
                    component: FilesListAr,
                    layout: "/default",
                },
                invoiceDesk?.sendInvoices?.enable &&
                {
                    path: "/send_invoices/ar",
                    name: "Send Invoices",
                    rtlName: "انهيار متعدد المستويات",
                    rtlMini: "ر",
                    icon: SystemUpdateIcon,
                    component: SentList,
                    layout: "/default",
                }
            ],
        },
        !isActionDeskDisable &&
        {
            collapse: true,
            name: "Action Desk",
            rtlName: "المكونات",
            icon: AssignmentIndIcon,
            state: "ActionDeskCollapsear",
            views: [
                actionDesk?.reviewTasks?.enable &&
                {
                    path: "/my-requests/ar",
                    name: "Review Tasks",
                    rtlName: "انهيار متعدد المستويات",
                    rtlMini: "ر",
                    component: Requested,
                    layout: "/default",
                    icon: AssignmentLateIcon,
                },
                actionDesk?.approvalTasks?.enable &&
                {
                    path: "/approvals/ar",
                    name: "Approval Tasks",
                    rtlName: "انهيار متعدد المستويات",
                    rtlMini: "ر",
                    icon: AssignmentTurnedInIcon,
                    component: ApprovalRequested,
                    layout: "/default",
                },
            ],
        },
        !isfinanceDeskDisable &&
        {
            collapse: true,
            name: "Finance Desk",
            rtlName: "المكونات",
            icon: AccountBalanceIcon,
            state: "FinanceDeskCollapsear",
            views: [
                financeDesk?.arAnalytics?.enable &&
                {
                    path: "/financeDashboard/ar",
                    name: "AR Analytics",
                    rtlName: "انهيار متعدد المستويات",
                    rtlMini: "ر",
                    icon: EqualizerIcon,
                    component: FinanceDashboard,
                    layout: "/default",
                },
                financeDesk?.invoicePayments?.enable &&
                {
                    path: "/payment/ar",
                    name: "Invoice Payments",
                    rtlName: "انهيار متعدد المستويات",
                    rtlMini: "ر",
                    icon: LocalAtmIcon,
                    component: PaymentListAr,
                    layout: "/default",
                },
                financeDesk?.customer360?.enable &&
                {
                    path: "/clientledger/ar",
                    name: "Customer 360",
                    rtlName: "لوحة القيادة",
                    icon: ReceiptIcon,
                    component: Receivable,
                    layout: "/default",
                },
                financeDesk?.invoiceAging?.enable &&
                {
                    path: "/invoice-aging/ar",
                    name: "Invoice Aging",
                    rtlName: "لوحة القيادة",
                    icon: TimerIcon,
                    component: AgingReport,
                    layout: "/default",
                },
            ],
        },
        others?.trackingValidation?.enable &&
        {
            path: "/verifier/ar",
            name: "Tracking & Validate",
            rtlName: "أشكال عادية",
            rtlMini: "صو",
            icon: VerifiedUserIcon,
            component: Verify,
            layout: "/default",
        },
        //Removed Name just to not show in Sidebar
        {
            path: "/cashflow/ar",
            rtlName: "لوحة القيادة",
            // name:"Cashflow"
            icon: PieChartIcon,
            component: Cashflow,
            layout: "/default",
        },
        others?.reports?.enable &&
        {
            path: "/reports/ar",
            name: "Reports",
            rtlName: "لوحة القيادة",
            icon: PieChartIcon,
            component: Reports,
            layout: "/default",
        },
        {
            path: "/notifications/ar",
            name: "Notifications",
            rtlName: "لوحة القيادة",
            icon: NotificationsActiveIcon,
            component: Notifications,
            layout: "/default",
        },
        others?.signatureStamp?.enable &&
        {
            path: "/signature-stamp/ar",
            name: "Signature / Stamp",
            rtlName: "أشكال عادية",
            rtlMini: "صو",
            icon: FingerprintIcon,
            component: SignatureStamp,
            layout: "/default",
        }
    ];
}



export const defaultRoutes = (permissions) => {
    return [

    ];
}

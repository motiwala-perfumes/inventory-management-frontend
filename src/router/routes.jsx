import React from "react";
import Login from "../pages/authentication/login/login-index";
import Register from "../pages/authentication/Register/Reister-index";
import ForgotPassword from "../pages/authentication/ForgotPassword";
import ConfirmPassword from "../pages/authentication/ConfirmationPassword";
import Dashboard from "../pages/Feature/dashboard/Index";
import ProductList from "../pages/Feature/products/productList/index";
import AddProduct from "../pages/Feature/products/addProduct/index";
import EditProduct from "../pages/Feature/products/editProduct/index";
import Settings from "../pages/Feature/settings/accountSettings/index";
import CompanySettings from "../pages/Feature/settings/companySettings/index";
import InvoiceSettings from "../pages/Feature/settings/invoiceSettings/index";
// import Customers from "../pages/Feature/customers/Index";
// import AddCustomer from "../pages/Feature/customers/AddCustomer";
// import EditCustomer from "../pages/Feature/customers/EditCustomer";
import PaymentSettings from "../pages/Feature/settings/paymentSettings/index";
import ChangePassword from "../pages/Feature/settings/changePassword/index";
import BankAccount from "../pages/Feature/settings/bankSettings/index";
import TaxRates from "../pages/Feature/settings/taxRates/index";
import Preferences from "../pages/Feature/settings/preferences/index";
import EmailSettings from "../pages/Feature/settings/emailSettings/index";
import AddVendors from "../pages/Feature/vendors/addVendor/index";
import AddLedger from "../pages/Feature/vendors/addLedger/index";
import EditVendorList from "../pages/Feature/vendors/editVendor/index";
import DeactiveCustomers from "../pages/Feature/customers/deactivateCustomers";
import ActiveCustomers from "../pages/Feature/customers/activeCustomers";
import CustomerDetails from "../pages/Feature/customers/customerDetails";
import Addcategory from "../pages/Feature/products/addCategory/index";
import Inventory from "../pages/Feature/inventory/inventory";
import PurchaseOrders from "../pages/Feature/purchaseOrdersLts/purchaseorderList/index";
import AddPurchaseOrders from "../pages/Feature/purchaseOrdersLts/addPurchaseOrder/index";
import EditPurchaseOrders from "../pages/Feature/purchaseOrdersLts/editPurchaseOrder/index";
import ViewPurchaseOrders from "../pages/Feature/purchaseOrdersLts/viewPurchaseOrder/index";
import ViewPurchase from "../pages/Feature/purchase/viewPurchase";
import ViewDebitnotes from "../pages/Feature/debitNotes/viewDebitnotes";
import ViewCustomer from "../pages/Feature/customers/viewCustomer";
import ViewDc from "../pages/Feature/deliveryChallans/viewDc";
import CreditNotes from "../pages/Feature/creditNotes/CreditList/index";
import AddCredit from "../pages/Feature/creditNotes/addCredit/index";
import EditCredit from "../pages/Feature/creditNotes/editCredit/index";
import ViewCredit from "../pages/Feature/creditNotes/viewCredit/index";
import InvoiceList from "../pages/Feature/invoices/invoiceList/index";
import InvoiceAdd from "../pages/Feature/invoices/addInvoice/index";
import InvoiceEdit from "../pages/Feature/invoices/editInvoice/index";
import InvoiceView from "../pages/Feature/invoices/viewInvoice/index";
import PrintDownload from "../pages/Feature/invoices/printDownload/index";
import RolePermissions from "../pages/Feature/rolePermission/index";
import UserTypes from "../pages/Feature/userType/index";
import PositionMaster from "../pages/Feature/position/index";
import BankMaster from "../pages/Feature/bank/index";
import Branch from "../pages/Feature/branch/index";
import CompanyManagement from "../pages/Feature/company/index";
import Permissions from "../pages/Feature/rolePermission/permission";
import Payments from "../pages/Feature/payments/Index";
import Users from "../pages/Feature/manageUser/ListUser/index";
import AddUser from "../pages/Feature/manageUser/AddUser/index";
import EditUser from "../pages/Feature/manageUser/EditUser/index";
import PaymentSummary from "../pages/Feature/paymentSummary/index";
import ListPurchases from "../pages/Feature/purchase/ListPurchase/index";
import AddPurchase from "../pages/Feature/purchase/addPurchase/index";
import EditPurchase from "../pages/Feature/purchase/EditPurchase/index";
import ListDebitNotes from "../pages/Feature/debitNotes/ListDebitNotes/index";
import AddPurchaseReturn from "../pages/Feature/debitNotes/addPurchaseReturn/index";
import EditPurchaseReturn from "../pages/Feature/debitNotes/editPurchaseReturn/index";
import ListDeliveryChallans from "../pages/Feature/deliveryChallans/ListDeliveryChallan/index";
import AddDeliveyChallan from "../pages/Feature/deliveryChallans/AddDeliveryChallan/index";
import EditDeliveryChallan from "../pages/Feature/deliveryChallans/EditDeliveryChallan/index";
import ListExpenses from "../pages/Feature/expenses/ListExpense/index";
import AddExpense from "../pages/Feature/expenses/AddExpense/index";
import EditExpense from "../pages/Feature/expenses/EditExpense/index";
import AddQuotation from "../pages/Feature/quatations/addQuotation/index";
import EditQuotation from "../pages/Feature/quatations/editQuotation/index";
import QuotationList from "../pages/Feature/quatations/quotationList/index";
import ViewQuotations from "../pages/Feature/quatations/viewQuotation/index";
import AddCustomers from "../pages/Feature/customers/addCustomer/index";
import EditCustomers from "../pages/Feature/customers/editCustomer/index";
import ListCustomer from "../pages/Feature/customers/listCustomer/index";
import EditCategory from "../pages/Feature/products/editCategory/index";
import ListCategory from "../pages/Feature/products/listCategory/index";
import AddUnit from "../pages/Feature/products/addUnits/index";
import EditUnits from "../pages/Feature/products/editUnits/index";
import Units from "../pages/Feature/products/listUnit/index";
import ListVendors from "../pages/Feature/vendors/vendorList/index";
import RecurringInvoices from "../pages/Feature/requrringInvoices/requringinvoiceList/index";
import NotificationSetting from "../pages/Feature/settings/notifications/index";
import Unauthorised from "../pages/Feature/unauthorised/Unauthorised";
import OnlinePayment from "../pages/Feature/onlinePayments/OnlinePaymnet";
import SignatureList from "../pages/Feature/signatureList";
import SignaturePreviewInvoice from "../pages/Feature/signaturePreview";
import MailPayInvoice from "../pages/Feature/mailPayInvoice";
import AllNotification from "../pages/Feature/notifications";
import InvoiceTemplate from "../pages/Feature/settings/invoiceTemplate/index";
import AddPreviewInvoice from "../pages/Feature/invoices/addSignPreview";
import EditPreviewInvoice from "../pages/Feature/invoices/editSignPreview";
import AddPreviewSales from "../pages/Feature/creditNotes/addSignPreview";
import AddPreviewPurchase from "../pages/Feature/purchaseOrdersLts/addSignPreview";
import EditPreviewPurchase from "../pages/Feature/purchaseOrdersLts/editSignPreview";
import ListOfSignature from "../pages/Feature/settings/signatureLists";
import AdminLogin from "../pages/authentication/login/admin-index";
import UserLogin from "../pages/authentication/login/user-index";
import ViewVendor from "../pages/Feature/vendors/viewVendor/index";
import ViewExpense from "../pages/Feature/expenses/ViewExpense/index";

export const unAuthRoutes = [
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin-login",
    element: <AdminLogin />,
  },
  {
    path: "/user-login",
    element: <UserLogin />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/confirmation-password",
    element: <ConfirmPassword />,
  },
  {
    path: "/online-payment",
    element: <OnlinePayment />,
  },
];

export const authRoutes = [
  {
    path: "",
    element: <Dashboard />,
  },
  {
    path: "/index",
    element: <Dashboard />,
  },
  {
    path: "/customers",
    element: <ListCustomer />,
  },
  {
    path: "/active-customers",
    element: <ActiveCustomers />,
  },
  {
    path: "/deactive-customers",
    element: <DeactiveCustomers />,
  },
  {
    path: `${"/customer-details"}/:id`,
    element: <CustomerDetails />,
  },
  {
    path: "/add-customer",
    element: <AddCustomers />,
  },
  {
    path: `${"/edit-customer"}/:id`,
    element: <EditCustomers />,
  },
  {
    path: "/product-list",
    element: <ProductList />,
  },
  {
    path: "/category",
    element: <ListCategory />,
  },
  {
    path: "/add-categories",
    element: <Addcategory />,
  },
  {
    path: `${"/edit-categories"}/:id`,
    element: <EditCategory />,
  },
  {
    path: "/units",
    element: <Units />,
  },
  {
    path: "/add-units",
    element: <AddUnit />,
  },
  {
    path: `${"/edit-units"}/:id`,
    element: <EditUnits />,
  },
  {
    path: "/add-product",
    element: <AddProduct />,
  },
  {
    path: `${"/edit-product"}/:id`,
    element: <EditProduct />,
  },
  {
    path: "/purchases",
    element: <ListPurchases />,
  },
  {
    path: "/add-purchases",
    element: <AddPurchase />,
  },
  {
    path: `${"/purchase-edit"}/:id`,
    element: <EditPurchase />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/company-settings",
    element: <CompanySettings />,
  },
  {
    path: "/invoice-settings",
    element: <InvoiceSettings />,
  },
  {
    path: "/payments",
    element: <Payments />,
  },
  {
    path: "/payment-settings",
    element: <PaymentSettings />,
  },
  {
    path: "/email-settings",
    element: <EmailSettings />,
  },
  {
    path: "/tax-rates",
    element: <TaxRates />,
  },
  {
    path: "/preferences",
    element: <Preferences />,
  },
  {
    path: "/bank-account",
    element: <BankAccount />,
  },
  // {
  //   path: "/vendors",
  //   element: <Vendors />,
  // },
  {
    path: "/vendors",
    element: <ListVendors />,
  },
  {
    path: "/add-vendors",
    element: <AddVendors />,
  },
  {
    path: `${"/add-ledger"}/:id`,
    element: <AddLedger />,
  },
  {
    path: "/add-quotations",
    element: <AddQuotation />,
  },
  {
    path: "/quotations",
    element: <QuotationList />,
  },

  {
    path: `${"/view-quotations"}/:id`,
    element: <ViewQuotations />,
  },
  {
    path: `${"/view-purchase"}/:id`,
    element: <ViewPurchase />,
  },
  {
    path: `${"/view-debitnotes"}/:id`,
    element: <ViewDebitnotes />,
  },
  {
    path: `${"/view-delivery-challan"}/:id`,
    element: <ViewDc />,
  },
  {
    path: `${"/view-customer"}/:id`,
    element: <ViewCustomer />,
  },
  {
    path: `${"/edit-quotations"}/:id`,
    element: <EditQuotation />,
  },
  // {
  //   path: `${"/edit-quotations"}/:id`,
  //   element: <EditQuotations />,
  // },
  {
    path: `${"/edit-vendors"}/:id`,
    element: <EditVendorList />,
  },
  {
    path: `${"/view-vendor"}/:id`,
    element: <ViewVendor />,
  },
  {
    path: "/inventory",
    element: <Inventory />,
  },
  {
    path: `/purchase-orders`,
    element: <PurchaseOrders />,
  },
  {
    path: `/add-purchases-order`,
    element: <AddPurchaseOrders />,
  },

  {
    path: `/sales-return`,
    element: <CreditNotes />,
  },
  {
    path: `/add-sales-return`,
    element: <AddCredit />,
  },
  {
    path: `${"/edit-sales-return"}/:id`,
    element: <EditCredit />,
  },
  {
    path: `${"/view-sales-return"}/:id`,
    element: <ViewCredit />,
  },
  {
    path: `${"/edit-purchases-order"}/:id`,
    element: <EditPurchaseOrders />,
  },
  {
    path: `${"/view-purchases-order"}/:id`,
    element: <ViewPurchaseOrders />,
  },

  {
    path: `/debit-notes`,
    element: <ListDebitNotes />,
  },
  {
    path: `/add-debit-notes`,
    element: <AddPurchaseReturn />,
  },
  {
    path: `${"/edit-debit-notes"}/:id`,
    element: <EditPurchaseReturn />,
  },
  {
    path: `/expenses`,
    element: <ListExpenses />,
  },
  {
    path: `/add-expenses`,
    element: <AddExpense />,
  },
  {
    path: `${"/edit-expenses"}/:id`,
    element: <EditExpense />,
  },
  {
    path: `${"/view-expenses"}/:id`,
    element: <ViewExpense />,
  },
  {
    path: `/invoice-list`,
    element: <InvoiceList />,
  },
  {
    path: `/add-invoice`,
    element: <InvoiceAdd />,
  },
  {
    path: `${"/edit-invoice"}/:id`,
    element: <InvoiceEdit />,
  },
  {
    path: `${"/view-invoice"}/:id`,
    element: <InvoiceView />,
  },
  {
    path: `${"/print-download-invoice"}/:id`,
    element: <PrintDownload />,
  },
  {
    path: `/roles-permission`,
    element: <RolePermissions />,
  },
  {
    path: `/user-type-management`,
    element: <UserTypes />,
  },
  {
    path: `/position-management`,
    element: <PositionMaster />,
  },
  {
    path: `/bank-management`,
    element: <BankMaster />,
  },
  {
    path: `/branch-management`,
    element: <Branch />,
  },
  {
    path: `/company-management`,
    element: <CompanyManagement />,
  },
  {
    path: `${"/permission"}/:id`,
    element: <Permissions />,
  },
  {
    path: `/delivery-challans`,
    element: <ListDeliveryChallans />,
  },
  {
    path: `/add-delivery-challans`,
    element: <AddDeliveyChallan />,
  },
  {
    path: `${"/edit-delivery-challan"}/:id`,
    element: <EditDeliveryChallan />,
  },
  {
    path: `/users`,
    element: <Users />,
  },
  {
    path: `/add-user`,
    element: <AddUser />,
  },
  {
    path: `${"/edit-user"}/:id`,
    element: <EditUser />,
  },
  {
    path: "/payment-summary",
    element: <PaymentSummary />,
  },
  {
    path: "/password-change",
    element: <ChangePassword />,
  },
  {
    path: "/recurring-invoices",
    element: <RecurringInvoices />,
  },
  {
    path: "/notification-settings",
    element: <NotificationSetting />,
  },
  {
    path: "/unauthorised",
    element: <Unauthorised />,
  },
  {
    path: "/list-of-signature",
    element: <SignatureList />,
  },
  {
    path: "/signature-preview-invoice",
    element: <SignaturePreviewInvoice />,
  },
  {
    path: "/add-signature-preview-invoice",
    element: <AddPreviewInvoice />,
  },
  {
    path: "/add-sales-signature-preview",
    element: <AddPreviewSales />,
  },
  {
    path: "/edit-signature-preview-invoice",
    element: <EditPreviewInvoice />,
  },
  {
    path: "/mail-pay-invoice",
    element: <MailPayInvoice />,
  },
  {
    path: "/all-notifications",
    element: <AllNotification />,
  },
  {
    path: "/invoice-templates",
    element: <InvoiceTemplate />,
  },
  {
    path: "/add-purchase-signature-preview",
    element: <AddPreviewPurchase />,
  },
  {
    path: "/edit-purchase-signature-preview",
    element: <EditPreviewPurchase />,
  },
  {
    // path: "/add-purchase-return-signature-preview",
    // element: <AddPurchaseReturnPreview />,
    path: "/signature-lists",
    element: <ListOfSignature />,
  },
];

export const filters = [
  { id: "unread", value: "Pending for Acceptance", _id: 1 , p_id:1},
  { id: "read", value: "Received (By InvoiceDesk)", _id: 2, p_id:1 },
  { id: "rejected", value: "Rejected ( By InvoiceDesk)", _id: 3 , p_id:1},
  { id: "pending", value: "Pending for Review", _id: 4 , p_id:2},
  { id: "reviewed", value: "Reviewed (All Reviewers)", _id: 5 , p_id:2},
  { id: "rejected", value: "Rejected during Review", _id: 6 , p_id:2},
  { id: "pending", value: "Pending For Approval", _id: 7 , p_id:3},
  { id: "approved", value: "Approved (All Approvers)", _id: 8 , p_id:3},
  { id: "rejected", value: "Rejected during Approval", _id: 9 , p_id:3},
];

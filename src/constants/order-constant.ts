import { INITIAL_STATE_ACTION } from "./general-constant";

export const INITIAL_ORDER = {
  customer_name: "",
  table_id: "",
  status: "",
};

export const INITIAL_STATE_ORDER = {
  status: "idle",
  errors: {
    customer_name: [],
    table_id: [],
    status: [],
    _form: [],
  },
};

export const INITIAL_ORDER_TAKEAWAY = {
  customer_name: "",
};

export const INITIAL_STATE_ORDER_TAKEAWAY = {
  status: "idle",
  errors: {
    customer_name: [],
    _form: [],
  },
};

export const STATUS_ORDER_LIST = [
  {
    value: "reserved",
    label: "Reserved",
  },
  {
    value: "process",
    label: "Process",
  },
];

export const FILTER_MENU = [
  {
    value: "",
    label: "All",
  },
  {
    value: "Mains",
    label: "Mains",
  },
  {
    value: "Sides",
    label: "Sides",
  },
  {
    value: "Desserts",
    label: "Desserts",
  },
  {
    value: "Beverages",
    label: "Beverages",
  },
];

export const INITIAL_STATE_GENERATE_PAYMENT = {
  ...INITIAL_STATE_ACTION,
  data: {
    payment_token: "",
  },
};

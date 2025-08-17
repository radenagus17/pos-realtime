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

export const INITIAL_MENU = {
  name: "",
  description: "",
  price: "",
  discount: "",
  category: "",
  image_url: "",
  is_available: "",
};

export const INITIAL_STATE_MENU = {
  status: "idle",
  errors: {
    id: [],
    name: [],
    description: [],
    price: [],
    discount: [],
    category: [],
    image_url: [],
    is_available: [],
    _form: [],
  },
};

export const CATEGORY_LIST = [
  {
    value: "Beverages",
    label: "Beverages",
  },
  {
    value: "Mains",
    label: "Mains",
  },
  {
    value: "Desserts",
    label: "Desserts",
  },
];

export const AVAILABILITY_LIST = [
  {
    value: "true",
    label: "Available",
  },
  {
    value: "false",
    label: "Not Available",
  },
];

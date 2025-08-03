export const INITIAL_CREATE_USER_FORM = {
  email: "",
  password: "",
  name: "",
  role: "",
  avatar_url: "",
};

export const INITIAL_STATE_CREATE_USER_FORM = {
  status: "idle",
  errors: {
    email: [],
    password: [],
    name: [],
    role: [],
    avatar_url: [],
    _form: [],
  },
};

export const INITIAL_STATE_UPDATE_USER_FORM = {
  status: "idle",
  errors: {
    name: [],
    role: [],
    avatar_url: [],
    _form: [],
  },
};

export const ROLE_LIST = [
  {
    value: "admin",
    label: "Admin",
  },
  {
    value: "kitchen",
    label: "Kitchen",
  },
  {
    value: "cashier",
    label: "Cashier",
  },
];

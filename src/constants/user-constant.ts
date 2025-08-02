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

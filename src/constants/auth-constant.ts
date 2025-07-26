export const INITIAL_PROFILE = {
  id: "",
  name: "",
  avatar_url: "",
  role: "",
};

export const INITIAL_LOGIN_FORM = {
  email: "",
  password: "",
};

export const INITIAL_STATE_LOGIN_FORM = {
  status: "idle",
  errors: {
    email: [],
    password: [],
    _form: [],
  },
};

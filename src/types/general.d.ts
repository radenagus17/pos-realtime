export type SearchParams = {
  [key: string]: string | string[] | undefined;
};

export type FormState = {
  errors?: {
    _form?: string[];
  };
  status?: string;
};

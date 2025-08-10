export type TableTypes = {
  id?: number;
  name?: string;
  description?: string;
  capacity?: number;
  status?: string;
  created_at?: Date;
  updated_at?: Date;
};

export type TableFormState = {
  status?: string;
  errors?: {
    id?: string[];
    name?: string[];
    description?: string[];
    capacity?: string[];
    status?: string[];
    _form?: string[];
  };
};

export type TableTypes = {
  id?: number;
  name?: string;
  description?: string;
  capacity?: number;
  position_x?: number;
  position_y?: number;
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

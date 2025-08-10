import { TableTypes } from "./table";

export type OrderTypes = {
  id?: number;
  order_id?: string;
  customer_name?: string;
  status?: string;
  payment_url?: string;
  table_id?: number;
  tables?: TableTypes | unknown;
  created_at?: Date;
  updated_at?: Date;
};

export type OrderFormState = {
  status?: string;
  errors?: {
    customer_name?: string[];
    table_id?: string[];
    status?: string[];
    _form?: string[];
  };
};

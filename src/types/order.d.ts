import { MenuTypes } from "./menu";
import { TableTypes } from "./table";

export type OrderTypes = {
  id?: number;
  order_id?: string;
  customer_name?: string;
  status?: string;
  payment_token?: string;
  table_id?: number;
  tables?: TableTypes | unknown;
  created_at?: Date;
  updated_at?: Date;
};

export type OrderMenuTypes = {
  id?: number;
  order_id?: number;
  menu_id?: number;
  status?: string;
  quantity?: number;
  notes?: string;
  menus?: MenuTypes | unknown;
  created_at?: Date;
  updated_at?: Date;
};

export type CartTypes = {
  menu_id: string;
  quantity: number;
  total: number;
  notes: string;
  menu: MenuTypes;
  order_id?: string;
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

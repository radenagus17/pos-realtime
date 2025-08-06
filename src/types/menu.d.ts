export type MenuTypes = {
  id?: number;
  name?: string;
  description?: string;
  price?: number;
  discount?: number;
  image_url?: string;
  category?: string;
  is_available?: boolean;
  created_at?: Date;
  updated_at?: Date;
};

export type MenuFormState = {
  status?: string;
  errors?: {
    id?: string[];
    name?: string[];
    description?: string[];
    price?: string[];
    discount?: string[];
    category?: string[];
    image_url?: string[];
    is_available?: string[];
    _form?: string[];
  };
};

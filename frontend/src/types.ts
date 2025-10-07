export interface Register {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  role: string;
  token?: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export interface ProductModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
  mode: "add" | "edit";
}
export interface Producto {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
  deactivatedAt: string | null;
  categoryId: number;
  categoryName: string;
}
/*El modelo representa qué aspecto tiene un producto y queremos poder utilizarlo desde diferentes componentes, por ejemplo:

listado de productos
detalle del producto
categorías
servicio
*/

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
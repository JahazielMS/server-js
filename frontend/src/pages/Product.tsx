import { useState } from "react";
import { useProducts, useProductsDelete } from "../hooks/product";
import { useAuth } from "../hooks/authorization";
import { ProductModal } from "../components/ProductModal";
import type { Product } from "../types";
import Swal from "sweetalert2";

export function ProductsModule() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { data: products = [] } = useProducts();
  const { mutate: deleteProduct } = useProductsDelete();

  const [showModalProduct, setShowModalProduct] = useState(false);
  const [productSelected, setProductSelected] = useState<Product | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalValue = products.reduce((sum, product) => sum + product.price * product.stock, 0);
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleAddProduct = () => {
    setProductSelected(null);
    setModalMode("add");
    setShowModalProduct(true);
  };

  const handleEditProduct = (product: Product) => {
    setProductSelected(product);
    setModalMode("edit");
    setShowModalProduct(true);
  };

  const handleDeleteProduct = (productId: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el producto de forma permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "rounded-lg",
        confirmButton: "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700",
        cancelButton: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ml-2",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct(productId);
      }
    });
    return;
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Gestión de Productos</h2>
          {isAdmin && (
            <button onClick={handleAddProduct} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Agregar Producto</span>
            </button>
          )}
        </div>
      </div>

      <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Productos</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Disponibles</p>
              <p className="text-2xl font-bold text-gray-900">{products.filter((p) => p.stock > 0).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sin Stock</p>
              <p className="text-2xl font-bold text-gray-900">{products.filter((p) => (p.stock === 0 ? true : false)).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              {isAdmin && <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-center font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">${product.price.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${product.stock > 10 ? "bg-green-400" : product.stock > 0 ? "bg-yellow-400" : "bg-red-400"}`}></span> <span className="text-center text-gray-900">{product.stock} unidades</span>
                  </div>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-2">
                    <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs hover:bg-blue-200 transition-colors" onClick={() => handleEditProduct(product)}>
                      Editar
                    </button>
                    <button className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs hover:bg-red-200 transition-colors" onClick={() => handleDeleteProduct(product.id)}>
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
        <button onClick={handlePrev} disabled={currentPage === 1} className={`px-4 py-2 text-sm font-medium rounded-md ${currentPage === 1 ? "text-gray-400 bg-gray-100 cursor-not-allowed" : "text-white bg-white hover:bg-gray-100 border border-gray-300"}`}>
          ← Anterior
        </button>

        <span className="text-sm text-gray-600">
          Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
        </span>

        <button onClick={handleNext} disabled={currentPage === totalPages} className={`px-4 py-2 text-sm font-medium rounded-md ${currentPage === totalPages ? "text-gray-400 bg-gray-100 cursor-not-allowed" : "text-white bg-white hover:bg-gray-100 border border-gray-300"}`}>
          Siguiente →
        </button>
      </div>
      {showModalProduct && <ProductModal isOpen={showModalProduct} product={productSelected} onClose={() => setShowModalProduct(false)} onSave={() => setShowModalProduct(false)} mode={modalMode} />}
    </div>
  );
}

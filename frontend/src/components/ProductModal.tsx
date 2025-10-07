import type { Product, ProductModalProps } from "../types";
import { useProductsAdd, useProductsUpdate } from "../hooks/product";
import { useBackend } from "../hooks/backend";
import { useEffect, useState } from "react";

export function ProductModal(props: ProductModalProps) {
  const { get } = useBackend();
  const { mutate: addProduct } = useProductsAdd();
  const { mutate: updateProduct } = useProductsUpdate();
  const [formData, setFormData] = useState<Product>({
    id: 0,
    name: "",
    price: 0,
    stock: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (props.isOpen) {
      if (props.mode === "edit" && props.product?.id) {
        setIsLoading(true);
        get(`/products/${props.product.id}`)
          .then((res) => {
            if (!res.ok) throw new Error("Error al cargar producto");
            return res.json();
          })
          .then((data) => {
            setFormData(data.products[0]);
          })
          .catch((error) => {
            console.error("Error loading product:", error);
            if (props.product) {
              setFormData(props.product);
            }
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        setFormData({
          id: 0,
          name: "",
          price: 0,
          stock: 0,
        });
      }
    }
  }, [props.isOpen, props.mode, props.product?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (props.mode === "add") {
        await addProduct(formData);
      } else {
        await updateProduct(formData);
      }
      props.onSave(formData);
      props.onClose();
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!props.isOpen) return null;

  const title = props.mode === "add" ? "Agregar Producto" : "Editar Producto";
  const submitText = props.mode === "add" ? "Agregar" : "Actualizar";

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md sm:max-w-lg md:max-w-xl p-4 sm:p-6 border-2 border-gray-800 shadow-lg">
        <div className="isolate bg-white px-2 py-10 sm:py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mt-2 text-lg/8 text-gray-600">{title}</p>
          </div>
          <form className="mx-auto mt-8 sm:mt-12 max-w-full" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="block text-sm/6 font-semibold text-gray-900">
                  Producto
                </label>
                <div className="mt-2.5">
                  <input id="name" name="name" type="text" required value={formData.name} onChange={handleInputChange} disabled={isLoading} className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 disabled:bg-gray-100 disabled:cursor-not-allowed" placeholder="Ingresa el nombre del producto" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="price" className="block text-sm/6 font-semibold text-gray-900">
                  Precio
                </label>
                <div className="mt-2.5">
                  <input id="price" name="price" type="number" required min="0" step="0.01" value={formData.price} onChange={handleInputChange} disabled={isLoading} className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 disabled:bg-gray-100 disabled:cursor-not-allowed" placeholder="0.00" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="stock" className="block text-sm/6 font-semibold text-gray-900">
                  Stock
                </label>
                <div className="mt-2.5">
                  <input id="stock" name="stock" type="number" required min="0" value={formData.stock} onChange={handleInputChange} disabled={isLoading} className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 disabled:bg-gray-100 disabled:cursor-not-allowed" placeholder="0" />
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
              <button type="submit" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                {submitText}
              </button>
              <button type="button" onClick={props.onClose} className="bg-gray-300 text-white py-2 px-4 rounded-md hover:bg-gray-400 transition-colors">
                Cerrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

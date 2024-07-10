import { useProducts } from "@/context/ProductProvider";

interface Product {
  id: string;
  label: string;
  category: string[];
  stock: number;
  price: number;
  images: string[];
  description: string;
  listed: boolean;
  date: string;
}

const ProductCard: React.FC<{ product: Product; listed: boolean }> = ({
  product,
  listed,
}) => 
  {
    const {deleteProduct}=useProducts();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={product.images[0]}
        alt={product.label}
        className="w-full h-64 object-cover object-center"
      />
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800">{product.label}</h2>
        <p className="text-sm text-gray-600">{product.description}</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {product.category.join(", ")}
          </span>
          <span className="text-lg font-bold text-blue-500">
            ${product.price}
          </span>
        </div>
        <div className="flex justify-start gap-3 mt-2">
          <button className="block  bg-red-400 p-1  px-3 rounded-lg text-center text-white hover:underline" onClick={()=>deleteProduct(product.id)}>
            Delete
          </button>
          <button className="block  bg-slate-400 p-1 px-3 rounded-lg text-center text-white hover:underline">
            Unlist Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

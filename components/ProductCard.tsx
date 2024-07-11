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
}) => {
  const { deleteProduct, toggleListing } = useProducts();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <img
        src={product.images[0]}
        alt={product.label}
        className="w-full h-64 object-cover object-center"
      />
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
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
        </div>
        <div className="flex justify-start gap-3 mt-4">
          <button
            className="flex-grow bg-red-400 p-2 rounded-lg text-center text-white hover:underline"
            onClick={() => deleteProduct(product.id)}
          >
            Delete
          </button>
          {product.listed ? (
            <button
              className="flex-grow bg-slate-400 p-2 rounded-lg text-center text-white hover:underline"
              onClick={() => {
                toggleListing(product.id, true);
              }}
            >
              Unlist
            </button>
          ) : (
            <button
              className="flex-grow bg-green-400 p-2 rounded-lg text-center text-white hover:underline"
              onClick={() => {
                toggleListing(product.id, false);
              }}
            >
              List
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

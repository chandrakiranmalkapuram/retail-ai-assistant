import React, { useEffect, useState } from 'react';

export interface ProductCardProps {
    name: string;
    price: string | number;
    rating?: string | number;
    description?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, rating, description }) => {
    const [image, setImage] = useState<string>('https://placehold.co/400x300?text=Product+Image');
    const [brand, setBrand] = useState<string>('Unknown Brand');
    const [availability, setAvailability] = useState<string>('In Stock');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                // Fetch extra details (image, brand, availability) from DummyJSON
                const response = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(name)}`);
                const data = await response.json();
                
                if (data.products && data.products.length > 0) {
                    const product = data.products[0];
                    if (product.thumbnail) setImage(product.thumbnail);
                    if (product.brand) setBrand(product.brand);
                    if (product.availabilityStatus) setAvailability(product.availabilityStatus);
                }
            } catch (error) {
                console.error("Failed to fetch product image:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [name]);

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full animate-fade-in-up">
            {/* Image Container */}
            <div className="relative h-48 w-full bg-gray-50 flex items-center justify-center p-4">
                {loading ? (
                    <div className="animate-pulse bg-gray-200 w-full h-full rounded-md"></div>
                ) : (
                    <img 
                        src={image} 
                        alt={name} 
                        className="object-contain max-h-full max-w-full drop-shadow-sm mix-blend-multiply"
                    />
                )}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm flex items-center gap-1">
                    <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {rating || 'N/A'}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2">{name}</h3>
                    <span className="font-bold text-indigo-600 whitespace-nowrap">${price}</span>
                </div>
                
                <div className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                    <span className="font-medium text-gray-700">{brand}</span>
                    <span>•</span>
                    <span className={availability.toLowerCase().includes('stock') ? 'text-emerald-600' : 'text-amber-600'}>
                        {availability}
                    </span>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                    {description}
                </p>

                <button className="w-full mt-auto py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-lg transition-colors duration-200 text-sm">
                    View Product
                </button>
            </div>
        </div>
    );
};

export default ProductCard;

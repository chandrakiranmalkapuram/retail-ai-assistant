import React from 'react';
import ProductCard from './ProductCard';
import type { ProductSearchResult } from '../../../shared/types/product.types';

interface ProductListProps {
    products: Partial<ProductSearchResult>[];
    onSendMessage?: (message: string) => void;
    onAddToCompare?: (product: ProductSearchResult) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onSendMessage, onAddToCompare }) => {
    if (!products || products.length === 0) return null;

    return (
        <div className="my-8 w-full">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-5 pl-2">
                Recommended Products
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                    <ProductCard 
                        key={product.id || `${product.name}-${index}`} 
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        rating={product.rating}
                        description={product.description}
                        url={product.url}
                        image={product.image}
                        brand={product.brand}
                        onSendMessage={onSendMessage}
                        onAddToCompare={onAddToCompare}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductList;

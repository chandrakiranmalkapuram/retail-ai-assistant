import React from 'react';
import ProductCard from './ProductCard';
import type { ProductCardProps } from './ProductCard';

interface ProductListProps {
    products: ProductCardProps[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
    if (!products || products.length === 0) return null;

    return (
        <div className="my-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Recommended Products
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {products.map((product, index) => (
                    <ProductCard 
                        key={`${product.name}-${index}`} 
                        name={product.name}
                        price={product.price}
                        rating={product.rating}
                        description={product.description}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductList;

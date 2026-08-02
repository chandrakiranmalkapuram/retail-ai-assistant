import React, { useEffect, useState } from 'react';
import type { ProductSearchResult } from '../../../shared/types/product.types';
import ProductCard from './ProductCard';

interface ComparisonTableProps {
    products: Partial<ProductSearchResult>[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ products }) => {
    // Store full product details including images
    const [detailedProducts, setDetailedProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            const enrichedProducts = await Promise.all(
                products.map(async (p) => {
                    try {
                        const response = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(p.name || '')}`);
                        const data = await response.json();
                        if (data.products && data.products.length > 0) {
                            return { ...p, ...data.products[0], originalPrice: p.price, originalRating: p.rating };
                        }
                    } catch (error) {
                        console.error('Failed to fetch details for comparison:', p.name);
                    }
                    return p;
                })
            );
            setDetailedProducts(enrichedProducts);
            setLoading(false);
        };

        if (products.length > 0) {
            fetchDetails();
        }
    }, [products]);

    if (!products || products.length === 0) return null;

    if (loading) {
        return (
            <div className="w-full my-6 animate-pulse">
                <div className="h-64 bg-gray-200 dark:bg-slate-800 rounded-2xl w-full"></div>
            </div>
        );
    }

    return (
        <div className="w-full my-8">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-5 pl-2">
                Product Comparison
            </h3>

            {/* Mobile View: Cards */}
            <div className="block md:hidden space-y-6">
                {detailedProducts.map((product, index) => (
                    <ProductCard
                        key={index}
                        name={product.name || product.title}
                        price={product.originalPrice || product.price}
                        rating={product.originalRating || product.rating}
                        description={product.description}
                        url={product.url || `https://dummyjson.com/products/${product.id}`}
                    />
                ))}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700">
                                <th className="p-4 font-semibold text-gray-700 dark:text-gray-300 w-1/4">Feature</th>
                                {detailedProducts.map((p, i) => (
                                    <th key={i} className="p-4 font-semibold text-gray-900 dark:text-gray-100 w-1/3 border-l border-gray-200 dark:border-slate-700 text-center">
                                        {p.name || p.title}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                            {/* Images */}
                            <tr>
                                <td className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400 align-middle">Image</td>
                                {detailedProducts.map((p, i) => (
                                    <td key={i} className="p-4 border-l border-gray-200 dark:border-slate-700 align-middle">
                                        <div className="h-40 w-full flex items-center justify-center bg-gray-50 dark:bg-slate-800 rounded-xl overflow-hidden">
                                            <img src={p.thumbnail || p.image || 'https://placehold.co/400x400?text=No+Image'} alt={p.name} className="object-contain max-h-full mix-blend-multiply dark:mix-blend-normal" />
                                        </div>
                                    </td>
                                ))}
                            </tr>
                            {/* Brand */}
                            <tr>
                                <td className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Brand</td>
                                {detailedProducts.map((p, i) => (
                                    <td key={i} className="p-4 border-l border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-200 text-center font-medium">
                                        {p.brand || 'Generic'}
                                    </td>
                                ))}
                            </tr>
                            {/* Price */}
                            <tr>
                                <td className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Price</td>
                                {detailedProducts.map((p, i) => (
                                    <td key={i} className="p-4 border-l border-gray-200 dark:border-slate-700 text-center font-bold text-lg text-indigo-600 dark:text-indigo-400">
                                        ${p.originalPrice || p.price}
                                    </td>
                                ))}
                            </tr>
                            {/* Rating */}
                            <tr>
                                <td className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Rating</td>
                                {detailedProducts.map((p, i) => (
                                    <td key={i} className="p-4 border-l border-gray-200 dark:border-slate-700 text-center">
                                        <div className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 rounded-full text-amber-700 dark:text-amber-400 font-medium text-sm">
                                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            {p.originalRating || p.rating || 'N/A'}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                            {/* Availability */}
                            <tr>
                                <td className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Availability</td>
                                {detailedProducts.map((p, i) => {
                                    const avail = p.availabilityStatus || 'In Stock';
                                    const inStock = avail.toLowerCase().includes('stock');
                                    return (
                                        <td key={i} className="p-4 border-l border-gray-200 dark:border-slate-700 text-center">
                                            <span className={`text-sm font-medium ${inStock ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                                {avail}
                                            </span>
                                        </td>
                                    );
                                })}
                            </tr>
                            {/* Description */}
                            <tr>
                                <td className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400 align-top">Description</td>
                                {detailedProducts.map((p, i) => (
                                    <td key={i} className="p-4 border-l border-gray-200 dark:border-slate-700 text-sm text-gray-600 dark:text-gray-300 align-top leading-relaxed">
                                        <div className="line-clamp-4">{p.description}</div>
                                    </td>
                                ))}
                            </tr>
                            {/* Action */}
                            <tr>
                                <td className="p-4 border-t border-gray-200 dark:border-slate-700"></td>
                                {detailedProducts.map((p, i) => (
                                    <td key={i} className="p-4 border-l border-t border-gray-200 dark:border-slate-700 text-center bg-gray-50 dark:bg-slate-900/30">
                                        <a href={p.url || `https://dummyjson.com/products/${p.id}`} target="_blank" rel="noopener noreferrer">
                                            <button className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors duration-200 text-sm shadow-sm focus:outline-none">
                                                View Product
                                            </button>
                                        </a>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ComparisonTable;

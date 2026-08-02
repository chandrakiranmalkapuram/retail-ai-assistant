import React, { useEffect, useState } from 'react';
import type { ProductSearchResult } from '../../../shared/types/product.types';

const ProductCard: React.FC<Partial<ProductSearchResult>> = ({ name, price, rating, description, url }) => {
    const [image, setImage] = useState<string>('https://placehold.co/400x400?text=Product+Image');
    const [brand, setBrand] = useState<string>('Unknown Brand');
    const [availability, setAvailability] = useState<string>('In Stock');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(name || '')}`);
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
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-out flex flex-col h-full animate-fade-in-up group">
            {/* Image Container */}
            <div className="relative h-64 w-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center p-6 border-b border-gray-100 dark:border-slate-700">
                {loading ? (
                    <div className="animate-pulse flex items-center justify-center w-full h-full bg-gray-200 dark:bg-slate-700 rounded-xl">
                        <svg className="w-10 h-10 text-gray-300 dark:text-slate-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                        </svg>
                    </div>
                ) : (
                    <img 
                        src={image} 
                        alt={name} 
                        className="object-contain max-h-full max-w-full drop-shadow-sm mix-blend-multiply dark:mix-blend-normal transform group-hover:scale-105 transition-transform duration-500"
                    />
                )}
                
                {!loading && (
                    <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-2.5 py-1.5 rounded-full text-xs font-semibold text-gray-800 dark:text-gray-100 shadow-sm flex items-center gap-1.5 border border-gray-100 dark:border-slate-700">
                        <svg className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {rating || 'N/A'}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
                {loading ? (
                    <div className="animate-pulse">
                        <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded-full w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-full w-1/2 mb-4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full w-full mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full w-5/6 mb-4"></div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-start gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg leading-snug line-clamp-2">{name}</h3>
                            <span className="font-bold text-xl text-indigo-600 dark:text-indigo-400 whitespace-nowrap">${price}</span>
                        </div>
                        
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2 font-medium">
                            <span>{brand}</span>
                            <span>•</span>
                            <span className={availability.toLowerCase().includes('stock') ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                                {availability}
                            </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-6 flex-1 leading-relaxed">
                            {description}
                        </p>
                    </>
                )}

                <div className="mt-auto flex gap-3">
                    <button 
                        onClick={() => alert(`Comparison feature coming soon for ${name}!`)}
                        disabled={loading}
                        className="flex-1 py-2.5 px-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 font-medium rounded-xl transition-colors duration-200 text-sm focus:outline-none disabled:opacity-50"
                    >
                        Compare
                    </button>
                    <a href={url || '#'} target="_blank" rel="noopener noreferrer" className="flex-1 block">
                        <button 
                            disabled={loading}
                            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors duration-200 text-sm shadow-sm focus:outline-none disabled:opacity-50"
                        >
                            View Product
                        </button>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

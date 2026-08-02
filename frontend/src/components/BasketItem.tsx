import React from 'react';
import type { BasketItem as IBasketItem } from '../../../backend/src/types/basket.types';

interface BasketItemProps {
    item: IBasketItem;
    onRemove: (productId: string) => void;
    onUpdateQuantity: (productId: string, quantity: number) => void;
}

const BasketItem: React.FC<BasketItemProps> = ({ item, onRemove, onUpdateQuantity }) => {
    return (
        <div className="flex gap-4 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
            <div className="w-20 h-20 flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden flex items-center justify-center p-2">
                <img 
                    src={item.product.image || undefined} 
                    alt={item.product.name || undefined}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/png?text=No+Image';
                    }}
                />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {item.product.name}
                </h4>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">
                    £{item.price.toFixed(2)}
                </p>
                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <button 
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50"
                            disabled={item.quantity <= 1}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
                        </button>
                        <span className="px-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                            {item.quantity}
                        </span>
                        <button 
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        </button>
                    </div>
                    
                    <button 
                        onClick={() => onRemove(item.product.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                        aria-label="Remove item"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BasketItem;

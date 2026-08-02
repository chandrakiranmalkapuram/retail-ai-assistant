import React, { useEffect, useState } from 'react';
import BasketItem from './BasketItem';
import type { Basket } from '../../../backend/src/types/basket.types';

interface BasketSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    basketUpdatedEvent: number; // A number that changes when the basket needs to be re-fetched
    onCheckout: () => void; // Called when the user clicks Checkout, so the UI can send the hidden chat message
}

const BasketSidebar: React.FC<BasketSidebarProps> = ({ isOpen, onClose, basketUpdatedEvent, onCheckout }) => {
    const [basket, setBasket] = useState<Basket | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchBasket = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:3001/api/basket');
            const data = await response.json();
            setBasket(data);
        } catch (error) {
            console.error('Failed to fetch basket:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen || basketUpdatedEvent > 0) {
            fetchBasket();
        }
    }, [isOpen, basketUpdatedEvent]);

    const handleRemove = async (productId: string) => {
        try {
            const response = await fetch(`http://localhost:3001/api/basket/${productId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            setBasket(data);
        } catch (error) {
            console.error('Failed to remove item:', error);
        }
    };

    const handleUpdateQuantity = async (productId: string, quantity: number) => {
        try {
            const response = await fetch(`http://localhost:3001/api/basket/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity }),
            });
            const data = await response.json();
            setBasket(data);
        } catch (error) {
            console.error('Failed to update quantity:', error);
        }
    };

    const handleCheckoutClick = () => {
        if (!basket || basket.items.length === 0) return;
        onCheckout();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity pointer-events-auto ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
                onClick={onClose}
            />

            {/* Sidebar (slides from right on desktop, up from bottom on mobile) */}
            <div className={`absolute inset-y-0 right-0 w-full md:w-96 bg-white dark:bg-gray-900 shadow-2xl pointer-events-auto transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col mt-auto md:mt-0 h-[85vh] md:h-full rounded-t-2xl md:rounded-none`}>
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Shopping Basket
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4">
                    {isLoading && !basket ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : !basket || basket.items.length === 0 ? (
                        <div className="flex flex-col justify-center items-center h-full text-center p-6">
                            <div className="w-32 h-32 mb-6 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                <svg className="w-16 h-16 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Your basket is empty</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Looks like you haven't added any items to your basket yet.</p>
                            <button 
                                onClick={onClose}
                                className="mt-6 px-6 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full font-medium text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {basket.items.map((item) => (
                                <BasketItem 
                                    key={item.product.id}
                                    item={item} 
                                    onRemove={handleRemove}
                                    onUpdateQuantity={handleUpdateQuantity}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer (Totals & Checkout) */}
                {basket && basket.items.length > 0 && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex justify-between items-center mb-4 text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Subtotal ({basket.totalQuantity} items)</span>
                            <span className="font-semibold text-gray-900 dark:text-white">£{basket.totalPrice.toFixed(2)}</span>
                        </div>
                        <button 
                            onClick={handleCheckoutClick}
                            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-sm transition-colors flex items-center justify-center gap-2"
                        >
                            <span>Checkout Now</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BasketSidebar;

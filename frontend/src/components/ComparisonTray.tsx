import React from 'react';
import type { Product } from '../../../shared/types/product.types';

interface ComparisonTrayProps {
    products: Product[];
    onRemove: (id: string) => void;
    onCompareNow: () => void;
}

export const ComparisonTray: React.FC<ComparisonTrayProps> = ({ products, onRemove, onCompareNow }) => {
    if (products.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            zIndex: 1000,
        }}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#333' }}>Compare</h4>
            {products.map(p => (
                <div key={p.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px' }}>
                    <img src={p.image || ''} alt={p.name || 'Product'} style={{ width: '40px', height: '40px', objectFit: 'contain', marginBottom: '4px' }} />
                    <button 
                        onClick={() => onRemove(p.id)} 
                        style={{ fontSize: '10px', background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}
                    >
                        Remove
                    </button>
                </div>
            ))}
            
            {products.length < 4 && (
                Array.from({ length: 4 - products.length }).map((_, i) => (
                    <div key={`empty-${i}`} style={{ width: '60px', height: '40px', border: '1px dashed #ccc', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#ccc', fontSize: '20px' }}>+</span>
                    </div>
                ))
            )}
            
            <div style={{ borderLeft: '1px solid #eee', paddingLeft: '16px', display: 'flex', alignItems: 'center' }}>
                <button 
                    onClick={onCompareNow}
                    disabled={products.length < 2}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: products.length >= 2 ? '#007bff' : '#ccc',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: products.length >= 2 ? 'pointer' : 'not-allowed',
                        fontWeight: 'bold'
                    }}
                >
                    Compare Now
                </button>
            </div>
        </div>
    );
};

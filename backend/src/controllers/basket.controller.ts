import { Request, Response, NextFunction } from 'express';
import { BasketService } from '../services/basket/BasketService';

export const getBasket = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const basket = BasketService.getBasket();
        res.json(basket);
    } catch (error) {
        next(error);
    }
};

export const addItem = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const { productId } = req.body;
        if (!productId) {
            res.status(400).json({ error: 'productId is required' });
            return;
        }
        const basket = BasketService.addItem(productId);
        res.json(basket);
    } catch (error) {
        next(error);
    }
};

export const removeItem = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const productId = req.params.productId as string;
        const basket = BasketService.removeItem(productId);
        res.json(basket);
    } catch (error) {
        next(error);
    }
};

export const updateQuantity = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const productId = req.params.productId as string;
        const { quantity } = req.body;
        if (typeof quantity !== 'number') {
            res.status(400).json({ error: 'quantity must be a number' });
            return;
        }
        const basket = BasketService.updateQuantity(productId, quantity);
        res.json(basket);
    } catch (error) {
        next(error);
    }
};

export const clearBasket = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const basket = BasketService.clearBasket();
        res.json(basket);
    } catch (error) {
        next(error);
    }
};

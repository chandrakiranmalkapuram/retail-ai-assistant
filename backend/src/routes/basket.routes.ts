import { Router } from 'express';
import { getBasket, addItem, removeItem, updateQuantity, clearBasket } from '../controllers/basket.controller';

const router = Router();

router.get('/', getBasket);
router.post('/add', addItem);
router.put('/:productId', updateQuantity);
router.delete('/:productId', removeItem);
router.delete('/', clearBasket);

export default router;

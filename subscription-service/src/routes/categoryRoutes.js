const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const validate = require('../middleware/validatorMiddleware');
const { categorySchema } = require('../validations/categoryValidation');

router.post('/', validate(categorySchema), categoryController.createCategory);
router.delete('/:id', categoryController.deleteCategory);
router.get('/', categoryController.getCategories);

module.exports = router;
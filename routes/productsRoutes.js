const joi = require('joi');
import express from 'express';
import bodyParser from 'body-parser';

import products from '../entity-managers/products';
import authRoute from './authRoute';

const productRoutes = express.Router();

const validateProduct = (product) => {
    const schema = joi.object().keys({
        "name" : joi.string().required(),
        "category" : joi.string().required(),
        "price" : joi.string().required(),
        "quantity" : joi.number().required(),
        "description" : joi.string(),
        "image_url" : joi.string()
    });

    return joi.validate(product, schema);
}

//productRoutes.use(authRoute);
productRoutes.use(bodyParser.json());
productRoutes.use(bodyParser.urlencoded({ extended: false}));

productRoutes.get('/', authRoute(['admin','attendant']), (req, res) => {
    (async () => {
        res.status(200).json(await products.getAll());
    })();
});

productRoutes.get('/:productID', authRoute(['admin','attendant']), (req, res,) => {
    (async () => {
        const { productID  } = req.params;
        const product = await products.getProduct(productID);
        if(product) return res.status(200).json(product);
        return res.status(404).json({
            error: {
                code: 404,
                message: "Invalid product ID"
            }
        });
    })();
});

productRoutes.post('/', authRoute(['admin']), (req, res) => {
    (async () => {
        const { body: productToAdd } = req;
        const { error } = validateProduct(productToAdd);
        if (error){
            return res.status(400).json(error.details[0].message);
        }
        productToAdd.id = await products.getLastID() + 1;
        await products.addProduct(productToAdd);
        return res.status(200).json(await products.getProduct(productToAdd.id));
    })();
});

productRoutes.put('/:productID',authRoute(['admin']), (req, res) => {
    (async () => {
        const { productID } = req.params;
        const { body: propsToUpdate } = req;
        if(propsToUpdate.hasOwnProperty("id")){
            delete propsToUpdate.id;
        }
        const product = await products.getProduct(productID);
        if(!product) {
            return res.status(404).json({
                error: {
                    code: 404,
                    message: "Invalid product ID"
                }
            });
        }
        for(const prop in propsToUpdate){
            product[prop] = propsToUpdate[prop];
        }
        const productCopy = Object.assign({}, product);
        delete productCopy.id;
        const { error } = validateProduct(productCopy);
        if(error) return res.status(400).json(error.details[0].message);
        await products.addProduct(product);
        return res.status(200).json(await products.getProduct(productID));
    })();
});

export default productRoutes;
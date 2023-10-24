import { Sequelize } from "sequelize-typescript";
import ProductModel from "../db/sequelize/model/product.model";
import Product from "../../domain/product/entity/product";
import ProductRepository from "./product.repository";

describe('Product Repository Tests', () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            sync   : { force: true },
            logging: false
        });

        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('Should create a product', async () => {
        const productRepository = new ProductRepository();
        const product = new Product('1', 'Product 1', 100)
        await productRepository.create(product);

        const productModel = await ProductModel.findOne({ where: { id: '1' } });
        expect(productModel.toJSON()).toStrictEqual({
            id: '1',
            name: 'Product 1',
            price: 100
        });
    
    });

    it('Should update a product', async () => {   
        const productRepository = new ProductRepository();
        const product = new Product('1', 'Product 1', 100)
        await productRepository.create(product);

        const productModel = await ProductModel.findOne({ where: { id: '1' } });

        expect(productModel.toJSON()).toStrictEqual({
            id: '1',
            name: 'Product 1',
            price: 100
        });

        product.changeName( 'Product 2');
        product.changePrice(200);

        await productRepository.update(product);

        const productModelUpdated = await ProductModel.findOne({ where: { id: '1' } });

        expect(productModelUpdated.toJSON()).toStrictEqual({
            id: '1',
            name: 'Product 2',
            price: 200
        });


    });

    it('Should find a product by id', async () => {
        const productRepository = new ProductRepository();
        const product = new Product('1', 'Product 1', 100)
        await productRepository.create(product);

        const productModel = await ProductModel.findOne({ where: { id: '1' } });

        const foundProduct = await productRepository.findById('1');

        expect(productModel.toJSON()).toStrictEqual({
            id: foundProduct.id,
            name: foundProduct.name,
            price: foundProduct.price
        });
    }  );

    it('Should find all products', async () => {
        const productRepository = new ProductRepository();
        const product1 = new Product('1', 'Product 1', 100)
        const product2 = new Product('2', 'Product 2', 200)
        await productRepository.create(product1);
        await productRepository.create(product2);

        const foundProducts = await productRepository.findAll();
        const product = [product1, product2];

        expect(product).toEqual(foundProducts);

    });

});


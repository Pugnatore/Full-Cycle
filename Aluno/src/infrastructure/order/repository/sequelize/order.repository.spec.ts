import { Customer } from '../../../../domain/customer/entity/customer';
import { Sequelize } from "sequelize-typescript";

import CustomerRepository from "../../../customer/respository/sequelize/customer.repository";
import CustomerModel from "../../../customer/respository/sequelize/customer.model";
import { Address } from "../../../../domain/customer/value-object/address";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from '../../../product/repository/sequelize/product.repository';
import Product from '../../../../domain/product/entity/product';
import OrderItem from '../../../../domain/checkout/entity/order_item';
import Order from '../../../../domain/checkout/entity/order';
import OrderRepository from './order.repository';

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([CustomerModel, OrderItemModel, OrderModel, ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });
  
  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", "City 1", 1,"Zipcode 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      2,
      product.id,
    );

    const order = new Order("123", customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: order.id,
          product_id: product.id,
        },
      ],
    }); 
})

it("Should return an order by id", async () => {
  const customerRepository = new CustomerRepository();
  const customer = new Customer("123", "Customer 1");
  const address = new Address("Street 1", "City 1", 1,"Zipcode 1");
  customer.changeAddress(address);
  await customerRepository.create(customer);

  const productRepository = new ProductRepository();
  const product = new Product("123", "Product 1", 10);
  await productRepository.create(product);

  const orderItem = new OrderItem(
    "1",
    product.name,
    product.price,
    2,
    product.id,
  );

  const orderRepository = new OrderRepository();
  const orderToInsert = new Order("123", customer.id, [orderItem]);
  await orderRepository.create(orderToInsert);
  
  const order:Order = await orderRepository.findById(orderToInsert.id);

  expect(order).toEqual(orderToInsert);

});

it("Should return all orders", async () => {
  const customerRepository = new CustomerRepository();
  const customer = new Customer("123", "Customer 1");
  const address = new Address("Street 1", "City 1", 1,"Zipcode 1");
  customer.changeAddress(address);
  await customerRepository.create(customer);

  const productRepository = new ProductRepository();
  const product = new Product("123", "Product 1", 10);
  await productRepository.create(product);

  const orderItem = new OrderItem(
    "1",
    product.name,
    product.price,
    2,
    product.id,
  );

  const orderRepository = new OrderRepository();
  const orderToInsert = new Order("123", customer.id, [orderItem]);
  await orderRepository.create(orderToInsert);
  
  const orders:Order[] = await orderRepository.findAll();

  expect(orders).toEqual([orderToInsert]);
});

it("Should update an order by adding a new OrderItem", async () => {
  const customerRepository = new CustomerRepository();
  const customer = new Customer("123", "Customer 1");
  const address = new Address("Street 1", "City 1", 1,"Zipcode 1");
  customer.changeAddress(address);
  await customerRepository.create(customer);

  const productRepository = new ProductRepository();
  const product = new Product("123", "Product 1", 10);
  await productRepository.create(product);

  const product2 = new Product("124", "Product 2", 20);
  await productRepository.create(product2);

  const orderItem = new OrderItem(
    "1",
    product.name,
    product.price,
    2,
    product.id,
  );

  const orderItem2 = new OrderItem(
    "2",
    product2.name,
    product2.price,
    2,
    product2.id,
  );

  const orderRepository = new OrderRepository();
  const order = new Order("123", customer.id, [orderItem]);
  await orderRepository.create(order);
  
  const orderModel = await OrderModel.findOne({
    where: { id: order.id },
    include: ["items"],
  });

  expect(orderModel.toJSON()).toStrictEqual({
    id: order.id,
    customer_id: customer.id,
    total: order.total(),
    items: [
      {
        id: orderItem.id,
        name: orderItem.name,
        price: orderItem.price,
        quantity: orderItem.quantity,
        order_id: order.id,
        product_id: product.id,
      },
    ],
  });

  order.addItems([orderItem2]);
  await orderRepository.update(order);

  const orderModel2 = await OrderModel.findOne({
    where: { id: order.id },
    include: ["items"],
  });

  expect(orderModel2.toJSON()).toStrictEqual({
    id: order.id,
    customer_id: customer.id,
    total: order.total(),
    items: [
      {
        id: orderItem.id,
        name: orderItem.name,
        price: orderItem.price,
        quantity: orderItem.quantity,
        order_id: order.id,
        product_id: product.id,
      },
      {
        id: orderItem2.id,
        name: orderItem2.name,
        price: orderItem2.price,
        quantity: orderItem2.quantity,
        order_id: order.id,
        product_id: product2.id,
      },
    ],
  });
});

it("Should update an order by removing an OrderItem", async () => {
  const customerRepository = new CustomerRepository();
  const customer = new Customer("123", "Customer 1");
  const address = new Address("Street 1", "City 1", 1,"Zipcode 1");
  customer.changeAddress(address);
  await customerRepository.create(customer);

  const productRepository = new ProductRepository();
  const product = new Product("123", "Product 1", 10);
  await productRepository.create(product);

  const product2 = new Product("124", "Product 2", 20);
  await productRepository.create(product2);

  const orderItem = new OrderItem(
    "1",
    product.name,
    product.price,
    2,
    product.id,
  );

  const orderItem2 = new OrderItem(
    "2",
    product2.name,
    product2.price,
    2,
    product2.id,
  );

  const orderRepository = new OrderRepository();
  const order = new Order("123", customer.id, [orderItem, orderItem2]);
  await orderRepository.create(order);
  
  const orderModel = await OrderModel.findOne({
    where: { id: order.id },
    include: ["items"],
  });

  expect(orderModel.toJSON()).toStrictEqual({
    id: order.id,
    customer_id: customer.id,
    total: order.total(),
    items: [
      {
        id: orderItem.id,
        name: orderItem.name,
        price: orderItem.price,
        quantity: orderItem.quantity,
        order_id: order.id,
        product_id: product.id,
      },
      {
        id: orderItem2.id,
        name: orderItem2.name,
        price: orderItem2.price,
        quantity: orderItem2.quantity,
        order_id: order.id,
        product_id: product2.id,
      },
    ],
  });

  order.removeItems([orderItem2]);
  await orderRepository.update(order);

  const orderModel2 = await OrderModel.findOne({
    where: { id: order.id },
    include: ["items"],
  });

  expect(orderModel2.toJSON()).toStrictEqual({
    id: order.id,
    customer_id: customer.id,
    total: order.total(),
    items: [
      {
        id: orderItem.id,
        name: orderItem.name,
        price: orderItem.price,
        quantity: orderItem.quantity,
        order_id: order.id,
        product_id: product.id,
      }
    ],
  });

});

});
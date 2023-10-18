import { Customer } from '../entity/customer';
import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import OrderService from "./order.service";

describe("Order service unit tests", () => {
    it("Should place an order", () => {
        const customer = new Customer("1", "Customer 1");
        const orderItem1 = new OrderItem("1", "Product 1", 10, 1, "p1" );

        const order = OrderService.placeOrder(customer, [orderItem1]);

        expect(customer.rewardPoints).toBe(5);
        expect(order.total()).toBe(10);
    });


    it("Should calculate total price of all orders", () => {
        //Arrange
        const orderItem1 = new OrderItem("1", "Product 1", 10, 1, "p1" );
        const orderItem2 = new OrderItem("2", "Product 2", 20, 1, "p2");
        
        const order1 = new Order("1", "Order 1", [orderItem1]);
        const order2 = new Order("2", "Order 2", [orderItem2]);
        //Act
        const total = OrderService.calculateTotalPrice([order1, order2]);
        //Assert
        expect(total).toBe(30);
    });
});
import { Address } from "./domain/entity/address";
import { Customer } from "./domain/entity/customer";
import Order from "./domain/entity/order";
import OrderItem from "./domain/entity/order_item";

let customer = new Customer("123", "Smith");
const address = new Address("Main Street", "New York", 1000, "123456");
customer.changeAddress( address);
customer.activate();

const item1 = new OrderItem("123", "item1", 10, 1, "P1");
const item2 = new OrderItem("456", "item2", 20, 1, "P1");
const order = new Order("1", "123", [item1, item2]);
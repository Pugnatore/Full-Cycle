import { Address } from "./entity/address";
import { Customer } from "./entity/customer";
import Order from "./entity/order";
import OrderItem from "./entity/order_item";

let customer = new Customer("123", "Smith");
const address = new Address("Main Street", "New York", 1000, "123456");
customer.Address = address;
customer.activate();

const item1 = new OrderItem("123", "item1", 10, 1, "P1");
const item2 = new OrderItem("456", "item2", 20, 1, "P1");
const order = new Order("1", "123", [item1, item2]);
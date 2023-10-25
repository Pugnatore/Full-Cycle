import { Address } from './../value-object/address';
import { Customer } from './../entity/customer';
import CustomerFactory from './customer.factory';
describe("Customer factory unit test", () => {
    it("should create a new customer", () => {
        let customer = CustomerFactory.create("John");
        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("John");
        expect(customer.Address).toBeUndefined();
    })

    it("Should create a new customer with address", () => {
        const address = new Address("Street 1", "City", 1 ,"12345-000");
        let customer = CustomerFactory.createWithAddress("John", address);

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("John");
        expect(customer.Address).toBeDefined();
        expect(customer.Address).toBe(address);
    })
})
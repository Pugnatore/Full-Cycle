import { Address } from "./address";
import { Customer } from "./customer";

describe("Customer unit tests", () => {

    it("Should throw error when Id is Empty", () => {
        
        expect(() => {
            let customer = new Customer("", "John Doe");
        }).toThrowError("Id is required");

    });

    it("Should throw error when name is Empty", () => {
        
        expect(() => {
            let customer = new Customer("123", "");
        }).toThrowError("Name is required");

    });

    it("Should change name", () => {
        //Arrange
        let customer = new Customer("123", "John Doe");

        //Act   
        customer.changeName("Jane Doe");

        //Assert
        expect(customer.name).toBe("Jane Doe");

    });

    it("Should activate customer", () => {
        const customer = new Customer("123", "John Doe");
        const address = new Address("Street", "City", 123, "12345678");
        customer.Address = address;

        customer.activate();

        expect(customer.isActive()).toBe(true);
    });

    it("Should throw error when address is undefined", () => {

        expect(() => {

            const customer = new Customer("123", "John Doe");
            customer.activate();
        }).toThrowError("Address is mandatory to activate customer");
     
    });

    it("Should deactivate customer", () => {
        const customer = new Customer("123", "John Doe");
        const address = new Address("Street", "City", 123, "12345678");
        customer.Address = address;

        customer.deactivate();

        expect(customer.isActive()).toBe(false);
    });

    it("Should add reward points", () => {
        const customer = new Customer("123", "John Doe");
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(10);

        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);

    });

});
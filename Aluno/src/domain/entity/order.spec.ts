import Order from "./order";
import OrderItem from "./order_item";


describe("Order unit tests", () => {

    it("Should throw error when Id is Empty", () => {
        
        expect(() => {
            let order = new Order("", "123", []);
        }).toThrowError("Id is required");

    });

    it("Should throw error when CustomerId is Empty", () => {
        
        expect(() => {
            let order = new Order("123", "", []);
        }).toThrowError("CustomerId is required");

    });

    it("Should throw error when OrderItems are Empty", () => {
        
        expect(() => {
            let order = new Order("123", "123", []);
        }).toThrowError("Item quantity must be greater than zero");

    });

    it("Should calculate total", () => {
        //Arrange
        let order = new Order("123", "123", [ 
            new OrderItem("I1","Item1", 10, 2, "P1"), 
            new OrderItem("I2","Item2", 20, 2, "P2"),
             new OrderItem("I3","Item3", 30, 2, "P3")]);
          

        //Act   
        let total = order.total();

        //Assert
        expect(total).toBe(120);

    });

    it("Should throw error if the quantity is less or equal than 0", () => {
        
        expect(() => {

            const item = new OrderItem("I1","Item1", 10, 0, "P1");
            const order = new Order("123", "123", [item]);

        }).toThrowError("Item quantity must be greater than zero");

    });

});
import Product from "./product";


describe("Product unit tests", () => {

    it("Should throw error when Id is Empty", () => {
        
        expect(() => {

            let product = new Product("", "Product 1", 100);
        }).toThrowError("Id is required");

    });

    it("Should throw error when Name is Empty", () => {
        
        expect(() => {

            let product = new Product("1", "", 100);
        }).toThrowError("Name is required");

    });

    it("Should throw error when Price is less than 0", () => {
        
        expect(() => {

            let product = new Product("1", "Product 1", -1);
        }).toThrowError("Price is must be greater than zero");

    });

    it("Should change name", () => {
        const product = new Product("1", "Product 1", 100);
        product.changeName("Product 2");
        expect(product.name).toBe("Product 2");

    });

    it("Should change price", () => {
        const product = new Product("1", "Product 1", 100);
        product.changePrice(200);
        expect(product.price).toBe(200);

    });



});
import { Address } from "../../customer/value-object/address";
import { Customer } from "../../customer/entity/customer";

import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";
import EnviaConsoleLog1Handler from "../../customer/event/handlers/customer-created-EnviaConsoleLog1Handler";
import EnviaConsoleLog2Handler from "../../customer/event/handlers/customer-created-EnviaConsoleLog2Handler";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import CustomerAddressChangedHandler from "../../customer/event/handlers/customer-address-changedHandler";
import CustomerAddressChangedEvent from "../../customer/event/customer-address-changed.event";

describe("Domain event tests",()=>{
    it("Should register an event handler",()=>{
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent",eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);


    })

    it("Should unregister product event handler",()=>{
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent",eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();


        eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);
    })

    it("Should unregister customer created event handler",()=>{
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLog1Handler();

        eventDispatcher.register("CustomerCreatedEvent",eventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();


        eventDispatcher.unregister("CustomerCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(0);
    })

    it("Should unregister all event handlers",()=>{
        const eventDispatcher = new EventDispatcher();
        const productEventHandler = new SendEmailWhenProductIsCreatedHandler();
        const customerEventHandler1 = new EnviaConsoleLog1Handler();
        const customerEventHandler2 = new EnviaConsoleLog2Handler();

        eventDispatcher.register("ProductCreatedEvent",productEventHandler);
        eventDispatcher.register("CustomerCreatedEvent",customerEventHandler1);
        eventDispatcher.register("CustomerCreatedEvent",customerEventHandler2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();

        eventDispatcher.unrigisterAll();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeUndefined();

    })

    it("Should notify all product event handlers",()=>{
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler,"handle");

        eventDispatcher.register("ProductCreatedEvent",eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toMatchObject([eventHandler]);

        const productCreatedEvent =  new ProductCreatedEvent({
                id:1,
                name:"Product 1",
                price:100
        });
        //QUANDO O NOTIFY FOR EXECUTADO O SENDEMIALWHENPRODUCTISCREATEDHANDLER DEVE SER EXECUTADO   
        eventDispatcher.notify(productCreatedEvent);
        expect(spyEventHandler).toHaveBeenCalled();
        expect(spyEventHandler).toBeCalledWith(productCreatedEvent);


        });

        it("Should register customer created event",()=>{
            const eventDispatcher = new EventDispatcher();
            const eventHandler1 = new EnviaConsoleLog1Handler();
            const eventHandler2 = new EnviaConsoleLog2Handler();
    
            eventDispatcher.register("CustomerCreatedEvent",eventHandler1);
            eventDispatcher.register("CustomerCreatedEvent",eventHandler2);
    
            expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
            expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
            expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler1);
            expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2);
        })

        it("Should notify all customer created event handlers",()=>{
            const eventDispatcher = new EventDispatcher();
            const eventHandler1 = new EnviaConsoleLog1Handler();
            const eventHandler2 = new EnviaConsoleLog2Handler();
            const spyEventHandler1 = jest.spyOn(eventHandler1,"handle");
            const spyEventHandler2 = jest.spyOn(eventHandler2,"handle");

            eventDispatcher.register("CustomerCreatedEvent",eventHandler1);
            eventDispatcher.register("CustomerCreatedEvent",eventHandler2);

            expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
            expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);

            const customerCreatedEvent =  new CustomerCreatedEvent({
                id:1,
                name:"Customer 1"
             })

            eventDispatcher.notify(customerCreatedEvent);  

                expect(spyEventHandler1).toHaveBeenCalled();
                expect(spyEventHandler2).toHaveBeenCalled();
                expect(spyEventHandler1).toBeCalledWith(customerCreatedEvent);  
                expect(spyEventHandler2).toBeCalledWith(customerCreatedEvent);

            });

            it("Should notify address changed event handlers",()=>{
                const eventDispatcher = new EventDispatcher();
                const eventHandler1 = new CustomerAddressChangedHandler();
                const spyEventHandler1 = jest.spyOn(eventHandler1,"handle");
    
                eventDispatcher.register("CustomerAddressChangedEvent",eventHandler1);
    
                expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"]).toBeDefined();
                expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"].length).toBe(1);

                const customer = new Customer("1","Cristiano Ronaldo");
                const address = new Address("Rua do paralelo torto","Porto", 2, "4580-234");
                customer.changeAddress(address);
    
                const customerAddressChangedEvent = new CustomerAddressChangedEvent(customer)
    
                eventDispatcher.notify(customerAddressChangedEvent);  
    
                expect(spyEventHandler1).toHaveBeenCalled();
                expect(spyEventHandler1).toBeCalledWith(customerAddressChangedEvent);  
            })


})


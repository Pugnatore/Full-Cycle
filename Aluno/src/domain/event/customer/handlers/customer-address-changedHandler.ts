import EventHandlerInterface from "../../@shared/event-handler.interface";
import CustomerAddressChangedEvent from "../customer-address-changed.event";

export default class CustomerAddressChangedHandler implements EventHandlerInterface<CustomerAddressChangedEvent> {
    handle(event: CustomerAddressChangedEvent) {
        const customerId = event.eventData.id;
        const address = event.eventData.Address;
        const nome = event.eventData.name;
        console.log(`Endereço do cliente: ${customerId}, ${nome} alterado para: ${address.street}`);
    }
}
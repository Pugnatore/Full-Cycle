import EventInterface from "../../@shared/event/event.interface";
import { Customer } from "../../customer/entity/customer";


export default class CustomerCreatedEvent implements EventInterface {
    dateTimeOccurred: Date;
    eventData: any;
    constructor(eventData: any) {
        this.dateTimeOccurred = new Date();
        this.eventData = eventData;
    }
}
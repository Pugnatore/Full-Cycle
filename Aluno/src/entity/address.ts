export class Address {
    street: string;
    number: number; 
    city: string;
    zip: string;
    constructor(street: string, city: string,number:number,  zip: string) {
        this.street = street;
        this.city = city;
        this.zip = zip;
        this.number = number;
    }
    validate() {
        if(this.street.length === 0){
            throw new Error("Street is required");
        }  
        
        if(this.number === 0){
            throw new Error("Number is required");
        }   

        if(this.city.length === 0){
            throw new Error("City is required");
        }
    }

    toString() {
        return `${this.street}, ${this.number} - ${this.city} - ${this.zip}`;
    }
}
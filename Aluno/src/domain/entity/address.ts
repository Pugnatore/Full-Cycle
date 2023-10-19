export class Address {
    private _street: string;
    private _number: number; 
    private _city: string;
    private _zip: string;

    constructor(street: string, city: string,number:number,  zip: string) {
        this._street = street;
        this._city = city;
        this._zip = zip;
        this._number = number;
    }

    get number(): number {
        return this._number;
    }

    get street(): string {
        return this._street;
    }

    get city(): string {
        return this._city;
    }

    get zip(): string {
        return this._zip;
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
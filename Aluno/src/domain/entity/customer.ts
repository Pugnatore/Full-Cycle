import { Address } from "./address";

export class Customer{
   private _id: string;
   private  _name: string;
   private _address!: Address;
   private _active: boolean = true;
   private _rewardPoints: number = 0;

    constructor(id: string, name: string){
        this._id = id;
        this._name = name;
        this.validate();
    }

    
    get Address(): Address{
        return this._address;
    }

    get name(): string{
        return this._name;
    }

    get id(): string{
        return this._id;
    }

    get rewardPoints(): number{
        return this._rewardPoints;
    }

    validate() {
        if(this._id.length === 0){
            throw new Error("Id is required");
        }

        if(this._name.length === 0){
            throw new Error("Name is required");
        }  
    }

    changeName(newName: string){
        this._name = newName;
    }

    changeAddress(newAddress: Address){
        this._address = newAddress;
    }

    activate(){
        if(this._address === undefined){
            throw new Error("Address is mandatory to activate customer");
        }
        this._active = true;
    }

    addRewardPoints(points: number){
        this._rewardPoints += points;
    }

    deactivate(){
        this._active = false;
    }

    isActive(): boolean{
        return this._active;
    }
}
import { ValidationError } from "../utils/errors.js";
export class User {
    static counter = 0;
    static initCounter(maxId = 0) {
        User.counter = Math.max(User.counter, maxId);
    }
    
    #id;
    #name;
    #email;
    #age;
    
    constructor({id=null, name=null, email=null, age=0 }) {
        // If loading from storage, use existing ID
        if (id !== null && Number.isInteger(id) && id > 0) {
            this.#id = id;
            User.initCounter(id);
        } else {
            this.#id = ++User.counter;
        }
        this.#name = name;
        this.#email = email;
        this.#age = Number(age);
        this.validate();
    }
    validate() {
        const errors = [];
        if(this.#id !== undefined && this.#id!==null){
            if(!Number.isInteger(this.#id) || this.#id<=0){
                errors.push('id must be a positive integer')
            }
        }

        if (!this.#name || String(this.#name).trim().length < 2) {
            errors.push('name is required and must be at least 2 characters');
        }

        const email = String(this.#email || '');
        if (!email.includes('@') || !email.includes('.')) {
            errors.push('email must contain "@" and "."');
        }

        if (this.#age === undefined || this.#age === null || !Number.isInteger(this.#age)) {
            errors.push('age is required and must be an integer');
        } else {
            if (this.#age < 1 || this.#age > 120) {
                errors.push('age must be between 1 and 120');
            }
        }
        if(errors.length) throw new ValidationError(errors);
    }
    update(data) { 
        /* update fields + re-validate */ 
        // apply only allowed fields
        //if (data.id !== undefined) this.#id = data.id;
        if (data.name !== undefined) this.#name = data.name;
        if (data.email !== undefined) this.#email = data.email;
        if (data.age !== undefined) this.#age = data.age;

        this.validate();
        return this;
    }

    toJSON() {
        /* return plain object */ 
        return {
            id: this.#id,
            name: this.#name,
            email: this.#email,
            age: this.#age
        };
    }

    get id() { return this.#id; }
    get name() { return this.#name; }
    get email() { return this.#email; }
    get age() { return this.#age; }
}
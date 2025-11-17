import { storage } from '../services/storage.js';
import { NotFoundError } from '../utils/errors.js';
import {User} from './User.js' ;
export class UserManager {
    #users = [];
    //#nextId = 1;
    constructor() {
       this.#loadFromStorage(); 
    }

    async addUser(data){
        const user = new User(data);
        if(user) this.#users.push(user);
        this.#save();
        return user.toJSON();
    } 

    async getUser(id){
        const nid = Number(id);
        const user = this.#users.find(u => u.id === nid);
        if(!user) throw new NotFoundError(`User with id=${nid} not found!`);
        return user;
    } 

    async updateUser(id, data){
        const nid = Number(id);
        const user = await this.getUser(nid);
        user.update(data);
        this.#save();
        //return user;        
    }

    async deleteUser(id){
        const nid = Number(id);
        const user = await this.getUser(nid);
        this.#users.splice(this.#users.indexOf(user),1);
        this.#save();
    }

    getAll(){
        return this.#users.map(u => u.toJSON());
    } 

    #save(){
        try {
            storage.set(this.getAll());
        } catch (error) {
            console.error('Failed to save users:', error);
        }
    } 
    
    #loadFromStorage(){
        try {
            const array = storage.get();
            if(Array.isArray(array) && array.length){
                this.#users = array.map(obj => {
                    const u = new User(obj);
                    return u;
                });
                // Initialize counter to highest ID
                const maxId = Math.max(...this.#users.map(u => u.id));
                User.initCounter(maxId);
            }
        } catch (error) {
            console.error('Failed to load users from local storage:', error);
        }
    } 
}
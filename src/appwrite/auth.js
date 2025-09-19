import conf from '../conf/conf.js';
import { Client, Account, ID } from 'appwrite';


// We making class instead of function in order to reduce the code 
// as so to not make this client n account variables again n again
export class AuthService {
    //Client n Account are Properties
    client = new Client();
    account;
    // We make them in constructor so that they are made only when object is created
    constructor() {
        this.client
            .setEndpoint('conf.appwriteEndpoint') // Your API Endpoint
            .setProject('conf.appwriteProjectId');
        this.account = new Account(this.client);
    }

    async createAccount({ email, password }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password);
            if (userAccount) {
                //When user signups we also log him in 
                login({ email, password })
            } else {
                return userAccount
            }
        } catch (error) {
            console.log("Appwrite Service :: createAccount :: error ", error);
        }
    }

    async login({ email, password }) {
        try {
            return this.account.createEmailPasswordSession(email, password)
        } catch (error) {
            console.log("Appwrite Service :: login :: error ", error);
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite Service :: getCurrentUser :: error ", error);
        }
        return null
    }

    async logout() {
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite Service :: logout :: error ", error);
        }
    }
}
const authService = new AuthService();
export default authService
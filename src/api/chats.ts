import HTTPTransport from '../tools/Request';
import { ChatId, CreateChat, ChatAddUser } from './types';

export default class ChatsApi {
    public httpTransport: HTTPTransport;

    constructor() {
        this.httpTransport = new HTTPTransport('/api/v2/chats');
    }

    async getChats() {
        return this.httpTransport.get('/');
    }

    async createChat(data: CreateChat) {
        console.log(`createChat data:\n ${data}`);
        return this.httpTransport.post('/', {
            data,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async delete(data: ChatId) {
        console.log(`delete data:\n ${data}`);
        return this.httpTransport.delete('/', {
            data,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async addUser(data: ChatAddUser) {
        return this.httpTransport.put('/users', {
            data,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async avatar(data: FormData) {
        return this.httpTransport.put('/users/avatar', {
            data,
        });
    }

    public getToken(data: ChatId) {
        return this.httpTransport.post(`/token/${data}`, {
            data,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                credentials: 'include',
                mode: 'cors',
            },
        });
    }
}

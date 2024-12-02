import HTTPTransport from '../tools/Request';
import { UserSearch, ChangeUserData } from './types';

export default class AuthApi {
    public httpTransport: HTTPTransport;

    constructor() {
        this.httpTransport = new HTTPTransport('/api/v2/user');
    }

    async changeProfile(data: ChangeUserData) {
        return this.httpTransport.put('/profile', {
            data,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async changeAvatar(data: FormData) {
        return this.httpTransport.put('/profile/avatar', {
            data,
        });
    }

    async searchUser(data: UserSearch) {
        console.log(`searchUser data: ${data}`);
        return this.httpTransport.post('/search', {
            data,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

import HTTPTransport from '../tools/Request';
import { LoginRequestData, SignUpRequestData } from './types';

export class AuthApi {
    private httpTransport: HTTPTransport;

    constructor() {
        this.httpTransport = new HTTPTransport('/api/v2/auth');
    }

    async login(data: LoginRequestData) {
        console.dir(`login data: ${data.login}`);
        console.dir(`pass data: ${data.password}`);
        return this.httpTransport.post('/signin', {
            data,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    async signup(data: SignUpRequestData) {
        return this.httpTransport.post('/signup', {
            data,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async logout() {
        return this.httpTransport.post('/logout');
    }

    async userinfo() {
        return this.httpTransport.get('/user');
    }
}

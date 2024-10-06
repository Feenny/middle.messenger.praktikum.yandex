import { AuthApi } from '../api/auth';
import { LoginRequestData, SignUpRequestData } from '../api/types';

const authApi = new AuthApi();
const login = async (data: LoginRequestData) => {
    window.store.set({ isLoading: true });

    const result : any = await authApi.login(data);
    // window.router.go('/messenger');
    return result.data;
};

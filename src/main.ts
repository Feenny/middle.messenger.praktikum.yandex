import Handlebars from 'handlebars';
import * as Components from './components';
import Router from './tools/Router';
import * as Pages from './pages';
import { Store } from './tools/Store';

Object.entries(Components).forEach(([name, component]) => {
    Handlebars.registerPartial(name, component);
});
declare global {
    export type Keys<T extends Record<string, unknown>> = keyof T;
    export type Values<T extends Record<string, unknown>> = T[Keys<T>];
}

declare global {
    interface Window {
        store: Store<any>;
        router: Router;
    }

    type Nullable<T> = T | null;
}

const router = new Router('#app');
window.router = router;

router
    .use('/', Pages.LoginPage)
    .use('/login', Pages.LoginPage)
    .use('/sign-up', Pages.RegistrationPage)
    .use('/chat', Pages.ChatPage)
    .use('/settings', Pages.SettingsPage)
    .use('/404', Pages.Error4Page)
    .use('/500', Pages.Error5Page)
    .start();

window.store = new Store({
    Updated: false,
    isLoading: false,
    loginError: null,
    cats: [],
    user: null,
    selectedCard: null,
});

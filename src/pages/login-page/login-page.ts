import { LoginRequestData } from '../../api/types';
import AuthApi from '../../api/auth';
import LoginPageTemplate from './login-page.hbs?raw';
import './login-page.scss';
import Block from '../../tools/Block';

import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { InputForm } from '../../components/input-form';
import { InputField } from '../../components/input-field';
import { Link } from '../../components/link';
import { Logout } from '../../components/logout';
import { PageTitle } from '../../components';
import { SidebarImg } from '../../components/sidebar-img';

import {
    loginValidation,
    checkValidate,
    passwordValidation,
    formValidate,
} from '../../tools/Validation';

class PageComponent extends Block {
    render() {
        return PageTitle;
    }
}

class ButtonComponent extends Block {
    render() {
        return Button;
    }
}

class InputComponent extends Block {
    render() {
        return Input;
    }
}

class InputFieldComponent extends Block {
    render() {
        return InputField;
    }
}

class InputFormComponent extends Block {
    render() {
        return InputForm;
    }
}

class LinkComponent extends Block {
    render() {
        return Link;
    }
}

class LogoutComponent extends Block {
    render() {
        return Logout;
    }
}

class SideBarImgComponent extends Block {
    render() {
        return SidebarImg;
    }
}

class LoginTemplate extends Block {
    render() {
        return LoginPageTemplate;
    }
}

const inputLogin = new InputFieldComponent({
    errorMessage: 'Логин должен включать латиницу, от 3 до 20 символов',
    title: 'Логин',
    Input: new InputComponent({
        name: 'login',
        title: 'Логин',
        value: 'shen',
        type: 'text',
        events: {
            blur: (evt: Event) => {
                checkValidate(evt, loginValidation, 'login');
            },
        },
    }),
});

const inputPassword = new InputFieldComponent({
    errorMessage:
        'Пароль должен содержать заглавную букву, цифру, быть от 8 до 40 символов',
    className: 'login-page__input',
    title: 'Пароль',
    Input: new InputComponent({
        name: 'password',
        title: 'Пароль',
        type: 'password',
        value: 'Shenhe1331',
        events: {
            blur: (event: Event) => {
                // checkValidate(event, passwordValidation, 'password');
                console.log(
                    checkValidate(event, passwordValidation, 'password'),
                );
            },
        },
    }),
});

const inputFormContent = new InputFormComponent({
    PageTitle: new PageComponent({
        title: 'Вход',
    }),
    InputContent: [inputLogin, inputPassword],
    Button: new ButtonComponent({
        type: 'submit',
        text: 'Войти',
    }),
    questionText: 'Нет аккаунта?',
    Link: new LinkComponent({
        text: 'Зарегистрироваться',
        page: 'registration',
        url: '/sign-up',
    }),
    // Валидация формы
    events: {
        submit: (event: Event) => {
            // formValidate(event, false);
            submitForm(event);
        },
    },
});

export class LoginPage extends Block {
    constructor(props: { [key: string]: string }) {
        super({
            ...props,
            loginTemplate: new LoginTemplate({
                SidebarImg: new SideBarImgComponent({
                    sidebarBgPath: '/assets/login-sidebar-bg.jpg',
                    alt: 'Фоновая картинка: Девушка в коробке',
                }),
                InputForm: inputFormContent,
                Logout: new LogoutComponent({
                    events: {
                        click: (event: Event) => {
                            logoutUser(event);
                        },
                    },
                }),
            }),
        });
    }

    override render() {
        return '{{{ loginTemplate }}}';
    }
}

async function submitForm(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    const formLogin = form.querySelector('[name="login"]');
    const formLoginValue = (formLogin as HTMLInputElement).value;

    const formPassword = form.querySelector('[name="password"]');
    const formPasswordValue = (formPassword as HTMLInputElement).value;

    const loginData: LoginRequestData = {
        login: formLoginValue,
        password: formPasswordValue,
    } as LoginRequestData;

    const authApi = new AuthApi();
    await authApi.login(loginData);
    window.router.go('/messenger');
}

async function logoutUser(event: Event) {
    event.preventDefault();
    console.log('logout');
    const authApi = new AuthApi();
    await authApi.logout();
    window.router.go('/login');
}

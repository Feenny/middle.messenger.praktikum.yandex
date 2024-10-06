import { SignUpRequestData } from './../../api/types';
import { Route } from './../../tools/Route';
import LoginPageTemplate from './login-page.hbs?raw';
import './login-page.scss';
import Block from '../../tools/Block';

import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { InputForm } from '../../components/input-form';
import { InputField } from '../../components/input-field';
import { Link } from '../../components/link';
import { PageTitle } from '../../components';
import { SidebarImg } from '../../components/sidebar-img';
import { LoginRequestData } from '../../api/types';

import {
    loginValidation,
    checkValidate,
    passwordValidation,
    formValidate,
} from '../../tools/Validation';
import { AuthApi } from '../../api/auth';
import { json } from 'stream/consumers';

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
        events: {
            blur: (event: Event) => {
                checkValidate(event, passwordValidation, 'password');
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
        page: 'chat',
        // url: '/chat',
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
            // formValidate(event);
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
            }),
        });
    }

    // init() {
    //     console.log('someFunc start');
    // }

    submitForm(event: Event) {
        console.log('submitForm');
        // const target = event.target as HTMLFormElement;
        // const { form } = target.form;
        // const formData = new FormData(form);
        // const loginData: LoginRequestData = {
        //     login: 'login123',
        //     password: 'pass1331',
        // } as LoginRequestData;
        // const signUpData: SignUpRequestData = {} as SignUpRequestData;

        // // formData.forEach((value, key) => {
        // //     loginData[key] = value.toString();
        // // });

        // const authApi = new AuthApi();
        // authApi.login(loginData);
        // // authApi.signup(signUpData);
        // console.log(authApi);
        // event.preventDefault();
    }

    override render() {
        return '{{{ loginTemplate }}}';
    }
}

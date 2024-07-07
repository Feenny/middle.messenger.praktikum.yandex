import LoginPageTemplate from './login-page.hbs?raw'
import './login-page.scss'
import Block from '../../tools/Block'

import { Button } from '../../components/button'
import { Input } from '../../components/input'
import { InputForm } from '../../components/input-form'
import { InputField } from '../../components/input-field'
import { Link } from '../../components/link'
import { PageTitle } from '../../components'

import {
    loginValidation,
    checkValidate,
    passwordValidation,
} from '../../tools/Validation'

class PageComponent extends Block {
    render() {
        return PageTitle
    }
}

class ButtonComponent extends Block {
    render() {
        return Button
    }
}

class InputComponent extends Block {
    render() {
        return Input
    }
}

class InputFieldComponent extends Block {
    render() {
        return InputField
    }
}

class InputFormComponent extends Block {
    render() {
        return InputForm
    }
}

class LinkComponent extends Block {
    render() {
        return Link
    }
}

class LoginTemplate extends Block {
    render() {
        return LoginPageTemplate
    }
}

const inputLogin = new InputFieldComponent({
    title: 'Логин',
    Input: new InputComponent({
        name: 'login',
        title: 'Логин',
        type: 'text',
        events: {
            blur: (evt: Event) => {
                checkValidate(evt, loginValidation, 'login')
            },
        },
    }),
})

const inputPassword = new InputFieldComponent({
    title: 'Пароль',
    Input: new InputComponent({
        name: 'password',
        title: 'Пароль',
        type: 'password',
        events: {
            blur: (event: Event) => {
                checkValidate(event, passwordValidation, 'password')
            },
        },
    }),
})

const inputFormContent = new InputFormComponent({
    PageTitle: new PageComponent({
        title: 'Вход',
    }),
    InputContent: [inputLogin, inputPassword],
    Button: new ButtonComponent({
        text: 'Войти',
        page: 'chat',
    }),
    questionText: 'Нет аккаунта?',
    Link: new LinkComponent({
        text: 'Зарегистрироваться',
        page: 'registration',
    }),
})

export class LoginPage extends Block {
    constructor(props: { [key: string]: string }) {
        super({
            ...props,
            loginTemplate: new LoginTemplate({
                InputForm: inputFormContent,
            }),
        })
    }

    override render() {
        return '{{{ loginTemplate }}}'
    }
}

import Block from '../../tools/Block'
import SettingsPageTemplate from './settings-page.hbs?raw'
import './settings-page.scss'

import { Avatar } from '../../components/avatar'
import { Button } from '../../components/button'
import { SettingsForm } from '../../components/settings-form'
import { PageTitle } from '../../components/page-title'
import { Input } from '../../components/input'
import { InputField } from '../../components/input-field'

import {
    nameValidation,
    loginValidation,
    checkValidate,
    emailValidation,
    phoneValidation,
    passwordValidation,
} from '../../tools/Validation'

class AvatarComponent extends Block {
    render() {
        return Avatar
    }
}

class SettingsTemplate extends Block {
    render() {
        return SettingsPageTemplate
    }
}

class ButtonComponent extends Block {
    render() {
        return Button
    }
}
class SettingsFormComponent extends Block {
    render() {
        return SettingsForm
    }
}
class PageComponent extends Block {
    render() {
        return PageTitle
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

export class SettingsPage extends Block {
    constructor(props: { [key: string]: string }) {
        super({
            ...props,
            SettingsTemplate: new SettingsTemplate({
                SettingsForm: new SettingsFormComponent({
                    PageTitle: new PageComponent({
                        title: 'Евгения',
                    }),
                    Avatar: new AvatarComponent({
                        avatar: '/assets/avatar-settings.jpg',
                    }),
                    InputName: [
                        new InputFieldComponent({
                            errorMessage: 'Имя введено некорректно',
                            className: 'login-page__input',
                            title: 'Имя',
                            Input: new InputComponent({
                                name: 'first_name',
                                title: 'Имя',
                                type: 'first_name',
                                events: {
                                    blur: (event: Event) => {
                                        checkValidate(event, nameValidation, 'name')
                                    },
                                },
                            }),
                        }),
                        new InputFieldComponent({
                            errorMessage: 'Фамилия введена некорректно',
                            className: 'login-page__input',
                            title: 'Фамилия',
                            Input: new InputComponent({
                                name: 'second_name',
                                title: 'Фамилия',
                                type: 'second_name',
                                events: {
                                    blur: (event: Event) => {
                                        checkValidate(event, nameValidation, 'name')
                                    },
                                },
                            }),
                        }),
                    ],
                    InputContent: [
                        new InputFieldComponent({
                            errorMessage: 'Пароль должен содержать заглавную, цифру, от 8 до 40 символов',
                            className: 'login-page__input',
                            title: 'Пароль',
                            Input: new InputComponent({
                                name: 'email',
                                title: 'Почта',
                                type: 'email',
                                events: {
                                    blur: (event: Event) => {
                                        checkValidate(event, passwordValidation, 'login')
                                    },
                                },
                            }),
                        }),
                        new InputFieldComponent({
                            errorMessage: 'Логин должен включать латиницу, от 3 до 20 символов',
                            className: 'login-page__input',
                            title: 'Логин',
                            Input: new InputComponent({
                                name: 'login',
                                title: 'Логин',
                                type: 'login',
                                events: {
                                    blur: (event: Event) => {
                                        checkValidate(event, loginValidation, 'login')
                                    },
                                },
                            }),
                        }),
                        new InputFieldComponent({
                            errorMessage: 'Почта должна быть в формате example@gmail.com',
                            className: 'login-page__input',
                            title: 'Почта',
                            Input: new InputComponent({
                                name: 'email',
                                title: 'Почта',
                                type: 'email',
                                events: {
                                    blur: (event: Event) => {
                                        checkValidate(event, emailValidation, 'login')
                                    },
                                },
                            }),
                        }),
                        new InputFieldComponent({
                            errorMessage: 'Телефон может состоять из цифр и +, от 10 до 15 символов',
                            className: 'login-page__input',
                            title: 'Телефон',
                            Input: new InputComponent({
                                name: 'phone',
                                title: 'Телефон',
                                type: 'phone',
                                events: {
                                    blur: (event: Event) => {
                                        checkValidate(event, phoneValidation, 'phone')
                                    },
                                },
                            }),
                        }),
                    ],
                }),
                Button: new ButtonComponent({
                    text: 'Изменить данные',
                    events: {
                        submit: (event: Event) => {
                            checkValidate(event, phoneValidation, 'phone')
                        },
                    },
                }),
            }),
        })
    }

    override render() {
        return '{{{ SettingsTemplate }}}'
    }
}

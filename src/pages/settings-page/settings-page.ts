import AuthApi from '../../api/auth';
import UserApi from '../../api/user';
import Block from '../../tools/Block';
import SettingsPageTemplate from './settings-page.hbs?raw';
import './settings-page.scss';

import { Avatar } from '../../components/avatar';
import { Button } from '../../components/button';
import { SettingsForm } from '../../components/settings-form';
import { PageTitle } from '../../components/page-title';
import { Input } from '../../components/input';
import { InputField } from '../../components/input-field';

import { ChangeUserData } from '../../api/types';

import {
    nameValidation,
    loginValidation,
    checkValidate,
    emailValidation,
    phoneValidation,
    passwordValidation,
} from '../../tools/Validation';

class AvatarComponent extends Block {
    render() {
        return Avatar;
    }
}

class SettingsTemplate extends Block {
    render() {
        return SettingsPageTemplate;
    }
}

class ButtonComponent extends Block {
    render() {
        return Button;
    }
}
class SettingsFormComponent extends Block {
    render() {
        return SettingsForm;
    }
}
class PageComponent extends Block {
    render() {
        return PageTitle;
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

const inputName = new InputComponent({
    name: 'first_name',
    title: 'Имя',
    type: 'first_name',
    placeholder: 'Введите имя',
    events: {
        blur: (event: Event) => {
            checkValidate(event, nameValidation, 'name');
        },
    },
});

const inputFieldName = new InputFieldComponent({
    errorMessage: 'Имя введено некорректно',
    className: 'login-page__input',
    title: 'Имя',
    Input: inputName,
});

const inputSurname = new InputComponent({
    name: 'second_name',
    title: 'Фамилия',
    type: 'second_name',
    placeholder: 'Введите фамилию',
    events: {
        blur: (event: Event) => {
            checkValidate(event, nameValidation, 'name');
        },
    },
});

const inputFieldSurname = new InputFieldComponent({
    errorMessage: 'Фамилия введена некорректно',
    className: 'login-page__input',
    title: 'Фамилия',
    Input: inputSurname,
});

const inputPassword = new InputComponent({
    name: 'password',
    title: 'Почта',
    type: 'password',
    events: {
        blur: (event: Event) => {
            checkValidate(event, passwordValidation, 'login');
        },
    },
});

const inputFieldPassword = new InputFieldComponent({
    errorMessage:
        'Пароль должен содержать заглавную, цифру, от 8 до 40 символов',
    className: 'login-page__input',
    title: 'Пароль',
    Input: inputPassword,
});

const inputLogin = new InputComponent({
    name: 'login',
    title: 'Логин',
    type: 'login',
    events: {
        blur: (event: Event) => {
            checkValidate(event, loginValidation, 'login');
        },
    },
});

const inputFieldLogin = new InputFieldComponent({
    errorMessage: 'Логин должен включать латиницу, от 3 до 20 символов',
    className: 'login-page__input',
    title: 'Логин',
    Input: inputLogin,
});

const inputEmail = new InputComponent({
    name: 'email',
    title: 'Почта',
    type: 'email',
    events: {
        blur: (event: Event) => {
            checkValidate(event, emailValidation, 'login');
        },
    },
});

const inputFieldEmail = new InputFieldComponent({
    errorMessage: 'Почта должна быть в формате example@gmail.com',
    className: 'login-page__input',
    title: 'Почта',
    Input: inputEmail,
});

const inputPhone = new InputComponent({
    name: 'phone',
    title: 'Телефон',
    type: 'phone',
    events: {
        blur: (event: Event) => {
            checkValidate(event, phoneValidation, 'phone');
        },
    },
});

const inputFieldPhone = new InputFieldComponent({
    errorMessage: 'Телефон может состоять из цифр и +, от 10 до 15 символов',
    className: 'login-page__input',
    title: 'Телефон',
    Input: inputPhone,
});

const pageTitle = new PageComponent({
    title: 'Имя пользователя',
});

const avatar = new AvatarComponent({
    avatar: '/assets/default_avatar.png',
    events: {
        change: () => {
            setImage();
        },
    },
});

const settingsFormComponent = new SettingsFormComponent({
    PageTitle: pageTitle,
    Avatar: avatar,
    InputName: [inputFieldName, inputFieldSurname],
    InputContent: [
        inputFieldPassword,
        inputFieldLogin,
        inputFieldEmail,
        inputFieldPhone,
    ],
    Button: new ButtonComponent({
        type: 'submit',
        text: 'Изменить данные',
    }),
    events: {
        submit: (event: Event) => {
            changeProfile(event);
        },
    },
});

export class SettingsPage extends Block {
    constructor(props: { [key: string]: string }) {
        super({
            ...props,
            SettingsTemplate: new SettingsTemplate({
                SettingsForm: settingsFormComponent,
            }),
        });
    }

    override render() {
        console.log(this.getUserInfo());
        return '{{{ SettingsTemplate }}}';
    }

    async getUserInfo() {
        const authApi = new AuthApi();
        const responce : any = await authApi.userinfo();
        console.log(`responce: ${JSON.stringify(responce)}`);
        pageTitle.setProps({ title: responce.first_name });

        avatar.setProps({
            avatar: `https://ya-praktikum.tech/api/v2/resources${responce.avatar}`,
        });

        inputName.setProps({ value: responce.first_name });
        inputSurname.setProps({ value: responce.second_name });
        inputPassword.setProps({ value: responce.password });
        inputLogin.setProps({ value: responce.login });
        inputEmail.setProps({ value: responce.email });
        inputPhone.setProps({ value: responce.phone });
    }
}

function setImage() {
    const fileInput : any = document.querySelector('.avatar__input');
    const file = fileInput?.files[0];
    if (file) {
        const img : any = document.getElementById('avatar__img');
        const reader = new FileReader();
        reader.onload = function (e) {
            img.src = (e.target)?.result;
        };

        reader.readAsDataURL(file);
    }
}

async function changeProfile(event: Event) {
    event.preventDefault();
    console.log('changeProfile');
    const form = event.target as HTMLFormElement;

    const formFirstName = form.querySelector('[name="first_name"]');
    const formFirstNameValue = (formFirstName as HTMLInputElement).value;

    const formSecondName = form.querySelector('[name="second_name"]');
    const formSecondNameValue = (formSecondName as HTMLInputElement).value;

    const formLogin = form.querySelector('[name="login"]');
    const formLoginValue = (formLogin as HTMLInputElement).value;

    const formEmail = form.querySelector('[name="email"]');
    const formEmailValue = (formEmail as HTMLInputElement).value;

    const formPhone = form.querySelector('[name="phone"]');
    const formPhoneValue = (formPhone as HTMLInputElement).value;

    const userData: ChangeUserData = {
        first_name: formFirstNameValue,
        second_name: formSecondNameValue,
        display_name: '',
        login: formLoginValue,
        email: formEmailValue,
        phone: formPhoneValue,
    } as ChangeUserData;

    const authApi = new UserApi();
    await authApi.changeProfile(userData);

    const fileInput : any = document.querySelector('.avatar__input'); // Изменено для выбора по классу
    const file = fileInput?.files[0]; // Получаем выбранный файл

    if (file) {
        const formData = new FormData(form);
        const avatar = form.querySelector('[name="avatar"]');
        const avatarValue = (avatar as HTMLInputElement).value;
        formData.append('avatar', avatarValue);
        await authApi.changeAvatar(formData);
    }
}

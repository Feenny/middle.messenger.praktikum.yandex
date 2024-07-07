import Block from "../../tools/Block";
import  RegistrationPageTemplate   from "./registration-page.hbs?raw";
import "./registration-page.scss";

import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { InputForm } from "../../components/input-form";
import { InputField } from "../../components/input-field";
import { Link } from "../../components/link";
import { PageTitle } from "../../components";

import {
  nameValidation,
  loginValidation,
  checkValidate,
  passwordValidation,
  emailValidation,
  phoneValidation
} from "../../tools/Validation";

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

class RegistrationTemplate extends Block {
  render() {
    return RegistrationPageTemplate;
  }
}

const inputFirstName = new InputFieldComponent({
  className: "login-page__input",
  title: "Имя",
  Input: new InputComponent({
    name: "first_name",
    title: "Имя",
    type: "text",
    events: {
      blur: (event: Event) => {
        checkValidate(event, nameValidation, "name");
      },
    },
  }),
});

const inputSecondName = new InputFieldComponent({
  className: "login-page__input",
  title: "Фамилия",
  Input: new InputComponent({
    name: "second_name",
    title: "Фамилия",
    type: "text",
    events: {
      blur: (event: Event) => {
        checkValidate(event, nameValidation, "name");
      },
    },
  }),
});

const inputEmail = new InputFieldComponent({
  className: "login-page__input",
  title: "Почта",
  Input: new InputComponent({
    name: "email",
    title: "Почта",
    type: "email",
    events: {
      blur: (event: Event) => {
        checkValidate(event, emailValidation, "login");
      },
    },
  }),
});

const inputLogin = new InputFieldComponent({
  className: "login-page__input",
  title: "Логин",
  Input: new InputComponent({
    name: "login",
    title: "Логин",
    type: "text",
    events: {
      blur: (event: Event) => {
        checkValidate(event, loginValidation, "login");
      },
    },
  }),
});

const inputPhone = new InputFieldComponent({
  className: "login-page__input",
  title: "Телефон",
  Input: new InputComponent({
    name: "phone",
    title: "Телефон",
    type: "tel",
    events: {
      blur: (event: Event) => {
        checkValidate(event, phoneValidation, "login");
      },
    },
  }),
});

const inputPassword = new InputFieldComponent({
  className: "login-page__input",
  title: "Пароль",
  Input: new InputComponent({
    name: "password",
    title: "Пароль",
    type: "password",
    events: {
      blur: (event: Event) => {
        checkValidate(event, passwordValidation, "password");
      },
    },
  }),
});

const inputRepeatPassword = new InputFieldComponent({
  className: "login-page__input",
  title: "Повторите пароль",
  Input: new InputComponent({
    name: "password",
    title: "Пароль",
    type: "password",
    events: {
      blur: (event: Event) => {
        checkValidate(event, passwordValidation, "password");
      },
    },
  }),
});

const inputFormContent = new InputFormComponent({
  PageTitle: new PageComponent({
    title: "Регистрация",
  }),
  InputName: [inputFirstName, inputSecondName],
  InputContent: [inputEmail, inputLogin,inputPhone, inputPassword, inputRepeatPassword ],
  Button: new ButtonComponent({
    text: "Зарегистрироваться",
    page: "chat",
  }),
  questionText: "Есть аккаунт?",
  Link: new LinkComponent({
    text: "Войти",
    page: "login",
  }),
});

export class RegistrationPage extends Block {
    constructor(props: { [key: string]: string }) {
      super({
        ...props,
        RegistrationTemplate: new RegistrationTemplate({
          InputForm: inputFormContent
        })
      });
    }
    override render() {
      return `{{{ RegistrationTemplate }}}`;
    }
  }
  
  
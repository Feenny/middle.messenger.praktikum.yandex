export interface ValidationFunction {
    (value: string): boolean;
}

export function checkValidate(
    event: Event,
    functionName: { (value: string): boolean | null },
    result: string,
) {
    const input = event.target as HTMLTextAreaElement;
    const errorMessage = input.nextElementSibling as HTMLTextAreaElement;
    let validationResult = false;
    const { value } = input;

    if (result === '123') {
        input.classList.remove('invalid');
    }
    if (functionName(value)) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        errorMessage.style.display = 'none';
        validationResult = true;
    } else {
        input.classList.add('invalid');
        errorMessage.style.display = 'block';
        validationResult = false;
    }
    return validationResult;
}

export function formValidate(event: Event, canLogin: boolean) {
    event.preventDefault();
    const inputs = document.querySelectorAll('input');

    // Проверяем каждый input на наличие класса 'valid'
    // eslint-disable-next-line no-restricted-syntax
    for (const input of inputs) {
        if (!input.classList.contains('valid')) {
            input.classList.add('invalid');
        } else {
            window.router.go('/chat');
        }
    }

    if (canLogin) {
        window.router.go('/chat');
    } else {
        console.log('you cant login... =(');
    }
}

export const nameValidation: ValidationFunction = (value) => {
    const regex = /^[А-ЯЁа-яё\w\-]+$/;
    return regex.test(value) && value[0] === value[0].toUpperCase();
};

export const loginValidation: ValidationFunction = (value) => {
    const regex = /^(?!.*\d+$)[a-zA-Z\d-_]{3,20}$/;
    return regex.test(value);
};

export const emailValidation: ValidationFunction = (value) => {
    const regex = /^[a-zA-Z\d._-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(value);
};

export const passwordValidation: ValidationFunction = (value) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d_-]{8,40}$/;
    return regex.test(value);
};

export const phoneValidation: ValidationFunction = (value) => {
    const regex = /^\+\d{10,15}$/;
    return regex.test(value);
};

export const messageValidation: ValidationFunction = (value) =>
    value.trim() !== '';

export interface ValidationFunction {
    (value: string): boolean;
}

export function checkValidate(
    event: Event,
    functionName: { (value: string): boolean | null },
    result: string,
) {
    console.log('check validate');
    const input = event.target as HTMLTextAreaElement;
    const errorMessage = input.nextElementSibling as HTMLTextAreaElement;
    const { value } = input;

    if (result === '123') {
        input.classList.remove('invalid');
    }
    if (functionName(value)) {
        input.classList.remove('invalid');
        errorMessage.style.display = 'none';
    } else {
        console.log('invalid');
        input.classList.add('invalid');
        errorMessage.style.display = 'block';
    }
}

export function formValidate(event: Event) {
    event.preventDefault();
    console.log('form validate');
}

export const nameValidation: ValidationFunction = (value) => {
    const regex = /^[А-ЯЁа-яё\w\-]+$/;
    return regex.test(value) && value[0] === value[0].toUpperCase();
};

export const loginValidation: ValidationFunction = (value) => {
    console.log('login val');
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

export const messageValidation: ValidationFunction = (value) => value.trim() !== '';

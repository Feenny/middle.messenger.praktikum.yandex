/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
import './chat-page.scss';
import ChatsApi from '../../api/chats';
import AuthApi from '../../api/auth';
import UserApi from '../../api/user';
import ChatPageTemplate from './chat-page.hbs?raw';
import Block from '../../tools/Block';
import { Button } from '../../components/button';
import { ChatContainer } from '../../components/chat-container';
import { ChatDelete } from '../../components/chat-delete';
import { ChatForm } from '../../components/chat-form';
import { ChatItem } from '../../components/chat-item';
import { ChatList } from '../../components/chat-list';
import { ChatMessage } from '../../components/chat-message';
import { Form } from '../../components/form';
import { Input } from '../../components/input';
import { Header } from '../../components/header';
import { ChatId, ChatAddUser, UserSearch, CreateChat } from '../../api/types';

class ButtonComponent extends Block {
    render() {
        return Button;
    }
}

class ChatTemplate extends Block {
    render() {
        return ChatPageTemplate;
    }
}

class ChatDeleteComponent extends Block {
    render() {
        return ChatDelete;
    }
}

class ChatFormComponent extends Block {
    render() {
        return ChatForm;
    }
}

class ChatItemComponent extends Block {
    render() {
        return ChatItem;
    }
}

class ChatListComponent extends Block {
    render() {
        return ChatList;
    }
}

class ChatContainerComponent extends Block {
    render() {
        return ChatContainer;
    }
}

class ChatMessageComponent extends Block {
    render() {
        return ChatMessage;
    }
}

class FormCompoment extends Block {
    render() {
        return Form;
    }
}

class InputComponent extends Block {
    render() {
        return Input;
    }
}

class HeaderComponent extends Block {
    render() {
        return Header;
    }
}

const chatList = new ChatListComponent({
    Chats: [],
    className: 'chat-page__list',
});

const chatForm = new ChatFormComponent({
    Input: new InputComponent({}),
    events: {
        submit: (event: Event) => {
            sendMessage(event);
        },
    },
});

const chatContainer = new ChatContainerComponent({
    Messages: [],
    ChatForm: chatForm,
});

const searchLogin = new InputComponent({
    name: 'search',
    value: 'Fenya',
    className: 'input__login-search',
    placeholder: 'Введите логин пользователя',
});

const addUserButton = new ButtonComponent({
    className: 'button__add-user',
    type: 'submit',
    text: 'Добавить пользователя',
    events: {
        click: (event: Event) => {
            addUser(event);
        },
    },
});

const addUserForm = new FormCompoment({
    Input: searchLogin,
    Button: addUserButton,
    // events: {
    //     submit: (event: Event) => {
    //         addUser(event);
    //     },
    // },
});

const deleteUserButton = new ButtonComponent({
    className: 'button__delete-user',
    type: 'submit',
    text: 'Удалить пользователя',
});

const deleteUserForm = new FormCompoment({
    Input: searchLogin,
    Button: deleteUserButton,
    events: {
        submit: (event: Event) => {
            deleteUser(event);
        },
    },
});

const addChatButton = new ButtonComponent({
    className: 'button__add-chat',
    type: 'submit',
    text: 'Добавить чат',
});

const addChatForm = new FormCompoment({
    Input: searchLogin,
    Button: addChatButton,
    events: {
        submit: (event: Event) => {
            addChat(event);
        },
    },
});

export class ChatPage extends Block {
    constructor(props: { [key: string]: string }) {
        super({
            ...props,
            ChatTemplate: new ChatTemplate({
                Header: new HeaderComponent({}),
                ChatList: chatList,
                ChatContainer: chatContainer,
                AddUserForm: addUserForm,
                DeleteUserForm: deleteUserForm,
                AddChatForm: addChatForm,
            }),
        });
    }

    override render() {
        this.getChatsList();
        return '{{{ ChatTemplate }}}';
    }

    async getChatsList() {
        const chatsApi = new ChatsApi();
        let response: any;
        try {
            response = await chatsApi.getChats();
        } catch (error: any) {
            console.log(`getChats error:\n${error}`);
        }

        const emptyMessageField = document.querySelector('.empty__messages');
        if (emptyMessageField) {
            emptyMessageField.textContent = 'Выберите чат или создайте его';
        }
        emptyMessageField?.classList.remove('hidden');

        const chatsArray = response.map(
            (chat: any) =>
                new ChatItemComponent({
                    id: chat.id,
                    name: chat.title,
                    message: chat.last_message
                        ? chat.last_message.content
                        : 'Нет сообщений',
                    unread: chat.unread_count.toString(),
                    ChatDelete: new ChatDeleteComponent({
                        events: {
                            click: (event: Event) => {
                                deleteChat(event, chat.id);
                            },
                        },
                    }),
                    avatar: (() => {
                        if (
                            chat.last_message &&
                            chat.last_message.user &&
                            chat.last_message.user.avatar !== null
                        ) {
                            return `https://ya-praktikum.tech/api/v2/resources${chat.last_message.user.avatar}`;
                        }
                        return '/assets/default_avatar.png';
                    })(),
                    events: {
                        click: () => {
                            openChat(chat.id, chatContainer);
                        },
                    },
                }),
        );
        const list = {
            Chats: chatsArray, // Присваиваем массив в объеме "Chats"
        };
        chatList.lists = list;
        chatList.setProps({ a: 1 });
    }
}

let socket: WebSocket;
let currentChatID: ChatId;

async function openChat(chatID: ChatId, СhatContainer: ChatContainerComponent) {
    currentChatID = chatID;
    const input = document.querySelector('.chat__message-input');
    input?.classList.remove('hidden');

    const auth = new AuthApi();
    let userResponse: any;
    try {
        userResponse = await auth.userinfo();
    } catch (error: any) {
        console.log(`userinfo error:\n${error}`);
    }

    const userID = userResponse.id;

    const chatsApi = new ChatsApi();
    let tokenResponse: any;
    try {
        tokenResponse = await chatsApi.getToken(chatID);
    } catch (error: any) {
        console.log(`getToken error:\n${error}`);
    }

    socket = new WebSocket(
        `wss://ya-praktikum.tech/ws/chats/${userID}/${chatID}/${tokenResponse.token}`,
    );

    socket.onopen = function () {
        socket.send(
            JSON.stringify({
                content: 0,
                type: 'get old',
            }),
        );
    };

    socket.addEventListener('message', (e) => {
        const messages = JSON.parse(e.data);

        if (Array.isArray(messages)) {
            const messageArray = messages.map(
                (message) =>
                    new ChatMessageComponent({
                        message: message.content,
                        time: formatDate(message.time),
                        userId: userID === message.user_id,
                    }),
            );
            СhatContainer.lists.Messages = messageArray;
            СhatContainer.setProps({ a: 1 });
            hideEmptyMessage(messageArray);
        } else if (messages) {
            const messageComponent = new ChatMessageComponent({
                message: messages.content,
                time: formatDate(messages.time),
                userId: userID === messages.user_id,
            });

            updateChat(chatID, messages.content);

            СhatContainer.lists.Messages.unshift(messageComponent);
            СhatContainer.setProps({ a: 1 });
            hideEmptyMessage(messageComponent);

            if (userResponse.avatar) {
                console.log(
                    `USER AVATAAAAAR https://ya-praktikum.tech/api/v2/resources${userResponse.avatar}`,
                );
                updateAvatar(
                    chatID,
                    `https://ya-praktikum.tech/api/v2/resources${userResponse.avatar}`,
                );
            }
        }
    });
}

async function addUser(event: Event) {
    event.preventDefault();

    const inputElement: any = document.querySelector(
        '.input__element.input__login-search',
    );

    if (inputElement) {
        const login: UserSearch = {
            login: inputElement.value,
        };

        const userAPI = new UserApi();
        let userResponse: any;
        try {
            userResponse = await userAPI.searchUser(login);
        } catch (error: any) {
            console.log(`searchUser error:\n${error}`);
        }

        const userFound = userResponse.find(
            (user: UserSearch) => user.login === login.login,
        );
        if (userFound && currentChatID) {
            addUserToChat(userFound, currentChatID);
        }
    }
}

async function deleteUser(event: Event) {
    event.preventDefault();
    const addChatForm = event.target as HTMLFormElement;
    const addChatSearch = addChatForm.querySelector('[name="search"]');
    const login: UserSearch = {
        login: (addChatSearch as HTMLInputElement).value,
    };

    console.log(`DELETE LOGIN: ${login}`);
}

async function addChat(event: Event) {
    event.preventDefault();

    const addChatForm = event.target as HTMLFormElement;

    const addChatSearch = addChatForm.querySelector('[name="search"]');
    const login: UserSearch = {
        login: (addChatSearch as HTMLInputElement).value,
    };

    const userAPI = new UserApi();
    let userResponse: any;
    try {
        userResponse = await userAPI.searchUser(login);
    } catch (error: any) {
        console.log(`searchUser error:\n${error}`);
    }

    const userFound = userResponse.find(
        (user: UserSearch) => user.login === login.login,
    );

    let title: CreateChat = {
        title: 'Новый чат',
    };

    let userAvatar;
    if (userFound) {
        const userName = userFound.first_name;
        userAvatar = userFound.avatar;
        title = {
            title: userName,
        };
    }

    let createChatResponse: any;
    const chatsAPI = new ChatsApi();
    try {
        createChatResponse = await chatsAPI.createChat(title);
    } catch (error: any) {
        console.log(`createChat error:\n${error}`);
    }

    const chatId: any = createChatResponse.id;

    if (userFound) {
        addUserToChat(userFound, chatId);
    }

    const newChat = new ChatItemComponent({
        id: chatId,
        name: title.title,
        message: 'Нет сообщений', // Добавьте сообщение по умолчанию или другое
        ChatDelete: new ChatDeleteComponent({
            events: {
                click: (event: Event) => {
                    deleteChat(event, chatId);
                },
            },
        }),
        avatar: userAvatar
            ? `https://ya-praktikum.tech/api/v2/resources${userAvatar}`
            : '/assets/default_avatar.png',
        events: {
            click: () => {
                openChat(chatId, chatContainer);
            },
        },
    });

    chatList.lists.Chats.unshift(newChat);
    chatList.setProps({ a: 1 });
    openChat(createChatResponse.id, chatContainer);
}

async function deleteChat(event: Event, chatID: number) {
    event.preventDefault();

    const chatsApi = new ChatsApi();
    const deleteId: ChatId = {
        chatId: chatID,
    };

    try {
        await chatsApi.delete(deleteId);
        chatList.lists.Chats = chatList.lists.Chats.filter(
            (chat: any) => chat.props.id !== chatID,
        );
        chatList.setProps({ a: 1 });
    } catch (error: any) {
        console.log(`error reason: ${error.reason}`);
        console.log(`deleteChat error:\n${JSON.stringify(error)}`);
    }
}

function sendMessage(event: Event) {
    event.preventDefault();

    const input: any = (event.target as HTMLInputElement).querySelector(
        '.input__element',
    );

    if (input) {
        socket.send(
            JSON.stringify({
                content: input.value,
                type: 'message',
            }),
        );
        input.value = '';
    }
}

function formatDate(messageTime: Date) {
    const date = new Date(messageTime);

    const formattedDate = `${[
        String(date.getDate()).padStart(2, '0'),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getFullYear()).slice(-2),
    ].join('.')} ${[
        String(date.getHours()).padStart(2, '0'),
        String(date.getMinutes()).padStart(2, '0'),
    ].join(':')}`;

    return formattedDate;
}

function hideEmptyMessage(messages: Object | Array<Object>) {
    if (messages) {
        const emptyMessageField = document.querySelector('.empty__messages');
        emptyMessageField?.classList.add('hidden');
    }
}

async function updateChat(chatID: ChatId, message: string) {
    const chat = chatList.lists.Chats.find((chat) => chat.props.id === chatID);

    if (chat) {
        chat.props.message = message;

        chatList.setProps({ a: 1 });
    }
}

function updateAvatar(chatID: ChatId, newAvatar?: any) {
    const chat: any = chatList.lists.Chats.find(
        (chat: any) => chat.props.id === chatID,
    );

    chat.setProps({ avatar: newAvatar });

    chatList.setProps({ a: 1 });
}

async function addUserToChat(userFound: any, chatId: any) {
    console.log(`addUserToChatL userFound: ${userFound}`);
    console.log(`addUserToChatL chatId: ${chatId}`);
    const users: number[] = [];
    const userId = userFound.id;
    users.push(userId);

    const addUserData: ChatAddUser = {
        users,
        chatId,
    };

    const chatsAPI = new ChatsApi();
    let addUserResponse: any;

    try {
        addUserResponse = await chatsAPI.addUser(addUserData);
    } catch (error: any) {
        console.log(`addUser error:\n${error}`);
    }
}

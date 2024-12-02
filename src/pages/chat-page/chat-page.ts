/* eslint-disable implicit-arrow-linebreak */
import './chat-page.scss';
import ChatsApi from '../../api/chats';
import AuthApi from '../../api/auth';
import UserApi from '../../api/user';
import ChatPageTemplate from './chat-page.hbs?raw';
import Block, { IProps } from '../../tools/Block';
import { Button } from '../../components/button';
import { ChatContainer } from '../../components/chat-container';
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

const addChatButton = new ButtonComponent({
    className: 'button__add-chat',
    type: 'submit',
    text: 'Добавить чат',
});

const searchLogin = new InputComponent({
    name: 'search',
    value: 'Fenya',
    className: 'input__login-search',
    placeholder: 'Введите логин пользователя',
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
        const responce = await chatsApi.getChats();
        document.querySelector('.empty__messages').textContent = 'Выберите чат или создайте его';
        const emptyMessageField = document.querySelector('.empty__messages');
        emptyMessageField?.classList.remove('hidden');

        const chatsArray = responce.map(
            (chat) =>
                new ChatItemComponent({
                    name: chat.title,
                    message: chat.last_message
                        ? chat.last_message.content
                        : 'Нет сообщений',
                    unread: chat.unread_count.toString(),
                    avatar: chat.avatar
                        ? chat.avatar
                        : '/assets/default_avatar.png',
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

async function openChat(chatID: ChatId, СhatContainer: ChatContainerComponent) {
    const input = document.querySelector('.chat__message-input');
    input?.classList.remove('hidden');

    const auth = new AuthApi();
    const userResponce : any = await auth.userinfo();
    const userID = userResponce.id;

    const chatsApi = new ChatsApi();
    const tokenResponce : any = await chatsApi.getToken(chatID);

    socket = new WebSocket(
        `wss://ya-praktikum.tech/ws/chats/${userID}/${chatID}/${tokenResponce.token}`,
    );

    socket.onopen = function (e) {
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
            // if (messageArray.length > 0) {
            //     const emptyMessageField =
            //         document.querySelector('.empty__messages');
            //     emptyMessageField?.classList.add('hidden');
            // }
        } else if (messages) {
            const messageComponent = new ChatMessageComponent({
                message: messages.content,
                time: formatDate(messages.time),
                userId: userID === messages.user_id,
            });
            СhatContainer.lists.Messages.unshift(messageComponent);
            СhatContainer.setProps({ a: 1 });
            hideEmptyMessage(messageComponent);
        }
    });

    // const chatContainer = document.querySelector('.chat__message-field');
    // if (chatContainer) chatContainer.classList.remove('hidden');
}

async function addChat(event: Event) {
    event.preventDefault();

    const addChatForm = event.target as HTMLFormElement;

    const addChatSearch = addChatForm.querySelector('[name="search"]');
    const login: UserSearch = {
        login: (addChatSearch as HTMLInputElement).value,
    };

    const userAPI = new UserApi();
    const userResponse = await userAPI.searchUser(login);
    const userFound = userResponse.find((user) => user.login === login.login);

    if (userFound) {
        const userId = userFound.id;
        const userName = userFound.first_name;
        const userAvatar = userFound.avatar;
        console.log(`user AVATAR : ${userAvatar}`);

        const chatsAPI = new ChatsApi();
        const title: CreateChat = {
            title: userName,
        };
        const createChatResponse : any = await chatsAPI.createChat(title);

        const users: number[] = [];
        users.push(userId);

        const chatId: any = createChatResponse.id;

        const addUserData: ChatAddUser = {
            users,
            chatId,
        };

        const addUserResponse = await chatsAPI.addUser(addUserData);

        if (addUserResponse) {
            const newChat = new ChatItemComponent({
                name: userName,
                message: 'Нет сообщений', // Добавьте сообщение по умолчанию или другое
                avatar: userAvatar
                    ? `https://ya-praktikum.tech/api/v2/resources${userAvatar}`
                    : '/assets/default_avatar.png',
                events: {
                    click: () => {
                        openChat(chatId, chatContainer);
                    },
                },
            });

            // Добавляем новый элемент в chatList.lists.Chats
            console.log(`chatList 1: ${JSON.stringify(chatList.lists.Chats)}`);
            chatList.lists.Chats.unshift(newChat);
            console.log(`chatList 2: ${JSON.stringify(chatList.lists.Chats)}`);
            chatList.setProps({ a: 1 });
            openChat(createChatResponse.id, chatContainer);
        }
    } else {
        console.log('User not found.');
    }
}

function sendMessage(event: Event) {
    event.preventDefault();

    const input = (event.target as HTMLInputElement).querySelector(
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
    ].join('.')
    } ${
        [
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

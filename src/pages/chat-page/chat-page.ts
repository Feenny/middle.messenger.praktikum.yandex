import "./chat-page.scss";
import ChatPageTemplate from "./chat-page.hbs?raw";
import Block from "../../tools/Block";
import { ChatItem } from "../../components/chat-item";
import { ChatList } from "../../components/chat-list";
import { ChatContainer } from "../../components/chat-container";
import { ChatMessage } from "../../components/chat-message";
import { Input } from "../../components/input";
import { Header } from "../../components/header";

class ChatTemplate extends Block {
  render() {
    return ChatPageTemplate;
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
  className: "chat-page__list",
  Chats: [
    new ChatItemComponent({
      name: "Маруся",
      message: "Зайди в магаз",
      unread: "2",
      avatar: "/assets/avatar1.jpg",
    }),
    new ChatItemComponent({
      className: "chat-item__active",
      name: "Феня",
      message: "Там на ковре ",
      avatar: "/assets/avatar2.jpg",
    }),
    new ChatItemComponent({
      name: "Марфа",
      message: "ок",
      unread: "4",
      avatar: "/assets/avatar3.jpg",
    }),
    new ChatItemComponent({
      name: "Кузя",
      message: "Изображение",
      unread: "4",
      avatar: "/assets/avatar4.jpg",
    }),
    new ChatItemComponent({
      name: "Барсик",
      message: "[2.4v1] Hotfix Update - Added the missing EN tex",
      unread: "4",
      avatar: "/assets/avatar5.jpg",
    }),
    new ChatItemComponent({
      name: "Мурзик",
      message: "Пасиба)",
      unread: "4",
      avatar: "/assets/avatar6.jpg",
    }),
    new ChatItemComponent({
      name: "Боня",
      message: "Поиграю, пойму стоит ли того",
      unread: "4",
      avatar: "/assets/avatar7.jpg",
    }),
  ],
});

const chatContainer = new ChatContainerComponent({
  Messages: [
    new ChatMessageComponent({
      message: "Привет",
    }),
    new ChatMessageComponent({
      message: "Короче",
    }),
    new ChatMessageComponent({
      message:
        "Произошел айконик диалог с колонкой:\n - Алиса, мне грустно\n - Понимаю, бывает такое время. Хочешь, включу твою любимую музыку?\n - хочу\n  - Чтобы слушать музыку вам нужно оформить подписку Плюс, отправила ссылку на телефон☺️\n  спасибо, Алиса🙂  сегодня без постов, извините хд",
    }),
  ],
  Input: new InputComponent({}),
});

export class ChatPage extends Block {
  constructor(props: { [key: string]: string }) {
    super({
      ...props,
      ChatTemplate: new ChatTemplate({
        Header: new HeaderComponent({}),
        ChatList: chatList,
        ChatContainer: chatContainer,
      }),
    });
  }
  override render() {
    return `{{{ ChatTemplate }}}`;
  }
}

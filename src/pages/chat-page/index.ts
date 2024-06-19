import Handlebars from 'handlebars';
import './chat-page.scss';
export { default as ChatPage } from './chat-page.hbs?raw';

Handlebars.registerHelper('chat-page-list', () => {
  return [
    { name: 'Опоссум', message: 'Изображение', unread: '2' , avatar: "/assets/avatar1.jpg"},
    { name: 'Енот', message:'Go на свалку!' ,avatar: "/assets/avatar2.jpg"},
    { name: 'Барсук', message:'А у кого ключи от сарая?', unread: '4' ,avatar: "/assets/avatar3.jpg"},
  ]
});

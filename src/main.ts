import Handlebars from 'handlebars';
import * as Components from './components';
import * as Pages from './pages';

interface Pages {
	[key: string]: [string, any?];
}

const pages: Pages = {
	'chat': [ Pages.ChatPage ],
  'login': [ Pages.LoginPage ],
  'registration': [ Pages.RegistrationPage ],
  'settings': [ Pages.SettingsPage ],
  'error404': [ Pages.Error4Page ],
  'error500': [ Pages.Error5Page ],
};

Object.entries(Components).forEach(([ name, component ]) => {
  Handlebars.registerPartial(name, component);
});


function navigate(page: string) {
  const [ source, args ] = pages[page];
  const handlebarsFunct = Handlebars.compile(source);
  document.body.innerHTML = handlebarsFunct(args);
}

document.addEventListener('DOMContentLoaded', () => navigate('login'));
console.log('loaded')
document.addEventListener('click', e => {
  const target = e.target as HTMLElement;
	const page = target.getAttribute('page');
  if (page) {
    console.log('page')
    navigate(page);
    e.preventDefault();
    e.stopImmediatePropagation();
  }
});
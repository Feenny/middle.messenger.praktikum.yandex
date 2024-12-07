/* eslint-disable no-unused-expressions */
/* eslint-disable operator-linebreak */
import { expect } from 'chai';
import Sinon from 'sinon';
import Block from './Block.ts';

interface Props {
    text?: string;
    events?: Record<string, () => void>;
}

describe('Block', () => {
    let PageClass: typeof Block;

    before(() => {
        class Page extends Block {
            constructor(props: Props) {
                super({
                    ...props,
                });
            }

            render(): string {
                return '<div><span id="test-text">{{text}}</span></div>';
            }
        }

        PageClass = Page;
    });

    it('Создан компонент с пропсами', () => {
        const text = 'Привет!';
        const pageComponent: any = new PageClass({ text });

        const spanText =
            pageComponent.element?.querySelector('#test-text')?.textContent;

        expect(spanText).to.be.eq(text);
    });

    it('Событие вызвано', () => {
        const handler = Sinon.stub();
        const component = new PageClass({
            text: 'Информация в свойстве text',
            events: { click: handler },
        });
        const event = new MouseEvent('click');
        component.getContent().dispatchEvent(event);

        expect(handler.calledOnce).to.be.true;
    });
    it('Вызван метод render при изменении пропсов', () => {
        const component = new PageClass({ text: 'Информация в свойстве text' });
        const spyDCM = Sinon.spy(component, 'render');
        component.setProps({ text: 'Информация изменена через setProps' });

        expect(spyDCM.calledOnce).to.be.true;
    });
});

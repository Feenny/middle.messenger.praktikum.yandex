/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import Sinon from 'sinon';
import Block from './Block.ts';
import Router from './Router.ts';

const router = new Router('app');

describe('Router', () => {
    it('Роут создан', () => {
        const spy = Sinon.spy(router, 'start');
        router.start();

        expect(spy.calledOnce).to.be.true;
    });
    it('Роут найден', () => {
        router.use('/404', Block);
        expect(router.getRoute('/404') !== undefined).to.eq(true);
    });
});

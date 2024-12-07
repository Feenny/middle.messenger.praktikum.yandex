/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import HTTPTransport from './Request.ts';

const baseUrl = 'https://ya-praktikum.tech';
const http = new HTTPTransport('/test');

describe('HTTPTransport', () => {
    afterEach(() => {
        sinon.restore();
    });
    it('Метод Get содержит метод GET и URL с корректным путем', async () => {
        const requestStub = sinon.stub(http, 'request').resolves();

        const options = { data: { a: '1', b: '2 2' } };
        await http.get('', options);

        const expectedPathUrl = `${baseUrl}/test`;

        expect(requestStub.calledOnce).to.be.true;
        expect(requestStub.firstCall.args[0]).to.equal(expectedPathUrl);
        expect(requestStub.firstCall.args[1].method).to.equal('GET');
    });
    it('Если метод отсутствует - ошибка', async () => {
        const requestStub = sinon
            .stub(http, 'request')
            .rejects(new Error('No method'));

        try {
            await http.request(`${baseUrl}/test`, { method: undefined });
            expect(requestStub.calledOnce).to.be.true;
        } catch (error) {
            const err = error as Error;
            expect(err.message).to.equal('No method');
        }
    });
    it('В Delete - вызван метод DELETE', async () => {
        const requestStub = sinon.stub(http, 'request').resolves();
        await http.delete('');
        expect(requestStub.calledOnce).to.be.true;
        expect(requestStub.firstCall.args[1].method).to.equal('DELETE');
    });
});

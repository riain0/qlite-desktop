import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import QBoxUtils from './QBoxUtils';

let mock: MockAdapter;
let qbox = new QBoxUtils();

describe('testing QBoxUtils', () => {
    beforeEach(() => {
        mock = new MockAdapter(axios);
    });

    it('triggers qbox to go', done => {
        const data = {id: 'test'};
        mock.onGet('http://192.168.0.11/go').reply(200, data);
        qbox.triggerGo('192.168.0.11').then((resp) => {
            expect(resp.id).toBe(data.id);
            done();
        });
    });

    it('triggers qbox to ack', done => {
        const data = {id: 'test'};
        mock.onGet('http://192.168.0.11/ack').reply(200, data);
        qbox.triggerAck('192.168.0.11').then((resp) => {
            expect(resp.id).toBe(data.id);
            done();
        });
    });

    it('assigns qbox', done => {
        const data = {id: 'test'};
        mock.onGet('http://192.168.0.11/util/qbox/assigned').reply(200, data);
        qbox.assignQBox('192.168.0.11').then((resp) => {
            expect(resp.id).toBe(data.id);
            done();
        });
    });

    it('gets qbox info', done => {
        const data = {id: 'test'};
        mock.onGet('http://192.168.0.11/util/qbox/info').reply(200, data);
        qbox.getQBoxInfo('192.168.0.11').then((resp) => {
            expect(resp.id).toBe(data.id);
            done();
        });
    });

    it('gets qbox version', done => {
        const data = {id: 'test'};
        mock.onGet('http://192.168.0.11/util/qbox/ver').reply(200, data);
        qbox.getQBoxVer('192.168.0.11').then((resp) => {
            expect(resp.id).toBe(data.id);
            done();
        });
    });

    it('gets qbox wifi info', done => {
        const data = {id: 'test'};
        mock.onGet('http://192.168.0.11/util/wifi/info').reply(200, data);
        qbox.getQBoxWifiInfo('192.168.0.11').then((resp) => {
            expect(resp.id).toBe(data.id);
            done();
        });
    });
});

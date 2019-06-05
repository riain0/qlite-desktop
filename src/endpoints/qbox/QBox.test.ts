import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import QBox, { QBoxDTO } from './QBox';

let mock: MockAdapter;
let qbox: QBox = new QBox();
qbox.setEndpoint('34.250.72.1:8080');
let qBoxDto: QBoxDTO = {id: 'testQBox', name: 'testQBox', ipAddress: 'testQBox', assigned: false};

beforeEach(() => {
    mock = new MockAdapter(axios);
});

describe('QBox', () => {
    it('returns 200 status and string when QBox is created', done => {
        const data = 'Created testQBox';
        mock.onPost('http://34.250.72.1:8080/qbox/create', qBoxDto).reply(200, data);
        qbox.createQBox(qBoxDto).then((resp) => {
            expect(resp.data).toEqual(data);
            done();
        });
    });

    it('returns 200 status and string when QBox is deleted', done => {
        const data = 'Deleted testQBox';
        mock.onDelete(`http://34.250.72.1:8080/qbox/deleteQBox/${qBoxDto.id}`).reply(200, data);
        qbox.deleteQBox(qBoxDto.id).then((resp) => {
            expect(resp.data).toEqual(data);
            done();
        });
    });

    it('returns 200 status and QBoxdto when QBox is requested', done => {
        const data = qBoxDto;
        mock.onGet(`http://34.250.72.1:8080/qbox/get/${qBoxDto.ipAddress}`).reply(200, data);
        qbox.getQBox(qBoxDto.ipAddress).then((resp) => {
            expect(resp).toEqual(data);
            done();
        });
    });

    it('returns 200 status and list of all QBoxes', done => {
        const data = [qBoxDto];
        mock.onGet('http://34.250.72.1:8080/qbox/getAllQBoxes').reply(200, data);
        qbox.getAllQBoxes().then((resp) => {
            expect(resp).toEqual(data);
            done();
        });
    });

    it('returns 200 status and assigns qbox', done => {
        const data = 'Assigned testQBox';
        mock.onPost(`http://34.250.72.1:8080/qbox/assign/${qBoxDto.ipAddress}`).reply(200, data);
        qbox.assignQBox(qBoxDto.ipAddress).then((resp) => {
            expect(resp.data).toEqual(data);
            done();
        });
    });

    it('returns the endpoint', () => {
        const spy = jest.spyOn(qbox, 'getEndpoint');
        expect(qbox.getEndpoint()).toEqual('http://34.250.72.1:8080/qbox');
        expect(spy).toHaveBeenCalled();
    });
});
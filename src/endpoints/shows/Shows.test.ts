import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Shows, { ShowDTO } from './Shows';

let mock: MockAdapter;
let show: Shows = new Shows();
show.setEndpoint('34.250.72.1:8080');
let showDto: ShowDTO = {id: 'testShow', name: 'testShow', owner: 'testShow', lastUpdated: 'testShow', cues: [], qboxes: []};

beforeEach(() => {
    mock = new MockAdapter(axios);
});

describe('Shows', () => {
    it('returns 200 status and string when Show is created', done => {
        const data = 'Created testShow';
        mock.onPost('http://34.250.72.1:8080/show/create', showDto).reply(200, data);
        show.createShow(showDto).then((resp) => {
            expect(resp.data).toEqual(data);
            done();
        });
    });

    it('returns 200 status and string when show is deleted', done => {
        const data = 'Deleted testShow';
        mock.onDelete(`http://34.250.72.1:8080/show/delete/${showDto.id}`).reply(200, data);
        show.deleteShow(showDto.id).then((resp) => {
            expect(resp.data).toEqual(data);
            done();
        });
    });

    it('returns 200 status and showdto when show is requested', done => {
        const data = showDto;
        mock.onGet(`http://34.250.72.1:8080/show/get/${showDto.id}`).reply(200, data);
        show.getShow(showDto.id).then((resp) => {
            expect(resp).toEqual(data);
            done();
        });
    });

    it('returns 200 status and list of all shows', done => {
        const data = [showDto];
        mock.onGet('http://34.250.72.1:8080/show/getAllShows').reply(200, data);
        show.getAllShows().then((resp) => {
            expect(resp).toEqual(data);
            done();
        });
    });

    it('returns 200 status and string when show is saved', done => {
        const data = 'Saved testShow';
        mock.onPut('http://34.250.72.1:8080/show/save', showDto).reply(200, data);
        show.saveShow(showDto).then((resp) => {
            expect(resp.data).toEqual(data);
            done();
        });
    });

    it('returns the endpoint', () => {
        const spy = jest.spyOn(show, 'getEndpoint');
        expect(show.getEndpoint()).toEqual('http://34.250.72.1:8080/show');
        expect(spy).toHaveBeenCalled();
    });
});
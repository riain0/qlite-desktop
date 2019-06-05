import axios, { AxiosPromise } from 'axios';
import { store } from '../../config';

export type ShowDTO = {
    id: string;
    name: string;
    lastUpdated: string;
    owner: string;
    qboxes: Array<QBox>;
    cues: {
        [key: string]: Cue | any;
    };
};

export type Cue = {
    id: string;
    description: string;
    length?: number;
    prewait?: number;
    postwait?: number;
    type: string | string[];
};

export type QBox = {
    id: string;
    name: string;
    ipAddress: string;
    type: string;
};

export default class Shows {

    private endpoint: string | undefined;

    constructor() {
        if (store.get('api')) {
            this.setEndpoint(store.get('api').toString());
        } else {
            this.setEndpoint('');
        }
    }

    createShow(showDto: ShowDTO): AxiosPromise<string> {
        let uri: string = this.endpoint + '/create';
        return axios.post(uri, showDto);
    }

    deleteShow(showId: string): AxiosPromise<string> {
        let uri: string = this.endpoint + `/delete/${showId}`;
        return axios.delete(uri);
    }

    getShow(showId: string): Promise<ShowDTO> {
        let uri: string = this.endpoint + `/get/${showId}`;
        return axios.get(uri).then((resp) => {
            let content = resp.data;
            let show: ShowDTO = {
                id: content.id, name: content.name, owner: content.owner,
                lastUpdated: content.lastUpdated, cues: content.cues, qboxes: content.qboxes
            };
            return show;
        });
    }

    getAllShows(): Promise<ShowDTO[]> {
        let uri: string = this.endpoint + '/getAllShows';
        return axios.get(uri).then((resp) => {
            let content = resp.data;
            return content.map((val: any) => (
                {
                    id: val.id, name: val.name, owner: val.owner,
                    lastUpdated: val.lastUpdated, cues: val.cues, qboxes: val.qboxes
                }
            ));
        });
    }

    saveShow(showDto: ShowDTO): AxiosPromise<string> {
        let uri: string = this.endpoint + '/save';
        return axios.put(uri, showDto);
    }

    setEndpoint(endpoint: string) {
        this.endpoint = 'http://' + endpoint + '/show';
    }

    getEndpoint() {
        return this.endpoint;
    }
}

import axios, { AxiosPromise } from 'axios';
import { store } from '../../config';

export type QBoxDTO = {
    id: string;
    name: string;
    assigned: boolean;
    ipAddress: string;
};

export default class QBox {

    private endpoint: string | undefined;

    constructor() {
        if (store.get('api')) {
            this.setEndpoint(store.get('api').toString());
        } else {
            this.setEndpoint('');
        }
    }

    createQBox(qBoxDto: QBoxDTO): AxiosPromise<string> {
        let uri: string = this.endpoint + '/create';
        return axios.post(uri, qBoxDto);
    }

    deleteQBox(qBoxId: string): AxiosPromise<string> {
        let uri: string = this.endpoint + `/deleteQBox/${qBoxId}`;
        return axios.delete(uri);
    }

    getQBox(ipAddress: string): Promise<QBoxDTO> {
        let uri: string = this.endpoint + `/get/${ipAddress}`;
        return axios.get(uri).then((resp) => {
            let content = resp.data;
            let show: QBoxDTO = {
                id: content.id, name: content.name, assigned: content.assigned, ipAddress: content.ipAddress
            };
            return show;
        });
    }

    getAllQBoxes(): Promise<QBoxDTO[]> {
        let uri: string = this.endpoint + '/getAllQBoxes';
        return axios.get(uri).then((resp) => {
            let content = resp.data;
            return content.map((val: any) => (
                {
                    id: val.id, name: val.name, assigned: val.assigned, ipAddress: val.ipAddress
                }
            ));
        });
    }

    assignQBox(ipAddress: string): AxiosPromise<string> {
        let uri: string = this.endpoint + `/assign/${ipAddress}`;
        return axios.post(uri);
    }

    setEndpoint(endpoint: string) {
        this.endpoint = 'http://' + endpoint + '/qbox';
    }

    getEndpoint() {
        return this.endpoint;
    }
}

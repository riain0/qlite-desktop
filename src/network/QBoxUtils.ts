import axios from 'axios';

export default class QBoxUtils {

    url: string;

    constructor() {
        this.url = 'http://';
    }

    async assignQBox(uri: string): Promise<any> {
        let resp = await axios.get(this.url + uri + '/util/qbox/assigned');
        return resp.data;
    }

    async triggerGo(uri: string): Promise<any> {
        let resp = await axios.get(this.url + uri + '/go');
        return resp.data;
    }

    async triggerAck(uri: string): Promise<any> {
        let resp = await axios.get(this.url + uri + '/ack');
        return resp.data;
    }

    async getQBoxInfo(uri: string): Promise<any> {
        let resp = await axios.get(this.url + uri + '/util/qbox/info');
        return resp.data;
    }

    async getQBoxVer(uri: string): Promise<any> {
        let resp = await axios.get(this.url + uri + '/util/qbox/ver');
        return resp.data;
    }

    async getQBoxWifiInfo(uri: string): Promise<any> {
        let resp = await axios.get(this.url + uri + '/util/wifi/info');
        return resp.data;
    }

}
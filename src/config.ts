// tslint:disable-next-line: no-require-imports
 import ElectronStore = require('electron-store');

export let store = new ElectronStore({
    name: 'userConfig',
    cwd: `${__dirname}`,
    defaults: {
        'api': 'test',
        'qboxes': [
            {
                'name': 'QBox Name',
                'type': 'QBox Type',
                'macAddress': 'QBox Mac Address',
                'ipAddress': 'QBox IP Address'
            }
        ],
        'checked': true
    }
});
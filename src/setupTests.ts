import { configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

const globalAny: any = global;
globalAny.window.require = function () {
    return {
      ipcRenderer: {
        on: jest.fn()
      }
    };
  };

jest.mock('electron-store');
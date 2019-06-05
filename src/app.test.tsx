import * as React from 'react';
import { shallow } from 'enzyme';
import { App } from './app';

describe('App', () => {
    it('renders as it should', () => {
        const mock: any = jest.fn();
        const wrapper = shallow(<App history={mock} location={mock} match={mock} />);
        expect(wrapper).toBeDefined();
    });
});
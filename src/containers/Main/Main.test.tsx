import * as React from 'react';
import { shallow } from 'enzyme';
import Main from './Main';

describe('Main', () => {
    it('renders as it should', () => {
        const wrapper = shallow(<Main />);
        expect(wrapper).toBeDefined();
    });
});
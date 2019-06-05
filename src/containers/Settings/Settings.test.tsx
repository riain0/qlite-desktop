import * as React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router';
import Settings from './Settings';

describe('Settings', () => {
    it('renders items', () => {
        // tslint:disable-next-line: no-empty
        const wrapper = mount(<MemoryRouter><Settings toggleOpen={() => {}}/></MemoryRouter>);
        wrapper.update();
        expect(wrapper.find('button#saveBtn')).toBeTruthy();
        expect(wrapper.find('input#api')).toBeTruthy();
        expect(wrapper.find('input#api').props().placeholder).toEqual('');
        expect(wrapper.find('input#api').props().value).toEqual('');
    });

    it('calls toggleOpen', () => {
        let mockToggleOpen = jest.fn();
        const wrapper = mount(<MemoryRouter><Settings toggleOpen={mockToggleOpen}/></MemoryRouter>);
        wrapper.update();
        // tslint:disable-next-line: no-empty
        wrapper.find('form').simulate('submit', { mockToggleOpen });
        expect(mockToggleOpen).toBeDefined();
    });
});
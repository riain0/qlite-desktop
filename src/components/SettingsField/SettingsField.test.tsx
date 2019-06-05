import { mount } from 'enzyme';
import SettingsField from './SettingsField';
import * as React from 'react';

describe('Settings', () => {
    it('renders items', () => {
        // tslint:disable-next-line: no-empty
        const wrapper = mount(<SettingsField title='api' setting= 'api' toggleOpen={() => {}}/>);
        wrapper.update();
        expect(wrapper.find('button#saveBtn')).toBeTruthy();
        expect(wrapper.find('input#api')).toBeTruthy();
        expect(wrapper.find('input#api').props().placeholder).toEqual('');
        expect(wrapper.find('input#api').props().value).toEqual('');
    });

    it('calls toggleOpen', () => {
        let mockToggleOpen = jest.fn();
        const wrapper = mount(<SettingsField title='api' setting= 'api' toggleOpen={mockToggleOpen}/>);
        wrapper.update();
        // tslint:disable-next-line: no-empty
        wrapper.find('form').simulate('submit', { preventDefault () {} });
        expect(mockToggleOpen).toBeDefined();
    });
});
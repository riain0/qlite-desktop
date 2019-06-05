import * as React from 'react';
import { mount } from 'enzyme';
import CueList from './CueList';

describe('CueList', () => {
    it('renders correctly', () => {
        const wrapper = mount(<CueList editable gone acknowledged cueList={[]} currentCue={0} handleCueUpdate={jest.fn()} />);
        expect(wrapper).toBeDefined();
    });
});
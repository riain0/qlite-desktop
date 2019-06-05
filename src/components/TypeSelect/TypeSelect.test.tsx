import * as React from 'react';
import { shallow } from 'enzyme';
import TypeSelect from './TypeSelect';
import * as renderer from 'react-test-renderer';

describe('TypeSelect', () => {
    it('renders correctly', ()  => {
        const mockOnChange = jest.fn();
        const tree = renderer
            .create(<TypeSelect onChange={mockOnChange} value='testValue' />)
            .toJSON();
        expect(tree).toMatchSnapshot();
        const wrapper = shallow(<TypeSelect onChange={mockOnChange} value='testValue' />);
        let instance = wrapper.instance() as TypeSelect;
        instance.props.onChange('newValue');
        expect(instance.props.value).toEqual('testValue');
        expect(mockOnChange).toBeCalled();
    });
});
import * as React from 'react';
import TriggerButton, { ButtonType } from './TriggerButton';
import { mount } from 'enzyme';

describe('TriggerButton', () => {
    it('creates go button', () => {
        let mockOnClick = jest.fn();
        const wrapper = mount(<TriggerButton type={ButtonType.Go} onClick={mockOnClick} disabled={false} />);
        let instance = wrapper.instance() as TriggerButton;
        expect(instance.props.type).toEqual(0);
        expect(instance.props.disabled).toBeFalsy();
        wrapper.update();
        wrapper.find('button#go').simulate('click');
        expect(mockOnClick).toBeCalled();
    });

    it('creates ack button', () => {
        let mockOnClick = jest.fn();
        const wrapper = mount(<TriggerButton type={ButtonType.Ack} onClick={mockOnClick} disabled={false} />);
        let instance = wrapper.instance() as TriggerButton;
        expect(instance.props.type).toEqual(1);
        expect(instance.props.disabled).toBeFalsy();
        wrapper.update();
        wrapper.find('button#ack').simulate('click');
        expect(mockOnClick).toBeCalled();
    });

    it('creates disabled button', () => {
        let mockOnClick = jest.fn();
        const wrapper = mount(<TriggerButton type={ButtonType.Ack} onClick={mockOnClick} disabled={true} />);
        let instance = wrapper.instance() as TriggerButton;
        expect(instance.props.type).toEqual(1);
        expect(instance.props.disabled).toBeTruthy();
        wrapper.update();
        wrapper.find('button#ack').simulate('click');
        expect(mockOnClick).toBeCalledTimes(0);
    });
});
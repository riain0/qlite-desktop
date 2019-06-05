import * as React from 'react';
import CreatableSelect from 'react-select/lib/Creatable';

interface Props {
    onChange: (newValue: any) => any;
    value: any;
    isMulti?: boolean;
}

export default class TypeSelect extends React.PureComponent<Props> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        const { isMulti } = this.props;
        return (
            <CreatableSelect
                options={[
                    {value: 'LX', label: 'Lighting'},
                    {value: 'SFX', label: 'Sound'},
                    {value: 'Set', label: 'Set'},
                    {value: 'FX', label: 'Special Effect'}
                ]}
                isMulti={isMulti}
                onChange={this.props.onChange}
            />
        );
    }
}
import * as React from 'react';
import { FieldProps } from 'formik';
import CreatableSelect from 'react-select/lib/Creatable';
import QBox, { QBoxDTO } from '../../endpoints/qbox/QBox';
import { Option } from 'react-select/lib/filters';

interface State {
    qboxes: Set<QBoxDTO>;
}

export default class QBoxSelect extends React.PureComponent<FieldProps, State> {

    private qbox: QBox = new QBox();

    constructor(props: FieldProps) {
        super(props);
        this.state = {
            qboxes: new Set()
        };
    }

    componentDidMount() {
        this.getQBoxes();
    }

    getQBoxes = async () => {
        let resp = await this.qbox.getAllQBoxes();
        this.setState({qboxes: new Set(resp)});
    }

    render() {
        const { qboxes } = this.state;
        return (
            <div style={ { color: '#000' } }>
                <div style={ { color: '#fff', display: 'flex', paddingBottom: '5px' } }>Select QBoxes</div>
                <CreatableSelect
                    options={
                        [ ...qboxes ].map((val) => {
                            return {
                                value: val.ipAddress,
                                label: val.name,
                                data: val
                            };
                        })
                    }
                    isMulti
                    onChange={(value: Array<Option>) => {
                        let arr: Array<QBox> = [];
                        value.forEach((obj) => arr.push(obj.data));
                        return this.props.form.setFieldValue(this.props.field.name, arr);
                    }}
                />
            </div>
        );
    }

}
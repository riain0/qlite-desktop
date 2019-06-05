import * as React from 'react';
import { Field, Formik, Form } from 'formik';
import { store } from '../../config';
import {MDBBtn} from 'mdbreact';
import { TextField } from 'formik-material-ui';

interface Props {
    title: string;
    setting: string;
    toggleOpen: () => void;
}

interface Values {
    api: string;
}

export default class SettingsField extends React.PureComponent<Props> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        const { setting } = this.props;
        const val = store.get(setting) || '';
        return (
            <div style={{backgroundColor: '#fff'}}>
                <Formik
                    onSubmit={(values: Values) => { store.set(setting, values.api); this.props.toggleOpen(); }}
                    initialValues={{
                        api: val
                    }}
                >
                    <Form>
                        <Field id={setting} name={setting} placeholder={val} component={TextField} style={{paddingLeft: '5px'}}/>
                        <MDBBtn id='saveBtn' size='sm' type='submit'>
                            Save
                        </MDBBtn>
                    </Form>
                </Formik>
            </div>
        );
    }
}
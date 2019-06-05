import * as React from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import { withRouter, RouteComponentProps } from 'react-router';
import QBoxSelect from '../QBoxSelect/QBoxSelect';
import Shows, { ShowDTO, QBox } from '../../endpoints/shows/Shows';
import { MDBBtn } from 'mdbreact';
const electron = (window as any).require('electron');
const ipcRenderer  = electron.ipcRenderer;

// tslint:disable-next-line: no-require-imports
import moment = require('moment');

interface Values {
    name: string;
    owner: string;
    qboxes: Array<QBox>;
}

export default withRouter(class ShowCreate extends React.PureComponent<RouteComponentProps> {

    private show: Shows = new Shows();

    constructor(props: RouteComponentProps) {
        super(props);
    }

    componentWillMount() {
        ipcRenderer.on('openShow', (_event: any, _route: any) => { this.props.history.push('/'); });
    }

    createShow(show: ShowDTO): void {
        this.show.createShow(show);
        this.props.history.push('/showScreen', {
            cueList: show.cues || [],
            name: show.name,
            owner: show.owner,
            lastUpdated: show.lastUpdated,
            qboxes: show.qboxes
        });
    }

    render() {
        return (
            <div id='showcreate' style={ { color: '#fff', display: 'inline-block' } }>
                <Formik
                    onSubmit={ (values: Values) => {
                        let newShow: ShowDTO = {
                            id: values.name,
                            name: values.name,
                            owner: values.owner,
                            qboxes: values.qboxes,
                            cues: [],
                            lastUpdated: moment().format('YYYY-MM-DD')
                        };
                        this.createShow(newShow);
                    } }
                    initialValues={ {
                        name: '',
                        owner: '',
                        qboxes: []
                    } }
                >
                    <Form>
                        <Field
                            id='name'
                            name='name'
                            placeholder='Show Name'
                            label='Show Name'
                            component={ TextField }
                            style={ { paddingBottom: '15px', color: '#fff' } }
                        />
                        <br />
                        <Field id='owner' name='owner' placeholder='Owner' label='Owner' component={ TextField } style={ { marginBottom: '25px' } } />
                        <Field id='qboxes' name='qboxes' component={ QBoxSelect } />
                        <MDBBtn type='submit' style={ { marginTop: '35px' } }>
                            Create
                        </MDBBtn>
                    </Form>
                </Formik>
            </div>
        );
    }
});
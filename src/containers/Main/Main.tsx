import * as React from 'react';
import Styles from './Styles/MainStyles';
import ShowLoad from '../../components/ShowLoad/ShowLoad';
import { MDBBtn } from 'mdbreact';
import ShowCreate from '../../components/ShowCreate/ShowCreate';
import { withRouter, RouteComponentProps } from 'react-router-dom';
const electron = (window as any).require('electron');
const ipcRenderer  = electron.ipcRenderer;
const qlite = './resources/qlite.png';

interface State {
    create: boolean;
}

export default withRouter(class Main extends React.PureComponent<RouteComponentProps, State> {

    constructor(props: RouteComponentProps) {
        super(props);
        this.state = {
            create: this.props.history.location.state && this.props.history.location.state.create
        };
    }

    componentWillMount() {
        ipcRenderer.on('newShow', (_event: any, _route: any) => { this.setState({ create: true }); });
        ipcRenderer.on('openShow', (_event: any, _route: any) => { this.setState({ create: false }); });
    }

    render() {
        const { create } = this.state;
        return (
            <Styles.CentreDiv>
                <img src={ qlite } style={ { margin: 'none' } } />
                <Styles.Title>
                    QLite
                </Styles.Title>
                <Styles.SubTitle>
                    control centre
                </Styles.SubTitle>
                {
                    !create ? (
                        <div>
                            <ShowLoad />
                            <div style={ { textAlign: 'center', padding: '15px', color: '#fff' } }>
                                or...
                            </div>
                            <MDBBtn onClick={ () => this.setState({ create: true }) }>
                                Create a show
                            </MDBBtn>
                        </div>
                    ) : (
                            <div style={{display: 'inline-block'}}>
                                <ShowCreate />
                                <div>
                                <MDBBtn onClick={() => this.setState({ create: false })} size='sm' outline style={ { marginTop: '35px' } }>
                                    Cancel
                                </MDBBtn>
                                </div>
                            </div>
                        )
                }
            </Styles.CentreDiv>
        );
    }
});
import * as React from 'react';
import { store } from '../../config';
import Shows, { ShowDTO } from '../../endpoints/shows/Shows';
import { MDBTable, MDBTableBody, MDBTableHead, MDBBtn, MDBIcon } from 'mdbreact';
import { RouteComponentProps, withRouter } from 'react-router';
import IconButton from '@material-ui/core/IconButton';

interface State {
    api: any;
    shows: Show;
    cueList: any;
    name: string;
    owner: string;
    lastUpdated: string;
    qboxes: any;
    loaded: boolean;
    apiUnreachable: boolean;
}

type Show = Array<
    {
        name: string,
        lastUpdated: string,
        owner: string
    }
>;

export default withRouter(class ShowLoad extends React.Component<RouteComponentProps, State> {

    private shows: Shows;

    constructor(props: RouteComponentProps) {
        super(props);
        this.state = {
            api: store.get('api'),
            shows: [],
            cueList: null,
            name: '',
            owner: '',
            lastUpdated: '',
            qboxes: null,
            loaded: false,
            apiUnreachable: false
        };
        this.shows = new Shows();
    }

    loadShow(showName: string) {
        let props: ShowDTO = { id: '', name: '', owner: '', lastUpdated: '', qboxes: [], cues: [] };
        Promise.resolve(this.shows.getShow(showName)).then((resp) => {
            this.setState({
                cueList: resp.cues,
                name: resp.name,
                owner: resp.owner,
                lastUpdated: resp.lastUpdated,
                qboxes: resp.qboxes,
                loaded: true
            });
            props = resp;
            const { cues, name, owner, lastUpdated, qboxes } = props;
            this.props.history.push('/showScreen', {
                cueList: cues,
                name,
                owner,
                lastUpdated,
                qboxes
            });
        });
    }

    componentDidMount() {
        this.getShows();
    }

    getShows = () => {
        Promise.resolve(this.shows.getAllShows()).then((resp) => {
            resp.forEach((elem) => {
                this.setState(prevState =>
                    ({ shows: [ ...prevState.shows, { name: elem.name, owner: elem.owner, lastUpdated: elem.lastUpdated } ] })
                );
            });
        }).catch(() => this.setState({ apiUnreachable: true }));
    }

    handleRefresh = () => {
        this.getShows();
    }

    handleDelete = async (showId: string) => {
        await this.shows.deleteShow(showId);
        this.state.shows.forEach((elem, idx) => {
            if (elem.name === showId) {
                let newArray = this.state.shows;
                newArray.splice(idx, 1);
                this.setState({ shows: newArray });
            }
        });
        this.handleRefresh();
    }

    render() {
        const { apiUnreachable, shows } = this.state;
        let uniq = {};
        return (
            <React.Fragment>
                { !apiUnreachable ? (
                    <div className='tableqlite' style={ { color: '#fff', textAlign: 'center' } }>
                        <MDBTable
                            scrollY
                            align='center'
                            borderless
                            striped
                            hover
                            responsive
                            style={ { width: '35%', paddingTop: '10px', paddingBottom: '20px' } }
                        >
                            <MDBTableHead>
                                <tr>
                                    <th>Show Name</th>
                                    <th>Owner</th>
                                    <th>Last Updated</th>
                                    <th></th>
                                    <th>
                                        <IconButton style={ { color: '#fff', width: '50px', padding: '0px' } } onClick={ this.handleRefresh }>
                                            <MDBIcon icon='redo' />
                                        </IconButton>
                                    </th>
                                </tr>
                            </MDBTableHead>
                            <MDBTableBody>
                                { shows.filter(obj => !uniq[ obj.name ] && (uniq[ obj.name ] = true))
                                    .sort((a, b) => (new Date(a.lastUpdated) < new Date(b.lastUpdated)) ? 1 : -1).map((val) => {
                                        return (
                                            <tr key={ val.name }>
                                                <td>{ val.name }</td>
                                                <td>{ val.owner }</td>
                                                <td>{ val.lastUpdated }</td>
                                                <td>
                                                    <MDBBtn outline size='sm' onClick={ () => this.loadShow(val.name) }>
                                                        Load
                                                </MDBBtn>
                                                </td>
                                                <td>
                                                    <IconButton onClick={ () => this.handleDelete(val.name) }>
                                                        <MDBIcon style={ { color: '#fff' } } icon='trash-alt' />
                                                    </IconButton>
                                                </td>
                                            </tr>
                                        );
                                    }) }
                            </MDBTableBody>
                        </MDBTable>
                    </div>
                ) :
                    <div style={ { textAlign: 'center' } }>
                        <MDBIcon icon='exclamation-triangle' />
                        <div style={ { color: 'white', paddingTop: '5px' } }>
                            Please make sure your API endpoint is set correctly.
                        </div>
                    </div>
                }
            </React.Fragment>
        );
    }
});

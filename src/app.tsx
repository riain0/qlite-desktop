import * as React from 'react';
import Main from './containers/Main/Main';
import { MemoryRouter, Route, Switch, RouteComponentProps } from 'react-router-dom';
import Settings from './containers/Settings/Settings';
import Show from './containers/Show/Show';
import { MDBContainer, MDBModal, MDBModalBody } from 'mdbreact';
import { createBrowserHistory } from 'history';
const electron = (window as any).require('electron');
const ipcRenderer  = electron.ipcRenderer;

interface State {
  preferences: boolean;
}

export const history = createBrowserHistory();

export class App extends React.PureComponent<RouteComponentProps, State> {

  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      preferences: false,
    };
  }

  componentWillMount() {
    ipcRenderer.on('openPreferences', (_event: any, _route: any) => { this.setState({ preferences: !this.state.preferences }); });
  }

  togglePref = () => {
    this.setState({ preferences: !this.state.preferences });
  }

  render() {
    const { preferences } = this.state;
    return (
      <MemoryRouter>
        <div>
          <Switch>
            <Route path='/' exact component={ Main } history={history}/>
            <Route path='/settings' exact component={ Settings } />
            <Route path='/showScreen' exact component={ Show } />
          </Switch>
          {
            preferences ? (
              <MDBContainer>
                <MDBModal style={ { color: 'white' } } isOpen={ preferences } toggle={ this.togglePref } size='fluid' frame position='top'>
                  <MDBModalBody>
                    <Settings toggleOpen={ this.togglePref } />
                  </MDBModalBody>
                </MDBModal>
              </MDBContainer>
            ) : null
          }
        </div>
      </MemoryRouter>
    );
  }
}

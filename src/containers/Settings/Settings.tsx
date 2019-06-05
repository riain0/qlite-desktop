import * as React from 'react';
import SettingsField from '../../components/SettingsField/SettingsField';
import { RouteComponentProps, withRouter } from 'react-router';

interface Props extends RouteComponentProps {
    toggleOpen: () => void;
}

export default withRouter(class Settings extends React.PureComponent<Props> {

    toggleOpen() {
        this.props.toggleOpen();
    }

    render() {
        return (
            <SettingsField title='API' setting='api' toggleOpen={() => this.toggleOpen()} />
        );
    }
});
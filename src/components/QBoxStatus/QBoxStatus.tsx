import * as React from 'react';

interface Props {
    acknowledged: boolean;
    gone: boolean;
}

interface State {
    acknowledged: boolean;
    gone: boolean;
    ackChanged: boolean;
    goChanged: boolean;
}

export default class QBoxStatus extends React.PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            acknowledged: this.props.acknowledged,
            gone: this.props.gone,
            ackChanged: false,
            goChanged: false
        };
    }

    componentDidUpdate(oldProps: Props) {
        let newProps: Props = this.props;
        if (oldProps.acknowledged !== newProps.acknowledged && !this.state.ackChanged) {
            this.setState({acknowledged: newProps.acknowledged, ackChanged: true});
        } else if (oldProps.gone !== newProps.gone && !this.state.goChanged) {
            this.setState({gone: newProps.gone, goChanged: true});
        }
      }

    render() {
        const { acknowledged } = this.state;
        return (
            <div style={{display: 'flex', flexDirection: 'column', paddingLeft: '11px'}}>
                <div>
                    {
                        acknowledged ? 'Cue Acknowledged ✓' : 'Waiting for acknowledgement. ╳'
                    }
                </div>
            </div>
        );
    }
}
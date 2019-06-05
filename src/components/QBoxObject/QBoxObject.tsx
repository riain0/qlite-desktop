import * as React from 'react';

interface State {
    ack: boolean;
    go: boolean;
    id: string;
}

interface Props {
    ack: boolean;
    go: boolean;
    id: string;
}

export default class QBoxObject extends React.PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            ack: this.props.ack,
            go: this.props.go,
            id: this.props.id
        };
    }

    componentDidUpdate(oldProps: Props) {
        let newProps: Props = this.props;
        if (oldProps != newProps) {
            this.setState({ack: newProps.ack, go: newProps.go, id: newProps.id});
        }
    }

    render() {
        const { ack, go, id } = this.state;
        return (
            <div style={{display: 'flex', margin: '5px'}}>
                <div>{id}</div>
                <div className='qbox'>
                    <div className={`circle-red-${ack ? 'on' : 'off'}`} />
                    <div className={`circle-green-${go ? 'on' : 'off'}`} />
                </div>
            </div>
        );
    }

}
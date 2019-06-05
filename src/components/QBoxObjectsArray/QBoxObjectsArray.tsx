import * as React from 'react';
import QBoxObject from '../QBoxObject/QBoxObject';

interface Props {
    options: Array<Options>;
}

type Options = {
    go: boolean;
    ack: boolean;
    id: string;
};

interface State {
    options: Array<Options>;
}

export default class QBoxObjectsArray extends React.PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            options: this.props.options
        };
    }

    componentDidUpdate(oldProps: Props) {
        let newProps: Props = this.props;
        if (newProps != oldProps) {
            this.setState({options: newProps.options});
        }
    }

    render() {
        const { options } = this.props;
        return (
            <div>
                <div style={{textAlign: 'center', marginTop: '5px'}}>QBox Statuses</div>
                {options.map((option) => <div key={option.id}><QBoxObject go={ option.go } ack={ option.ack } id={option.id} /></div>)}
            </div>
        );
    }
}
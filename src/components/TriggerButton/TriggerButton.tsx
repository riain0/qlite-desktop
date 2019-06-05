import * as React from 'react';
import { MDBBtn } from 'mdbreact';

export enum ButtonType {
    Go,
    Ack,
    Step,
    Back
}

interface Props {
    onClick: () => any;
    type: ButtonType;
    disabled: boolean;
}

const mutualStyles = {
    width: '130px',
};

const goStyle = {
    height: '120px',
    fontSize: '30px',
    ...mutualStyles
};

const ackStyle = {
    height: '60px',
    fontSize: '10px',
    ...mutualStyles
};

const otherStyles = {
    height: '53.5px',
    fontSize: '10px',
    // ...mutualStyles
};

export default class TriggerButton extends React.PureComponent<Props> {

    constructor(props: Props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { onClick, type, disabled } = this.props;
        const { Go, Ack, Step, Back } = ButtonType;
        let button = undefined;
        switch (type) {
            case Go:
                button =
                    <MDBBtn
                        id='go'
                        onClick={ onClick }
                        style={ goStyle }
                        color={ 'default' }
                        disabled={ disabled }
                    >
                        Go
                    </MDBBtn>;
                break;
            case Ack:
                button =
                    <MDBBtn
                        id='ack'
                        onClick={ onClick }
                        style={ ackStyle }
                        color={ 'danger' }
                        disabled={ disabled }
                    >
                        Request Acknowledgement
                    </MDBBtn>;
                break;
            case Step:
                button =
                    <MDBBtn
                        id='step'
                        onClick={ onClick }
                        style={ otherStyles }
                        color={ 'primary' }
                        disabled={ disabled }
                    >
                        Step Over
                    </MDBBtn>;
                break;
                case Back:
                button =
                    <MDBBtn
                        id='back'
                        onClick={ onClick }
                        style={ otherStyles }
                        color={ 'secondary' }
                        disabled={ disabled }
                    >
                        Back
                    </MDBBtn>;
                break;
        }
        return button;
    }
}
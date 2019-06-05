import * as React from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';

interface Props {
    showRedirectModal: boolean;
    handleRedirect: () => void;
    setState: () => void;
}

export default class SaveModal extends React.PureComponent<Props> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        const { showRedirectModal, handleRedirect, setState } = this.props;
        return (
            <MDBContainer style={ { width: '30%', backgroundColor: '#ecf0f1', textAlign: 'center', margin: 'auto', color: '#000' } }>
            <MDBModal isOpen={ showRedirectModal }>
                <MDBModalHeader>Are you sure?</MDBModalHeader>
                <MDBModalBody>
                    Are you sure you want to create or open a new show and lose any unsaved changes?
                </MDBModalBody>
                <MDBModalFooter>
                    <MDBBtn color='primary' onClick={ handleRedirect }>Yes!</MDBBtn>
                    <MDBBtn color='secondary' onClick={ setState }>No!</MDBBtn>
                </MDBModalFooter>
            </MDBModal>
        </MDBContainer>
        );
    }
}
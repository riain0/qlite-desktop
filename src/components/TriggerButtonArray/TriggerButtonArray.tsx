import * as React from 'react';
import TriggerButton, { ButtonType } from '../TriggerButton/TriggerButton';

interface Props {
    options: Array<Options>;
}

type Options = {
    onClick: () => any;
    type: ButtonType;
    disabled: boolean;
};

export default class TriggerButtonArray extends React.PureComponent<Props> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        const { options } = this.props;
        return (
            <div style={{display: 'flex', flexDirection: 'column', flexWrap: 'wrap'}}>
                {
                    options.map((option) => {
                        return (
                            <TriggerButton disabled={option.disabled} onClick={option.onClick} type={option.type} key={option.type} />
                        );
                    })
                }
            </div>
        );
    }
}
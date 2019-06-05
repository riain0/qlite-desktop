import * as React from 'react';
import ModeSwitch from '../ModeSwitch/ModeSwitch';

interface Props {
    options: Array<Options>;
}

type Options = {
    label: string;
    onClick: () => void;
    value: string;
    enabled: boolean;
};

export default class ModeSwitchArray extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const { options } = this.props;
        return (
            <div style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'column'}}>
                {
                    options.map((option) => {
                        return (
                            <ModeSwitch
                                key={option.value}
                                label={option.label}
                                onClick={option.onClick}
                                value={option.value}
                                enabled={option.enabled}
                            />
                        );
                    })
                }
            </div>
        );
    }
}
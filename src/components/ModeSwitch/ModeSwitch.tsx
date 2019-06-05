import * as React from 'react';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

interface Props {
    onClick: () => any;
    label: string;
    value: string;
    enabled: boolean;
}

export default class ModeSwitch extends React.PureComponent<Props> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        const { onClick, label, value, enabled } = this.props;
        return (
            <FormControlLabel
                control={
                    <Switch
                        checked={enabled}
                        onClick={onClick}
                        value={value}
                    />
                }
                label={label}
            />
        );
    }

}
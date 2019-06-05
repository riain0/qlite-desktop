import * as React from 'react';
import { QBox } from '../../endpoints/shows/Shows';
import MaterialTable, { Column, EditComponentProps } from 'material-table';
import TypeSelect from '../TypeSelect/TypeSelect';
import { Option } from 'react-select/lib/filters';
// import console = require('console');

interface Props {
    qboxes: Array<QBox>;
    handleTypeUpdate: (rows: Array<any>) => void;
}

interface State {
    qboxes: Array<QBox>;
    rows: any;
}

export default class QBoxTypeSet extends React.PureComponent<Props, State> {

    private columns: Column[] = [
        { field: 'id', title: 'QBox ID' , editable: 'never', type: 'numeric' },
        { field: 'type', title: 'QBox Type', editComponent:
          (props: EditComponentProps) => (<TypeSelect value={props.value} onChange={(value: Option) => {
              props.onChange(value.value);
              return value.label;
          }} />) },
      ];

    constructor(props: Props) {
        super(props);
        this.state = {
            qboxes: this.props.qboxes,
            rows: []
        };
    }

    componentDidMount() {
        this.renderRows();
    }

    renderRows = () => {
        let { qboxes } = this.state;
        this.setState({rows: [...qboxes.map((qbox) => {
            return {id: qbox.id, type: qbox.type};
        })]});
    }

    render() {
        const { rows } = this.state;
        return (
            <div style={{marginTop: '5px', marginRight: '5px'}}>
                <MaterialTable
                    title='QBox Types'
                    columns={this.columns}
                    data={rows}
                    options={{
                        paging: false
                    }}
                    editable={{
                        onRowUpdate: (newData, oldData) =>
                            new Promise((resolve, _reject) => {
                                setTimeout(() => {
                                    {
                                        const data = this.state.rows;
                                        const index = data.indexOf(oldData);
                                        data[index] = newData;
                                        this.setState({ rows: data }, () => resolve());
                                    }
                                    this.props.handleTypeUpdate(this.state.rows);
                                    this.renderRows();
                                    resolve();
                                }, 1000);
                        }),
                    }}
                />
            </div>
        );
    }
}
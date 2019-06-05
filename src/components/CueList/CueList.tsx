import * as React from 'react';
import MaterialTable, { Column, EditComponentProps } from 'material-table';
import TypeSelect from '../TypeSelect/TypeSelect';
import { Option } from 'react-select/lib/filters';
import { Cue } from '../../endpoints/shows/Shows';
import QBoxStatus from '../QBoxStatus/QBoxStatus';

export type Row = {
    id: number, desc: string, status?: {ack: boolean, go: boolean}, pre?: number, post?: number, type: string | string[], tableData?: Object
};

interface Props {
    cueList: Array<Cue>;
    currentCue: number;
    handleCueUpdate: (rows: Row[]) => void;
    editable: boolean;
    gone: boolean;
    acknowledged: boolean;
}

interface State {
    rows: Array<Row>;
    currentCue: number;
    cueList: Array<Cue>;
    acknowledged: boolean;
    gone: boolean;
}

export default class CueList extends React.Component<Props, State> {

    private columns: Column[] = [
        { field: 'id', title: 'ID' , editable: 'onAdd', type: 'numeric' },
        { field: 'desc', title: 'Description' },
        { field: 'status', title: 'Status', editable: 'never', render: rowData => {
            return rowData ?
                <QBoxStatus
                    acknowledged={this.state.acknowledged && rowData.tableData.id == this.state.currentCue}
                    gone={this.state.gone && rowData.tableData.id == this.state.currentCue - 1}
                /> : null;
         } },
        { field: 'type', title: 'Cue Type', editComponent:
          (props: EditComponentProps) => (<TypeSelect isMulti value={props.value} onChange={(values: Array<Option> ) => {
              let labelArr: string[] = [];
              let valueArr: string[] = [];
              values.forEach((value) => {
                  labelArr.push(value.label);
                  typeof value.value == 'string' ? valueArr.push(value.value) : Array(value.value).map((val) => valueArr.push(val));
              });
              let labels = labelArr.length > 1 ? labelArr.join(', ') : labelArr[0];
              let value = valueArr.length > 1 ? valueArr.join(', ') : valueArr[0];
              props.onChange(value);
              return labels;
          }} />) },
        { field: 'pre', title: 'Pre-wait (seconds)', type: 'numeric' },
        { field: 'post', title: 'Post-wait (seconds)', type: 'numeric'},
      ];

    constructor(props: Props) {
        super(props);
        this.state = {
            rows: [],
            currentCue: this.props.currentCue,
            cueList: this.props.cueList,
            gone: false,
            acknowledged: false
        };
    }

    componentDidUpdate(oldProps: Props) {
        let newProps: Props = this.props;
        if (oldProps.cueList !== newProps.cueList) {
          this.setState({ cueList: newProps.cueList });
        } else if (oldProps.acknowledged !== newProps.acknowledged) {
            this.setState({acknowledged: newProps.acknowledged});
        } else if (oldProps.gone !== newProps.gone) {
            this.setState({gone: newProps.gone});
        }
      }

    handleRowRender = () => {
        let newRows: Array<Row> = [];
        this.props.cueList.forEach((cue, idx) => {
            newRows[idx] = {
                    id: parseFloat(cue.id),
                    desc: cue.description,
                    pre: cue.prewait,
                    post: cue.postwait,
                    type: typeof cue.type == 'string' ? cue.type : cue.type.join(', ') || []
                };
        });
        this.setState({rows: newRows});
    }

    componentDidMount() {
        this.handleRowRender();
    }

    render() {
    const { rows, currentCue, acknowledged } = this.state;
    const { editable } = this.props;
        return (
            <div style={{marginTop: '25px', marginLeft: '5px', marginRight: '5px'}}>
                <MaterialTable
                    title='Cue List'
                    columns={this.columns}
                    data={rows}
                    options={{
                        rowStyle: rowData => ({
                            backgroundColor: ((rowData.tableData.id) === currentCue) ? (acknowledged ? '#FA7171' : '#74b9ff') : '#fff'
                        }),
                        exportButton: true
                    }}
                    localization={{
                        body: {
                            emptyDataSourceMessage: 'No cues to display for this show.',
                            editRow: {
                                deleteText: 'Are you sure you want to delete this cue?'
                            }
                        }
                    }}
                    editable={{
                        isEditable: () => editable,
                        isDeletable: () => editable,
                        onRowAdd: newData =>
                            new Promise((resolve, _reject) => {
                                setTimeout(() => {
                                    {
                                        const data = this.state.rows;
                                        data.push(newData);
                                        this.setState({ rows: data }, () => resolve());
                                    }
                                    this.props.handleCueUpdate(this.state.rows);
                                    this.handleRowRender();
                                    resolve();
                                }, 1000);
                        }),
                        onRowUpdate: (newData, oldData) =>
                            new Promise((resolve, _reject) => {
                                setTimeout(() => {
                                    {
                                        const data = this.state.rows;
                                        const index = data.indexOf(oldData);
                                        data[index] = newData;
                                        this.setState({ rows: data }, () => resolve());
                                    }
                                    this.props.handleCueUpdate(this.state.rows);
                                    this.handleRowRender();
                                    resolve();
                                }, 1000);
                        }),
                        onRowDelete: oldData =>
                            new Promise((resolve, _reject) => {
                                setTimeout(() => {
                                    {
                                        let data = this.state.rows;
                                        const index = data.indexOf(oldData);
                                        data.splice(index, 1);
                                        this.setState({ rows: data }, () => resolve());
                                    }
                                    this.props.handleCueUpdate(this.state.rows);
                                    this.handleRowRender();
                                    resolve();
                                }, 1000);
                        }),
                    }}
                />
            </div>
    );
  }
}

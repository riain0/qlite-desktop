import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { ButtonType } from '../../components/TriggerButton/TriggerButton';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import QBoxUtils from '../../network/QBoxUtils';
import Shows, { QBox, ShowDTO, Cue } from '../../endpoints/shows/Shows';
import CueList, { Row } from '../../components/CueList/CueList';
import { store } from '../../config';
// tslint:disable-next-line: no-require-imports
import moment = require('moment');
import QBoxObjectsArray from '../../components/QBoxObjectsArray/QBoxObjectsArray';
import SaveModal from '../../components/SaveModal/SaveModal';
import ModeSwitchArray from '../../components/ModeSwitchArray/ModeSwitchArray';
import TriggerButtonArray from '../../components/TriggerButtonArray/TriggerButtonArray';
const electron = (window as any).require('electron');
const ipcRenderer = electron.ipcRenderer;
import Timeout from 'smart-timeout';
import QBoxTypeSet from '../../components/QBoxTypeSet/QBoxTypeSet';

interface State {
    cueList: any;
    name: string;
    owner: string;
    lastUpdated: string;
    qboxes: Array<QBox>;
    showRedirectModal: boolean;
    redirectOptions: {
        path: string;
        state?: Object;
    } | any;
    runMode: boolean;
    autoRun: boolean;
    runEdit: boolean;
    gone: boolean;
    acknowledged: boolean;
    currentCue: number;
    autoSave: any;
    savingShow: boolean;
    acking: boolean;
    currentCueType: string | string[];
}

class Show extends React.Component<RouteComponentProps, State> {

    private qboxUtils: QBoxUtils = new QBoxUtils();
    private show: Shows = new Shows();
    private autoSaveInterval: number;

    constructor(props: RouteComponentProps) {
        super(props);
        this.state = {
            cueList: this.props.location && this.props.location.state.cueList || [],
            name: this.props.location &&  this.props.location.state.name || '',
            owner: this.props.location &&  this.props.location.state.owner || '',
            lastUpdated: this.props.location &&  this.props.location.state.lastUpdated || '',
            qboxes: this.props.location &&  this.props.location.state.qboxes || [],
            showRedirectModal: false,
            redirectOptions: null,
            runMode: false,
            autoRun: false,
            runEdit: false,
            gone: false,
            acknowledged: false,
            currentCue: 0,
            autoSave: store.get('checked'),
            savingShow: false,
            acking: false,
            currentCueType: []
        };
    }

    handleRedirectDialog = (path: string, state?: Object) => {
        const { showRedirectModal } = this.state;
        this.setState({ showRedirectModal: !showRedirectModal, redirectOptions: { path, state } });
    }

    handleRedirect = (): void => {
        const { redirectOptions } = this.state;
        this.props.history.push(redirectOptions.path, redirectOptions.state);
    }

    handleShowSave = (): void => {
        let showDto: ShowDTO = {
            cues: this.state.cueList,
            id: this.state.name,
            lastUpdated: moment().format('YYYY-MM-DD'),
            name: this.state.name,
            owner: this.state.owner,
            qboxes: this.state.qboxes
        };
        this.setState({ savingShow: true });
        setTimeout(() => {
            this.setState({ savingShow: false });
        }, 1000);
        this.show.saveShow(showDto);
    }

    componentDidMount = () => {
        ipcRenderer.on('saveShow', (_event: any, _route: any) => {
            this.handleShowSave();
        });
        ipcRenderer.on('toggleRunMode', (_event: any, _route: any) => {
            this.setState({ runMode: !this.state.runMode });
        });
        ipcRenderer.on('go', (_event: any, _route: any) => {
            this.handleGo(this.getCurrentCue().type);
        });
        ipcRenderer.on('ack', (_event: any, _route: any) => {
            this.handleAck(this.getCurrentCue().type);
        });
        ipcRenderer.on('toggleEditRunMode', (_event: any, _route: any) => {
            this.setState({ runEdit: !this.state.runEdit });
        });
        ipcRenderer.on('toggleAutoRunMode', (_event: any, _route: any) => {
            this.setState({ autoRun: !this.state.autoRun });
        });
        ipcRenderer.on('openShow', (_event: any, _route: any) => {
            this.handleRedirectDialog('/');
        });
        ipcRenderer.on('newShow', (_event: any, _route: any) => {
            this.handleRedirectDialog('/', { create: true });
        });
        this.initialiseQBoxes();
        this.handleAutoSave();
    }

    componentWillUnmount = () => {
        clearInterval(this.autoSaveInterval);
    }

    handleAutoSave = () => {
        const { autoSave } = this.state;
        if (autoSave) {
            this.autoSaveInterval = setInterval(() => {
                this.handleShowSave();
            }, 300000);
        }
    }

    handleCueUpdate = (rows: Row[]): void => {
        let newCueList: Cue[] = [];
        rows.forEach((row: Row) => {
            let types: string[] = [];
            if (typeof row.type === 'string') {
                if (row.type.includes(',')) {
                    types = row.type.split(',');
                } else { types = [ row.type ]; }
            } else {
                types = row.type.map((str) => str.trim());
            }
            let cueListElem: Cue = { id: row.id.toString(), description: row.desc, prewait: row.pre, postwait: row.post, type: types };
            newCueList.push(cueListElem);
        });
        this.setState({ cueList: newCueList });
    }

    isRunMode(): boolean {
        return this.state.runMode;
    }

    getQBoxesWithType(type: string): Array<QBox> {
        const { qboxes } = this.state;
        let qboxesWithType: Array<QBox> = [];
        qboxes.forEach((qbox) => {
            if (qbox.type == type) {
                qboxesWithType.push(qbox);
            }
        });
        return qboxesWithType;
    }

    getQBoxesWithTypes(types: string[]): Array<QBox> {
        const { qboxes } = this.state;
        let qboxesWithTypes: Array<QBox> = [];
        qboxes.forEach((qbox) => {
            if (types.includes(qbox.type)) {
                qboxesWithTypes.push(qbox);
            }
        });
        console.log(qboxesWithTypes);
        return qboxesWithTypes;
    }

    initialiseQBoxes(): void {
        const { qboxes } = this.state;
        qboxes.forEach((qbox) => {
            this.qboxUtils.assignQBox(qbox.ipAddress);
        });
    }

    getCurrentCue = (): any => {
        let { cueList, currentCue } = this.state;
        return cueList[ currentCue ];
    }

    getNextCue = (): Cue => {
        Timeout.set(() => this.setState({gone: false, acknowledged: false}), 2000);
        let { cueList, currentCue } = this.state;
        if (currentCue < cueList.length - 1) {
            this.setState({ currentCue: currentCue + 1 });
            return cueList[ this.state.currentCue ];
        } else {
            this.setState({ currentCue: 0, autoRun: false });
            return cueList[ 0 ];
        }
    }

    goAfterTimeout = (type: string | string[]): void => {
        if (typeof type == 'string') {
            let qboxes = this.getQBoxesWithType(type);
            qboxes.forEach((qbox) => {
                this.qboxUtils.triggerGo(qbox.ipAddress);
            });
        } else {
            let types = type.map((t) => t.trim());
            let qboxes = this.getQBoxesWithTypes(types);
            qboxes.forEach((qbox) => {
                this.qboxUtils.triggerGo(qbox.ipAddress);
            });
        }
    }

    handleGo = (type: string | string[]): void => {
        let prewait = parseInt(this.getCurrentCue().prewait);
        let postwait = parseInt(this.getCurrentCue().postwait);
        this.setState({currentCueType: type});
        if (this.isRunMode()) {
            let delayPre = () => this.goAfterTimeout(type);
            let delayPost = () => {
                this.getNextCue();
                if (this.state.autoRun) { this.handleGo(this.getCurrentCue().type); }
            };
            Promise.all([Timeout.set(delayPre, prewait * 1000), Timeout.set(delayPost, (postwait + prewait) * 1000)])
                .then(() => { this.setState({gone: true}); });
        }
    }

    handleAck = (type: string | string[]): void => {
        if (this.isRunMode()) {
            this.setState({currentCueType: type, acking: true});
            if (typeof type == 'string') {
                let qboxes = this.getQBoxesWithType(type);
                let promises = [...qboxes.map((qbox) => {
                    return this.qboxUtils.triggerAck(qbox.ipAddress);
                })];
                Promise.all(promises).then(() => {
                    this.setState({acknowledged: true, acking: false});
                });
            } else {
                let types = type.map((t) => t.trim());
                let qboxes = this.getQBoxesWithTypes(types);
                let promises = [...qboxes.map((qbox) => {
                    return this.qboxUtils.triggerAck(qbox.ipAddress);
                })];
                Promise.all(promises).then(() => {
                    this.setState({acknowledged: true, acking: false});
                });
            }
        }
    }

    handleBack = (): void => {
        let { cueList, currentCue } = this.state;
        if (cueList[ currentCue - 1 ]) {
            this.setState({ currentCue: currentCue - 1 });
        }
    }

    handleStep = (): void => {
        let { cueList, currentCue } = this.state;
        if (cueList[ currentCue + 1 ]) {
            this.setState({ currentCue: currentCue + 2 });
        } else {
            this.setState({ currentCue: 0 });
        }
    }

    handleTypeUpdate = (rows: Array<{id: string, type: string, tableData: any}>): void => {
        let newQBoxes = this.state.qboxes;
        newQBoxes.forEach((qbox) => {
            rows.forEach((row) => {
                if (row.id == qbox.id) {
                    qbox.type = row.type;
                }
            });
        });
        this.setState({qboxes: newQBoxes});
        this.handleShowSave();
    }

    render = (): JSX.Element => {
        const { showRedirectModal, runMode, autoRun, runEdit, currentCue, qboxes, currentCueType, acking, gone } = this.state;
        return (
            <div>
                <div style={ { color: '#fff', display: 'flex', position: 'relative' } }>
                    <div className={ !runMode ? 'gray' : 'triggerBtn' }>
                        <TriggerButtonArray
                            options={
                                [
                                    {
                                        onClick: () => this.handleGo(this.getCurrentCue().type),
                                        type: ButtonType.Go,
                                        disabled: !runMode
                                    },
                                    {
                                        onClick: () => this.handleAck(this.getCurrentCue().type),
                                        type: ButtonType.Ack,
                                        disabled: !runMode
                                    }
                                ]
                            }
                        />
                    </div>
                    <div className={ !runMode ? 'gray' : 'triggerBtn' } >
                        <TriggerButtonArray
                            options={
                                [
                                    {
                                        onClick: () => this.handleBack(),
                                        type: ButtonType.Back,
                                        disabled: !runMode
                                    },
                                    {
                                        onClick: () => this.handleStep(),
                                        type: ButtonType.Step,
                                        disabled: !runMode
                                    }
                                ]
                            }
                        />
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-around'}}>
                        <div style={{marginLeft: '35px', marginRight: '35px'}}>
                            <FormControl style={ { marginLeft: '25px' } }>
                                <FormLabel style={ { marginTop: '5px', textAlign: 'center' } }>Options</FormLabel>
                                <FormGroup>
                                    <ModeSwitchArray options={
                                        [
                                            {
                                                label: 'Toggle Run Mode',
                                                onClick: () => this.setState({ runMode: !runMode }),
                                                value: 'run',
                                                enabled: runMode
                                            },
                                            {
                                                label: 'Toggle Auto-Run Mode',
                                                onClick: () => this.setState({ autoRun: !autoRun }),
                                                value: 'auto',
                                                enabled: autoRun
                                            },
                                            {
                                                label: 'CueList Editable in Run Mode',
                                                onClick: () => this.setState({ runEdit: !runEdit }),
                                                value: 'edit',
                                                enabled: runEdit
                                            }
                                        ]
                                    }
                                    />
                                </FormGroup>
                            </FormControl>
                        </div>
                        <div style={{marginLeft: '35px', marginRight: '35px'}}>
                            <QBoxObjectsArray
                                options={[...qboxes.map((qbox) =>
                                    ({
                                        id: qbox.id,
                                        ack: acking &&
                                            (currentCueType == qbox.type ||
                                            typeof currentCueType !==  'string' && currentCueType.map((typ) => typ.trim()).includes(qbox.type)),
                                        go: gone && (currentCueType == qbox.type ||
                                            typeof currentCueType !==  'string' && currentCueType.map((typ) => typ.trim()).includes(qbox.type))
                                    }))
                                ]}
                            />
                        </div>
                        <div style={{marginLeft: '35px', marginRight: '35px'}}>
                            <QBoxTypeSet qboxes={this.state.qboxes} handleTypeUpdate={this.handleTypeUpdate} />
                        </div>
                        <div style={ { position: 'absolute', right: '0', marginTop: '5px', marginRight: '30px' } }>
                            { this.state.savingShow ? (
                                <div>
                                    Show Saved!
                                </div>
                            ) : null }
                        </div>
                    </div>
                    { showRedirectModal ?
                        (<SaveModal
                            showRedirectModal={ showRedirectModal }
                            handleRedirect={ () => this.handleRedirect() }
                            setState={ () => this.setState({ showRedirectModal: false }) } />
                        ) : null }
                </div>
                <div>
                    <CueList
                        cueList={ this.state.cueList }
                        currentCue={ currentCue }
                        handleCueUpdate={ this.handleCueUpdate }
                        key={ currentCue }
                        editable={!runMode || runEdit}
                        gone={this.state.gone}
                        acknowledged={this.state.acknowledged}
                    />
                </div>
            </div>
        );
    }
}

export default withRouter(Show);
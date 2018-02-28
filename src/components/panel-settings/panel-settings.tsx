import * as React from 'react';
import * as classNames from 'classnames';
import { PanelObject } from '../../api/panel-object';
import './_panel-settings.scss';

interface Props {
    panel: PanelObject;
    saveSettings: (formValues: any) => void;
    deletePanel: () => void;
    close: () => void;
}

interface State {
    allowDelete: boolean;
    hasChanges: boolean;
    form: {
        label: string,
        cc: string
    }
}

const ALLOW_DELETE_TIME = 5000;
let timer;

export default class PanelSettingsComponent extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            allowDelete: false,
            hasChanges: false,
            form: {
                label: this.props.panel && this.props.panel.label || '',
                cc: this.props.panel && this.props.panel.cc !== null && this.props.panel.cc >= 0 ? this.props.panel.cc.toString() : ''
            }
        };
        
        this.saveChanges = this.saveChanges.bind(this);
        this.deletePanel = this.deletePanel.bind(this);
    }

    componentWillMount() {
        clearTimeout(timer);
    }

    saveChanges(event) {
        event.preventDefault();
        const { saveSettings } = this.props;
        const { hasChanges, form } = this.state;
        if (!hasChanges) return;
        saveSettings(form);
        this.setState({ hasChanges: false });
        return false;
    }

    deletePanel(event) {
        event.preventDefault();
        if (!this.state.allowDelete) {
            this.setState({ allowDelete: true });
            timer = setTimeout(() => {
                this.setState({ allowDelete: false });
                clearTimeout(timer);
            }, ALLOW_DELETE_TIME);
            return;
        }
        clearTimeout(timer);
        this.props.deletePanel();
    }

    setFormValue(prop: string, value: string) {
        this.setState({
            hasChanges: true,
            form: {
                ...this.state.form, 
                [prop]: value 
            }
        });
    }

    render() {
        const { panel, close } = this.props;
        const { form, allowDelete, hasChanges } = this.state;
        
        return (
            <form onSubmit={this.saveChanges} className="form panel-settings">
                <h2>Panel settings for {panel && panel.label}</h2>
                <div className="form-group">
                    <label>Panel name</label>
                    <input type="text" 
                        className="panel__label--input"
                        name="label"
                        value={form.label} 
                        onChange={event => this.setFormValue('label', event.target.value)} />
                </div>
                <div className="form-group">
                    <label>Activate panel using CC</label>
                    <input type="number"
                        name="controlChange"
                        value={form.cc} 
                        min="0"
                        max="127"
                        onChange={event => this.setFormValue('cc', event.target.value)} />
                </div>
                <div className="actions">
                    <button type="button" 
                        className={classNames('btn btn--danger', { 'btn--danger-flashing': allowDelete })} 
                        onClick={this.deletePanel}>Delete</button>
                    <button type="button" className="btn" onClick={close}>Cancel</button>
                    <input type="submit" className="btn btn-primary" value="Save" disabled={!hasChanges} />
                </div>
            </form>
        );
    }
}
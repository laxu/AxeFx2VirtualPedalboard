import * as React from 'react';
import * as classNames from 'classnames';
import { BoardObject } from '../../api/board-object';
import './_board-settings.scss';

export interface Props {
    board: BoardObject;
    saveSettings: (formValues: any) => void;
    deleteBoard: () => void;
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

export default class BoardSettingsComponent extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            allowDelete: false,
            hasChanges: false,
            form: {
                label: this.props.board && this.props.board.label || '',
                cc: this.props.board && this.props.board.cc !== null && this.props.board.cc >= 0 ? this.props.board.cc.toString() : ''
            }
        };
        
        this.saveChanges = this.saveChanges.bind(this);
        this.deleteBoard = this.deleteBoard.bind(this);
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

    deleteBoard(event) {
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
        this.props.deleteBoard();
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
        const { board, close } = this.props;
        const { form, allowDelete, hasChanges } = this.state;
        
        return (
            <form onSubmit={this.saveChanges} className="form board-settings">
                <h2>Board settings for {board && board.label}</h2>
                <div className="form-group">
                    <label>Board name</label>
                    <input type="text" 
                        className="board__label--input"
                        name="label"
                        value={form.label} 
                        onChange={event => this.setFormValue('label', event.target.value)} />
                </div>
                <div className="form-group">
                    <label>Activate board using CC</label>
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
                        onClick={this.deleteBoard}>Delete</button>
                    <button type="button" className="btn" onClick={close}>Cancel</button>
                    <input type="submit" className="btn btn-primary" value="Save" disabled={!hasChanges} />
                </div>
            </form>
        );
    }
}
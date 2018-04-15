import * as React from 'react';
import * as classNames from 'classnames';
import { BoardObject } from '../../api/board-object';
import { GroupObject, KnobMode, KnobStyle, KnobColor } from '../../api/group-object';
import { SwatchesPicker } from 'react-color';
import './_group-editor.scss';

interface Props {
    group: GroupObject;
    saveGroup: (formValues: any) => void;
    deleteGroup: () => void;
    closeModal: (hasChanges: boolean) => void;
}

interface State {
    allowDelete: boolean;
    hasChanges: boolean;
    showColorPicker: boolean;
    colorPickerField: string;
    form: GroupObject;
}

const ALLOW_DELETE_TIME = 5000;
let timer;

export default class GroupEditorComponent extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        const { group } = this.props;
        this.state = {
            allowDelete: false,
            hasChanges: false,
            showColorPicker: false,
            colorPickerField: null,
            form: {...group}
        };
        
        this.saveChanges = this.saveChanges.bind(this);
        this.deleteGroup = this.deleteGroup.bind(this);
        this.selectColor = this.selectColor.bind(this);
    }

    componentWillMount() {
        clearTimeout(timer);
    }

    saveChanges(event) {
        event.preventDefault();
        const { saveGroup } = this.props;
        const { hasChanges, form } = this.state;
        saveGroup(form);
        this.props.closeModal(hasChanges);
        return false;
    }

    deleteGroup(event) {
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
        this.props.deleteGroup();
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

    showColorPicker(field: string) {
        this.setState({
            showColorPicker: true,
            colorPickerField: field
        });
    }

    hideColorPicker() {
        this.setState({
            showColorPicker: false,
            colorPickerField: null
        });
    }

    selectColor(color) {
        const field = this.state.colorPickerField;
        this.setState({
            showColorPicker: false,
            colorPickerField: null,
            hasChanges: true,
            form: {
                ...this.state.form,
                [field]: color.hex
            }
        });
    }

    render() {
        const { group, closeModal } = this.props;
        const { form, allowDelete, hasChanges, showColorPicker, colorPickerField } = this.state;
        
        return (
            <form onSubmit={this.saveChanges} className="form group-editor">
                <h2>Group settings for {group && group.label}</h2>
                <div className="form-group">
                    <label>Group name</label>
                    <input type="text" 
                        className="group__label--input"
                        name="label"
                        value={form.label} 
                        onChange={event => this.setFormValue('label', event.target.value)} />
                </div>
                <label>Background color</label>
                <div className="form-group form-group--inline">
                    <input type="text"
                        name="bgColor"
                        value={form.bgColor} 
                        onClick={() => this.showColorPicker('bgColor')}
                        onChange={event => this.setFormValue('bgColor', event.target.value)} />
                    <div className="color-preview" 
                        style={{ backgroundColor: form.bgColor }}
                        onClick={() => this.showColorPicker('bgColor')}></div>
                </div>
                <label>Text color</label>
                <div className="form-group form-group--inline">
                    <input type="text"
                        name="textColor"
                        value={form.textColor} 
                        onClick={() => this.showColorPicker('textColor')}
                        onChange={event => this.setFormValue('textColor', event.target.value)} />
                    <div className="color-preview" 
                        style={{ backgroundColor: form.textColor }}
                        onClick={() => this.showColorPicker('textColor')}></div>
                </div>
                <div className="form-group form-group--inline">
                    <label>
                        <input type="checkbox" 
                            name="isRelative"
                            value="1"
                            checked={form.showBlockNames}
                            onChange={event => this.setFormValue('showBlockNames', form.showBlockNames ? '' : '1')} />
                            <span>Show block names</span>
                    </label>
                </div>
                <div className="form-group">
                    <label>Show value as</label>
                    <select name="showKnobs" value={form.showKnobs} onChange={event => this.setFormValue('showKnobs', event.target.value)}>
                        <option value={KnobMode.NumericOnly}>Numeric value</option>
                        <option value={KnobMode.KnobOnly}>Knob only</option>
                        <option value={KnobMode.Both}>Both</option>
                    </select>
                </div>
                {form.showKnobs !== KnobMode.NumericOnly && 
                <div className="form-group">
                    <label>Knob style</label>
                    <select name="knobStyle" value={form.knobStyle} onChange={event => this.setFormValue('knobStyle', event.target.value)}>
                        <option value={KnobStyle.RoundOutline}>Round outline</option>
                        <option value={KnobStyle.Round}>Round</option>
                        <option value={KnobStyle.ChickenHead}>Chickenhead</option>
                        <option value={KnobStyle.Hexagon}>Hexagon</option>
                    </select>
                </div>}
                {form.showKnobs !== KnobMode.NumericOnly && 
                <div className="form-group">
                    <label>Knob color</label>
                    <select name="knobColor" value={form.knobColor} onChange={event => this.setFormValue('knobColor', event.target.value)}>
                        <option value={KnobColor.Dark}>Dark</option>
                        <option value={KnobColor.Bright}>Bright</option>
                        <option value={KnobColor.Ivory}>Ivory</option>
                    </select>
                </div>}
                <div className="actions">
                    <button type="button" 
                        className={classNames('btn btn--danger', { 'btn--danger-flashing': allowDelete })} 
                        onClick={this.deleteGroup}>Delete</button>
                    <button type="button" className="btn" onClick={() => closeModal(false)}>Cancel</button>
                    <input type="submit" className="btn btn-primary" value="Save" disabled={!hasChanges} />
                </div>
                {showColorPicker && <div className="color-picker-container" onClick={() => this.hideColorPicker()}>
                    <SwatchesPicker color={form[colorPickerField]} onChange={this.selectColor}></SwatchesPicker>
                </div>}
            </form>
        );
    }
}
export enum PARAM_TYPE {
    Select = 'select',
    Switch = 'switch',
    Knob = 'knob'
};

export function getBypassState(value: number): boolean {
    return !value;
}

export const FX_PARAMS_COMMON = [
    { id: 255, label: 'Engage / bypass block', type: PARAM_TYPE.Switch, valueFunc: getBypassState }
];
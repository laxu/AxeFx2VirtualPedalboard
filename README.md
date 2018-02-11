# AxeFx2 MIDI Middleman
Middleman app that converts MIDI controller CCs to AxeFx 2 compatible SysEx messages for controlling parameters.

## Motivation
Axe-Fx 2 has a pretty archaic front panel user interface that is awkward to operate. 
The Axe-Edit editor is great but requires turning virtual knobs with a mouse.
Axe-Fx 2 only allows attaching modifiers to a very limited set of its controls and the number of modifiers is also very limited.

This project allows me to use a MIDI knob controller (in my case [Arturia BeatStep](https://www.arturia.com/products/hybrid-synths/beatstep/overview)) to
control any Axe-Fx 2 effects block parameter and display their values in an easy user interface.

Inspiration and concept came from PALYGAP's [MidyAX2](https://github.com/PALYGAP/MidyAX-2) project but 
I was not happy with the UI and data model of that project so I decided to try to implement this with web technologies that are more familiar to me.

## How it works

First you create a control panel. Then you add controls to the panel. 
Controls can be either knob or switch types where knob types allow changing values usually from 0-10 and switches turn things on and off.
While each panel can have (at least in theory) an infinite number of controls, too many controls in one panel might cause it to take too long to find the corresponding control when changing it from the MIDI controller, causing either dropped inputs or delays in updates.
It is recommend to use  different panels as different sets of controls. This way you could have one panel with amp and cab settings, another with your favorite effects parameters and switch between panels with a button on your MIDI controller or using the mouse.

## Features
- Map any effects block parameter on the Axe-Fx 2 to a MIDI CC. This means you can use MIDI knob controllers to alter Axe-Fx 2 parameters.
- Show desired parameter values of any effects block in a single panel.
- Switch panels with MIDI CCs.
- Easy to use UI with drag and drop rearrangeable controls.
- Responsive UI adapts to various window sizes and scales perfectly even on high resolution displays.
- Automatic detection of Axe-Fx model when correct MIDI ports have been chosen.
- Interpret MIDI CC values as either absolute (0-127) or relative (+/- current value). Relative works best for Select type params such as amp type and can be assigned per control.

## Requirements
- Web browser that supports the Web MIDI API. Currently only Chrome and Opera support it.
- Axe-Fx 2, any variant. AX8 might also work but is untested.
- MIDI controller that you can hook up to your computer via USB or thru MIDI..

## Requirements for developers
- NodeJS
- Node Package Manager (NPM)

## How to run
- Connect your Axe-Fx 2 or AX8 via USB or MIDI to your computer.
- Connect a MIDI controller to your computer via USB or MIDI.
- Clone this repo.
- Run `npm install` in cloned folder.
- Run `npm run start`.
- Open `http://localhost:8080` in your web browser.

## Block parameter data format
Each block param consists of an object containing following properties. Propeties that are using default values don't need to be defined. Listed below in `property name: type - description (default value if applicable)`
```
{
    id: number                       - Parameter ID for block, must match Axe-Fx parameter IDs
    label: string                    - Parameter label
    type: enum                       - Parameter type, get this from PARAM_TYPE enum
    range: [number, number]          - Array of [min, max] values (default [0, 10]) for parameter. Not necessary for Select type params.
    values: Array<string> | function - Only used with Select type params. Defines the value labels. Can also be a function if you need to get the values from Axe-Fx for example
    step: number                     - How much values change per step, these are always values like 0.001 etc (default 0.1)
    precision: number                - How many decimals to show (default 1)
    unit: string                     - Unit to show for parameter, e.g. "dB" or "%"
    labelGroup: string               - Label and start for a group. If you want to say have a group called "Advanced", add this to the first parameter in the group. Parameters after it will be in the same group
}
```
Step property is not that intuitive as it relates to the value received from Axe-Fx so you might need to mess with it to get the correct stepping for control changes.

## Adding block parameter data
Add a file that matches the block name to the `src/api/fx-block-data` folder and define the parameters there. Import and add the params in `index.ts` constant `FX_PARAMS` in the same folder. The property in FX_PARAMS must match block name.
The mapping for block names can be found in `src/api/fx-block-data/fx-block-data.ts` under the `FX_BLOCK_TYPES` constant. 

## FAQ
#### The relative values don't work!
MIDI controller must be able to send relative values (< 64 for decrement, > 64 for increment) for relative mapping to work. For example value 63 would be decrement by 1 unit. This is translated to the value fraction needed for the parameter.
#### Values are not the same as on the Axe-Fx!
Axe-Fx 2 users values that are often more precise than is necessary so some of these are formatted to values that make more sense to the user. For example it doesn't matter if Bass in the Amp block is 5.12 vs 5.1. The exact values are still used internally, just formatted in the UI.

## Limitations
- Currently works only with one Axe-Fx.
- Supports only controlling params using one MIDI controller.
- All effects blocks are not yet implemented.
- Restarting Axe-Fx while the app is running doesn't connect it back to the app properly. If you need to restart your Axe-Fx, also restart the app.

## Development roadmap
- Add support for all effects blocks.
- Add sub groups to panels so controls can be grouped for example into "stompbox" style sets.
- Add Electron support.

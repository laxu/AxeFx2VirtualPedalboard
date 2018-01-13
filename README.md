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
While each panel can have (at least in theory) an infinite number of controls, I would recommend using different panels as different sets of controls.
This way you could have one panel with amp and cab settings, another with your favorite effects parameters and switch between panels with a button on your MIDI controller.

## Requirements
- Web browser that supports the Web MIDI API. Currently only Chrome and Opera support it.
- Axe-Fx 2 or AX8.
- MIDI controller that you can hook up to your computer via USB or thru MIDI..

## How to run
- Connect your Axe-Fx 2 or AX8 via USB to your computer.
- Connect a MIDI controller.
- Clone this repo.
- Run `npm install` in cloned folder.
- Run `npm run start`.
- Open `http://localhost:8080` in your web browser.

## Development roadmap
- Make the UI work in the browser.
- Add support for all effects blocks.
- Add sub groups to panels so controls can be grouped.
- Add support for rearranging controls.
- Add Electron support.

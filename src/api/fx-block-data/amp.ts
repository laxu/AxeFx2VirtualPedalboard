import { PARAM_TYPE } from './fx-param-common';
import { eqType } from './graphic-eq';

const ampType = [
    '59 Bassguy',
    '65 Bassguy Nrml',
    'Vibrato Verb',
    'Deluxe Verb Vib',
    'Double Verb Vib',
    'Jr Blues',
    'Class-A 15W TB',
    'Class-A 30W',
    'Class-A 30W TB',
    'Brit JM45',
    'Plexi 50W Nrml',
    'Plexi 50W Hi 1',
    '1987X Normal',
    '1987X Treble',
    'Brit 800',
    'Brit Super',
    'Hipower Normal',
    'Hipower Brillnt',
    'USA Clean',
    'USA Pre Clean',
    'USA Rhythm',
    'USA IIC+',
    'USA IIC+ Bright',
    'USA Lead',
    'USA Lead Brt',
    'Recto2 Org Vntg',
    'Recto2 Org Mdrn',
    'Recto2 Red Vntg',
    'Recto2 Red Mdrn',
    'Euro Blue',
    'Euro Red',
    'Shiver Clean',
    'Shiver Lead',
    'Euro Uber',
    'Solo 99 Clean',
    'Solo 100 Rhy',
    'Solo 100 Lead',
    'Friedman BE V1',
    'Friedman HBE V1',
    'PVH 6160 Block',
    'Mr Z Mz-38',
    'CA3+ Rhy',
    'CA3+ Lead',
    'Wrecker Rocket',
    'Corncob M50',
    'CA OD 2',
    'Fryette D60 L',
    'Fryette D60 M',
    'Brit Brown',
    'Citrus Rv50',
    'Jazz 120',
    'Energyball',
    'ODS-100 Clean',
    'ODS-100 HRM',
    'FAS Rhythm',
    'FAS Lead 1',
    'FAS Lead 2',
    'FAS Modern',
    'Das Metall',
    'Brit Pre',
    'Buttery',
    'Boutique 1',
    'Boutique 2',
    'Cameron CCV 1A',
    'Cameron CCV 2A',
    'SV Bass',
    'Tube Pre',
    'FAS Brown',
    'Big Hair',
    'Solo 99 Lead',
    'Supertweed',
    'TX Star Lead',
    'FAS Wreck',
    'Brit JVM OD1 Or',
    'Brit JVM OD2 Or',
    'FAS 6160',
    'Cali Leggy',
    'USA Lead',
    'USA Lead Brt',
    'Prince Tone',
    'Blankenship Leeds',
    '5153 100W Green',
    '5153 100W Blue',
    '5153 100W Red',
    'Solo 88 Rhythm',
    'Div/13 CJ',
    'Herbie Ch2',
    'Herbie Ch2',
    'Herbie Ch3',
    'Dirty Shirley 1',
    'Dizzy V4 Blue 2',
    'Dizzy V4 Blue 3',
    'Dizzy V4 Blue 4',
    'Suhr Badger 18',
    'Suhr Badger 30',
    'Prince Tone NR',
    'Supremo Trem',
    'Atomica Low',
    'Atomica High',
    'Deluxe Tweed',
    'Spawn Rod OD2 1',
    'Spawn Rod OD2 2',
    'Spawn Rod OD2 3',
    'Brit Silver',
    'Spawn Nitrous 2',
    'FAS Crunch',
    'Two Stone J35 1',
    'Fox ODS',
    'Hot Kitty',
    'Band Commander',
    'Super Verb Vib',
    'Vibra-King',
    'Gibtone Scout',
    'PVH 6160 LD',
    'Solo 100 Clean',
    'USA Pre LD2 Grn',
    'USA Pre LD2 Ylw',
    'CA3 Clean',
    'Fox ODS Deep',
    'Brit JVM OD1 Gn',
    'Brit JVM OD2 Gn',
    'Vibrato-Lux',
    'Brit 800 Mod',
    'Nuclear Tone',
    'Bludojai Clean',
    'Bludojai LD Pab',
    'Plexi 100W High',
    'Plexi 100W Nrml',
    'Ruby Rocket',
    'AC-20 EF86 B',
    'Prince Tone Rev',
    'Comet Concourse',
    'FAS Modern II',
    'CA Triptik Mdrn',
    'CA Triptik Clsc',
    'CA Triptik Cln',
    'Thordendal Vint',
    'Thordendal Mdrn',
    'ODS-100 HRM Mid',
    'Euro Blue Mdrn',
    'Euro Red Mdrn',
    'Plexi 50W Jump',
    'AC-20 EF86 T',
    'Comet 60',
    'Hipower Jumped',
    'Plexi 100W Jump',
    'Brit JM45 Jump',
    '1987X Jump',
    'Recto1 Org Vntg',
    'Recto1 Red',
    'ODS-100 Ford 1',
    'Bogfish Strato',
    'Bogfish Brown',
    '5F1 Tweed',
    'Wrecker Express',
    'Two Stone J35 2',
    'ODS-100 Ford 2',
    'Mr Z Mz-8',
    'Car Roamer',
    'USA Sub Blues',
    'Wrecker Liverpool',
    'Citrus Terrier',
    'Citrus A30 Cln',
    'Citrus A30 Drty',
    'Div/13 FT37 Lo',
    'Div/13 FT37 Hi',
    'Matchbox D-30',
    'FAS Class-A',
    'USA Bass 400 1',
    'USA Bass 400 2',
    'Citrus Bass 200',
    'FAS Bass',
    'Tremolo Lux',
    'FAS Brootalz',
    'Recto1 Org Mdrn',
    'Angle Severe 1',
    'Angle Severe 2',
    'UAS Pre Ld2 Red',
    'UAS Pre Ld1 Red',
    'TX Star Clean',
    'AC-20 12AX7 T',
    'Vibrato Verb AA',
    'Vibrato Verb AB',
    'CA Tucana Lead',
    'Jr Blues Fat',
    'Solo 88 Lead',
    'Brit AFS100 1',
    'Brit AFS100 2',
    'Class-A 30W Hot',
    'Dizzy V4 Slvr 2',
    'Dizzy V4 Slvr 3',
    'Dizzy V4 Slvr 4',
    '1959 SLP Normal',
    '1959 SLP Treble',
    '1959 SLP Jump',
    'FAS Modern III',
    'ODS-100 Ford Md',
    'Mr Z Hwy 66',
    '6G4 Super',
    '6G12 Concert',
    '65 Bassguy Bass',
    'Vibra-King Fat',
    'Spawn Rod OD1 1',
    'Spawn Rod OD1 2',
    'Spawn Rod OD1 3',
    'CA Tucana Cln',
    'Brit JVM OD1 Rd',
    'Brit JVM OD2 Rd',
    'Cameron CCV 1B',
    'Cameron CCV 2B',
    'Cameron CCV 2C',
    'Cameron CCV 2D',
    'Friedman Sm Box',
    '5153 50W Blue',
    'Div/13 CJ Boost',
    'USA IIC+ Deep',
    'USA IIC+ Brt Dp',
    '5F8 Tweed',
    'Double Verb SF',
    'Vibrato Verb CS',
    'JMPre 1 Od1',
    'JMPre 1 Od2',
    'JMPre 1 Od1 Bs',
    'JMPre 1 Od2 Bs',
    'Deluxe Verb Nrm',
    'Double Verb Nrm',
    'Super Verb Nrm',
    'Bludojai LD 2',
    'Plexi 50W 6550',
    'FAS Hot Rod',
    'Pvh 6160 Rhy B',
    'Pvh 6160 Rhy',
    'Solo 88 Clean',
    'Class-A 30W Brt',
    'Plexi 50W Hi 2',
    'Spawn Nitrous 1',
    'Ruby Rocket Brt',
    'AC-20 12AX7 B',
    'Plexi 100W 1970',
    'JS410 Lead Or',
    'JS410 Lead Rd',
    'JS410 Crunch Or',
    'JS410 Crunch Rd',
    'Friedman BE V2',
    'Friedman HBE V2',
    'Dweezil\'s B-Man',
    'Friedman BE',
    'Friedman HBE',
    'USA IIC++',
    'Legato 100',
    'Capt Hook 2B',
    'Capt Hook 3B',
    'Capt Hook 2A',
    'Capt Hook 3A',
    'Capt Hook 1A',
    'Capt Hook 1B',
    'Dirty Shirley 2',
    'Brit 800 #34',
    '5F1 Tweed EC'
];

const toneStack = [
    'Active',
    'Default',
    'Brownface',
    'Blackface',
    'Bassguy',
    'Top Boost',
    'Plexi',
    'Boutiqu',
    'Hi Power',
    'USA Normal',
    'USA Fat',
    'Recto1 Org',
    'Recto1 Red',
    'Skyline',
    'German',
    'JR Blues',
    'Wrecker 1',
    'Neutral',
    'CA3+SE',
    'Fryette D60',
    'MR Z 38 SR',
    'Euro Uber',
    'PVH 6160',
    'Solo 100',
    'Corncob',
    'XTC',
    'CarolAnn',
    'Citrus',
    'Brit JM45',
    'USA Rhy',
    'Recto2 Org',
    'Rect2 Red',
    'Shiver Cln',
    'Cameron',
    'Brit JVM OD1',
    'Brit JVM OD2',
    '5153 Green',
    '5153 Blue',
    '5153 Red',
    'Brit Super',
    'Div13 CJ',
    'Badger 18',
    'Atomica',
    'Spawn',
    'Badger 30',
    'Brit Silver',
    'Super Verb',
    'Hot Kitty',
    'Vibrato-King',
    'Gibtone Scout',
    'CA3+SE Clean',
    'BF Fixed Mid',
    'German V4',
    'Vibrato-Lux',
    'Dirty Shirley',
    'Plexi 100W',
    'Ruby Rocket Brt',
    'Concourse',
    'Triptik LD',
    'Triptik Cln',
    'Jazz 120',
    'Bogfish',
    'Wrecker 2',
    'Skyline Deep',
    'USA Sub Blues',
    'Wrecker Lvrpool',
    'Citrus A30 Cln',
    'Citrus A30 Drt',
    'Car Roamer',
    'USA Bass',
    'Citrus Bass',
    'Studio',
    'Brit 800',
    'Recto1 Org Mdrn',
    'Angle Severe 1',
    'Angle Severe 2',
    'USA PRE LD1 Red',
    'Recto Org Brt',
    'Recto Red Brt',
    'Vibroverb AA',
    'PVH 6160 II LD',
    'Rumble HRM',
    'MR Z Hwy 66',
    'Super 6G4',
    '65 Bassman Bass',
    'Friedman',
    'Band-Commander',
    'USA Pre Clean',
    'Tucana Clean',
    'Friedman Sm Box',
    'TX Star',
    'USA IIC+',
    'Thordendal',
    'Solo 99',
    'Bludojai',
    'Herbie',
    'PVH 6160 II Rhy',
    'Solo 88 Clean',
    'JS410',
    'JS410 Midshift',
    'Ruby Rocket',
    'USA IIC++',
    'Legato 100',
    'Hook Edge',
    'Hook No Edge',
    'Hook Clean 1',
    'Hook Clean 2',
    'Solo 88'
];

const preampTubes = [
    '12AX7A SYL',
    'ECC83',
    '7025',
    '12AX7A JJ',
    'ECC803S',
    'EF86',
    '12AX7A RCA',
    '12AX7A',
    '12AX7B'
];

const powerTubes = [
    'Ideal tetrode',
    'Ideal pentode',
    'EL34/6CA7',
    'EL84/6BQ5',
    '6L6/5881',
    '6V6',
    'KT66',
    'KT88',
    '6550',
    '6973',
    '6AQ5',
    '300B'
];

const masterVolLocation = [
    'Pre-PI',
    'Post-PI',
    'Pre-triode'
];

const saturationSwitch = [
    'Off',
    'Auth',
    'Ideal'
];

const powerType = ['AC', 'DC'];
const charType = [
    'Shelving',
    'Peaking',
    'Dynamic'
];
const toneLocation = ['Pre', 'Post', 'Mid', 'End'];
const outCompType = ['Output', 'Feedback'];
const CFCompType = ['Authentic', 'Ideal'];
const eqLocation = ['Post P.A', 'Pre P.A'];

const inputSelect = [
    'Left',
    'Right',
    'Sum L+R'
];

const amp = [
    { id: 999, label: 'Engage/bypass block', type: PARAM_TYPE.Switch },
    { id: 0, label: 'Type', type: PARAM_TYPE.Select, step: 1, range: [0, ampType.length - 1], values: ampType, labelGroup: 'Basic' },
    { id: 1, label: 'Input drive', type: PARAM_TYPE.Knob },
    { id: 74, label: 'Overdrive', type: PARAM_TYPE.Knob },
    { id: 2, label: 'Bass', type: PARAM_TYPE.Knob },
    { id: 3, label: 'Middle', type: PARAM_TYPE.Knob },
    { id: 4, label: 'Treble', type: PARAM_TYPE.Knob },
    { id: 20, label: 'Presence', type: PARAM_TYPE.Knob },
    { id: 5, label: 'Master volume', type: PARAM_TYPE.Knob },
    { id: 21, label: 'Level', type: PARAM_TYPE.Knob, range: [-80, 20], step: 1, precision: 1, unit: 'dB' },
    { id: 22, label: 'Balance', type: PARAM_TYPE.Knob, range: [-100, 100], step: 1, precision: 1 },
    { id: 16, label: 'Depth', type: PARAM_TYPE.Knob },
    { id: 6, label: 'Preamp low cut', type: PARAM_TYPE.Knob, labelGroup: 'Advanced' },
    { id: 7, label: 'High cut freq', type: PARAM_TYPE.Knob },
    { id: 8, label: 'Tone freq', type: PARAM_TYPE.Knob },
    { id: 9, label: 'X-former grind', type: PARAM_TYPE.Knob },
    { id: 10, label: 'Bright cap', type: PARAM_TYPE.Knob },
    { id: 12, label: 'X-former low freq', type: PARAM_TYPE.Knob },
    { id: 13, label: 'X-former hi freq', type: PARAM_TYPE.Knob },
    { id: 14, label: 'Tone location', type: PARAM_TYPE.Select, step: 1, values: toneLocation },
    { id: 15, label: 'Input select', type: PARAM_TYPE.Select, step: 1, values: inputSelect },
    { id: 19, label: 'Supply sag', type: PARAM_TYPE.Knob },
    { id: 23, label: 'Bypass mode', type: PARAM_TYPE.Select, values: inputSelect, step: 1 },
    { id: 24, label: 'Negative feedback', type: PARAM_TYPE.Knob },
    { id: 25, label: 'Presence freq', type: PARAM_TYPE.Knob },
    { id: 26, label: 'Low res freq', type: PARAM_TYPE.Knob },
    { id: 27, label: 'Low res', type: PARAM_TYPE.Knob },
    { id: 29, label: 'Depth freq', type: PARAM_TYPE.Knob },
    { id: 31, label: 'MV cap', type: PARAM_TYPE.Knob },
    { id: 33, label: 'Harmonics', type: PARAM_TYPE.Knob },
    { id: 34, label: 'Tone stack', type: PARAM_TYPE.Select, step: 1, values: toneStack },
    { id: 35, label: 'B+ time const', type: PARAM_TYPE.Knob },
    { id: 36, label: 'Tube grid bias', type: PARAM_TYPE.Knob },
    { id: 39, label: 'Bright switch', type: PARAM_TYPE.Switch },
    { id: 40, label: 'Boost', type: PARAM_TYPE.Switch },
    { id: 41, label: 'Low res Q', type: PARAM_TYPE.Knob },
    { id: 42, label: 'Preamp bias', type: PARAM_TYPE.Knob },
    { id: 43, label: 'Hi freq', type: PARAM_TYPE.Knob },
    { id: 44, label: 'Hi resonance', type: PARAM_TYPE.Knob },
    { id: 45, label: 'Cut', type: PARAM_TYPE.Switch },
    { id: 46, label: 'X-former drive', type: PARAM_TYPE.Knob },
    { id: 47, label: 'Input trim', type: PARAM_TYPE.Knob },
    { id: 48, label: 'Preamp hardness', type: PARAM_TYPE.Knob },
    { id: 49, label: 'MV location', type: PARAM_TYPE.Select, step: 1, values: masterVolLocation },
    { id: 50, label: 'Speaker drive', type: PARAM_TYPE.Knob },
    { id: 51, label: 'X-former match', type: PARAM_TYPE.Knob },
    { id: 54, label: 'Sat switch', type: PARAM_TYPE.Select, step: 1, values: saturationSwitch },
    { id: 55, label: 'GraphicEQ band 1', type: PARAM_TYPE.Knob, labelGroup: 'Graphic EQ' },
    { id: 56, label: 'GraphicEQ band 2', type: PARAM_TYPE.Knob },
    { id: 57, label: 'GraphicEQ band 3', type: PARAM_TYPE.Knob },
    { id: 58, label: 'GraphicEQ band 4', type: PARAM_TYPE.Knob },
    { id: 59, label: 'GraphicEQ band 5', type: PARAM_TYPE.Knob },
    { id: 60, label: 'GraphicEQ band 6', type: PARAM_TYPE.Knob },
    { id: 61, label: 'GraphicEQ band 7', type: PARAM_TYPE.Knob },
    { id: 62, label: 'GraphicEQ band 8', type: PARAM_TYPE.Knob },
    { id: 63, label: 'Bias excursion', type: PARAM_TYPE.Knob, labelGroup: 'Advanced 2' },
    { id: 66, label: 'Triode 2 plate freq', type: PARAM_TYPE.Knob },
    { id: 67, label: 'Triode 1 plate freq', type: PARAM_TYPE.Knob },
    { id: 68, label: 'Poweramp tube', type: PARAM_TYPE.Select, step: 1, values: powerTubes },
    { id: 69, label: 'Preamp tubes', type: PARAM_TYPE.Select, step: 1, values: preampTubes },
    { id: 70, label: 'Out comp clarity', type: PARAM_TYPE.Knob },
    { id: 71, label: 'Character Q', type: PARAM_TYPE.Knob },
    { id: 72, label: 'Character freq', type: PARAM_TYPE.Knob },
    { id: 73, label: 'Character amount', type: PARAM_TYPE.Knob },
    { id: 75, label: 'Out comp amount', type: PARAM_TYPE.Knob },
    { id: 76, label: 'Out comp threshold', type: PARAM_TYPE.Knob },
    { id: 77, label: 'Master trim', type: PARAM_TYPE.Knob },
    { id: 78, label: 'Fat', type: PARAM_TYPE.Switch },
    { id: 79, label: 'Definition', type: PARAM_TYPE.Knob },
    { id: 80, label: 'Preamp CF compress', type: PARAM_TYPE.Knob },
    { id: 81, label: 'Preamp CF time', type: PARAM_TYPE.Knob },
    { id: 84, label: 'Dynamic presence', type: PARAM_TYPE.Knob },
    { id: 85, label: 'Dynamic depth', type: PARAM_TYPE.Knob },
    { id: 86, label: 'Power type', type: PARAM_TYPE.Select, step: 1, values: powerType },
    { id: 87, label: 'AC line freq', type: PARAM_TYPE.Knob },
    { id: 88, label: 'Poweramp hardness', type: PARAM_TYPE.Knob },
    { id: 91, label: 'Preamp CF ratio', type: PARAM_TYPE.Knob },
    { id: 92, label: 'EQ type', type: PARAM_TYPE.Select, step: 1, values: eqType },
    { id: 93, label: 'Cathode resist', type: PARAM_TYPE.Knob },
    { id: 96, label: 'Preamp sag', type: PARAM_TYPE.Switch },
    { id: 97, label: 'Bright', type: PARAM_TYPE.Knob },
    { id: 98, label: 'Poweramp bias', type: PARAM_TYPE.Knob },
    { id: 99, label: 'Preamp dynamics', type: PARAM_TYPE.Knob },
    { id: 100, label: 'Hi freq slope', type: PARAM_TYPE.Knob },
    { id: 101, label: 'Variac', type: PARAM_TYPE.Knob },
    { id: 102, label: 'Char type', type: PARAM_TYPE.Select, step: 1, values: charType },
    { id: 104, label: 'Presence shift', type: PARAM_TYPE.Switch },
    { id: 105, label: 'Saturation drive', type: PARAM_TYPE.Knob },
    { id: 106, label: 'Crunch', type: PARAM_TYPE.Knob },
    { id: 109, label: 'Out comp type', type: PARAM_TYPE.Select, step: 1, values: outCompType },
    { id: 110, label: 'EQ location', type: PARAM_TYPE.Select, step: 1, values: eqLocation },
    { id: 111, label: 'CF comp type', type: PARAM_TYPE.Select, step: 1, values: CFCompType },
    { id: 113, label: 'Preamp CF hardness', type: PARAM_TYPE.Knob },
    { id: 114, label: 'PI bias shift', type: PARAM_TYPE.Knob },
    { id: 115, label: 'Motor drive', type: PARAM_TYPE.Knob },
    { id: 116, label: 'Motor time const', type: PARAM_TYPE.Knob },
];

export default amp;
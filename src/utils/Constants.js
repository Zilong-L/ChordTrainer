
const CHORD_TYPES = ['M', 'm', 'o','M7','m7','7'];

const defaultDegreeChordTypes = [
  {
    degree: 'I',
    distance: 0, // 添加距离
    chordTypes: ['M']
  },
  {
    degree: 'IIb',
    distance: 1, // 添加距离
    chordTypes: []
  },
  {
    degree: 'II',
    distance: 2, // 添加距离
    chordTypes: ['m']
  },
  {
    degree: 'IIIb',
    distance: 3, // 添加距离
    chordTypes: []
  },
  {
    degree: 'III',
    distance: 4, // 添加距离
    chordTypes: ['m']
  },
  {
    degree: 'IV',
    distance: 5, // 添加距离
    chordTypes: ['M']
  },
  {
    degree: 'Vb',
    distance: 6, // 添加距离
    chordTypes: []
  },
  {
    degree: 'V',
    distance: 7, // 添加距离
    chordTypes: ['M']
  },
  {
    degree: 'VIb',
    distance: 8, // 添加距离
    chordTypes: []
  },
  {
    degree: 'VI',
    distance: 9, // 添加距离
    chordTypes: ['m']
  },
  {
    degree: 'VIIb',
    distance: 10, // 添加距离
    chordTypes: []
  },
  {
    degree: 'VII',
    distance: 11, // 添加距离
    chordTypes: ['o']
  }
]
const chordPreset = {
  'major':[{
    degree: 'I',
    chordType: 'M'
  },
  {
    degree: 'II',
    chordType: 'm'
  },
  {
    degree: 'III',
    chordType: 'm'
  },
  {
    degree: 'IV',
    chordType: 'M'
  },
  {
    degree: 'V',
    chordType: 'M'
  },
  {
    degree: 'VI',
    chordType: 'm'
  },
  {
    degree: 'VII',
    chordType: 'o'
  }],
  'minor':[{
    degree: 'I',
    chordType: 'm'
  },
  {
    degree: 'II',
    chordType: 'o'
  },
  {
    degree: 'III',
    chordType: 'M'
  },
  {
    degree: 'IV',
    chordType: 'm'
  },
  {
    degree: 'V',
    chordType: 'm'
  },
  {
    degree: 'VI',
    chordType: 'M'
  },
  {
    degree: 'VII',
    chordType: 'M'
  }],
  
  
}
const VoicingDictionary = {
  M: ["1P 3M 5P", "3M 5P 8P", "5P 8P 10M"],
  m: ["1P 3m 5P", "3m 5P 8P", "5P 8P 10m"],
  o: ["1P 3m 5d", "3m 5d 8P", "5d 8P 10m"],
  aug: ["1P 3m 5A", "3m 5A 8P", "5A 8P 10m"],
  m7: ["1P 3m 5P 7m", "7m 9M 10m 12P"],
  "7": ["3M 6M 7m 9M", "7m 9M 10M 13M"],
  "M7": ["3M 5P 7M 9M", "7M 9M 10M 12P"],
  "69": ["3M 5P 6A 9M"],
  m7b5: ["3m 5d 7m 8P", "7m 8P 10m 12d"],
  "7b9": ["3M 6m 7m 9m", "7m 9m 10M 13m"], // b9 / b13
  "7b13": ["3M 6m 7m 9m", "7m 9m 10M 13m"], // b9 / b13
  o7: ["1P 3m 5d 6M", "5d 6M 8P 10m"],
  "7#11": ["7m 9M 11A 13A"],
  "7#9": ["3M 7m 9A"],
  mM7: ["3m 5P 7M 9M", "7M 9M 10m 12P"],
  m6: ["3m 5P 6M 9M", "6M 9M 10m 12P"],
};
export { defaultDegreeChordTypes,CHORD_TYPES,VoicingDictionary};

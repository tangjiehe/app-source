import React from 'react';
import { Grid } from '../components';
import './App.css';

const gridHeaders = [
  { name: 'a', label: 'a' },
  { name: 'bb', label: 'bb' },
  { name: 'ccc', label: 'ccc' },
  { name: 'dddd', label: 'dddd' },
  { name: 'eeeee', label: 'eeeee' },
  { name: 'ffffff', label: 'ffffff' },
  { name: 'ggggggg', label: 'ggggggg' }
];

const gridRows = [
  [
    { name: 'bb', value: '1' }
  ],
  [

    { name: 'bb', value: '2' }
  ],
  [
    { name: 'bb', value: '3' }
  ],
  [
    { name: 'bb', value: '4' }
  ],
  [
    { name: 'bb', value: '5' }
  ],
  [
    { name: 'bb', value: '6' }
  ],
  [
    { name: 'bb', value: '7' }
  ],
  [
    { name: 'bb', value: '8' }
  ],
  [
    { name: 'bb', value: '9' }
  ],
  [
    { name: 'bb', value: '10' }
  ],
  [
    { name: 'bb', value: '11' }
  ],
  [
    { name: 'bb', value: '12' }
  ],
  [
    { name: 'bb', value: '13' }
  ],
  [
    { name: 'bb', value: '14' }
  ],
  [
    { name: 'bb', value: '15' }
  ],
  [
    { name: 'bb', value: '16' }
  ],
  [
    { name: 'bb', value: '17' }
  ],
  [
    { name: 'bb', value: '18' }
  ],
  [
    { name: 'bb', value: '19' }
  ],
  [
    { name: 'bb', value: '20' }
  ],
  [
    { name: 'bb', value: '21' }
  ]
];

function App() {
  return (
    <div className="App">
      <Grid
        gridHeaders={gridHeaders}
        gridRows={gridRows}
      />
    </div>
  );
}

export default App;

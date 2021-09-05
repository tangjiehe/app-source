import React from 'react';
import { Grid } from '../components';
import './App.css';

const gridHeaders = [
  { name: 'a', label: 'a' },
  { name: 'bb', label: 'bb', sortable: true },
  { name: 'ccc', label: 'ccc' },
  { name: 'dddd', label: 'dddd' },
  { name: 'eeeee', label: 'eeeee' },
  { name: 'ffffff', label: 'ffffff' },
  { name: 'ggggggg', label: 'ggggggg' }
];

const gridRows: any = [];
for (let i = 0; i < 21; i++) {
  gridRows.push([{ name: 'bb', value: i.toString(), sortValue: i.toString() }]);
}

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

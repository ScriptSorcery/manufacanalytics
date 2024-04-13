import React from 'react';
import './App.css';
import WineStatistics from './components/WineStatistics';
import WineGammaStatistics from './components/WineGammaStatistics';

function App() {
  return (
    <div>
      {/* <DataTable /> */}
      <WineStatistics />
      <WineGammaStatistics />
    </div>
  );
}

export default App;

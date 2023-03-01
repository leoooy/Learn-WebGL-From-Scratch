import React from 'react';
import { createOasis } from './game';

function App() {
  React.useEffect(() => {
    createOasis();
  }, []);

  return (
    <canvas id='canvas' style={{ width: '100vw', height: '100vh' }}></canvas>
  );
}

export default App;

import React from 'react';
import { motion } from 'framer-motion';

const colors = {
  burgundy: '#632424',
  gold: '#EBC95E',
  white: '#FFFFFF',
  black: '#0a0a0a',
};

function App() {
  return (
    <div style={{ background: colors.black, color: colors.white, minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ color: colors.gold }}>Blockage Masters</h1>
      <p>Melbourne's Drain Specialists</p>
      <motion.button
        style={{ background: colors.gold, padding: '10px 20px', borderRadius: '20px' }}
        whileHover={{ scale: 1.1 }}
      >
        Test Button
      </motion.button>
    </div>
  );
}

export default App;

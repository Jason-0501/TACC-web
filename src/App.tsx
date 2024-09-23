import React from 'react';
import PolicyList from './components/PolicyList'
import './App.css'

const App: React.FC = () => {
  return (
    <div>
      <h2>政策管理</h2>
      <PolicyList />
    </div>
  );
};

export default App

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface PolicySetFormProps {
  onSubmit: (policySetName: string, resourceName: string) => void;
}

const PolicySetForm: React.FC<PolicySetFormProps> = ({ onSubmit }) => {
  const [policySetName, setPolicySetName] = useState('');
  const [resourceName, setResourceName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (policySetName && resourceName) {
      onSubmit(policySetName, resourceName);
      setPolicySetName('');
      setResourceName('');
    } else {
      alert('請輸入 PolicySet 名稱 和 Resource 名稱');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="policySetName">PolicySet 名稱: </label>
        <input
          id="policySetName"
          type="text"
          value={policySetName}
          onChange={(e) => setPolicySetName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="resourceName">Resource 名稱: </label>
        <input
          id="resourceName"
          type="text"
          value={resourceName}
          onChange={(e) => setResourceName(e.target.value)}
        />
      </div>
      <button type="submit" className="add-button">新增 PolicySet</button>
    </form>
  );
};

export default PolicySetForm;

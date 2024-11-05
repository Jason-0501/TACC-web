import React, { useState, useEffect } from 'react';
import './set.css';
import { createPolicySet, getPolicySets, updatePolicySet, getPolicies,getResources, deletePolicySet, deletePolicyFromPolicySet } from './service/policySetService'; // 確保導入了刪除單個 Policy 的方法

interface PolicySet {
  id: number;
  name: string;
  resource: { name: string };  // 加入 Resource 名稱
  policies: { id: number, name: string }[]; // 確保每個 policy 也有 id
}

interface Policy {
  id: number;
  name: string;
}

interface Resource{
  id: number;
  name: string;
  risk_rank: string;
  type: string;
  abac_Enabled: boolean
}

const Set: React.FC = () => {
  const [policySets, setPolicySets] = useState<PolicySet[]>([]);
  const [availablePolicies, setAvailablePolicies] = useState<Policy[]>([]);
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [currentPolicySetId, setCurrentPolicySetId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableResources, setAvailableResources] = useState<Resource[]>([]);
  const [newPolicySetName, setNewPolicySetName] = useState('');
  const [newResourceName, setNewResourceName] = useState('');

  // 獲取現有的 PolicySet
  const fetchPolicySets = async () => {
    try {
      const data = await getPolicySets();
      setPolicySets(data);
    } catch (error) {
      alert('無法取得 PolicySet 列表，請重試');
    }
  };

  // 獲取現有的 Policies 從資料庫
  const fetchAvailablePolicies = async () => {
    try {
      const data = await getPolicies();
      setAvailablePolicies(data);
    } catch (error) {
      alert('無法取得 Policies 列表，請重試');
    }
  };

  // 獲取所有 Resources
  const fetchAvailableResources = async () => {
    try {
      const data = await getResources();
      setAvailableResources(data);
    } catch (error) {
      alert('無法取得 Resources 列表，請重試');
    }
  };

  useEffect(() => {
    fetchPolicySets();
    fetchAvailableResources();
    fetchAvailablePolicies();
  }, []);

  // 刪除單個 Policy
  const handleDeletePolicy = async (policySetId: number, policyId: number) => {
    try {
      await deletePolicyFromPolicySet(policySetId, policyId);
      alert('Policy 刪除成功');
      fetchPolicySets();  // 刪除後重新獲取 PolicySet 列表
    } catch (error) {
      alert('刪除 Policy 失敗，請重試');
    }
  };

  const handleAddPolicy = async () => {
    if (selectedPolicies.length === 0) {
      alert('請至少選擇一個 Policy');
      return;
    }
  
    if (currentPolicySetId === null) {
      alert('未選擇 PolicySet');
      return;
    }
  
    try {
      const existingPolicySet = policySets.find(ps => ps.id === currentPolicySetId);
      if (!existingPolicySet) {
        alert('找不到對應的 PolicySet');
        return;
      }
  
      // 構建 policies 陣列，保留選擇的 policies 名稱
      const updatedPolicies = [...selectedPolicies.map(policyName => ({ name: policyName }))];
  
      // 構建 PUT 請求需要的資料格式
      const policySetData = {
        name: existingPolicySet.name,  // 保持原來的 PolicySet 名稱
        policies: updatedPolicies,     // 只包含 policies 名稱
      };
  
      // 發送 PUT 請求到後端
      await updatePolicySet(currentPolicySetId, policySetData);
      alert('Policy 新增成功');
      fetchPolicySets();  // 更新後重新抓取列表
      setSelectedPolicies([]);  // 清空選擇的 policies
      setIsModalOpen(false);    // 關閉彈窗
      setCurrentPolicySetId(null);
    } catch (error) {
      alert('新增失敗，請重試');
    }
  };

  const handleDeletePolicySet = async (policySetId: number) => {
    try {
      await deletePolicySet(policySetId);
      alert('PolicySet 刪除成功');
      fetchPolicySets();  // 刪除後重新獲取列表
    } catch (error) {
      alert('刪除失敗，請重試');
    }
  };

  const handlePolicySelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedPolicies(selectedOptions);
  };

  const openPolicyModal = (policySetId: number) => {
    setCurrentPolicySetId(policySetId);
    setIsModalOpen(true); // 打開彈窗
  };

  // 新增 PolicySet 的處理函數
  const handleCreatePolicySet = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPolicySetName || !newResourceName) {
      alert('請填寫 PolicySet 名稱和 Resource 名稱');
      return;
    }

    try {
      await createPolicySet(newPolicySetName, newResourceName);
      alert('PolicySet 新增成功');
      setNewPolicySetName('');
      setNewResourceName('');
      fetchPolicySets(); // 新增後重新獲取列表
    } catch (error) {
      alert('新增失敗，請重試');
    }
  };

  return (
    <div className="App">
      <div className="create-section">
        <h1>PolicySet管理</h1>
        {/* 新增 PolicySet 的表單 */}
        <form onSubmit={handleCreatePolicySet} className="create-policy-set-form">
          <div className='inputValue'>
            <label htmlFor="policySetName">PolicySet 名稱:</label>
            <input
              id="policySetName"
              type="text"
              value={newPolicySetName}
              onChange={(e) => setNewPolicySetName(e.target.value)}
              required
            />
          </div>
          <div className='inputValue'>
            <label htmlFor="resourceName">Resource 名稱:</label>
            <input
              id="resourceName"
              type="text"
              value={newResourceName}
              onChange={(e) => setNewResourceName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="add-button" id='inputButton'>新增 PolicySet</button>
        </form>
      </div>


      {/* Resource 列表區域 */}
      <div className="resource-list-header">
        <h2>現有的 Resource 列表</h2>
      </div>

      <div className="resource-list-container">
        <div className="resource-list">
          {availableResources.map((resource) => (
            <div className="resource-card" key={resource.id}>
              <h3>Resource 名稱: {resource.name}</h3>
              <p>類型: {resource.type}</p>  {/* 顯示 type */}
              <p>風險等級: {resource.risk_rank}</p>  {/* 顯示 risk_rank */}
              <p>ABAC 啟用: {resource.abac_Enabled ? "啟用" : "未啟用"}</p> {/* 顯示 abac_Enabled 狀態 */}
            </div>
          ))}
        </div>
      </div>
      {/* 標題區域 */}
      <div className="policySet-list-header">
        <h2>現有的 PolicySet 列表</h2>
      </div>

      {/* 大卡片包住所有 PolicySet */}
      <div className="policySet-list-container">
        <div className="policySet-list">
          {policySets.map((policySet) => (
            <div className="policySet-card" key={policySet.id}>
              <h3>PolicySet 名稱: {policySet.name}</h3>
              <h3><strong>Resource 名稱:</strong> {policySet.resource.name}</h3>
              <h3><strong>Policies:</strong></h3>
              <ul>
                {policySet.policies.map(policy => (
                  <li key={policy.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {policy.name}
                    <button
                      onClick={() => handleDeletePolicy(policySet.id, policy.id)}
                      className="delete-policy-button"
                    >
                      &#10006; {/* 使用 Unicode "X" 符號 */}
                    </button>
                  </li>
                ))}
              </ul>

              {/* 刪除 PolicySet 按鈕 */}
              <button onClick={() => handleDeletePolicySet(policySet.id)} className="policySet-delete-button">
                刪除 PolicySet
              </button>

              {/* 新增 Policy 的按鈕 */}
              <button onClick={() => openPolicyModal(policySet.id)} className="policy-add-button">
                新增 Policy
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 彈窗部分 */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>選擇 Policies</h3>
            <div className="policy-list">
              {availablePolicies.map((policy) => (
                <div
                  key={policy.name}
                  className={`policy-card ${selectedPolicies.includes(policy.name) ? 'selected' : ''}`}
                  onClick={() => {
                    if (selectedPolicies.includes(policy.name)) {
                      setSelectedPolicies(selectedPolicies.filter((p) => p !== policy.name));
                    } else {
                      setSelectedPolicies([...selectedPolicies, policy.name]);
                    }
                  }}
                >
                  {policy.name}
                </div>
              ))}
            </div>
            <button onClick={handleAddPolicy} className="add-button">
              確認新增
            </button>
            <button  onClick={() => {
                  setSelectedPolicies([]); // 清空選擇的 policies
                  setIsModalOpen(false);   // 關閉彈窗
                }}  className="cancel-button">
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Set;

import axios from 'axios';

const API_URL = "http://localhost:8080"; 

// 新增 PolicySet，帶入 PolicySet 的 name 和 Resource 的 name
export const createPolicySet = async (policySetName: string, resourceName: string) => {
    const response = await axios.post(`${API_URL}/policysets`, {
        name: policySetName,
        resource: {
            name: resourceName,
        }
    });
    return response.data;
};

// 獲取所有的 PolicySet
export const getPolicySets = async () => {
    const response = await axios.get(`${API_URL}/policysets`);
    return response.data;
};

// 根據 ID 獲取特定的 PolicySet
export const getPolicySetById = async (id: number) => {
    const response = await axios.get(`${API_URL}/policysets/id/${id}`);
    return response.data;
};

// 刪除 PolicySet
export const deletePolicySet = async (policySetId: number) => {
    await axios.delete(`${API_URL}/policysets/${policySetId}`);
};

// 更新 PolicySet
export const updatePolicySet = async (policySetId: number,policySetData: { name: string; policies: { name: string }[] }
) => {const response = await axios.put(`${API_URL}/policysets/${policySetId}`, policySetData);
    return response.data;
  };

// 更新 PolicySet(從PolicySet刪除Policy)
export const deletePolicyFromPolicySet = async (policySetId: number, policyId: number) => {
    const response = await axios.put(`${API_URL}/policysets/${Number(policySetId)}/policies/${Number(policyId)}`);
    return response.data;
};

// 獲取所有 Policies
export const getPolicies = async () => {
    const response = await axios.get(`${API_URL}/policies`);
    return response.data;
};

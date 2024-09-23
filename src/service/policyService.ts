import axios from 'axios';

const API_URL = "http://localhost:8080"; 

export const getPolicies = async () => {
    const response = await axios.get(`${API_URL}/policies`);
    return response.data;
};
  
export const getPolicyById = async (id: number) => {
    const response = await axios.get(`${API_URL}/policies/${id}`);
    return response.data;
};
export const addAllOf = async (anyOf: number) => {
    const response = await axios.post(`${API_URL}/allof`, { anyOf });
    return response.data;
};

export const deleteAllOf = async (allOfId: number) => {
    await axios.delete(`${API_URL}/allof/${allOfId}`);
};

export const addMatch = async (newMatch: { allOf: number; designater: string; attributeValue: string; op: string; dataType: number }) => {
    const response = await axios.post(`${API_URL}/matches`, newMatch);
    return response.data;
};

export const updateMatch = async ( matchId: number,updateMatch:{ designater: string; attributeValue: string; op: string; dataType: number})=>{
    const response = await axios.put(`${API_URL}/matches/${matchId}`,updateMatch);
    return response.data;
}

export const deleteMatch = async (matchId: number) => {
    await axios.delete(`${API_URL}/matches/${matchId}`);
};
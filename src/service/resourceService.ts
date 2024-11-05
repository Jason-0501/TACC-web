// src/services/ResourceService.ts
import axios from 'axios';

const API_URL = "http://localhost:8082";

export const getResources = async () => {
    const response = await axios.get(`${API_URL}/resources`);
    return response.data;
};

export const updateResource = async (resourceId: number, updatedData: { abacEnabled: boolean }) => {
    const response = await axios.put(`${API_URL}/resources/${resourceId}`, updatedData);
    return response.data;
};

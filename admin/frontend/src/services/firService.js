// admin/frontend/src/services/firService.js
import axios from 'axios';
// import { getFIRById } from '../../../backend/controllers/firController';

// 
const API_URL = 'http://localhost:5002/api/admin/'; // Base URL for admin APIs

const getToken = () => {
  const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
  return adminInfo ? adminInfo.token : null;
};

const getConfig = () => {
  return {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };
};

const getAllFIRs = async () => {
  const response = await axios.get(API_URL + 'firs', getConfig());
  return response.data;
};
const getFIRById = async (id) => { // <--- Definition of getFIRById
  const response = await axios.get(API_URL + `firs/${id}`, getConfig());
  return response.data;
};

const updateFIRStatus = async (id, status) => {
  const response = await axios.put(API_URL + `firs/${id}/status`, { status }, getConfig());
  return response.data;
};

const getFIRStats = async () => {
  const response = await axios.get(API_URL + 'analytics/fir-stats', getConfig());
  return response.data;
};

const getFIRTrend = async () => {
    const response = await axios.get(API_URL + 'analytics/fir-trend', getConfig());
    return response.data;
};

const firService = {
  getAllFIRs,
  getFIRById,
  updateFIRStatus,
  getFIRStats,
  getFIRTrend,
};

export default firService;
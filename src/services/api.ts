import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = __DEV__
    ? 'http://192.168.3.3:3000/api'
    : 'https://sua-api.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await AsyncStorage.removeItem('authToken');
        }
        return Promise.reject(error);
    }
);

export const assessmentAPI = {
    getAll: async () => {
        try {
            const response = await api.get('/assessments');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar avaliações:', error);
            const local = await AsyncStorage.getItem('assessments');
            return local ? JSON.parse(local) : [];
        }
    },

    getById: async (id: string) => {
        try {
            const response = await api.get(`/assessments/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar avaliação:', error);
            throw error;
        }
    },

    create: async (data: any) => {
        try {
            const response = await api.post('/assessments', data);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar avaliação:', error);
            const local = await AsyncStorage.getItem('assessments');
            const assessments = local ? JSON.parse(local) : [];
            const newAssessment = {
                ...data,
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date(),
                syncStatus: 'pending',
            };
            assessments.push(newAssessment);
            await AsyncStorage.setItem('assessments', JSON.stringify(assessments));
            return newAssessment;
        }
    },

    update: async (id: string, data: any) => {
        try {
            const response = await api.put(`/assessments/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar avaliação:', error);
            throw error;
        }
    },

    delete: async (id: string) => {
        try {
            await api.delete(`/assessments/${id}`);
            return true;
        } catch (error) {
            console.error('Erro ao deletar avaliação:', error);
            throw error;
        }
    },
};

export const threatAPI = {
    getLatest: async () => {
        try {
            const response = await api.get('/threats/latest');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar ameaças:', error);
            return [];
        }
    },
};

export default api;

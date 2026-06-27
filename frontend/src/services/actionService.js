import api from './api';

export const actionService = {
    getAction: async () => {
        const response = await api.get('/action');
        return response.data.action;
    },

    updateAction: async (data) => {
        const response = await api.put('/action', data);
        return response.data.action;
    },
};

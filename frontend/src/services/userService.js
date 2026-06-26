import api from './api';

export const userService = {
    getProfile: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data.usuario;
    },

    updateProfile: async (id, data) => {
        const response = await api.patch(`/users/${id}`, data);
        return response.data.usuario;
    },

    listVolunteers: async () => {
        const response = await api.get('/users');
        return response.data.usuarios;
    },

    // Creates a volunteer via POST /auth/register, then PATCHes academic data if provided.
    createVolunteer: async (data) => {
        const cpfDigits = (data.cpf || '').replace(/\D/g, '');
        const regRes = await api.post('/auth/register', {
            name: data.name,
            email: data.email,
            cpf: cpfDigits,
            password: data.password || cpfDigits,
            role: 'VOLUNTARIO',
        });
        const newUser = regRes.data.usuario;

        if (data.course || data.bond) {
            try {
                const patchRes = await api.patch(`/users/${newUser._id}`, {
                    course: data.course || '',
                    bond: data.bond || 'DISCENTE',
                });
                return patchRes.data.usuario;
            } catch {
                // PATCH failed — return flat object from the register response
            }
        }

        return {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            cpf: newUser.cpf,
            course: data.course || '',
            bond: data.bond || 'DISCENTE',
            phone: '',
            status: 'active',
        };
    },

    deleteVolunteer: async (id) => {
        await api.delete(`/users/${id}`);
    },
};

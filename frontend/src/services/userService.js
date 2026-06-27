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

    // Creates a user via POST /auth/register, then PATCHes role-specific data.
    createVolunteer: async (data) => {
        const cpfDigits = (data.cpf || '').replace(/\D/g, '');
        const role = data.role || 'VOLUNTARIO';
        const regRes = await api.post('/auth/register', {
            name: data.name,
            email: data.email,
            cpf: cpfDigits,
            password: data.password || cpfDigits,
            role,
        });
        const newUser = regRes.data.usuario;

        if (role === 'VOLUNTARIO' && (data.course || data.bond)) {
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

        if (role === 'COORDENADOR' && data.department) {
            try {
                const patchRes = await api.patch(`/users/${newUser._id}`, {
                    department: data.department,
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
            role,
            department: role === 'COORDENADOR' ? (data.department || '') : '',
            course: role === 'VOLUNTARIO' ? (data.course || '') : '',
            bond: role === 'VOLUNTARIO' ? (data.bond || 'DISCENTE') : '',
            phone: '',
            status: 'active',
        };
    },

    deleteVolunteer: async (id) => {
        await api.delete(`/users/${id}`);
    },

    // Downloads the filled DOCX term for the logged-in volunteer
    downloadTermo: async () => {
        const response = await api.get('/termo', { responseType: 'blob' });
        const url = URL.createObjectURL(new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        }));
        const a = document.createElement('a');
        a.href = url;
        a.download = response.headers['content-disposition']
            ?.match(/filename="([^"]+)"/)?.[1] || 'Termo-Voluntário.docx';
        a.click();
        URL.revokeObjectURL(url);
    },
};

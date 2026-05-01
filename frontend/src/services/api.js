const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const api = {
    async get(endpoint) {
        const res = await fetch(`/api${endpoint}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    async post(endpoint, data) {
        const res = await fetch(`/api${endpoint}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(res);
    },

    async put(endpoint, data) {
        const res = await fetch(`/api${endpoint}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(res);
    },

    async delete(endpoint) {
        const res = await fetch(`/api${endpoint}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    }
};

async function handleResponse(response) {
    if (!response.ok) {
        let errorMsg = `Server error: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorData.error || errorMsg;
            if (response.status === 403) {
                 errorMsg = "You do not have permission to perform this action.";
            } 
        } catch (e) {
        }
        throw new Error(errorMsg);
    }
    
    if (response.status === 204) return null;
    try {
        return await response.json();
    } catch(e) {
        return null;
    }
}

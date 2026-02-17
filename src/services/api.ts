import type { User, JobDrive, Application } from '../types';

const API_URL = '/api'; // Proxy handles the rest

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        let errorMessage = 'Request failed';
        try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
        } catch {
            errorMessage = `Server Error (${response.status})`;
        }
        throw new Error(errorMessage);
    }
    return response.json();
};

export const api = {
    // Auth
    login: async (email: string, role: 'student' | 'company'): Promise<{ user: User, token: string }> => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, role })
        });

        if (!response.ok) {
            let errorMessage = 'Login failed';
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } catch {
                // If JSON parse fails, it's likely a network/server issue (HTML response)
                errorMessage = `Server Error (${response.status}): The backend might be down.`;
            }
            throw new Error(errorMessage);
        }
        return response.json();
    },

    register: async (data: Record<string, unknown>): Promise<{ user: User, token: string }> => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Registration failed');
        return response.json();
    },

    // Drives
    getDrives: async (): Promise<JobDrive[]> => {
        const response = await fetch(`${API_URL}/drives`);
        if (!response.ok) throw new Error('Failed to fetch drives');
        return response.json();
    },

    // Applications
    getApplications: async (studentId: string): Promise<Application[]> => {
        const response = await fetch(`${API_URL}/applications?studentId=${studentId}`);
        if (!response.ok) throw new Error('Failed to fetch applications');
        return response.json();
    },

    apply: async (driveId: string, studentId: string) => {
        const res = await fetch(`${API_URL}/applications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ driveId, studentId })
        });
        return handleResponse(res);
    },

    uploadResume: async (file: File, studentId: string) => {
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('studentId', studentId);

        const res = await fetch(`${API_URL}/upload/resume`, {
            method: 'POST',
            body: formData, // No Content-Type header needed for FormData
        });
        return handleResponse(res);
    },

    analyzeProfile: async (profileData: Record<string, unknown>) => {
        const res = await fetch(`${API_URL}/gemini/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData)
        });
        return handleResponse(res);
    }
};

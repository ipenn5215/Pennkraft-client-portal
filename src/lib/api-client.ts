// API client for frontend to communicate with backend

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export class ApiClient {
  static async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  static async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  static async patch<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  static async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }
}

// API endpoint helpers
export const api = {
  projects: {
    list: (userId: string) => ApiClient.get(`/api/projects?userId=${userId}`),
    get: (id: string) => ApiClient.get(`/api/projects/${id}`),
    create: (data: any) => ApiClient.post('/api/projects', data),
    update: (id: string, data: any) => ApiClient.patch(`/api/projects/${id}`, data),
    delete: (id: string) => ApiClient.delete(`/api/projects/${id}`),
  },
  users: {
    get: (id: string) => ApiClient.get(`/api/users/${id}`),
    update: (id: string, data: any) => ApiClient.patch(`/api/users/${id}`, data),
  },
  documents: {
    list: (projectId: string, category?: string) => {
      const params = category ? `&category=${category}` : '';
      return ApiClient.get(`/api/documents?projectId=${projectId}${params}`);
    },
    upload: (data: any) => ApiClient.post('/api/documents', data),
    updateStatus: (documentId: string, status: string, reviewedBy?: string) =>
      ApiClient.patch('/api/documents', { documentId, status, reviewedBy }),
  },
  messages: {
    list: (projectId: string) => ApiClient.get(`/api/messages?projectId=${projectId}`),
    send: (data: any) => ApiClient.post('/api/messages', data),
    markAsRead: (messageIds: string[]) => ApiClient.patch('/api/messages', { messageIds }),
  },
  quotes: {
    list: (projectId?: string, userId?: string) => {
      const params = [];
      if (projectId) params.push(`projectId=${projectId}`);
      if (userId) params.push(`userId=${userId}`);
      return ApiClient.get(`/api/quotes${params.length ? '?' + params.join('&') : ''}`);
    },
    create: (data: any) => ApiClient.post('/api/quotes', data),
    updateStatus: (quoteId: string, status: string) =>
      ApiClient.patch('/api/quotes', { quoteId, status }),
  },
  invoices: {
    list: (projectId?: string, userId?: string) => {
      const params = [];
      if (projectId) params.push(`projectId=${projectId}`);
      if (userId) params.push(`userId=${userId}`);
      return ApiClient.get(`/api/invoices${params.length ? '?' + params.join('&') : ''}`);
    },
    create: (data: any) => ApiClient.post('/api/invoices', data),
    updateStatus: (invoiceId: string, status: string, paymentMethod?: string, stripeId?: string) =>
      ApiClient.patch('/api/invoices', { invoiceId, status, paymentMethod, stripeId }),
  },
};
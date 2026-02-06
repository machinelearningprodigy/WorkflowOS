import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * Production-ready API client built on Axios.
 * Handles auth headers, common error cases, and JSON parsing.
 */
class ApiClient {
    private client: AxiosInstance

    constructor() {
        this.client = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        // Add interceptors here (e.g., auth tokens)
        this.client.interceptors.request.use((config) => {
            // Get token from local storage or app state
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        })

        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                // Handle global error cases (401, 500, etc.)
                if (error.response?.status === 401) {
                    // Redirect to login or refresh token
                }
                return Promise.reject(error)
            }
        )
    }

    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.get(url, config)
        return response.data
    }

    public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.post(url, data, config)
        return response.data
    }

    public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.put(url, data, config)
        return response.data
    }

    public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.delete(url, config)
        return response.data
    }

    public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.patch(url, data, config)
        return response.data
    }
}

export const apiClient = new ApiClient()

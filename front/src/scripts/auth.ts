import axios from 'axios';
import { useToast } from 'vue-toastification'

export const API = axios.create({
		baseURL: 'http://localhost:3000/',
		withCredentials: true
})

const toast = useToast()

API.interceptors.response.use(
	(response) => {
		return (response);
	},
	(error) => {
		toast.error("Error: " + error.response.data?.message || "An error occured")
		return Promise.reject(error);
	}
)

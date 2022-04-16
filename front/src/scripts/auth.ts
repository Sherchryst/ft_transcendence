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
		const messages : string[] | string = error.response.data?.message
		if (!error.response.data)
			toast.error("An error occured")
		else if (Array.isArray(messages))
			messages.forEach(e => {
				toast.error(e)
			});
		else
			toast.error(messages)
		return Promise.reject(error);
	}
)

import axios from 'axios';

export function set_access_token() {
const token = localStorage.getItem('access_token');
axios.defaults.headers.common = {'Authorization': `Bearer ${token}`};
}

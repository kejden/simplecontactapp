import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8080';
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

interface Contact {
  id?: string;
  photoURL?: string;
  name?: string;
  title?: string;
  email?: string;
  address?: string;
  phone?: string;
  status?: string;
  [key: string]: any;
}

export async function saveContact(contact: Contact) {
  return await axios.post('/contacts', {username: localStorage.getItem('user'), contact: contact});
}

export async function getContacts(page: number = 0, size: number = 10) {
  return await axios.get(`/contacts?userName=${localStorage.getItem('user')}&page=${page}&size=${size}`);
}

export async function getContact(id: string) {
  return await axios.get(`/contacts/${id}`);
}

export async function updateContact(contact: Contact) {
  return await axios.post('/contacts', contact);
}

export async function updatePhoto(formData: FormData) {
  return await axios.put('/contacts/photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function registerUser(username: string, password: string) {
    const response = await axios.post('/auth/register', { username, password }, {
      headers: {
        Authorization: ''
      }
    });
    return response.data;
}

export async function loginUser(username: string, password: string) {
  const response = await axios.post('/auth/login', { username, password }, {
    headers:{
      Authorization:''
    }
  }); 
  const user = response.data.user.username;
  const token = response.data.jwt;
  if (token) {  
    localStorage.setItem('user', user);
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  return response;
}
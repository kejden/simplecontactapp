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
  return await axios.post('/contacts', contact);
}

export async function getContacts(page: number = 0, size: number = 10) {
  return await axios.get(`/contacts?page=${page}&size=${size}`);
}

export async function getContact(id: string) {
  return await axios.get(`/contacts/${id}`);
}

export async function updateContact(contact: Contact) {
  return await axios.post('/contacts', contact);
}

export async function deleteContact(id: string) {
  return await axios.delete(`/contacts/${id}`);
}

export async function updatePhoto(formData: FormData) {
  return await axios.put('/contacts/photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function loginUser(username: string, password: string) {
  const response = await axios.post('/auth/login', { username, password });
  const token = response.data.token;
  if (token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  return response;
}

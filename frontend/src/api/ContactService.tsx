import axios from "axios";

const API_URL = "http://127.0.0.1:8080/contacts";

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
  return await axios.post(API_URL, contact);
}

export async function getContacts(page: number = 0, size: number = 10) {
  return await axios.get(`${API_URL}?page=${page}&size=${size}`);
}

export async function getContact(id: string) {
  return await axios.get(`${API_URL}/${id}`);
}

export async function updateContact(contact: Contact) {
  return await axios.post(API_URL, contact);
}

export async function deleteContact(id: string) {
  return await axios.delete(`${API_URL}/${id}`);
}

export async function updatePhoto(formData: FormData) {
  return await axios.put(`${API_URL}/photo`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

import { useEffect, useRef, useState } from "react";
import { getContacts, saveContact, updatePhoto } from "./api/ContactService";
import Header from "./components/Header";
import { Routes, Route, Navigate } from "react-router-dom";
import ContactList from "./components/ContactList";
import ContactDetail from "./components/ContactDetail";
import Register from "./components/Register"
import Login from "./components/Login"
import { useNavigate } from "react-router-dom";

interface ContactData {
  totalElements: number;
  totalPages: number;
  size: number;
  content: any[];
  number: number;
  sort: any;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: any;
} 

function App() {
  const modalRef = useRef<HTMLDialogElement>(null);
  const fileRef: any = useRef();
  const [currentPage, setCurrentPage] = useState(0);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [data, setData] = useState<ContactData>({
    totalElements: 0,
    totalPages: 0,
    size: 0,
    content: [],
    number: 0,
    sort: {},
    first: false,
    last: false,
    numberOfElements: 0,
    pageable: {},
  });
  const navigate = useNavigate();

  const getAllContacts = async (page: number = 0, size: number = 10) => {
    try {
      setCurrentPage(page);
      const { data } = await getContacts(page, size);
      setData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    title: "",
    status: "",
  });

  const handleNewContact = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { data: newContact } = await saveContact(values);
      setData(prevData => ({
        ...prevData,
        content: [newContact, ...prevData.content],
      }));

      const formData = new FormData();
      formData.append('id', newContact.id);
      formData.append('photo', file as Blob, file?.name || '');
      const { data: photoURL } = await updatePhoto(formData);
      setData(prevData => ({
        ...prevData,
        content: prevData.content.map(contact =>
          contact.id === newContact.id ? { ...newContact, photoURL } : contact
        ),
      }));
      setValues({
        name: '',
        email: '',
        phone: '',
        address: '',
        title: '',
        status: '',
      });
      setFile(undefined);
      fileRef.current.value = '';
      toggleModal(false);
      navigate("/")
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  } 

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const toggleModal = (show: boolean) => {
    if (modalRef.current) {
      show ? modalRef.current.showModal() : modalRef.current.close();
    }
  };

  const updateContact = async (contact: ContactData) => {
    try{
      const {data} = await saveContact(contact);
    }catch(error){
      console.error(error);
    }
  };

  const updateImage = async (formData: FormData) => {
    try {
      const { data:photoURL } = await updatePhoto(formData);
      console.log(data)
    } catch (error) {
      console.error(error);
    } 
  };

  useEffect(() => {
    getAllContacts();
  }, [data.content]);

  return (
    <>
      <Header toggleModal={toggleModal} numOfContacts={data.totalElements} />
      <main>
        <div className="container">
          <Routes>
            <Route path="/register" element={< Register />} />
            <Route path="/login" element={< Login />}/>
            <Route path="/" element={<Navigate to={"contacts"} />} />
            <Route
              path="/contacts"
              element={
                <ContactList
                  data={data}
                  currentPage={currentPage}
                  getAllContacts={getAllContacts}
                />
              }
            />
            <Route
              path="/contacts/:id"
              element={
                <ContactDetail
                updateContact = {updateContact} 
                updateImage = {updateImage} 
                />
              }
            />
          </Routes>
        </div>
      </main>

      <dialog ref={modalRef} className="modal" id="modal">
        <div className="modal__header">
          <h3>New Contact</h3>
          <i onClick={() => toggleModal(false)} className="bi bi-x-lg"></i>
        </div>
        <div className="divider"></div>
        <div className="modal__body">
          <form onSubmit={handleNewContact}>
            <div className="user-details">
              <div className="input-box">
                <span className="details">Name</span>
                <input
                  type="text"
                  value={values.name}
                  onChange={onChange}
                  name="name"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Email</span>
                <input
                  type="text"
                  value={values.email}
                  onChange={onChange}
                  name="email"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Title</span>
                <input
                  type="text"
                  value={values.title}
                  onChange={onChange}
                  name="title"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Phone Number</span>
                <input
                  type="text"
                  value={values.phone}
                  onChange={onChange}
                  name="phone"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Address</span>
                <input
                  type="text"
                  value={values.address}
                  onChange={onChange}
                  name="address"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Account Status</span>
                <input
                  type="text"
                  value={values.status}
                  onChange={onChange}
                  name="status"
                  required
                />
              </div>
              <div className="file-input">
                <span className="details">Profile Photo</span>
                <input
                  type="file"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const files = event.target.files;
                    if (files && files.length > 0) {
                      setFile(files[0]);
                    }
                  }}
                  ref={fileRef}
                  name="photo"
                  required
                />
              </div>
            </div>
            <div className="form_footer">
              <button
                onClick={() => toggleModal(false)}
                type="button"
                className="btn btn-danger"
              >
                Cancel
              </button>
              <button type="submit" className="btn">
                Save
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}

export default App;

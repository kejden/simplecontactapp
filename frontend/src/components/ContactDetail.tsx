import React, {ReactEventHandler, useEffect, useState, useRef} from 'react'
import { Link, useParams } from 'react-router-dom';
import { getContact, updatePhoto } from '../api/ContactService';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

interface Props{
    updateContact:any ,
    updateImage: (formData: FormData) => {},
};

const ContactDetail = ({updateContact, updateImage}: Props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState('');
    const navigate = useNavigate();

    const [contact, setContact] = useState({
        id: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        title: "",
        status: "",
        photoURL: "",
    });

    const {id} = useParams();
    
    const fetchContact = async (id: any) => {
        try{
            const { data } = await getContact(id);
            setContact(data);
        }catch(error){
            console.error(error);
        }
    }

    const selectImage = () => {
        const ref = inputRef.current;
        if(ref){
            ref.click();
        }
    }

    const udpatePhoto = async (file: any) => {
        try{    
            const formData = new FormData();
            formData.append('id', id as string);
            formData.append('photo', file as Blob, file.name || " ");
            await updateImage(formData);
            setContact((prev) => ({ ...prev, photoURL: `${prev.photoURL}?updated_at=${new Date().getTime()}` }));
        }catch(error){
            console.error(error);
        }
    }

    const getImage = async () => { 
        const response = await axios.get(contact.photoURL, {responseType: 'blob'});
        setImage(URL.createObjectURL(response.data));
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setContact({ ...contact, [name]: value });
    };  

    const onUpdateContact: React.FormEventHandler<HTMLFormElement> = async (event) => { 
        event.preventDefault();
        await updateContact(contact);        
        fetchContact(id);
    };

    const onDelete = async () => {
        axios.delete(`/contacts/${contact.id}`);
        navigate('/contacts');
    }

    useEffect(() => {
        fetchContact(id);
    }, [id]);

    useEffect(() => {
        if (contact.photoURL) {
            getImage();
        }
    }, [contact.photoURL]);

  return (
  <>
    <Link to={'/contacts'} className='link'><i className='bi bi-arrow-left'></i> Back to list</Link>
    <div className='profile'>
      <div className='profile__details'>
        <img src={image} alt={`Profile photo of ${contact.name}`} />
        <div className='profile__metadata'>
          <p className='profile__name'>{contact.name}</p>
          <p className='profile__muted'>JPG, GIF, or PNG. Max size of 10MG</p>
          <button onClick={selectImage} className='btn'><i className='bi bi-cloud-upload'></i> Change Photo</button>
        </div>
      </div>
      <div className='profile__settings'>
        <div>
          <form onSubmit={onUpdateContact} className="form">
            <div className="user-details">
              <input type="hidden" defaultValue={contact.id} name="id" required />
              <div className="input-box">
                <span className="details">Name</span>
                <input type="text" value={contact.name} onChange={onChange} name="name" required />
              </div>
              <div className="input-box">
                <span className="details">Email</span>
                <input type="text" value={contact.email} onChange={onChange} name="email" required />
              </div>
              <div className="input-box">
                <span className="details">Phone</span>
                <input type="text" value={contact.phone} onChange={onChange} name="phone" required />
              </div>
              <div className="input-box">
                <span className="details">Address</span>
                <input type="text" value={contact.address} onChange={onChange} name="address" required />
              </div>
              <div className="input-box">
                <span className="details">Title</span>
                <input type="text" value={contact.title} onChange={onChange} name="title" required />
              </div>
              <div className="input-box">
                <span className="details">Status</span>
                <input type="text" value={contact.status} onChange={onChange} name="status" required />
              </div>
            </div>
            <div className="form_footer">
              <button type="submit" className="btn">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div className="profile__button">
      <button className="btn delete" onClick={onDelete}>
        <i className='bi bi-trash'></i> Delete Contact
      </button>
    </div>
    <form style={{ display: 'none' }}>
      <input 
        type='file' 
        ref={inputRef} 
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const files = event.target.files;
          if (files && files.length > 0) {
            udpatePhoto(files[0]);
          }}
        } 
        name='file' 
        accept='image/*' 
      />
    </form>
  </>
);

}

export default ContactDetail    
import React, {useEffect,useState} from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Props {
  contact: {
    id: string;
    photoURL: string;
    name: string;
    title: string;
    email: string;
    address: string;
    phone: string;
    status: string;
    [key: string]: any;
  };
}

const Contact = ({ contact }: Props) => {
  const [image, setImage] = useState('');
  const navigate = useNavigate();
  const getImage = async () => { 
    const response = await axios.get(contact.photoURL, {responseType: 'blob'});
    setImage(URL.createObjectURL(response.data));
  };

  useEffect(() => {
    getImage()
  },[]);

  return (
    <Link to={`/contacts/${contact.id}`} className="contact__item">
      <div className="contact__header">
        <div className="contact__image">
          <img src={image} alt={contact.name} />
        </div>
        <div className="contact__details">
          <p className="contact_name">
            {contact.name && contact.name.substring(0, 15)}{" "}
          </p>
          <p className="contact_title">{contact.title}</p>
        </div>
      </div>
      <div className="contact__body">
        <p>
          <i className="bi bi-envelope"></i>{" "}
          {contact.email && contact.email.substring(0, 20)}{" "}
        </p>
        <p>
          <i className="bi bi-geo"></i> {contact.address}
        </p>
        <p>
          <i className="bi bi-telephone"></i> {contact.phone}
        </p>
        <p>
          {contact.status === "Active" ? (
            <i className="bi bi-check-circle"></i>
          ) : (
            <i className="bi bi-x-circle"></i>
          )}{" "}
          {contact.status}
        </p>
      </div>
    </Link>
  );
};

export default Contact;
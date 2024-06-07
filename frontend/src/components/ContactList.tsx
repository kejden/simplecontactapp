import React from "react";
import Contact from "./Contact";
import { useNavigate } from "react-router-dom";

interface ContactData {
  id: string;
  photoURL: string;
  name: string;
  title: string;
  email: string;
  address: string;
  phone: string;
  status: string;
  [key: string]: any;
}

interface Props {
  data: {
    content: ContactData[];
    totalPages: number;
  };
  currentPage: number;
  getAllContacts: (page: number) => void;
}

const ContactList = ({ data, currentPage, getAllContacts }: Props) => {

  return (
    <main className="main">
      {data?.content?.length === 0 && localStorage.getItem('user') &&(
        <div>No Contacts. Please add a new contact</div>
      )}

      <ul className="contact__list">
        {data?.content?.length > 0 &&
          data.content.map((contact) => (
            <Contact contact={contact} key={contact.id} />
          ))}
      </ul>

      {data?.content?.length > 0 && data?.totalPages > 1 && (
        <div className="pagination">
          <a
            onClick={() => getAllContacts(currentPage - 1)}
            className={0 === currentPage ? "disabled" : ""}
          >
            &laquo;
          </a>

          {data &&
            [...Array(data.totalPages).keys()].map((page, index) => (
              <a
                onClick={() => getAllContacts(page)}
                className={currentPage === page ? "active" : ""}
                key={page}
              >
                {page + 1}
              </a>
            ))}

          <a
            onClick={() => getAllContacts(currentPage + 1)}
            className={data.totalPages === currentPage + 1 ? "disabled" : ""}
          >
            &raquo;
          </a>
        </div>
      )}
    </main>
  );
};

export default ContactList;

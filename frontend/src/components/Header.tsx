import React from "react";

interface Props {
  toggleModal: (show: any) => void;
  numOfContacts: number;
}

const Header = ({ toggleModal, numOfContacts }: Props) => {
  return (
    <header className="header">
      <div className="container">
        <h3>Contact List ({numOfContacts})</h3>
        <button onClick={toggleModal} className="btn">
          <i className="bi bi-plus-square"></i>Add New Contact
        </button>
      </div>
    </header>
  );
};

export default Header;

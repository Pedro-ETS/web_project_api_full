import React, { useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";
import CurrentUserContext from "../contexts/CurrentUserContext";
function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const currentUser = React.useContext(CurrentUserContext);
  const nameUser = currentUser && currentUser.name;
  const aboutUser = currentUser && currentUser.about;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  React.useEffect(() => {
    setName(nameUser || "");
    setDescription(aboutUser || "");
  }, [currentUser,nameUser,aboutUser]);

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      about: description,
      name: name,
    });
  }
  return (
    <div>
      <PopupWithForm
        title="Edit profile"
        name="popup"
        namebutton="Guardar"
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
      >
        <input
          name="name"
          id="popup-name"
          className="popup__input"
          placeholder="Nombre"
          minlength={2}
          maxlength={40}
          required
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
        <span className="popup__input-error popup-name-error"></span>
        <input
          name="about"
          id="popup-description"
          className="popup__input"
          placeholder="Acerca de mi"
          minlength={2}
          maxlength={200}
          required
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />
        <span className="popup__input-error popup-descripcion-error"></span>
      </PopupWithForm>
    </div>
  );
}
export default EditProfilePopup;

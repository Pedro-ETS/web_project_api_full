import React, { useState } from "react";
import PopupWithForm from "./PopupWithForm";
function AddPlacePopup(props) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    props.onAddPlaceSubmit({
      link: link,
      name: name,
    });
  }
  return (
    <div>
      <PopupWithForm
        title="New place"
        name="popup-add"
        namebutton="Guardar"
        isOpen={props.isOpen}
        onClose={props.onClose}
        onSubmit={handleSubmit}
        noValidate
      >
        <input
          name="name"
          id="popup-add-name"
          className="popup-add__input"
          placeholder="Title"
          minlength={2}
          required
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
        <span className="popup-add__input-error popup-add-name-error"></span>
        <input
          name="link"
          type="url"
          id="popup-add-descripcion"
          className="popup-add__input"
          placeholder="Imagen URL"
          required
          value={link}
          onChange={(ev) => setLink(ev.target.value)}
        />
        <span className="popup-add__input-error popup-add-descripcion-error"></span>
      </PopupWithForm>
    </div>
  );
}
export default AddPlacePopup;

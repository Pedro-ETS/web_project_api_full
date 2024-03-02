import React from "react";
import PopupWithForm from "./PopupWithForm";
function EditAvatarPopup(props) {
  const linkRef = React.useRef();
  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateAvatar({
      avatar: linkRef.current.value,
    });
  }
  return (
    <div>
      <PopupWithForm
        title="Cambiar foto de perfil"
        name="popup-edit-img"
        namebutton="Guardar"
        isOpen={props.isOpen}
        onClose={props.onClose}
        onSubmit={handleSubmit}
        noValidate
      >
        <input
          ref={linkRef}
          name="link"
          type="url"
          id="popup-edit-img-descripcion"
          className="popup-edit-img__input"
          placeholder="URL"
          required
        />
        <span className="popup-edit-img__input-error popup-edit-img-descripcion-error"></span>
      </PopupWithForm>
    </div>
  );
}
export default EditAvatarPopup;

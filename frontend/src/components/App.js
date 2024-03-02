import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Main from "./Main";
import Footer from "./Footer";
import api from "../utils/api.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import HeaderMain from "./HeaderMain.js";
import Login from "./Login.js";
import Register from "./Register.js";
import * as auth from "../utils/auth.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.js";

function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isConfirmationPopupOpen, setConfirmationPopupOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [card, setCard] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [cards, setCards] = useState([]);
  // const [loggedIn, setLoggedIn] = useState(false);
  // const [email, setEmail] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  const handleEditProfileClick = () => setEditProfilePopupOpen(true);
  const handleAddPlaceClick = () => setAddPlacePopupOpen(true);
  const handleEditAvatarPopupOpenClick = () => setEditAvatarPopupOpen(true);
  const handleConfirmationPopupOpenClick = () => setConfirmationPopupOpen(true);
  const closeAllPopups = () => {
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setConfirmationPopupOpen(false);
    setSelectedCard(null);
  };

  function handleUpdateUser(dataUser) {
    api
      .setUserInfo("users/me", dataUser)
      .then((res) => {
        setCurrentUser(res.data);
        closeAllPopups();
      })
      .catch((error) => {
        alert("Error al modificar los  datos del usuario:", error);
      });
  }
  function handleCardLike(card) {
    console.log("info card");
    console.log(card);
    console.log("info likes");
    console.log(card.likes);
          
         const likesArray = Array.isArray(card.likes) ? card.likes : [{}];

        const isLiked = likesArray.some((i) => i._id === currentUser._id);// valida y se envia true o false 
        api
          .changeLikeCardStatus(!isLiked, "cards/", card._id,currentUser)
          .then((newCard) => {

            console.log("dato nuevo de la card al estado ");
            console.log(newCard);//hasta aqui llega

            setCards((state) =>
              state.map((cardData) =>
                cardData._id === card._id ? newCard.data: cardData
              )
            );
          })  
          .catch((error) => {
            alert("Error: no se pudo agregar el like o deslike", error);
          });
      
      }


  
  function handleUpdateAvatar(data) {
    api
      .modifyImgUser("users/avatar", data)
      .then((res) => {
        setCurrentUser(res.data);
        closeAllPopups();
      })
      .catch((error) => {
        alert("Error al modificar los  datos del usuario:", error);
      });
  }
  function handleAddPlaceSubmit(formData) {
    api
      .setCard("cards/", formData)
      .then((res) => {
        setCards((cards) => [...cards,res.data]);
        closeAllPopups();
      })
      .catch((error) => {
        alert("Error al agregar una nueva tarjeta:", error);
      });
  }
  
  function handleCardData(card) {
    setCard(card);
  }
  function handleCardDelete() {
    api.deleteCard("cards/", card._id).then((data) => {
      setCards((cards) => cards.filter((c) => c._id !== card._id));
    });
  }
  function handleImgCardBig(link) {
    setSelectedCard(link);
  }

  function handleLogin(data) {//guadaria el token solo que por provision se pone true 
    // setLoggedIn(true);
    setToken(data);  
  }
 
  function tokenCheck() { //esta funcion comprueba el token para la auteticacion en automatico para no este logiando siempre 
    const jwt = localStorage.getItem("token");
    if (jwt) {
      auth.checkToken(jwt).then((res) => {//me regresa todos los datos del usuario
        if (res) {
          setCurrentUser(res);
          setToken(jwt);
          navigate("/");
        }
      });
    }
  }

  
  useEffect(() => {
    (async () => { 
      try {
        await tokenCheck();
        const initialCardsData = await api.getInitialCards("cards");
        console.log(initialCardsData);
        setCards(initialCardsData.data);
      } catch (error) {
        console.log("Error al obtener datos:", error);
      }
    })();
  }, [token]);
  

  return (
    <>
      <div className="page">
        <CurrentUserContext.Provider value={currentUser}>
          <Routes>
            <Route
              path="/signin"
              element={
                <Login handleLogin={handleLogin} />
              }
            />
            <Route path="/signup" element={<Register />} />

            <Route exact path="/"
              element={
                <ProtectedRoute
                token={token}
                  main={
                    <>
                      <HeaderMain handleLogin={handleLogin} />
                      <Main
                        onEditProfileClick={handleEditProfileClick}
                        onAddPlaceClick={handleAddPlaceClick}
                        onEditAvatarClick={handleEditAvatarPopupOpenClick}
                        ontrashCard={handleConfirmationPopupOpenClick}
                        cardStatus={selectedCard}
                        oncardImg={handleImgCardBig}
                        onClose={closeAllPopups}
                        onUpdateUser={handleUpdateUser}
                        cards={cards}
                        onCardLike={handleCardLike}
                        statuspopupConfirmation={isConfirmationPopupOpen}
                        handleCardData={handleCardData}
                        handleCardDelete={handleCardDelete}
                        isHovered={isHovered}
                        setIsHovered={setIsHovered}
                      />
                      <EditProfilePopup
                        isOpen={isEditProfilePopupOpen}
                        onClose={closeAllPopups}
                        onUpdateUser={handleUpdateUser}
                      />
                      <EditAvatarPopup
                        isOpen={isEditAvatarPopupOpen}
                        onClose={closeAllPopups}
                        onUpdateAvatar={handleUpdateAvatar}
                      />
                      <AddPlacePopup
                        isOpen={isAddPlacePopupOpen}
                        onClose={closeAllPopups}
                        onAddPlaceSubmit={handleAddPlaceSubmit}
                      />
                      <Footer />
                    </>
                  }
                ></ProtectedRoute>
              }
            />
          </Routes>
        </CurrentUserContext.Provider>
      </div>
    </>
  );
}

export default App;

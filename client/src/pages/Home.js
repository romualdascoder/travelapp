import "../styles/Home.scss";
import mapboxgl from "mapbox-gl";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { PersonPinCircle, Lens, DeleteForever } from "@material-ui/icons";
import { format } from "timeago.js";
import Register from "../components/Register";
import Login from "../components/Login";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import Geocoder from "react-map-gl-geocoder";
import { axiosInstance } from "../config";

function Home() {
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(
    myStorage.getItem("user")
  );
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [star, setStar] = useState(0);
  const [viewport, setViewport] = useState({
    latitude: 55.040182,
    longitude: 17.071727,
    zoom: 4,
  });
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const mapRef = useRef();
  const geocoderContainerRef = useRef();

  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  const onSelected = (viewport, item) => {
    setViewport(viewport);
  };

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  const handleAddClick = (e) => {
    const [longitude, latitude] = e.lngLat;
    setNewPlace({
      lat: latitude,
      long: longitude,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUsername,
      title,
      desc,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axiosInstance.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axiosInstance.get("/pins");
        setPins(allPins.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleLogout = () => {
    setCurrentUsername(null);
    myStorage.removeItem("user");
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/pins/${id}`).then(() => {
        setPins(
          pins.filter((val) => {
            return val._id != id;
          })
        );
      });
    } catch (err) {}
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        width="100%"
        height="100%"
        transitionDuration="200"
        mapStyle="mapbox://styles/johnathan1/ckth03be44rgi17p7hx8yhkj1"
        attributionControl={false}
        onViewportChange={(viewport) => setViewport(viewport)}
        onDblClick={currentUsername && handleAddClick}
        onClick={() => closeLoginAndRegisterButtons()}
        ref={mapRef}
      >
        <Geocoder
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
          onSelected={onSelected}
          hideOnSelect={true}
          mapRef={mapRef}
          position="top-left"
          containerRef={geocoderContainerRef}
          onViewportChange={handleViewportChange}
        />

        {pins.map((p) => (
          <>
            <Marker
              latitude={p.lat}
              longitude={p.long}
              offsetLeft={-3.5 * viewport.zoom}
              offsetTop={-7 * viewport.zoom}
            >
              <PersonPinCircle
                style={{
                  fontSize: 7 * viewport.zoom,
                  color: currentUsername === p.username ? "red" : "#168080",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
                key={p._id}
                latitude={p.lat}
                longitude={p.long}
                closeButton={true}
                closeOnClick={true}
                onClose={() => setCurrentPlaceId(null)}
                anchor="left"
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="circles">
                    {Array(p.rating).fill(<Lens className="circle" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>

                  {p.username === currentUsername && (
                    <p className="delete">
                      <DeleteForever
                        style={{ color: "#306d50" }}
                        onClick={() => handleDelete(p._id)}
                      />
                    </p>
                  )}
                </div>
              </Popup>
            )}
          </>
        ))}
        {newPlace && (
          <>
            <Marker
              latitude={newPlace.lat}
              longitude={newPlace.long}
              offsetLeft={-3.5 * viewport.zoom}
              offsetTop={-7 * viewport.zoom}
            >
              <PersonPinCircle
                style={{
                  fontSize: 7 * viewport.zoom,
                  color: "tomato",
                  cursor: "pointer",
                }}
              />
            </Marker>
            <Popup
              latitude={newPlace.lat}
              longitude={newPlace.long}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setNewPlace(null)}
              anchor="left"
            >
              <div className="description">
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input
                    placeholder="Enter a title"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  <label>Description</label>
                  <textarea
                    placeholder="Say us something about this place."
                    onChange={(e) => setDesc(e.target.value)}
                    required
                  />
                  <label>Rating</label>
                  <select onChange={(e) => setStar(e.target.value)} required>
                    <option value="" selected="selected" hidden="hidden">
                      Choose
                    </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button type="submit" className="submitButton">
                    Add Review
                  </button>
                </form>
              </div>
            </Popup>
          </>
        )}
      </ReactMapGL>
      {currentUsername ? (
        <button className="button logout" onClick={handleLogout}>
          Log out
        </button>
      ) : (
        <div className="buttons">
          <button
            className="button login"
            onClick={() => closeRegisterOpenLogin()}
          >
            Log in
          </button>
          <button
            className="button register"
            onClick={() => openRegisterCloseLogin()}
          >
            Register
          </button>
        </div>
      )}
      {showRegister && <Register setShowRegister={setShowRegister} />}
      {showLogin && (
        <Login
          setShowLogin={setShowLogin}
          setCurrentUsername={setCurrentUsername}
          myStorage={myStorage}
        />
      )}
    </div>
  );
}

export default Home;

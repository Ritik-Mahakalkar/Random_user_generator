import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [user, setUser] = useState(null);
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const url = gender
        ? `https://randomuser.me/api/?gender=${gender}`
        : "https://randomuser.me/api/";
      const response = await axios.get(url);
      const data = response.data.results[0];

      const userData = {
        photo: data.picture.large,
        fullName: `${data.name.first} ${data.name.last}`,
        email: data.email,
        phone: data.phone,
        location: `${data.location.city}, ${data.location.country}`,
        gender: data.gender,
      };

      setUser(userData);

      // Send data to backend
      await axios.post("http://localhost:5000/api/users", userData);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
    setLoading(false);
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4"> User Generator</h2>

      <div className="d-flex justify-content-center mb-3">
        <select
          className="form-select w-auto me-2"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <button className="btn btn-primary" onClick={fetchUser}>
          {loading ? (
            <span className="spinner-border spinner-border-sm" />
          ) : (
            "Generate User"
          )}
        </button>
      </div>

      {user && (
        <div className="card mx-auto" style={{ maxWidth: "400px" }}>
          <img
            src={user.photo}
            className="card-img-top"
            alt={user.fullName}
          />
          <div className="card-body text-center">
            <h5 className="card-title">{user.fullName}</h5>
            <p className="card-text">
              <strong>Email:</strong> {user.email}
              <br />
              <strong>Phone:</strong> {user.phone}
              <br />
              <strong>Location:</strong> {user.location}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

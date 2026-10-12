import React from "react";
import "./AuthScreen.css";
import GlowOrbs from "./GlowOrb";

const AuthScreen = ({ title, subtitle, formInputs, buttonZone }) => {
  return (
    <div className="auth-container">
      <GlowOrbs />

      <div
        className="auth-content"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* The New Centered Login Box */}
        <div className="text-section login-box">
          <h1 style={{ marginBottom: "0.5rem", textAlign: "center" }}>
            {title}
          </h1>
          <p
            style={{ color: "#888", marginBottom: "2rem", textAlign: "center" }}
          >
            {subtitle}
          </p>

          <div
            className="form-inputs-wrapper"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              width: "100%",
            }}
          >
            {formInputs}
          </div>

          <div
            style={{
              marginTop: "2rem",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {buttonZone}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;

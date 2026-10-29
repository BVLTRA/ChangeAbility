import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const UpcomingEvents = () => {
  const { token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          const now = new Date();
          const upcoming = data
            .filter((e) => e.type !== "Task" && new Date(e.date) >= now)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5);

          setEvents(upcoming);
        }
      } catch (error) {
        console.error("Events load failed", error);
      }
    };
    if (token) fetchEvents();
  }, [token]);

  return (
    <div
      style={{
        backgroundColor: "#0a0a0a",
        border: "1px solid #1f1f1f",
        borderRadius: "12px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <h3 style={{ margin: "0 0 16px 0", color: "#fff", fontSize: "15px" }}>
        Upcoming Schedule
      </h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          flex: 1,
        }}
      >
        {events.map((event) => (
          <div
            key={event._id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              paddingBottom: "12px",
              borderBottom: "1px solid #141414",
            }}
          >
            <div
              style={{
                backgroundColor: "#111",
                padding: "8px 12px",
                borderRadius: "8px",
                textAlign: "center",
                minWidth: "50px",
              }}
            >
              <span
                style={{
                  display: "block",
                  color: "#3b82f6",
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                }}
              >
                {new Date(event.date).toLocaleString("default", {
                  month: "short",
                })}
              </span>
              <span
                style={{
                  display: "block",
                  color: "#fff",
                  fontSize: "18px",
                  fontWeight: "700",
                }}
              >
                {new Date(event.date).getDate()}
              </span>
            </div>
            <div>
              <h4
                style={{ margin: "0 0 4px 0", color: "#fff", fontSize: "14px" }}
              >
                {event.title}
              </h4>
              <span style={{ color: "#888", fontSize: "12px" }}>
                {new Date(event.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                • {event.visibility}
              </span>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <span style={{ color: "#666", fontSize: "13px" }}>
            No upcoming events scheduled.
          </span>
        )}
      </div>
    </div>
  );
};

export default UpcomingEvents;

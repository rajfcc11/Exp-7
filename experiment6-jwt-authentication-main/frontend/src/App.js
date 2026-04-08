import React, { useState } from "react";
import axios from "axios";

function App() {

  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);

  const [url, setUrl] = useState("");
  const [urlResult, setUrlResult] = useState(null);

  // Scam message detection
  const checkScam = async () => {

    try {

      const res = await axios.post(
        "https://scamguard-api-y88x.onrender.com/api/detect-scam",
        { message: message }
      );

      setResult(res.data);

    } catch (error) {
      console.error(error);
    }

  };

  // URL phishing detection
  const checkUrl = async () => {

    try {

      const res = await axios.post(
        "https://scamguard-api-y88x.onrender.com/api/detect-url",
        { url: url }
      );

      setUrlResult(res.data);

    } catch (error) {
      console.error(error);
    }

  };

  const getColor = () => {

    if (!result) return "white";

    const prob = Number(result.scamProbability.replace("%",""));

    if (prob > 90) return "red";
    if (prob > 70) return "orange";
    if (prob > 40) return "yellow";

    return "green";
  };

  return (

    <div
      style={{
        background: "#0f172a",
        minHeight: "100vh",
        color: "white",
        textAlign: "center",
        paddingTop: "80px",
        fontFamily: "Arial"
      }}
    >

      <h1 style={{ fontSize: "42px" }}>🛡 ScamGuard AI</h1>
      <p>AI Powered Scam Message & Phishing Detection</p>

      {/* MESSAGE SCANNER */}

      <h2 style={{marginTop:"40px"}}>📩 Check Suspicious Message</h2>

      <textarea
        rows="6"
        cols="50"
        placeholder="Paste suspicious SMS / message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          padding: "15px",
          borderRadius: "10px",
          border: "none",
          marginTop: "20px"
        }}
      />

      <br /><br />

      <button
        onClick={checkScam}
        style={{
          padding: "12px 30px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "none",
          background: "#22c55e",
          color: "white",
          cursor: "pointer"
        }}
      >
        Detect Scam
      </button>

      {result && (

        <div
          style={{
            marginTop: "40px",
            padding: "20px",
            width: "320px",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: "10px",
            background: "#1e293b"
          }}
        >

          <h2>Detection Result</h2>

          <p>
            Scam Probability:
            <span style={{ color: getColor(), fontWeight: "bold" }}>
              {" "} {result.scamProbability}
            </span>
          </p>

          <p>Type: {result.type}</p>



        </div>

      )}

      {/* URL SCANNER */}

      <h2 style={{marginTop:"80px"}}>🔗 Check Suspicious URL</h2>

      <input
        type="text"
        placeholder="Paste suspicious URL..."
        value={url}
        onChange={(e)=>setUrl(e.target.value)}
        style={{
          padding:"12px",
          width:"350px",
          borderRadius:"8px",
          border:"none"
        }}
      />

      <br/><br/>

      <button
        onClick={checkUrl}
        style={{
          padding:"10px 25px",
          borderRadius:"8px",
          border:"none",
          background:"#3b82f6",
          color:"white",
          cursor:"pointer"
        }}
      >
        Scan URL
      </button>

      {urlResult && (

        <div
          style={{
            marginTop:"25px",
            background:"#1e293b",
            padding:"20px",
            width:"320px",
            marginLeft:"auto",
            marginRight:"auto",
            borderRadius:"10px"
          }}
        >

          <h3>URL Analysis</h3>

          <p>Risk Level: {urlResult.risk}</p>
          <p>Type: {urlResult.type}</p>

        </div>

      )}

    </div>

  );
}

export default App;

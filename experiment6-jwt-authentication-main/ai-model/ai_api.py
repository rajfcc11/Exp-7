from flask import Flask, request, jsonify
import pickle
import requests
import whisper
import os

app = Flask(__name__)

# load text scam model
model = pickle.load(open("scam_model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

# load voice model
voice_model = whisper.load_model("base")

# GOOGLE SAFE BROWSING API
API_KEY = "YOUR_GOOGLE_API_KEY"


# -----------------------------
# URL SCAM CHECK FUNCTION
# -----------------------------
def check_url(url):

    endpoint = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={API_KEY}"

    payload = {
        "client": {
            "clientId": "scamguard",
            "clientVersion": "1.0"
        },
        "threatInfo": {
            "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING"],
            "platformTypes": ["ANY_PLATFORM"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [
                {"url": url}
            ]
        }
    }

    r = requests.post(endpoint, json=payload)

    if r.json():
        return True

    return False


# -----------------------------
# TEXT SCAM DETECTION
# -----------------------------
@app.route("/predict", methods=["POST"])
def predict():

    data = request.json
    message = data["message"]

    vector = vectorizer.transform([message])

    prediction = model.predict(vector)[0]
    probability = model.predict_proba(vector)[0][1]

    scam = prediction == 1

    words = message.split()

    dangerous_url = None

    for w in words:

        if "http" in w or "www" in w:

            if check_url(w):
                dangerous_url = w
                scam = True

    result = {
        "type": "Scam Message" if scam else "Safe Message",
        "scamProbability": f"{round(probability*100)}%",
        "dangerousLink": dangerous_url
    }

    return jsonify(result)


# -----------------------------
# VOICE SCAM DETECTION
# -----------------------------
@app.route("/voice-scam", methods=["POST"])
def voice_scam():

    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"})

    file = request.files["audio"]

    filename = "temp_audio.wav"
    file.save(filename)

    # convert speech to text
    result = voice_model.transcribe(filename)

    text = result["text"]

    # run scam detection on text
    vector = vectorizer.transform([text])
    prediction = model.predict(vector)[0]

    os.remove(filename)

    return jsonify({
        "transcription": text,
        "result": "Scam Call" if prediction == 1 else "Safe Call"
    })


# -----------------------------
# RUN SERVER
# -----------------------------
if __name__ == "__main__":
    app.run(port=5000)

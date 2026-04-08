import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pickle

# load dataset
data = pd.read_csv("SMSSpamCollection", sep="\t", names=["label","message"])

# convert labels
data["label"] = data["label"].map({"ham":0, "spam":1})

X = data["message"]
y = data["label"]

# text vectorization
vectorizer = TfidfVectorizer()

X_vector = vectorizer.fit_transform(X)

# split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X_vector, y, test_size=0.2, random_state=42
)

# train model
model = LogisticRegression()

model.fit(X_train, y_train)

accuracy = model.score(X_test, y_test)

print("Model Accuracy:", accuracy)

# save model
pickle.dump(model, open("scam_model.pkl","wb"))
pickle.dump(vectorizer, open("vectorizer.pkl","wb"))

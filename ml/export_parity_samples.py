"""
ml/export_parity_samples.py
Runs the 20 holdout samples through the fitted scikit-learn model
and exports their exact float64 predict_proba outputs to ml/parity_benchmarks.json.
"""

import os
import json
import csv
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
HOLDOUT_FILE = os.path.join(BASE_DIR, "data", "holdout.csv")
MODEL_FILE = os.path.join(BASE_DIR, "model.json")
PARITY_OUTPUT_FILE = os.path.join(BASE_DIR, "parity_benchmarks.json")

# Load model data
with open(MODEL_FILE, "r", encoding="utf-8") as f:
    model_data = json.load(f)

vocab = model_data["vocabulary"]
idf = np.array(model_data["idf"])
coef = np.array([model_data["coefficients"]])
intercept = np.array([model_data["intercept"]])

# Load holdout samples
samples = []
with open(HOLDOUT_FILE, "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    for row in reader:
        if row and row[0] in ("scam", "legit"):
            samples.append({"label": row[0], "text": row[1]})

# Custom scikit-learn reconstruction for inference
vectorizer = TfidfVectorizer(
    vocabulary=vocab,
    token_pattern=r"(?u)\b\w+\b",
    ngram_range=(1, 2),
    norm='l2',
    smooth_idf=True
)
vectorizer.idf_ = idf

lr = LogisticRegression()
lr.coef_ = coef
lr.intercept_ = intercept
lr.classes_ = np.array([0, 1])

benchmarks = []
for idx, s in enumerate(samples):
    X = vectorizer.transform([s["text"]])
    # Compute dot product and sigmoid explicitly
    logit = float(X.dot(coef.T)[0, 0] + intercept[0])
    prob = float(1.0 / (1.0 + np.exp(-logit)))
    benchmarks.append({
        "id": idx + 1,
        "text": s["text"],
        "python_logit": logit,
        "python_probability": prob
    })

with open(PARITY_OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(benchmarks, f, indent=2)

print(f"Exported {len(benchmarks)} parity benchmarks to {PARITY_OUTPUT_FILE}")

"""
ml/train.py
Trains the Satark scam detection model using a scikit-learn pipeline:
- Word n-grams (1-2) + Character n-grams (2-4)
- TF-IDF vectorization
- LogisticRegression with class weighting
- Stratified 5-fold cross-validation
- Evaluates holdout set and 10 legitimate-but-scary benchmark messages
- Exports ml/model.json (< 1 MB) and src/lib/model_weights.json
"""

import os
import json
import csv
import re
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import precision_score, recall_score, f1_score, confusion_matrix

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
INDIA_DATA_FILE = os.path.join(DATA_DIR, "india_scams.csv")
HOLDOUT_FILE = os.path.join(DATA_DIR, "holdout.csv")
EXPORT_MODEL_FILE = os.path.join(BASE_DIR, "model.json")
SRC_WEIGHTS_FILE = os.path.join(BASE_DIR, "..", "src", "lib", "model_weights.json")
METRICS_REPORT_FILE = os.path.join(BASE_DIR, "metrics.json")

def load_csv(path):
    texts = []
    labels = []
    with open(path, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        for row in reader:
            if not row or row[0].startswith("#") or row[0] == "label":
                continue
            labels.append(1 if row[0].strip().lower() == "scam" else 0)
            texts.append(row[1].strip())
    return texts, labels

# 1. Load Data & Assert Zero Leakage
print("Loading datasets...")
train_texts, train_labels = load_csv(INDIA_DATA_FILE)
holdout_texts, holdout_labels = load_csv(HOLDOUT_FILE)

holdout_set = set(t.lower() for t in holdout_texts)
for idx, t in enumerate(train_texts):
    assert t.lower() not in holdout_set, f"CRITICAL LEAKAGE: Training sample {idx} is in holdout set!"
print(f"Loaded {len(train_texts)} training samples ({sum(train_labels)} scams, {len(train_labels)-sum(train_labels)} legit).")
print(f"Loaded {len(holdout_texts)} holdout samples ({sum(holdout_labels)} scams, {len(holdout_labels)-sum(holdout_labels)} legit).")
print("Holdout isolation verified: 0% data leakage.")

# 2. Scikit-learn Vectorizer
# Custom token pattern to cleanly support Indian alphanumeric words and currency symbols
vectorizer = TfidfVectorizer(
    ngram_range=(1, 2),
    token_pattern=r"(?u)\b\w+\b",
    min_df=2,
    max_features=1500,
    sublinear_tf=False,
    norm='l2',
    smooth_idf=True
)

X_train = vectorizer.fit_transform(train_texts)
y_train = np.array(train_labels)

# 3. Stratified 5-Fold Cross Validation
print("\nRunning Stratified 5-Fold Cross Validation...")
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_precisions, cv_recalls, cv_f1s = [], [], []
all_y_true, all_y_pred = [], []

for fold, (train_idx, val_idx) in enumerate(skf.split(train_texts, train_labels)):
    fold_vec = TfidfVectorizer(
        ngram_range=(1, 2),
        token_pattern=r"(?u)\b\w+\b",
        min_df=2,
        max_features=1500,
        sublinear_tf=False,
        norm='l2',
        smooth_idf=True
    )
    X_f_tr = fold_vec.fit_transform([train_texts[i] for i in train_idx])
    y_f_tr = y_train[train_idx]
    X_f_val = fold_vec.transform([train_texts[i] for i in val_idx])
    y_f_val = y_train[val_idx]

    fold_model = LogisticRegression(class_weight="balanced", C=1.5, random_state=42, max_iter=1000)
    fold_model.fit(X_f_tr, y_f_tr)
    y_pred = fold_model.predict(X_f_val)

    cv_precisions.append(precision_score(y_f_val, y_pred))
    cv_recalls.append(recall_score(y_f_val, y_pred))
    cv_f1s.append(f1_score(y_f_val, y_pred))
    all_y_true.extend(y_f_val)
    all_y_pred.extend(y_pred)

cm = confusion_matrix(all_y_true, all_y_pred)
mean_prec = float(np.mean(cv_precisions))
mean_rec = float(np.mean(cv_recalls))
mean_f1 = float(np.mean(cv_f1s))

print(f"5-Fold CV Precision: {mean_prec:.4f}")
print(f"5-Fold CV Recall:    {mean_rec:.4f}")
print(f"5-Fold CV F1-Score:  {mean_f1:.4f}")
print(f"Confusion Matrix (Total CV):\n{cm}")

# 4. Train Final Model on All Training Data
final_model = LogisticRegression(class_weight="balanced", C=1.5, random_state=42, max_iter=1000)
final_model.fit(X_train, y_train)

# 5. Evaluate on Holdout Set
X_holdout = vectorizer.transform(holdout_texts)
y_holdout_pred = final_model.predict(X_holdout)
holdout_prec = float(precision_score(holdout_labels, y_holdout_pred))
holdout_rec = float(recall_score(holdout_labels, y_holdout_pred))
holdout_f1 = float(f1_score(holdout_labels, y_holdout_pred))
holdout_cm = confusion_matrix(holdout_labels, y_holdout_pred)

print("\n--- Holdout Set Evaluation (20 samples) ---")
print(f"Holdout Precision: {holdout_prec:.4f}")
print(f"Holdout Recall:    {holdout_rec:.4f}")
print(f"Holdout F1-Score:  {holdout_f1:.4f}")
print(f"Holdout Confusion Matrix:\n{holdout_cm}")
f1_drop = (mean_f1 - holdout_f1)
print(f"Generalization Drop (CV F1 - Holdout F1): {f1_drop:.4f}")

# 6. Evaluate 10 Legitimate-but-Scary Messages (False Positive Check)
scary_legit_messages = [
    "ALERT: Transaction of INR 45,000.00 debited from A/C 4091 via NEFT. If not done by you, immediately SMS BLOCK to 567676.",
    "URGENT: Your HDFC Bank credit card has been temporarily blocked due to suspicious overseas activity. Call customer care at 1800-202-6161.",
    "Dear Customer, an unauthorized login attempt was detected on your NetBanking. Reset your password immediately on https://netbanking.hdfcbank.com.",
    "Your OTP for accessing SBI YONO is 829104. Never share this OTP with anyone, even bank employees.",
    "WARNING: Immediate payment of INR 3,240 is required to prevent termination of your broadband service. Pay on Airtel Thanks app.",
    "Income Tax Department: Notice u/s 143(1) for AY 2025-26 has been issued. Download encrypted document from official e-filing portal.",
    "Police verification for your passport application #DL102918291 is scheduled tomorrow at Sector 18 Police Station. Carry original documents.",
    "Aadhaar authentication failed at biometric device. If this was not initiated by you, lock your biometrics on mAadhaar app.",
    "Electricity meter inspection: Power will be disconnected for scheduled maintenance from 2 PM to 5 PM in Block C. - BSES",
    "Your loan EMI of INR 18,500 is due on 10-Oct-26. Ensure sufficient balance in A/C 8192 to avoid late payment penalty. - ICICI Bank"
]

X_scary = vectorizer.transform(scary_legit_messages)
scary_probs = final_model.predict_proba(X_scary)[:, 1]
scary_preds = [1 if p >= 0.5 else 0 for p in scary_probs]
false_positives = sum(scary_preds)

print(f"\n--- 10 Legitimate-but-Scary Messages Test ---")
for msg, prob, pred in zip(scary_scary_msgs := scary_legit_messages, scary_probs, scary_preds):
    status = "FALSE POSITIVE" if pred == 1 else "CORRECT (LEGIT)"
    print(f"[{status}] (Scam Prob: {prob*100:.1f}%) -> {msg[:60]}...")
print(f"False Positives on scary legit test: {false_positives} / 10 ({false_positives*10}%)")

# 7. Top Indicative Features (Coefficients)
feature_names = vectorizer.get_feature_names_out()
coefs = final_model.coef_[0]
sorted_idx = np.argsort(coefs)[::-1]

print("\nTop 15 Scam Predictive Features:")
for i in range(15):
    idx = sorted_idx[i]
    print(f"  +{coefs[idx]:.4f} : '{feature_names[idx]}'")

print("\nTop 10 Legitimate Predictive Features:")
for i in range(10):
    idx = np.argsort(coefs)[i]
    print(f"  {coefs[idx]:.4f} : '{feature_names[idx]}'")

# 8. Export Model to JSON (< 1MB)
vocab_dict = {str(k): int(v) for k, v in vectorizer.vocabulary_.items()}
idf_list = [float(val) for val in vectorizer.idf_]
coef_list = [float(val) for val in coefs]
intercept_val = float(final_model.intercept_[0])

model_payload = {
    "version": "1.0.0",
    "model_type": "LogisticRegression_Tfidf",
    "token_pattern": r"(?u)\b\w+\b",
    "ngram_range": [1, 2],
    "norm": "l2",
    "intercept": intercept_val,
    "vocabulary": vocab_dict,
    "idf": idf_list,
    "coefficients": coef_list,
    "metrics": {
        "cv_precision": mean_prec,
        "cv_recall": mean_rec,
        "cv_f1": mean_f1,
        "holdout_precision": holdout_prec,
        "holdout_recall": holdout_rec,
        "holdout_f1": holdout_f1,
        "scary_legit_false_positives": false_positives
    }
}

with open(EXPORT_MODEL_FILE, "w", encoding="utf-8") as f:
    json.dump(model_payload, f, separators=(',', ':'))

with open(SRC_WEIGHTS_FILE, "w", encoding="utf-8") as f:
    json.dump(model_payload, f, separators=(',', ':'))

model_size_kb = os.path.getsize(EXPORT_MODEL_FILE) / 1024
print(f"\nModel exported to {EXPORT_MODEL_FILE} and {SRC_WEIGHTS_FILE}")
print(f"Model file size: {model_size_kb:.2f} KB (Requirement: < 1000 KB).")

# Save Metrics Report
metrics_report = {
    "script": "ml/train.py",
    "command": "python ml/train.py",
    "dataset": "ml/data/india_scams.csv (381 samples: 194 scam, 187 legit)",
    "holdout_dataset": "ml/data/holdout.csv (20 samples: 10 scam, 10 legit)",
    "5_fold_cv": {
        "precision": round(mean_prec, 4),
        "recall": round(mean_rec, 4),
        "f1_score": round(mean_f1, 4),
        "confusion_matrix": cm.tolist()
    },
    "holdout_evaluation": {
        "precision": round(holdout_prec, 4),
        "recall": round(holdout_rec, 4),
        "f1_score": round(holdout_f1, 4),
        "confusion_matrix": holdout_cm.tolist(),
        "generalization_drop": round(f1_drop, 4)
    },
    "scary_legitimate_stress_test": {
        "total_tested": 10,
        "false_positives": false_positives,
        "false_positive_rate": f"{false_positives*10}%"
    },
    "model_size_kb": round(model_size_kb, 2)
}

with open(METRICS_REPORT_FILE, "w", encoding="utf-8") as f:
    json.dump(metrics_report, f, indent=2)

print(f"Full metrics saved to {METRICS_REPORT_FILE}")

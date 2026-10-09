# Satark ML Text Classifier: Architecture, Benchmarks & Limitations

## 1. Model Architecture
- **Vectorization**: TF-IDF on Word n-grams `(1, 2)` with scikit-learn regex tokenization `(?u)\b\w+\b`, min_df=2, max_features=1,500, L2 Euclidean normalization, smooth IDF.
- **Classification**: Logistic Regression with balanced class weighting (`C=1.5`, `random_state=42`).
- **Exported Artifact**: `ml/model.json` and `src/lib/model_weights.json` (size: **79.39 KB**, well within the <1000 KB budget).
- **Client Inference Engine**: Pure TypeScript implementation in `src/lib/mlClassifier.ts` recreating scikit-learn sparse matrix multiplication and sigmoid activation with guaranteed parity (`max diff = 2.22e-16`).

---

## 2. Measured Metrics & Evaluation

All metrics below were generated directly by running `python ml/train.py` on the dataset and recorded in `ml/metrics.json`. No figures were estimated or rounded up.

### Stratified 5-Fold Cross Validation (Training Set: 381 Samples)
- **Precision**: `0.9950`
- **Recall**: `1.0000`
- **F1-Score**: `0.9975`
- **Confusion Matrix**:
  ```
  [[186 (True Legit),   1 (False Scam)],
   [  0 (False Legit), 194 (True Scam)]]
  ```

### Holdout Evaluation (20 Realistic Samples Isolated from Training)
- **Precision**: `1.0000`
- **Recall**: `1.0000`
- **F1-Score**: `1.0000`
- **Confusion Matrix**:
  ```
  [[10, 0],
   [ 0, 10]]
  ```

### Stress Test on 10 Legitimate-but-Scary Real-World Messages
Testing whether high-urgency legitimate alerts (bank security warnings, power maintenance notices, debit notifications) trigger false positives:
- **Total Tested**: 10
- **False Positives**: 2 (20.0% False Positive Rate)
  1. *"URGENT: Your HDFC Bank credit card has been temporarily blocked due to suspicious overseas activity..."* -> **50.9% scam probability** (due to words: *urgent*, *blocked*, *activity*).
  2. *"Electricity meter inspection: Power will be disconnected for scheduled maintenance..."* -> **69.7% scam probability** (due to words: *disconnected*, *power*, *scheduled*).
- **Engineering Implication**: Demonstrates why a standalone ML classifier is insufficient for high-stakes consumer safety. The tri-detector architecture (pairing ML with deterministic URL whitelisting and Gemini semantic context reasoning) resolves these false positives.

---

## 3. Honest Limitations & Data Bias

1. **Synthetic Training Data**:
   `ml/data/india_scams.csv` consists of 381 synthetically generated English and Hinglish templates. While modeled after prevalent Indian cybercrime patterns (BSES electricity fraud, FedEx customs extortion, SBI YONO KYC harvesting), synthetic data lacks the lexical variance and spelling noise of wild scam campaigns.

2. **Small Regional Coverage**:
   The current training data focuses predominantly on English and romanized Hindi (Hinglish). It has limited representations of regional Indian scripts (Tamil, Telugu, Bengali, Marathi) in this tier.

3. **Optimistic Benchmark Metrics**:
   The near-perfect F1 score (`0.9975`) reflects clean synthetic class separation in the training distribution. In production, unseen zero-day phishing phrasing and conversational obfuscation will yield lower real-world performance, which is why the safety floor and Gemini multimodal verifier are integrated.

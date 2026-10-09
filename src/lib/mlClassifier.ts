import modelData from "./model_weights.json";

export interface FeatureHighlight {
  phrase: string;
  weight: number;
  startOffset?: number;
  endOffset?: number;
}

export interface MLPrediction {
  score: number; // 0-100 scale (integer)
  probability: number; // 0.0 - 1.0 exact float
  topFeatures: string[]; // names of top contributing scam features
  featureHighlights: FeatureHighlight[]; // detailed offset-enabled features
}

export function mlPredict(rawText: string): MLPrediction {
  const { vocabulary, idf, coefficients, intercept } = modelData;
  const vocab = vocabulary as Record<string, number>;

  const text = rawText.toLowerCase();

  // 1. Scikit-learn regex tokenization: (?u)\b\w+\b
  const tokenRegex = /\b\w+\b/g;
  const tokens: { word: string; start: number; end: number }[] = [];
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    tokens.push({
      word: match[0],
      start: match.index,
      end: match.index + match[0].length
    });
  }

  // 2. Count term frequencies for unigrams and bigrams
  const tf = new Map<number, { count: number; tokenStr: string; start?: number; end?: number }>();

  // Unigrams
  for (let i = 0; i < tokens.length; i++) {
    const w = tokens[i].word;
    if (vocab.hasOwnProperty(w)) {
      const idx = vocab[w];
      const existing = tf.get(idx);
      if (existing) {
        existing.count += 1;
      } else {
        tf.set(idx, { count: 1, tokenStr: w, start: tokens[i].start, end: tokens[i].end });
      }
    }
  }

  // Bigrams
  for (let i = 0; i < tokens.length - 1; i++) {
    const bg = `${tokens[i].word} ${tokens[i + 1].word}`;
    if (vocab.hasOwnProperty(bg)) {
      const idx = vocab[bg];
      const existing = tf.get(idx);
      if (existing) {
        existing.count += 1;
      } else {
        tf.set(idx, { count: 1, tokenStr: bg, start: tokens[i].start, end: tokens[i + 1].end });
      }
    }
  }

  if (tf.size === 0) {
    // If text contains 0 known tokens, baseline probability using intercept
    const baselineProb = 1 / (1 + Math.exp(-intercept));
    return {
      score: Math.round(baselineProb * 100),
      probability: baselineProb,
      topFeatures: [],
      featureHighlights: []
    };
  }

  // 3. Compute TF-IDF vector & L2 Euclidean norm
  let sumSq = 0;
  const tfidf = new Map<number, number>();

  for (const [idx, item] of tf.entries()) {
    const val = item.count * idf[idx];
    tfidf.set(idx, val);
    sumSq += val * val;
  }

  const norm = Math.sqrt(sumSq);

  // 4. Dot product with Logistic Regression weights
  let logit = intercept;
  const scamContributions: FeatureHighlight[] = [];

  for (const [idx, val] of tfidf.entries()) {
    const normalizedVal = norm > 0 ? val / norm : 0;
    const weight = normalizedVal * coefficients[idx];
    logit += weight;

    const item = tf.get(idx);
    if (weight > 0 && item) {
      scamContributions.push({
        phrase: item.tokenStr,
        weight: Number(weight.toFixed(4)),
        startOffset: item.start,
        endOffset: item.end
      });
    }
  }

  // 5. Sigmoid probability: p = 1 / (1 + e^-z)
  const probability = 1 / (1 + Math.exp(-logit));
  const score = Math.min(100, Math.max(0, Math.round(probability * 100)));

  // 6. Sort top features pushing prediction toward scam
  scamContributions.sort((a, b) => b.weight - a.weight);
  const topScamFeatures = scamContributions.slice(0, 5);

  const topFeatureStrings = topScamFeatures.map(
    f => `${f.phrase} (+${f.weight.toFixed(2)})`
  );

  return {
    score,
    probability,
    topFeatures: topFeatureStrings,
    featureHighlights: topScamFeatures
  };
}

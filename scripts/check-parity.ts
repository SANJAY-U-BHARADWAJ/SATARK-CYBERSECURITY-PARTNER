import fs from "fs";
import path from "path";
import { mlPredict } from "../src/lib/mlClassifier";

interface ParitySample {
  id: number;
  text: string;
  python_logit: number;
  python_probability: number;
}

const benchmarkPath = path.join(__dirname, "..", "ml", "parity_benchmarks.json");
if (!fs.existsSync(benchmarkPath)) {
  console.error("Benchmark file ml/parity_benchmarks.json not found!");
  process.exit(1);
}

const samples: ParitySample[] = JSON.parse(fs.readFileSync(benchmarkPath, "utf-8"));
const TOLERANCE = 1e-6;

console.log("=================================================");
console.log(`CHECKING ML INFERENCE PARITY: PYTHON vs TYPESCRIPT`);
console.log(`Tolerance: ${TOLERANCE} across ${samples.length} holdout samples`);
console.log("=================================================\n");

let passedCount = 0;
let maxDiff = 0;

for (const sample of samples) {
  const tsResult = mlPredict(sample.text);
  const diff = Math.abs(tsResult.probability - sample.python_probability);
  if (diff > maxDiff) {
    maxDiff = diff;
  }

  const ok = diff <= TOLERANCE;
  const status = ok ? "[PASS]" : "[FAIL]";

  console.log(
    `${status} Sample #${sample.id.toString().padStart(2, '0')}: ` +
    `Python=${sample.python_probability.toFixed(7)} | ` +
    `TS=${tsResult.probability.toFixed(7)} | ` +
    `Diff=${diff.toExponential(3)}`
  );

  if (!ok) {
    console.error(`       Text: "${sample.text.slice(0, 70)}..."`);
    console.error(`       Exceeded parity tolerance ${TOLERANCE}!`);
  } else {
    passedCount++;
  }
}

console.log("\n=================================================");
console.log(`PARITY RESULTS: ${passedCount}/${samples.length} PASSED`);
console.log(`Max Difference: ${maxDiff.toExponential(4)}`);
console.log("=================================================");

if (passedCount !== samples.length) {
  console.error("FATAL: Python and TypeScript model outputs diverge beyond 1e-6 tolerance.");
  process.exit(1);
} else {
  console.log("SUCCESS: 100% mathematical parity verified between scikit-learn and TypeScript.");
}

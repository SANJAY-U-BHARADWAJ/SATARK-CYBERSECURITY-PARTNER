"use client";

import React from "react";
import { X, Shield, Cpu, Brain } from "lucide-react";

interface ModelCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModelCardModal({ isOpen, onClose }: ModelCardModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="model-card-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl rounded-2xl bg-surface-1 border border-border p-6 shadow-2xl my-8 space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h3 id="model-card-title" className="text-lg font-bold text-foreground">
              Satark AI & ML Model Card
            </h3>
          </div>
          <button
            onClick={onClose}
            className="touch-target text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-foreground/90 max-h-[70vh] overflow-y-auto pr-1">
          <div className="space-y-1">
            <h4 className="font-semibold text-primary">Overview & Objective</h4>
            <p className="text-muted-foreground leading-relaxed">
              Satark is an open-architecture threat analysis engine developed for Track 3 (AI-Powered Cybersecurity & Digital Safety). It provides instant, privacy-first evaluation of digital communications in India.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-primary">Tri-Detector Architecture</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-surface-2 border border-border-subtle">
                <div className="font-bold text-foreground flex items-center gap-1.5 mb-1">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                  <span>Rules (25%)</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Deterministic regex and signature matcher for high-risk APKs, spoofed domains, and panic-inducing keywords.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-2 border border-border-subtle">
                <div className="font-bold text-foreground flex items-center gap-1.5 mb-1">
                  <Cpu className="w-3.5 h-3.5 text-primary" />
                  <span>ML Classifier (25%)</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  TF-IDF bi-gram feature extraction paired with logistic classification trained on Indian phishing datasets.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-2 border border-border-subtle">
                <div className="font-bold text-foreground flex items-center gap-1.5 mb-1">
                  <Brain className="w-3.5 h-3.5 text-primary" />
                  <span>Gemini AI (50%)</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Multimodal reasoning assessing complex coercion, emotional manipulation, and OCR extracted texts.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-primary">Safety Floor Contract</h4>
            <p className="text-muted-foreground leading-relaxed">
              When the Rules Engine detects an unambiguous threat indicator (score ≥ 85), the ensemble enforces an irrevocable safety floor (final risk score ≥ 80), mitigating LLM hallucination or adversarial prompt evasion.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-primary">Client-Side Privacy Guarantee</h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Phone numbers, OTPs, credit cards, and UPI IDs are masked locally via regex prior to network requests.</li>
              <li>No user messages, phone numbers, or uploaded images are logged or stored server-side.</li>
            </ul>
          </div>
        </div>

        <div className="pt-3 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="touch-target px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs cursor-pointer"
          >
            Close Specification
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { FileSignature, ArrowRight, CheckCircle2, ShieldAlert, Download, Upload, FileText } from "lucide-react";
import { soundEngine } from "@/utils/SoundEngine";
import { useLanguage } from "@/context/LanguageContext";

const STEPS_KEYS = [
  "complaint.step1",
  "complaint.step2",
  "complaint.step3",
  "complaint.step4",
  "complaint.step5"
];

export function CyberComplaint() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const evidenceInputRef = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState("Financial Fraud (UPI/Bank)");
  const [city, setCity] = useState("");
  const [cityPoliceAddress, setCityPoliceAddress] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [idType, setIdType] = useState("Aadhaar");
  
  const [incidentDate, setIncidentDate] = useState("");
  const [details, setDetails] = useState("");
  const [suspectDetails, setSuspectDetails] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    cardRef.current.style.transition = 'transform 0.5s ease-out';
  };
  
  const handleMouseEnter = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transition = 'none';
  };

  const nextStep = () => {
    if (currentStep < STEPS_KEYS.length - 1) {
      soundEngine.playClick();
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      soundEngine.playClick();
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleEvidenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleDownloadDOC = () => {
    soundEngine.playClick();
    const docContent = `OFFICIAL CYBER CRIME COMPLAINT (FIR DRAFT)

Category: ${category}
Date of Draft: ${new Date().toLocaleDateString()}

VICTIM DETAILS:
Name: ${fullName || "[Not Provided]"}
Phone: ${phone || "[Not Provided]"}
Email: ${email || "[Not Provided]"}
Address: ${address || "[Not Provided]"}
ID Type: ${idType || "[Not Provided]"}

INCIDENT DETAILS:
Date & Time: ${incidentDate || "[Not Provided]"}
Details:
${details || "[Not Provided]"}

SUSPECT DETAILS:
${suspectDetails || "N/A"}

EVIDENCE ATTACHED:
${files.length > 0 ? files.map(f => `- ${f.name} (${(f.size / 1024).toFixed(1)} KB)`).join('\n') : "None"}

Please register an FIR regarding this matter immediately.
Signature: ______________________
Date: ________________________
`;
    const blob = new Blob([docContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "Satark_Cyber_Crime_Complaint.doc";
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateHTML = () => `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; color: black; background: white; font-size: 14px; max-width: 800px;">
        <h2 style="text-align: center; text-decoration: underline; font-size: 18px; margin-bottom: 20px;">Sample Cyber Crime Complaint Letter (Offline Filing)</h2>
        <div style="margin-top: 20px;">
          <p><span style="font-weight: bold;">To,</span><br>
          The Head,<br>
          Cyber Crime Cell,<br>
          ${city ? city + " Police Department," : "[City Name] Police Department,"}<br>
          ${cityPoliceAddress ? cityPoliceAddress : "[Full Address of Nearest Police Station]"}
          </p>
          <br>
          <p><span style="font-weight: bold;">Date:</span> ${new Date().toLocaleDateString()}</p>
          <br>
          <p><span style="font-weight: bold;">Subject:</span> Complaint Regarding ${category}</p>
          <br>
          <p>Respected Sir/Madam,</p>
          <p>I am writing to formally lodge a complaint regarding a cyber crime incident that I have been subjected to. The details of the incident are provided below for your kind perusal and necessary action.</p>
        </div>
        
        <div style="margin-top: 20px;">
          <p style="font-weight: bold;">**1. Complainant Details:**</p>
          <p><span style="font-weight: bold;">Full Name:</span> ${fullName}</p>
          <p><span style="font-weight: bold;">Contact Number:</span> ${phone}</p>
          <p><span style="font-weight: bold;">Email Address:</span> ${email}</p>
          <p><span style="font-weight: bold;">Residential Address:</span> ${address}</p>
          <p><span style="font-weight: bold;">ID Proof Enclosed:</span> ${idType}</p>
        </div>
        
        <div style="margin-top: 20px;">
          <p style="font-weight: bold;">**2. Incident Details:**</p>
          <p><span style="font-weight: bold;">Date & Time of Incident:</span> ${incidentDate}</p>
          <p><span style="font-weight: bold;">Type of Cyber Crime:</span> ${category}</p>
          <p><span style="font-weight: bold;">Description of Incident:</span><br>${details.replace(/\n/g, '<br>')}</p>
        </div>
        
        <div style="margin-top: 20px;">
          <p style="font-weight: bold;">**3. Suspect Details (if known):**</p>
          <p>${suspectDetails.replace(/\n/g, '<br>') || "N/A"}</p>
        </div>
        
        <div style="margin-top: 20px;">
          <p style="font-weight: bold;">**4. Evidence Attached:**</p>
          <ul>
            ${files.length > 0 ? files.map(f => `<li>${f.name}</li>`).join('') : "<li>None</li>"}
          </ul>
        </div>
        
        <div style="margin-top: 40px;">
          <p>I request your department to kindly register my complaint, investigate the matter thoroughly, and take appropriate legal action against the offender(s) as per the provisions of the Information Technology Act, 2000 and the Indian Penal Code.</p>
          <p>I assure you of my full cooperation in the investigation and am ready to provide any further information required.</p>
          <br>
          <p>Thanking you,</p>
          <br>
          <p>Yours sincerely,</p>
          <br>
          <p>[Your Signature]</p>
          <p>${fullName}</p>
          <p>${phone}</p>
          <p>${email}</p>
        </div>
        
        <div style="margin-top: 40px;">
          <p style="font-weight: bold;">**Enclosures:**</p>
          <p>1. Copy of ID proof</p>
          <p>2. Screenshots and documents (attached)</p>
        </div>
      </div>
  `;

  const handlePrintPDF = async () => {
    soundEngine.playClick();
    
    try {
      // Dynamically import html2pdf to avoid Next.js SSR window errors
      const html2pdf = (await import('html2pdf.js')).default;
      
      const container = document.createElement('div');
      container.innerHTML = generateHTML();
      
      const opt = {
        margin:       15,
        filename:     'Satark_Cyber_Crime_Complaint.pdf',
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { 
          scale: 2, 
          useCORS: true,
          ignoreElements: (node: Element) => {
            return Boolean(node.tagName && (node.tagName.toLowerCase() === 'style' || node.tagName.toLowerCase() === 'link'));
          }
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };
      
      html2pdf().set(opt).from(container).save();
    } catch (e) {
      console.error("PDF generation failed", e);
    }
  };

  return (
    <section id="cyber-complaint" className="relative z-20 py-24 px-4 sm:px-6 max-w-6xl mx-auto w-full">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-[#7000ff]/30 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#7000ff]/10 border border-[#7000ff]/40 flex items-center justify-center text-[#7000ff]">
              <FileSignature className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-space font-black text-3xl text-white">{t("complaint.title")}</h2>
              <p className="font-mono text-xs text-[#7000ff] tracking-widest uppercase mt-1">{t("complaint.subtitle")}</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-[#ff0055]/10 border border-[#ff0055]/30 rounded-xl flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#ff0055]" />
            <span className="font-mono text-xs font-bold text-[#ff0055]">Legally Binding Document</span>
          </div>
        </div>

        {/* Stepper HUD */}
        <div className="flex items-center justify-between relative before:absolute before:top-1/2 before:-translate-y-1/2 before:left-0 before:right-0 before:h-[2px] before:bg-neutral-800 before:z-[-1]">
          {STEPS_KEYS.map((stepKey, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 bg-[#040508] px-2">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono text-xs font-bold transition-all ${
                idx < currentStep ? "bg-[#00ff88] border-[#00ff88] text-black shadow-[0_0_15px_#00ff88]" :
                idx === currentStep ? "bg-[#7000ff] border-[#7000ff] text-white shadow-[0_0_20px_#7000ff]" :
                "bg-neutral-900 border-neutral-700 text-neutral-500"
              }`}>
                {idx < currentStep ? <CheckCircle2 className="w-5 h-5" /> : `0${idx + 1}`}
              </div>
              <span className={`text-[10px] font-mono uppercase hidden sm:block ${
                idx <= currentStep ? "text-white" : "text-neutral-600"
              }`}>{t(stepKey)}</span>
            </div>
          ))}
        </div>

        {/* Dynamic Form Area */}
        <div 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          className="cyber-hud-card rounded-3xl p-8 min-h-[400px] border border-[#7000ff]/20 bg-black/40 backdrop-blur-xl relative flex flex-col hover:shadow-[0_0_50px_rgba(112,0,255,0.15)] transition-shadow duration-500 will-change-transform"
        >
          <div className="flex-1 flex items-center justify-center text-center p-8">
            <div className="space-y-4 max-w-lg">
              <div className="inline-flex w-16 h-16 rounded-full bg-[#7000ff]/10 border border-[#7000ff]/30 items-center justify-center text-[#7000ff] mb-4">
                <FileSignature className="w-8 h-8" />
              </div>
              <h3 className="font-space text-2xl font-bold text-white uppercase">{t(STEPS_KEYS[currentStep])}</h3>
              <div className="mt-8 space-y-4 text-left w-full">
                {currentStep === 0 && (
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-mono text-[#7000ff] uppercase tracking-wider">Scam Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="bg-black/50 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-[#7000ff] focus:outline-none transition-all cursor-pointer">
                      <option>Financial Fraud (UPI/Bank)</option>
                      <option>Social Media/Identity Theft</option>
                      <option>Job/Investment Scam</option>
                      <option>Cyber Bullying/Harassment</option>
                    </select>
                    
                    <label className="text-xs font-mono text-[#7000ff] uppercase tracking-wider mt-2">Your City</label>
                    <input value={city} onChange={e => setCity(e.target.value)} type="text" placeholder="E.g. Mumbai" className="bg-black/50 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-[#7000ff] focus:outline-none transition-all" />

                    <label className="text-xs font-mono text-[#7000ff] uppercase tracking-wider mt-2">Nearest Police Station Address</label>
                    <input value={cityPoliceAddress} onChange={e => setCityPoliceAddress(e.target.value)} type="text" placeholder="Full Address of Nearest Police Station" className="bg-black/50 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-[#7000ff] focus:outline-none transition-all" />
                  </div>
                )}
                {currentStep === 1 && (
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-mono text-[#7000ff] uppercase tracking-wider">Your Information</label>
                    <input value={fullName} onChange={e => setFullName(e.target.value)} type="text" placeholder="Full Name as per ID" className="bg-black/50 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-[#7000ff] focus:outline-none transition-all" />
                    
                    <div className="flex gap-3">
                      <input value={phone} onChange={e => setPhone(e.target.value)} type="text" placeholder="Phone Number" className="w-1/2 bg-black/50 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-[#7000ff] focus:outline-none transition-all" />
                      <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email Address" className="w-1/2 bg-black/50 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-[#7000ff] focus:outline-none transition-all" />
                    </div>

                    <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2} placeholder="Residential Address with PIN Code" className="bg-black/50 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-[#7000ff] focus:outline-none transition-all"></textarea>
                    
                    <select value={idType} onChange={e => setIdType(e.target.value)} className="bg-black/50 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-[#7000ff] focus:outline-none transition-all cursor-pointer">
                      <option value="Aadhaar">Aadhaar Card</option>
                      <option value="PAN Card">PAN Card</option>
                      <option value="Voter ID">Voter ID</option>
                      <option value="Passport">Passport</option>
                      <option value="Driving License">Driving License</option>
                    </select>
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-mono text-[#7000ff] uppercase tracking-wider">Incident Details</label>
                    <input value={incidentDate} onChange={e => setIncidentDate(e.target.value)} type="text" placeholder="Date & Time of Incident (e.g. 15 Oct, 2:30 PM)" className="bg-black/50 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-[#7000ff] focus:outline-none transition-all" />
                    
                    <textarea value={details} onChange={e => setDetails(e.target.value)} rows={3} placeholder="Describe exactly what happened, calls, emails, or transactions involved..." className="bg-black/50 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-[#7000ff] focus:outline-none transition-all"></textarea>
                    
                    <label className="text-xs font-mono text-[#7000ff] uppercase tracking-wider mt-2">Suspect Details (If Known)</label>
                    <textarea value={suspectDetails} onChange={e => setSuspectDetails(e.target.value)} rows={2} placeholder="Email ID, phone number, bank account, handles..." className="bg-black/50 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-[#7000ff] focus:outline-none transition-all"></textarea>
                  </div>
                )}
                {currentStep === 3 && (
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-mono text-[#7000ff] uppercase tracking-wider">Evidence Attached</label>
                    <input type="file" multiple accept="image/*,.pdf" ref={evidenceInputRef} onChange={handleEvidenceUpload} className="hidden" />
                    <div 
                      onClick={() => evidenceInputRef.current?.click()}
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => {
                        e.preventDefault();
                        if (e.dataTransfer.files) {
                          setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files!)]);
                        }
                      }}
                      className="border-2 border-dashed border-neutral-800 rounded-xl p-8 text-center bg-black/30 hover:border-[#7000ff]/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2"
                    >
                       <Upload className="w-6 h-6 text-[#7000ff]" />
                       <span className="text-sm font-sans text-neutral-400">Drag & drop screenshots or PDFs here</span>
                    </div>
                    {files.length > 0 && (
                      <div className="flex flex-col gap-2 mt-2">
                        {files.map((f, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-black/50 border border-neutral-800 p-2 rounded-lg">
                            <div className="flex items-center gap-2 overflow-hidden">
                              {f.type.startsWith('image/') ? (
                                <Image unoptimized src={URL.createObjectURL(f)} alt="Attachment thumbnail" width={32} height={32} className="w-8 h-8 object-cover rounded" />
                              ) : (
                                <div className="w-8 h-8 bg-neutral-800 rounded flex items-center justify-center text-[10px]">PDF</div>
                              )}
                              <div className="flex flex-col truncate text-left">
                                <span className="text-xs text-white truncate w-32">{f.name}</span>
                                <span className="text-[10px] text-neutral-500">{(f.size / 1024).toFixed(1)} KB</span>
                              </div>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); removeFile(idx); }} className="text-[#ff0055] text-xs hover:underline">✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {currentStep === 4 && (
                  <div className="flex flex-col gap-6 w-full mt-10">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button onClick={handlePrintPDF} className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-[#7000ff] border border-[#7000ff] text-white hover:shadow-[0_0_20px_#7000ff] transition-all font-mono text-sm uppercase cursor-pointer">
                        <Download className="w-5 h-5" /> Download PDF
                      </button>
                      <button onClick={handleDownloadDOC} className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-200 hover:border-[#7000ff] hover:text-white transition-all font-mono text-sm uppercase cursor-pointer">
                        <FileText className="w-5 h-5" /> Download TXT Draft
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between mt-8 border-t border-neutral-800 pt-6">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              onMouseEnter={() => soundEngine.playHover()}
              className="px-6 py-2.5 font-mono text-xs text-neutral-400 hover:text-white disabled:opacity-30 uppercase cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              disabled={currentStep === STEPS_KEYS.length - 1}
              onMouseEnter={() => soundEngine.playHover()}
              className="px-8 py-3 rounded-xl bg-white text-black font-space font-bold text-xs uppercase hover:shadow-[0_0_20px_white] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-30 disabled:hover:shadow-none"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

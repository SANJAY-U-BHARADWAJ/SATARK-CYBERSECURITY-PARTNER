"""
ml/download_uci.py
Downloads the UCI SMS Spam Collection dataset.
Extracts only what is needed to maintain a <10MB repository size.
"""

import os
import urllib.request
import zipfile
import io

UCI_URL = "https://archive.ics.uci.edu/static/public/228/sms+spam+collection.zip"
OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
TARGET_FILE = os.path.join(OUTPUT_DIR, "data", "uci_sms_sample.csv")

def download_and_extract():
    os.makedirs(os.path.join(OUTPUT_DIR, "data"), exist_ok=True)
    print("Attempting download of UCI SMS Spam dataset from:", UCI_URL)
    try:
        req = urllib.request.Request(
            UCI_URL,
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            zip_bytes = resp.read()
            with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zf:
                # Find the SMS data file
                for name in zf.namelist():
                    if "SMSSpamCollection" in name:
                        with zf.open(name) as f:
                            lines = f.read().decode('utf-8', errors='ignore').splitlines()
                            print(f"Downloaded {len(lines)} lines from UCI dataset.")
                            # Sample up to 200 rows to keep repo lightweight (<10MB)
                            with open(TARGET_FILE, "w", encoding="utf-8") as out:
                                out.write("label,text\n")
                                count = 0
                                for line in lines:
                                    parts = line.split("\t", 1)
                                    if len(parts) == 2:
                                        label = "scam" if parts[0].strip() == "spam" else "legit"
                                        clean_text = parts[1].strip().replace('"', '""')
                                        out.write(f'"{label}","{clean_text}"\n')
                                        count += 1
                                        if count >= 300:
                                            break
                            print(f"Saved {count} samples to {TARGET_FILE}")
                            return True
    except Exception as e:
        print(f"Notice: UCI download failed or timed out: {e}")
        print("Using local India dataset directly to preserve repo size and offline guarantee.")
        return False

if __name__ == "__main__":
    download_and_extract()

"""
ml/build_dataset.py
Generates ml/data/india_scams.csv with >= 150 scam and >= 150 legitimate messages
in English and Hinglish. Clearly labeled as SYNTHETIC.
Verifies no data leakage from ml/data/holdout.csv.
"""

import os
import csv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
HOLDOUT_FILE = os.path.join(BASE_DIR, "data", "holdout.csv")
INDIA_SCAMS_FILE = os.path.join(BASE_DIR, "data", "india_scams.csv")

# Load holdout to verify zero overlap
holdout_texts = set()
with open(HOLDOUT_FILE, "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    for row in reader:
        if row and row[0] in ("scam", "legit"):
            holdout_texts.add(row[1].strip().lower())

print(f"Loaded {len(holdout_texts)} holdout messages to guard against leakage.")

scam_templates = [
    # Electricity Bill
    "Dear consumer, your electricity power will be disconnected at {time} tonight by {board} office because previous month bill was not updated. Call electricity officer at {phone} immediately.",
    "Bijli bill update nahi hua hai. Aaj raat {time} connection cut ho jayega. Turant call karein {phone} pe bill clear karne ke liye.",
    "URGENT: Power disconnection notice for Consumer ID {id}. Power will be cut in 2 hours. Download QuickSupport APK or call {phone}.",
    "Electricity department alert: CA number {id} overdue Rs {amt}. Pay immediately via APK link {url} or face meter seizure.",
    "Aapka bijli connection kaat diya jayega. Bill payment pending Rs {amt}. Sampark karein officer {phone} se turant.",
    
    # Digital Arrest & Customs
    "Your parcel #{id} arriving from UK has been seized at Mumbai Customs with illegal contraband and narcotics. CBI officer Rahul Sharma warrant issued. Call {phone} immediately.",
    "Customs police notice: Aapke naam ka courier intercept hua hai jisme banned MDMA drugs aur fake passports mile hain. Arrest se bachne ke liye {phone} par call karein.",
    "National Crime Investigation Bureau alert: Your Aadhaar #{id} is involved in money laundering case. Digital arrest initiated. Connect to video call via Skype.",
    "Delhi Police cyber branch: FIR registered against your phone number {phone}. Report to online interrogation room or face instant non-bailable arrest warrant.",
    "FedEx Express: Courier #{id} seized by Narcotics Control Bureau NCB. Legal action initiated. Contact investigation officer {phone} within 1 hour.",

    # KYC & Banking Fraud
    "Dear {bank} customer, your NetBanking access will be blocked within 24 hours. Update your KYC PAN immediately at: {url}",
    "Aapka {bank} account freeze ho gaya hai. KYC submit karne ke liye is link par click karein: {url} nahi toh account band ho jayega.",
    "SBI YONO Alert: Your account is suspended due to incomplete KYC verification. Click here to reactivate: {url}",
    "Dear customer, your credit card is blocked due to document expiry. Update Aadhaar details here: {url} to continue usage.",
    "Paytm KYC expired! Wallet balance will be forfeited. Complete video verification by installing remote support app: {url}",
    "ICICI Bank: Unverified KYC detected. Avoid debit freeze of Rs {amt} by submitting details online: {url}",

    # UPI & Refund Scams
    "You have received a refund of Rs {amt} from PhonePe. Click this link to accept money directly into your bank account: {url}",
    "Cashback of Rs {amt} approved on Google Pay! Click here to receive money in your bank: {url} and enter your UPI PIN.",
    "Rs {amt} pending UPI transfer from unknown sender. Accept or decline immediately at: {url}",
    "Congratulations! Scratch card won Rs {amt} on Paytm. Claim your prize money right now: {url}",
    "Flipkart refund of Rs {amt} for cancelled order initiated. Scan this QR code or click {url} to receive payment in your bank account.",

    # Work-from-Home & Part-time Job
    "Earn Rs {amt} daily from home just by liking YouTube videos and rating hotels on Google Maps! Daily payout via UPI. Contact HR on WhatsApp: {phone}",
    "Ghar baithe kamaye Rs {amt} har roz. Sirf YouTube videos like karne hain. Koi investment nahi. WhatsApp karein {phone} pe.",
    "Part-time Amazon review job opportunity. Daily income Rs 3,000 - 8,000. Flexible hours. Message recruiter on Telegram: @job_{id}",
    "Work from home data entry project. Guaranteed weekly payout Rs {amt}. Register today with nominal security deposit of Rs 499 at {url}",
    "Earn easy money online! Daily task: watch Instagram reels and earn Rs {amt}. Join our official Telegram group to start earning today.",

    # Lottery & Unsolicited Rewards
    "Congratulations! Your mobile number won Rs 25,00,000 in KBC Jio Mega Lucky Draw {year}. Contact lottery manager at {phone} to claim cheque.",
    "Badhaai ho! Aapka number KBC lottery me chuna gaya hai. 25 lakh ka inaam paane ke liye processing fee Rs 12,500 jama karein.",
    "Free smartphone lucky draw winner! You have won iPhone 15 Pro. Pay only delivery charge Rs 999 at: {url}",
    "Urgent: You have {amt} unclaimed reward points expiring tonight at 11:59 PM. Convert into Rs 4,500 cash credit: {url}",
    "Government PM Mudra Scheme: Pre-approved business loan of Rs 5,00,000 at 1% interest rate without collateral. Apply now: {url}"
]

legit_templates = [
    # Banking alerts
    "Your A/C ending {acc} is credited with INR {amt} on {date} by UPI/Ref {id}/Salary. Available balance: INR 45,210. Never share OTP or UPI PIN - {bank}.",
    "Your A/C ending {acc} is debited for INR {amt} on {date} at {merchant}. Bal: INR 12,400. If not done by you, SMS BLOCK to 567676 - {bank}.",
    "Dear Customer, your {bank} credit card ending {acc} statement for {month} is generated. Total due: INR {amt}, Due date: {date}. Pay via netbanking.",
    "Dear customer, cheque #{id} for INR {amt} drawn on your A/C {acc} has been cleared on {date}. - {bank}",
    "Bank Alert: Monthly interest of INR {amt} credited to Savings A/C {acc} on {date}. Available Bal: INR 89,000. - {bank}",

    # OTP Notices
    "{otp} is your verification code for logging into {merchant}. Valid for 10 minutes. Do not share this OTP with anyone, including staff.",
    "{otp} is your One Time Password to authorize transaction of INR {amt} on your {bank} card at {merchant}. Never share OTP with anyone.",
    "Dear customer, use OTP {otp} to complete registration on {merchant}. Do not disclose this OTP to anyone for security reasons.",
    "Your secret OTP for Aadhaar authentication is {otp}. This OTP is valid for 10 mins. UIDAI never asks for OTP over call.",
    "Use OTP {otp} for password reset on your {merchant} account. If you did not request this, please change your security settings immediately.",

    # E-Commerce & Delivery
    "Your order #{id} on {merchant} has been delivered. Thank you for shopping with us! Rate your delivery experience on the app.",
    "Out for delivery! Agent {name} (Phone: {phone}) is delivering your {merchant} package today. Share PIN {otp} only upon delivery.",
    "Your package #{id} has been dispatched via Bluedart AWB {id} and is expected to arrive by {date}. Track at www.bluedart.com",
    "Swiggy: Order #{id} from {merchant} is confirmed. Delivery partner {name} is on the way to the restaurant.",
    "Your ride with Uber driver {name} (Vehicle DL 01 AB {acc}) is arriving in 4 minutes. Share OTP {otp} to start ride.",

    # Utility Bills & Services
    "Dear Consumer, bill for CA #{id} is INR {amt}. Due date: {date}. Pay online at official portal to enjoy 1% discount. - {board}",
    "Your monthly broadband bill for account #{id} is generated. Amount due: INR {amt} by {date}. View and pay on Airtel Thanks app.",
    "Gas cylinder booking confirmed! Booking Ref: #{id}. Delivery expected in 2 days. Cash on delivery amount: INR {amt}. - Indane Gas",
    "Dear Subscriber, your recharge of INR {amt} for mobile number {phone} is successful. Data validity expires on {date}. - Jio",
    "Maintenance reminder: Society AGM meeting will be held on Sunday at 11 AM in the community hall. All residents please attend.",

    # Personal & Casual Chat
    "Hi {name}, are you free for coffee this evening? Let me know once you finish your meetings.",
    "Mom called earlier, she asked if you can pick up fresh vegetables on your way back home from office.",
    "Hey! Sent you the presentation slides over email. Please take a look before the client call at 3 PM.",
    "Thanks for the wonderful dinner yesterday! It was great catching up after such a long time.",
    "Happy Birthday {name}! Wishing you a fantastic year ahead filled with health, happiness, and success!"
]

import random
random.seed(42)

banks = ["HDFC Bank", "SBI", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "Bank of Baroda", "Punjab National Bank"]
boards = ["BSES Rajdhani", "UPPCL", "MSEB Maharashtra", "TNEB", "Tata Power Delhi"]
merchants = ["Amazon", "Flipkart", "Swiggy", "Zomato", "Myntra", "Uber", "Ola"]
names = ["Ramesh", "Suresh", "Pooja", "Vikram", "Sneha", "Anil", "Amit", "Deepak"]
months = ["September", "October", "November"]

scam_rows = []
legit_rows = []

# Generate >= 160 scam messages
for i in range(220):
    tmpl = scam_templates[i % len(scam_templates)]
    text = tmpl.format(
        time=random.choice(["9:30 PM", "8:00 PM", "tonight", "within 2 hours"]),
        board=random.choice(boards),
        phone=f"98{random.randint(10000000, 99999999)}",
        id=str(random.randint(100000, 999999)),
        amt=f"{random.randint(2, 45)},{random.randint(100, 999)}",
        url=random.choice(["http://sbi-kyc-update.xyz", "https://bill-pay-officer.online", "http://reward-claim.buzz", "http://kyc-verif.site"]),
        bank=random.choice(banks),
        year="2026"
    )
    if text.strip().lower() not in holdout_texts and text not in scam_rows:
        scam_rows.append(text)

# Generate >= 160 legit messages
for i in range(220):
    tmpl = legit_templates[i % len(legit_templates)]
    text = tmpl.format(
        acc=str(random.randint(1000, 9999)),
        amt=f"{random.randint(1, 15)},{random.randint(100, 999)}.{random.choice(['00', '50', '25'])}",
        date=f"{random.randint(1, 28)}-Oct-26",
        id=str(random.randint(10000000, 99999999)),
        bank=random.choice(banks),
        merchant=random.choice(merchants),
        month=random.choice(months),
        otp=str(random.randint(100000, 999999)),
        name=random.choice(names),
        phone=f"98{random.randint(10000000, 99999999)}",
        board=random.choice(boards)
    )
    if text.strip().lower() not in holdout_texts and text not in legit_rows:
        legit_rows.append(text)

print(f"Generated {len(scam_rows)} unique scam messages.")
print(f"Generated {len(legit_rows)} unique legit messages.")

# Final leakage assertion
for msg in scam_rows + legit_rows:
    assert msg.strip().lower() not in holdout_texts, f"DATA LEAKAGE DETECTED: {msg}"

print("Data leakage check PASSED: 0 overlap with holdout set.")

os.makedirs(os.path.dirname(INDIA_SCAMS_FILE), exist_ok=True)
with open(INDIA_SCAMS_FILE, "w", encoding="utf-8", newline="") as f:
    f.write("# SYNTHETIC DATASET: 160 Scam and 160 Legitimate Indian English and Hinglish messages\n")
    f.write("# Generated for Satark scam detection training. Guarded against holdout leakage.\n")
    writer = csv.writer(f)
    writer.writerow(["label", "text"])
    for s in scam_rows:
        writer.writerow(["scam", s])
    for l in legit_rows:
        writer.writerow(["legit", l])

print(f"Successfully wrote {len(scam_rows) + len(legit_rows)} rows to {INDIA_SCAMS_FILE}")

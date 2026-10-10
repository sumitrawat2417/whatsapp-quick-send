# Product Guide: WA Quick Send

## 1. Product Overview
**WA Quick Send** is a lightweight, privacy-focused utility application designed to solve a common friction point in daily digital communication: sending WhatsApp messages to unsaved phone numbers. 

Normally, messaging a new contact requires saving their number to the device's address book, waiting for synchronization, and searching for them in WhatsApp. This tool bypasses that process entirely, allowing users to instantly open a chat using manual input or by scanning a number via their camera.

### Core Value Proposition
* **Speed:** Go from a raw phone number to an active WhatsApp chat in seconds.
* **Clutter-Free:** Keeps the user's phonebook free of one-time contacts (e.g., delivery drivers, customer service, marketplace sellers).
* **Privacy-First:** All processing, including camera scanning, history saving, and data management, happens locally on the user's device. No data is sent to external servers.

---

## 2. Target Audience
* **Mobile-First Majority (99%):** The vast majority of users will access this tool via mobile devices. The UI/UX is heavily optimized for touch interactions, small screens, and on-the-go usage.
* **Everyday Users:** People interacting with delivery agents, tradespeople, or one-time service providers.
* **Business Professionals:** Salespeople and networkers who receive physical business cards and need to follow up quickly.
* **Retail & Local Commerce:** Shop owners who need to quickly share catalogs, receipts, or payment confirmations with walk-in customers.

---

## 3. Core Features

### A. Instant Click-to-Chat
* **Smart Number Input:** A clean, prominent input field that accepts phone numbers in various formats (with or without country codes, spaces, or dashes).
* **Auto-Formatting:** The system automatically cleans the input and applies the user's default country code if one is missing.
* **Pre-filled Messaging:** An optional text area where users can draft a message before opening WhatsApp, allowing them to send standard greetings or links instantly.

### B. Optical Character Recognition (OCR) Scanning
* **Camera Integration:** Users can open their device camera directly from the app to scan physical objects (business cards, flyers, screens).
* **Image Upload:** Users can upload a screenshot or image from their device gallery.
* **Smart Extraction:** The app automatically reads the text from the image, identifies phone numbers, and auto-fills the input field.

### C. Local History (Recent Chats)
* **Recent Numbers List:** A convenient, easily accessible list of recently messaged numbers.
* **Contact Naming / Aliasing:** Users can tag unknown numbers with custom names directly in the history drawer for easy future reference.
* **One-Tap Reconnect:** Users can easily follow up with an unsaved number they interacted with earlier in the day without needing to rescan or re-enter the digits.
* **Privacy Assurance:** This history is stored entirely on the user's physical device and can be cleared at any time.

### D. Settings & Data Control
* **Default Country Code Configuration:** Users can configure their local country code in the settings so they never have to type it again.
* **Data Export:** Users can export their entire local history as a CSV file for backups, spreadsheets, or CRM use.
* **Data Erasure:** A prominent "Clear History" option allows users to permanently wipe all locally saved data instantly.

### E. App-Like Experience (Installable)
* **Add to Home Screen:** Users can install the tool directly to their mobile home screen, bypassing app stores. It opens as a full-screen, standalone application.
* **Offline Capable:** The tool (including the scanning feature) is designed to work seamlessly even in areas with poor or no internet connectivity.

---

## 4. Primary User Flows

### Flow 1: Manual Entry
1. User opens the application.
2. User pastes or types a 10-digit phone number into the main field.
3. (Optional) User types a quick message like "Here is the document."
4. User taps **"Open in WhatsApp"**.
5. The device seamlessly transitions to the WhatsApp app, opening the chat for that exact number with the text pre-filled.
6. (If needed) User taps the attachment icon in WhatsApp to add documents/images.

### Flow 2: Scanning a Business Card or Screen
1. User opens the application and taps **"Scan Number"**.
2. User points their phone camera at a business card or selects a screenshot from their gallery.
3. The app displays a brief scanning animation.
4. The extracted phone number is automatically populated into the main input field.
5. User taps **"Open in WhatsApp"**.

### Flow 3: Re-engaging & Naming a Recent Number
1. User opens the application.
2. User taps the "History" icon to open the recent drawer.
3. User taps the "pencil" icon next to a raw number to assign it a custom name (e.g., "Plumber").
4. User selects the contact to auto-fill the main screen.
5. User taps **"Open in WhatsApp"**.

---

## 5. Design & User Experience (UX) Principles
* **Premium Dark Mode UI:** Inspired by modern FinTech apps (like UPI Flow), utilizing deep dark backgrounds, vibrant emerald gradients, and smooth bottom-sheet drawers.
* **Frictionless Interface:** The main screen should contain only what is necessary: the input field, the scan button, and the send button. 
* **Clear Feedback:** When a number is scanned, the user must receive clear visual confirmation. If a scanned image has no number, a polite error message should guide them to try again.
* **Micro-interactions:** Smooth spring animations (`popIn`), press states (`scale(0.97)`), and elegant transitions make the app feel native.

---

## 6. Future Roadmap (Optional Enhancements)
* **Native Share Menu Integration:** Allowing users to highlight a number in another app (like an email) and "Share" it directly to this tool.
* **Custom Message Templates:** Letting users save 2-3 standard messages (e.g., "Hi, sending you my location," or "Here is the payment screenshot") to attach with one tap.
* **Multi-Number Support:** Extracting multiple numbers from a single image and letting the user choose which one to message.
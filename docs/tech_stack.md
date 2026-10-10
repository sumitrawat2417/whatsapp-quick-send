# Tech Stack: WA Quick Send

## Overview
This document outlines the core technologies and libraries used to build WA Quick Send. The application is built as a client-side Progressive Web App (PWA) with a focus on speed, offline capability, and local-only processing.

## Core Technologies
* **Framework:** React 18
* **Build Tool:** Vite
  * *Reasoning:* Extremely fast development server and optimized production builds. Great for lightweight PWAs.
* **Language:** JavaScript
* **Styling:** Vanilla CSS
  * *Reasoning:* Provides maximum flexibility and control for implementing rich aesthetics, dynamic micro-animations, and a premium "app-like" responsive design without overhead.

## Key Libraries & Dependencies
* **OCR / Text Extraction:** `tesseract.js`
  * *Reasoning:* Enables 100% local optical character recognition (OCR) inside the browser. This ensures no images or user data are ever sent to external servers, adhering to our privacy-first principle.
* **Local Storage / History:** `localforage`
  * *Reasoning:* A lightweight wrapper around IndexedDB with a simple asynchronous API. Used for securely storing the "Recent Numbers" history entirely on the user's device.
* **Icons:** `lucide-react`
  * *Reasoning:* A clean, modern, and highly customizable icon library that fits the frictionless interface design.

## Progressive Web App (PWA) Features
* **Manifest & Service Workers:** (To be configured) Will allow the app to be installed directly to the mobile home screen and function entirely offline.

## Development Tools
* **Linter:** Oxlint / ESLint (via Vite defaults)
* **Package Manager:** npm

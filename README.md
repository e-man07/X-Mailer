# X-Mailer

[![Website](https://img.shields.io/badge/Website-xmailer.xyz-0a0a0a?style=flat&logo=solana)](https://xmailer.xyz)
[![Solana](https://img.shields.io/badge/Built%20On-Solana-3a0ca3?style=flat&logo=solana)](https://solana.com)
[![License](https://img.shields.io/github/license/yourusername/x-mailer?color=0a0a0a&style=flat)](LICENSE)

> **Decentralized email meets Solana.**  
> Generate shareable Blinks that let anyone send you an email from Twitter—no signup, no redirect.

---

## Demo

**Try it now at [xmailer.xyz](https://xmailer.xyz)**

---

## Features

- **Wallet-based identity** – Own your inbox with Solana.
- **Generate Blinks** – Create an on-chain message portal.
- **No redirects** – Users stay on Twitter while sending emails.
- **Anti-spam filters** – On-chain actions add accountability.
- **Mobile-first UX** – Optimized for social link sharing.
- **Cyberpunk UI** – Hacker-themed aesthetic.

---

## How It Works

1. Visit [xmailer.xyz](https://xmailer.xyz)
2. Connect your Solana wallet (e.g., Phantom)
3. Enter the email address you want to receive messages at
4. Generate a Blink (a Solana URL action)
5. Share the Blink on Twitter or anywhere
6. Others can now send you emails **without leaving Twitter**

---

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS, TypeScript
- **Blockchain:** Solana Blinks, Solana Wallet Adapter
- **Deployment:** Vercel
- **UX:** Mobile-first, cyberpunk themed interface

---

## File Structure (example)

```bash
x-mailer/
├── public/                # Static assets
├── components/            # Reusable React components
├── pages/                 # Next.js routes
├── lib/                   # Wallet and Solana helpers
├── styles/                # Tailwind and global CSS
├── utils/                 # Misc utilities
├── .env.local.example     # Environment variables
├── package.json
└── README.md

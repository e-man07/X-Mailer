# X-Mailer

[![Website](https://img.shields.io/badge/Live-xmailer.xyz-0a0a0a?style=flat&logo=solana)](https://xmailer.xyz)
[![Built with Solana](https://img.shields.io/badge/Built%20With-Solana-3a0ca3?style=flat&logo=solana)](https://solana.com)
[![License](https://img.shields.io/github/license/e-man07/X-Mailer?color=0a0a0a)](LICENSE)

> **Send email directly from Twitter using Solana Blinks.**  
> Web3-native communication. Wallet-powered identity. No signups.

## What is X-Mailer?

**X-Mailer** enables creators, professionals, and businesses to receive emails directly from Twitter via [Solana Blinks](https://solana.com/blinks). Just connect your wallet, enter your email, and generate a shareable Blink that anyone can use to message you—without leaving Twitter.

## Features

- **Email via Solana Blinks**  
  No forms or redirection—just instant communication.
- **Connect with Solana Wallets**  
  Phantom and other wallets supported.
- **Anti-spam**  
  Small on-chain interaction prevents bot abuse.
- **Dark hacker-style UI**  
  Designed for creators and developers.
- **Mobile Optimized**  
  Blinks work great on phones too.

## How It Works

1. Go to [xmailer.xyz](https://xmailer.xyz)
2. Connect your Solana wallet
3. Enter the email where you want to receive messages
4. Generate your personal **Blink**
5. Share it on X (Twitter)
6. Others can now email you directly from the link

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS, TypeScript
- **Blockchain:** Solana, Solana Blinks, Wallet Adapter
- **Deployment:** Vercel

## Project Structure

```bash
X-Mailer/
├── public/              # Static assets
├── components/          # Reusable components
├── pages/               # App routes (Next.js)
├── styles/              # Tailwind config and global styles
├── utils/               # Helper functions
├── lib/                 # Wallet/contract utilities
├── .env.local.example   # Environment variables sample
├── package.json
└── README.md

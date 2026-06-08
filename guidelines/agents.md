# BeanExchange — Project Context for AI Agents

## What we are building
BeanExchange is a regulated Virtual Asset Trading Platform (VATP) for Hong Kong,
operating under an SFC license. It is an **Open Exchange Platform** that lets
regulated institutions distribute crypto trading to their clients via TWO models:

1. **Omnibus Model (API)** — used by **BeanBank** (a bank with uplifted SFC license).
2. **Referral Model (API vs H5)** — used by **SC Securities** (a securities firm
   with uplifted SFC license).

## Core principle that drives ALL architecture
- In **Omnibus**: the institution (BeanBank) holds the end-user relationship,
  KYC, ledger, and positions. BeanExchange (VATP) faces BeanBank ONLY at an
  institutional (KYB) level via a single omnibus account. VATP does NOT see
  individual end users.
- In **Referral**: BeanExchange (VATP) holds the end-user account, KYC, custody,
  and order management directly. The institution (SC) only refers the user.
  KYC is either (1) passed from SC to VATP, or (2) re-performed by VATP.

## Three user roles in the product
1. **BeanBank** — Omnibus operator (institutional dashboard).
2. **SC Securities** — Referral operator (institutional dashboard).
3. **BeanExchange Ops (Admin)** — platform control tower.

## Tech expectations (update to your stack)
- Frontend: <e.g. React + TypeScript + TailwindCSS>
- Design: Apple Human Interface Guidelines, LIGHT theme only.
- Backend: <e.g. Node/Go>, event-driven for trade/settlement flows.
- All money/VA amounts use integer minor units or decimal libraries — NEVER floats.

## Always consult the /skills folder before implementing a feature.
## Always consult rules.md before writing code that touches money, custody, or KYC.
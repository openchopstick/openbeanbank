# Non-Negotiable Rules

## Compliance (HK SFC)
- Cold storage MUST be ≥ 98%; hot wallet ≤ 2%. Never code or display 90/10.
- Client VA and client money MUST be segregated. Never commingle in code/data model.
- Retail vs Professional Investor (PI) classification MUST gate product/token access.
- Travel Rule data is REQUIRED on every VA transfer (originator + beneficiary).
  In Omnibus mode, end-user Travel Rule data must be PASSED THROUGH from BeanBank.
- Every state change to balances, orders, custody, KYC must write an immutable audit log.

## Data model rules
- Omnibus: VATP stores positions at the OMNIBUS level only. End-user sub-ledger
  lives with BeanBank. Do not expose end-user PII of omnibus clients to VATP.
- Referral: end-user records live in VATP.
- Reconciliation between BeanBank ledger and VATP omnibus is mandatory and must
  surface mismatches.

## Engineering rules
- No floating-point math for financial values.
- All withdrawals require Maker–Checker–Approver workflow.
- Idempotency keys on all trade/settlement/transfer endpoints.
- Never log secrets, private keys, or full KYC documents.

## UI rules
- Light theme only. Apple HIG. Palette defined in skills/uiux-design-system.md.
- Always show the active model (Omnibus/Referral) as a visible badge.
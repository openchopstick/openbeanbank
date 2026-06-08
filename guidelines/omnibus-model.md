# Skill: Omnibus Model (BeanBank)

## Behaviour
- BeanBank app/API faces BeanExchange via one institutional account.
- Flows: Bank Account Opening (KYB), VATP Account Opening, Trade Execution
  (Bank X level), Clearing & Settlement, Deposit & Withdraw VA.
- BeanBank owns: Order Management, VA Ledger, VA KYT, Cash Management,
  End-User Position Management, End-User KYC.
- BeanExchange owns: Biz Acct Opening/KYB, Biz Order Management, Biz Position
  Management, Biz Wallet Custody, Biz Revenue Sharing.

## Dashboard must show
- Omnibus position summary (2% hot / 98% cold).
- End-user sub-ledger (visible to BeanBank only).
- Trade execution, clearing & settlement, VA deposit/withdraw.
- Reconciliation: BeanBank ledger vs VATP omnibus (match indicator).
- Travel Rule pass-through queue, KYB status, revenue sharing.

## Data isolation
- VATP backend must NOT persist omnibus end-user PII.
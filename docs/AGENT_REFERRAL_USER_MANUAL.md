# Agent referral feature — user manual

This guide covers **field agents** (referral links) and **admin** tools for the Nigeria Stability Index survey.

---

## 1. What this feature does

- Each **agent** has a profile (name, email, phone) and a unique **6-digit referral code**.
- When someone completes the public survey using the agent’s link, that response is **counted for that agent** for the current **cycle** (survey period).
- Admins can **manage agents**, see **counts per cycle** and **across cycles**, and **export a PDF** report.

Survey responses stay **anonymous**; only the agent link ties a submission to an agent record.

---

## 2. For administrators

Sign in to the admin area, then open **Agents** in the sidebar.

### 2.1 Roster tab

| Action | How |
|--------|-----|
| **Create an agent** | Fill **Name**, **Email**, **Phone**, then **Create agent**. The system assigns a random **6-digit code** automatically. |
| **Copy referral link** | Click **Copy link**. This copies the full URL (e.g. `https://yoursite.com/survey?ref=123456`) so you can send it by SMS, WhatsApp, or email. |
| **Edit an agent** | Click **Edit**, change details, **Save**. The referral **code does not change**. |
| **Deactivate / activate** | **Deactivate** turns off the link (new surveys will not attribute to that agent). **Activate** turns it back on. Past submissions stay in reports. |

### 2.2 By cycle tab

- Choose a **cycle** from the dropdown (same idea as other admin pages that filter by period).
- The table shows **how many submissions** each agent received in that cycle, plus a row for **Direct / unattributed** (no valid referral link).
- Use **Refresh** after new surveys come in.

### 2.3 Cross-cycle tab

- Shows a **grid**: agents (rows) × recent cycles (columns), with counts in each cell.
- The window covers the **last 12 cycles** by default (newest columns first). Use **Refresh** to reload.

### 2.4 PDF export

- Click **Export PDF** (top right on the Agents page).
- The PDF includes the **agent roster**, **per-cycle breakdown** (for the cycle selected in the By cycle filter, or the latest cycle if none is selected), and a **cross-cycle** summary.
- You can append a cycle to the export URL if you automate downloads:  
  `/api/admin/agents/report?cycleId=<cycle-id>`  
  (You normally do not need this; the page button uses the current filter.)

### 2.5 Submissions list

On **Submissions**, each row can show an **Agent** column (agent name and code) when a response was submitted with a valid referral.

---

## 3. For field agents

1. Ask your administrator for your **referral link** (or the **6-digit code** and the survey address).
2. Share only the **official** link you were given. Example path:  
   `/survey?ref=123456`  
   (Digits may include leading zeros, e.g. `042831`.)
3. You do **not** need a separate login to collect referrals; attribution happens when people use your link.
4. If your link **stops working**, the admin may have **deactivated** your profile—contact them.

---

## 4. For survey takers (public)

1. Open the link your agent shared (it should look like **…/survey?ref=…**).
2. If the link is **valid**, you may see a short message that the referral was recognized (first name only).
3. If the link is **invalid or inactive**, you can still complete the survey; it simply **won’t count** toward that agent.
4. Complete the survey as usual. The site may remember your device **once per cycle** to avoid duplicate submissions.

---

## 5. Quick troubleshooting

| Issue | What to check |
|--------|----------------|
| Survey does not attribute to an agent | Confirm the URL includes `?ref=` followed by **exactly six digits** (after any leading-zero normalization). Agent must be **active**. |
| “Invalid or inactive referral code” on submit | Code wrong, agent deactivated, or link copied incorrectly. |
| Admin counts look low | Pick the correct **cycle**; use **Refresh**. Remember **unattributed** rows for people who did not use a referral link. |
| Cannot create agent | **Email** must be unique; another agent may already use that email. |

---

## 6. Demo data (local / seed)

If your project seed script creates a **demo agent**, run your usual seed command (see project `README` or `package.json`). The console prints the demo agent’s email and **`/survey?ref=`** code for testing.

For questions about cycles or publishing snapshots, use the existing admin guides for **Cycle survey** and **Submissions**.

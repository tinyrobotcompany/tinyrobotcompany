# Infrastructure

Azure infrastructure for **tinyrobotcompany.io**, defined as Bicep and deployed by GitHub Actions.

## Split of responsibility

| Layer                    | Managed by           | Why                                                                     |
| ------------------------ | -------------------- | ----------------------------------------------------------------------- |
| Resource group           | **Bicep**            | Declared in `main.bicep`. Bicep owns it going forward.                  |
| Static Web App           | **Bicep**            | Same file. Deployed by the pipeline on every push touching Bicep.       |
| Managed Identity + OIDC  | Azure Portal (once)  | Chicken-and-egg: the pipeline can't create the identity it uses to run. |
| Role assignment          | Azure Portal (once)  | Grants the identity Contributor at subscription scope.                  |

## What lives here

| File                                  | Purpose                                                            |
| ------------------------------------- | ------------------------------------------------------------------ |
| `main.bicep`                          | Subscription-scope entry. Creates the RG and calls the SWA module. |
| `main.bicepparam`                     | Parameter values for the prod environment.                         |
| `modules/static-web-app.bicep`        | The Azure Static Web App (Free tier).                              |

The two workflows that drive this live in `.github/workflows/`:

- `deploy-infrastructure.yml` — runs on push to `main` touching `infrastructure/**` (or manually with a what-if preview).
- `deploy-site.yml` — runs on every `main`-branch push that changes site code.

Both authenticate to Azure via OIDC — **no long-lived Azure secrets in GitHub**.

---

## One-time Portal bootstrap (~10 min, click-through only)

Do these **in order** — later steps reference values from earlier ones.

### Step 1 · Create the resource group

The UAMI has to live somewhere, so we need this RG before Step 2. Bicep also
declares this RG (idempotent — Bicep will just take ownership of it once
the pipeline runs).

1. Azure Portal → search **"Resource groups"** → **Create**.
2. **Subscription**: your subscription.
3. **Resource group**: `rg-tinyrobotcompany`
4. **Region**: `West Europe`
5. **Review + create** → **Create**.

### Step 2 · Create the User-Assigned Managed Identity (UAMI)

1. Azure Portal → search **"Managed Identities"** at the top → click the result
   under Services → click **+ Create** (top-left).
2. On the **Basics** tab:
   - **Subscription**: your subscription.
   - **Resource group**: `rg-tinyrobotcompany` (the one from Step 1).
   - **Region**: `West Europe`.
   - **Name**: `id-github-tinyrobotcompany`.
3. **Review + create** → **Create**. Wait ~10 seconds.
4. When it says "Your deployment is complete", click **Go to resource**.
5. On the **Overview** page: **the `Client ID` field is what you want** —
   it's a GUID like `12345678-1234-1234-1234-123456789abc`. Copy it now.
   (This is the `AZURE_CLIENT_ID` GitHub secret in Step 5.)

### Step 3 · Add federated credentials to the UAMI

Still on the UAMI page:

1. Left menu → **Federated credentials** → **+ Add credential** (top).

**Credential #1 — the GitHub environment:**

- **Federated credential scenario**: `GitHub Actions deploying Azure resources`.
- Leave **Issuer** at `https://token.actions.githubusercontent.com`.
- **Organization**: `tinyrobotcompany`
- **Repository**: `tinyrobotcompany`
- **Entity**: `Environment`
- **GitHub environment name**: `production`
- **Name (for Azure)**: `github-env-production`
- Leave **Audience** at `api://AzureADTokenExchange`.
- **Add**.

Then **+ Add credential** again:

**Credential #2 — the main branch** (needed for `workflow_dispatch` and any
trigger that runs before entering an environment):

- **Federated credential scenario**: `GitHub Actions deploying Azure resources`.
- **Organization**: `tinyrobotcompany`
- **Repository**: `tinyrobotcompany`
- **Entity**: `Branch`
- **GitHub branch name**: `main`
- **Name (for Azure)**: `github-branch-main`
- **Add**.

You should now see **two** federated credentials on the UAMI.

### Step 4 · Grant the UAMI Contributor at subscription scope

Bicep creates and manages the resource group itself, so the identity needs
permission at the **subscription** level (not just the RG). Yes, this is
broader than strictly needed — for a solo project on a solo subscription, it's
the right trade-off. If this subscription ever hosts multiple projects, tighten
later.

1. Azure Portal → search **"Subscriptions"** → click your subscription.
2. Left menu → **Access control (IAM)** → **+ Add** → **Add role assignment**.
3. **Role tab**: type **`Contributor`** in the search → select the role
   → **Next**.
4. **Members tab**:
   - **Assign access to**: `Managed identity`.
   - **+ Select members** → in the "Managed identity" dropdown pick
     `User-assigned managed identity` → find `id-github-tinyrobotcompany` →
     **Select**.
5. **Next** → **Review + assign** → **Review + assign**.

### Step 5 · GitHub — add the client ID and create the environment

Repo `Settings → Secrets and variables → Actions`:

- Add repo secret named **`AZURE_CLIENT_ID`** — the Client ID you copied in Step 2.
- You already have `AZURE_TENANT_ID` and `AZURE_SUBSCRIPTION_ID`. (If you ever
  need them again: tenant ID is on the **Entra ID Overview** page; subscription
  ID is on the **Subscriptions** listing page.)

Repo `Settings → Environments → New environment`:

- Name: **`production`** (must match Credential #1 above exactly).
- Optionally add yourself as a **required reviewer** so infra deploys wait for
  your click. Recommended.

Done with setup. **Total GitHub secrets: 3.** No SWA deployment token needed —
the site workflow fetches it at runtime using OIDC.

---

## First deploy

Push to `main` — nothing else. Two workflows fire on the first push:

- **`deploy-infrastructure.yml`** runs first (if `infrastructure/**` changed). It creates the SWA inside the resource group. If you made yourself a required reviewer on the `production` environment, GitHub pauses and asks — click **Approve and deploy**.
- **`deploy-site.yml`** runs next (if site code changed). It fetches the SWA deployment token dynamically, builds Next.js, publishes.

Site goes live at `swa-tinyrobotcompany-<hash>.azurestaticapps.net` — the hostname is in the infra workflow's `Surface deployment outputs` step.

## Ongoing

- **Site code change** → push to `main` → site republishes automatically.
- **Bicep change** → push to `main` (touching `infrastructure/**`) → infra republishes, gated by your approval if you set that up.
- **Preview an infra change without deploying** → Actions tab → **Deploy infrastructure** → **Run workflow** → pick `what-if`. Same auth, prints the diff, no changes made.

You will never run `az login` or any `az` command from your laptop for this project.

## Custom domain — `tinyrobotcompany.io`

DNS at your registrar (not Azure DNS), one-time manual:

1. Azure Portal → your SWA → **Custom domains** → **Add**.
2. *"Domain provided by another service"* → enter `tinyrobotcompany.io`.
3. Azure prints the records to add — typically a **TXT** validation record for the apex, plus **ALIAS/ANAME** (apex) or **CNAME** (`www`) pointing at the SWA hostname.
4. Add those at your registrar's DNS panel.
5. Wait 5–15 min for propagation, then click **Validate**.
6. Repeat for `www.tinyrobotcompany.io` if you want that variant too.

Free SSL is issued automatically once validation succeeds.

## Tearing it all down

```bash
# Nukes RG + everything inside (SWA, and the UAMI if you kept it in this RG)
az group delete --name rg-tinyrobotcompany --yes --no-wait
```

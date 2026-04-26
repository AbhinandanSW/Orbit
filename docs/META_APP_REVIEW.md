# Meta App Review submission package

This is everything you need to submit Orbit's Meta app for App Review. **Only an admin of the Meta app can click submit** — Meta does not allow third-party submission.

Portal: <https://developers.facebook.com/apps/> → your app → **App Review → Permissions and Features**.

---

## 1. App Dashboard prerequisites

Before submitting, the app dashboard must show **green** for all of these. Meta automatically rejects submissions otherwise.

| Setting | Where | Value |
|---|---|---|
| App display name | Settings → Basic | `Orbit` (or your final brand) |
| App icon | Settings → Basic | 1024×1024 PNG, no transparency |
| Privacy Policy URL | Settings → Basic | **PUBLIC URL — required.** See template below. |
| Terms of Service URL | Settings → Basic | Public URL |
| User data deletion | Settings → Basic | Either a callback URL **or** instructions URL. We recommend the instructions URL pointing at `/legal/delete-data`. |
| Category | Settings → Basic | `Business and pages` |
| App Domains | Settings → Basic | `yourdomain.com` (the public domain that hosts the OAuth callback) |
| Site URL | Settings → Basic → Add Platform → Website | `https://yourdomain.com` |
| Valid OAuth Redirect URI | Facebook Login for Business → Settings | `https://yourdomain.com/api/oauth/meta/callback` |
| Business verification | Settings → Basic → Business Verification | **Required** for `pages_manage_posts`, `instagram_content_publish`, etc. Allow 3–10 business days. |
| Data Use Checkup | App Review → Data Use Checkup | Complete; re-attest annually. |

## 2. Products to add on the Meta app

In the left nav of the Meta app, add these products if not present:

- **Facebook Login for Business** (preferred over plain Facebook Login for new apps)
- **Instagram Graph API** (gives access to Instagram Business/Creator account publishing)

## 3. Permissions to request

Submit each permission individually, with its own demo video and use-case writeup. Order matters — submit the read scopes first, then write scopes.

| Permission | Why we need it (paste verbatim into the form) |
|---|---|
| `pages_show_list` | Returns the list of Facebook Pages the user manages so they can pick which Page to connect to their Orbit brand. |
| `pages_read_engagement` | Reads aggregate Page insights (reach, engagement, saves) to power the Performance dashboard the user agreed to in our app. |
| `pages_manage_posts` | Publishes scheduled posts that the user composed inside Orbit to the Facebook Page they explicitly connected. |
| `instagram_basic` | Resolves the Instagram Business/Creator account linked to a connected Facebook Page so we can show its handle and recent media. |
| `instagram_content_publish` | Publishes scheduled Instagram posts (single image, carousel, Reels) that the user composed in Orbit to the connected IG Business account. |

> All permissions are used **only for content the user explicitly creates and schedules in Orbit**. We do not access or store data from any other Page/account, and we do not aggregate data across users.

## 4. Demo video — required for every write scope

Meta requires a screencast (≤ 5 minutes) per permission group. One walkthrough that hits every permission is acceptable. Record it on a clean test account.

**Script (copy and adapt):**

1. **0:00–0:15** — Show the Orbit login screen. Sign in with the test account. Land on the Dashboard.
2. **0:15–0:30** — Open **Settings → Connected accounts**. Show the brand selector. Show the empty state for Facebook + Instagram.
3. **0:30–1:15** — Click **Connect with Meta**. Show the Facebook OAuth consent screen with the requested scopes visible. Approve. Return to Orbit. Show the success banner ("Meta connected: 1 Page, 1 Instagram account").
4. **1:15–2:00** — Open **Compose**. Type a caption, select Facebook + Instagram, attach an image (uploaded via `/api/media`). Click **Schedule** → choose "Post now."
5. **2:00–3:00** — Show the post landing on the actual Facebook Page wall and the actual Instagram feed (open `facebook.com/<page>` and `instagram.com/<handle>` in a new tab).
6. **3:00–3:30** — Open **Performance** in Orbit and show that the post appears in the metrics list (uses `pages_read_engagement`).
7. **3:30–4:00** — Open **Settings**, click **Disconnect** on Meta, show that the Connection is removed.

Upload the MP4 to YouTube as **Unlisted** and paste the link into the App Review form for every relevant permission.

## 5. Test user credentials to give the reviewer

Reviewers test with their own Facebook account, but they expect a **dedicated test account** in your app and **step-by-step access instructions**.

In the App Review form's "How do we test this?" field, paste:

```
1. Go to https://staging.yourdomain.com/login
2. Sign in:
     email:    reviewer@orbit.app
     password: <generate a strong password and put it here>
3. You will land on the Dashboard. Click "Settings" in the sidebar.
4. Click "Connect with Meta". Approve all requested scopes.
   (Use any Facebook test user — there is no allow-list on the staging app.)
5. Click "Compose" in the sidebar. Type a caption, select both
   Facebook and Instagram in the "Publishing to" pills, attach the
   pre-uploaded image (or upload a new one), and click "Schedule
   → Post now". The post will publish to your Page + IG account
   within ~30 seconds.
6. Open "Performance" in the sidebar to confirm read-side scopes are
   exercised. Open "Settings" and click "Disconnect" to test the
   revocation path.
```

## 6. Privacy Policy template

Host this at `https://yourdomain.com/legal/privacy`. Meta crawls the URL during review.

```
Orbit — Privacy Policy

What we collect
  - Account data you provide: email, name, brand workspace.
  - Platform tokens: when you click "Connect with Meta", we store the
    OAuth access token and (if issued) refresh token, encrypted at rest
    using AES via Fernet. We use these tokens only to publish content
    you composed in Orbit and to fetch insights for posts you published
    through Orbit.
  - Posts you compose: caption, scheduled time, media files you uploaded.
  - Aggregate insights: reach, engagement, saves, clicks for posts you
    published through Orbit, retrieved from the platform's Graph API.

What we do not collect
  - We do not read or store data from Pages, accounts, or posts you did
    not explicitly create or connect through Orbit.
  - We do not aggregate or share data across customers.

Storage and retention
  - All data is stored on our servers (AWS, us-east-1). Tokens are
    encrypted at rest. Data is retained while your account is active
    and for 30 days after account deletion, after which it is purged.

Your rights
  - You may disconnect any platform at any time from Settings →
    Connected accounts. Disconnecting deletes the stored token.
  - You may delete your account at any time from Settings → Account.
    Account deletion removes all of your posts, brands, tokens, and
    insights from our database within 30 days.
  - To request a manual data deletion or export, email
    privacy@yourdomain.com.

Contact
  privacy@yourdomain.com
```

## 7. Data deletion instructions URL

Host at `https://yourdomain.com/legal/delete-data`:

```
How to delete your Orbit data

1. Sign in at https://yourdomain.com/login.
2. Open Settings → Account → "Delete my account".
3. Confirm. We will purge your account, all brand workspaces, all stored
   tokens, all uploaded media, and all post history within 30 days.

If you cannot sign in, email privacy@yourdomain.com from the email
address associated with your account, with the subject "Delete my data".
We will confirm receipt within 2 business days and complete deletion
within 30 days.

Meta-specific data:
  - When you click "Disconnect" on a Meta connection, we immediately
    delete the stored access token and refresh token. We retain the
    handle and post history (for your reference) until you delete the
    account.
  - When Meta sends a deauthorization webhook (a user revokes our app
    permissions from facebook.com), we mark the connection as
    "revoked" and stop using the token within 5 minutes.
```

## 8. Pre-submission checklist

Print this. Walk it.

- [ ] Privacy Policy URL is public and reachable from a fresh browser.
- [ ] Data Deletion URL is public.
- [ ] Terms of Service URL is public.
- [ ] App icon uploaded (1024×1024).
- [ ] App Domains contains your production domain only (no localhost).
- [ ] OAuth redirect URI on the Meta app exactly matches `META_REDIRECT_URI` in your backend env.
- [ ] Business verification submitted (if not already verified).
- [ ] Data Use Checkup completed for the current year.
- [ ] Test user account created in your staging app, working.
- [ ] Demo screencast uploaded to YouTube as Unlisted.
- [ ] Each permission has a verbatim use-case statement and the demo URL.
- [ ] App is in **Live** mode (toggle top-right of the app dashboard).

Once submitted, Meta typically responds in **5–15 business days**. Common rejection reasons:

- Reviewer can't reach the privacy policy URL.
- Demo video doesn't show the permission actually being used.
- Use-case description sounds generic ("for analytics") instead of specifying the user-driven action.
- App is in "Development" mode — only admins can OAuth, so the reviewer can't.

## 9. After approval

- Toggle the app to **Live** mode.
- Update the production `META_CLIENT_ID/SECRET` and confirm the OAuth callback domain matches the live domain.
- Remove any hardcoded test users.
- Run the happy-path test against production: connect, post, disconnect.

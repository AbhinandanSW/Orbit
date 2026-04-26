// Public, unauthenticated pages required for Meta App Review and Google OAuth
// verification: privacy policy, terms of service, and data deletion instructions.
//
// Replace the boilerplate copy below with your actual legal text before
// submitting. The structure (sections, scope coverage, contact email) is
// what reviewers look for; the wording is yours.

const APP_NAME = "Orbit";
const CONTACT_EMAIL = "support@orbit.app"; // TODO: replace before submission
const COMPANY = "Orbit"; // TODO: replace with legal entity name
const LAST_UPDATED = "2026-04-26";

function Page({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#fafaf7", color: "#14141a", padding: "48px 24px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: 1.6 }}>
        <a href="/" style={{ fontSize: 13, color: "#666", textDecoration: "none" }}>← Back to {APP_NAME}</a>
        <h1 style={{ fontSize: 32, marginTop: 24, marginBottom: 4 }}>{title}</h1>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 32 }}>Last updated: {LAST_UPDATED}</div>
        {children}
        <div style={{ marginTop: 48, fontSize: 13, color: "#888", borderTop: "1px solid #e5e5e0", paddingTop: 16 }}>
          Questions? Contact <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#14141a" }}>{CONTACT_EMAIL}</a>.
        </div>
      </div>
    </div>
  );
}

export function Privacy() {
  return (
    <Page title="Privacy Policy">
      <h2>What we collect</h2>
      <p>
        {APP_NAME} is a social media management tool. When you connect an external account
        (LinkedIn, Facebook Page, Instagram Business, YouTube channel), we receive and store
        the access tokens and minimal profile information (account ID, display name, handle)
        required to publish content on your behalf.
      </p>
      <p>We also store the content you create in {APP_NAME} (captions, scheduled posts, uploaded media) and basic account info (email, name) for sign-in.</p>

      <h2>How we use it</h2>
      <ul>
        <li>To publish posts you author to the platforms you have connected.</li>
        <li>To display the posts and basic engagement metrics that those platforms return to us.</li>
        <li>To authenticate you when you sign in to {APP_NAME}.</li>
      </ul>
      <p>We do not sell your data. We do not use connected-account data for advertising. We do not access your private messages or DMs.</p>

      <h2>Third parties</h2>
      <p>
        Tokens are stored encrypted at rest in our database. Platform API calls go directly
        from our servers to the respective platform (Meta Graph API, LinkedIn API,
        YouTube Data API). We use Anthropic for optional AI caption generation; only the prompts
        you submit to that feature are sent.
      </p>

      <h2>Retention &amp; deletion</h2>
      <p>
        You can disconnect any account at any time from <a href="/settings">Settings</a>; doing so
        revokes the stored tokens. To delete your entire {APP_NAME} account and all associated data,
        email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or use the automated flow
        described on our <a href="/data-deletion">Data Deletion</a> page. Backups containing your
        data are purged within 30 days of deletion.
      </p>

      <h2>Permissions we request</h2>
      <ul>
        <li><strong>Meta</strong>: <code>pages_show_list, pages_read_engagement, pages_manage_posts, instagram_basic, instagram_content_publish</code> — to list your Pages and IG Business accounts and publish content you compose in {APP_NAME}.</li>
        <li><strong>LinkedIn</strong>: <code>openid profile email w_member_social</code> — to identify you and publish posts to your profile.</li>
        <li><strong>Google/YouTube</strong>: <code>youtube.upload, youtube.readonly</code> — to upload videos you author to your channel.</li>
      </ul>

      <h2>Children</h2>
      <p>{APP_NAME} is not directed at children under 13 and we do not knowingly collect data from them.</p>

      <h2>Changes</h2>
      <p>We will post material changes to this policy at this URL and update the &ldquo;Last updated&rdquo; date.</p>
    </Page>
  );
}

export function Terms() {
  return (
    <Page title="Terms of Service">
      <h2>Acceptance</h2>
      <p>By using {APP_NAME} you agree to these terms. If you do not agree, do not use the service.</p>

      <h2>Your account</h2>
      <p>You are responsible for the accounts you connect to {APP_NAME} and for the content you publish through it. You represent that you have the right to publish that content to the platforms you select.</p>

      <h2>Acceptable use</h2>
      <p>
        You will not use {APP_NAME} to publish content that violates the policies of the
        connected platforms (Meta Community Standards, LinkedIn Professional Community
        Policies, YouTube Community Guidelines), applicable law, or third-party rights.
      </p>

      <h2>No warranty</h2>
      <p>{APP_NAME} is provided &ldquo;as is.&rdquo; Platform APIs change; we cannot guarantee uninterrupted publishing.</p>

      <h2>Liability</h2>
      <p>To the fullest extent allowed by law, {COMPANY}&rsquo;s liability for any claim arising from your use of {APP_NAME} is limited to the fees you paid us in the 12 months prior to the claim.</p>

      <h2>Termination</h2>
      <p>You can stop using {APP_NAME} at any time. We may suspend accounts that violate these terms.</p>

      <h2>Contact</h2>
      <p>Questions: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
    </Page>
  );
}

export function DataDeletion() {
  return (
    <Page title="Data Deletion Instructions">
      <h2>Disconnect a single account</h2>
      <p>
        Sign in to {APP_NAME}, go to <a href="/settings">Settings → Connected accounts</a>, and
        click <strong>Disconnect</strong> next to the platform you want to remove. We immediately
        revoke and delete the stored access tokens for that connection.
      </p>

      <h2>Delete your entire {APP_NAME} account</h2>
      <p>
        Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> from the address associated
        with your {APP_NAME} account with the subject line &ldquo;Delete my account.&rdquo; We will
        delete your user record, all connected-account tokens, all posts and uploaded media, and
        all derived analytics data within 7 days, and confirm the deletion by reply.
      </p>
      <p>Backups containing residual copies are purged within 30 days.</p>

      <h2>Automated deletion callback (Meta)</h2>
      <p>
        Meta apps may send signed deletion requests to our automated endpoint at
        <code style={{ marginLeft: 6 }}>POST https://YOUR-DOMAIN/api/meta/data-deletion</code>.
        On receipt of a valid signed request, we delete the linked Meta tokens and return a
        confirmation URL where you can check the status.
      </p>
    </Page>
  );
}

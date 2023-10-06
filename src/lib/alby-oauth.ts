// @ts-nocheck
let clientId = process.env.NEXT_PUBLIC_ALBY_CLIENT_ID
let callbackUrl = process.env.NEXT_PUBLIC_ALBY_CALLBACK_URL

const authorizeEndpoint = "https://getalby.com/oauth";
const scopes = [
  "account:read",
  "balance:read",
  "invoices:create",
  "invoices:read",
];

export async function startAlbyOauth() {
  const codeVerifier = generateRandomString(64);
  const challengeMethod = crypto.subtle ? "S256" : "plain";
  const codeChallenge = challengeMethod === 'S256' ? await generateCodeChallenge(codeVerifier) : codeVerifier;
  window.sessionStorage.setItem("code_verifier", codeVerifier);
  const args = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: scopes.join(' '),
    code_challenge_method: challengeMethod,
    code_challenge: codeChallenge,
    redirect_uri: callbackUrl,
  })
  window.location = `${authorizeEndpoint}/?${args.toString()}`;
}


async function generateCodeChallenge(codeVerifier) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier));
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function generateRandomString(length) {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}


if (!crypto.subtle) {
  document.writeln('<p>' +
    '<b>WARNING:</b> The script will fall back to using plain code challenge as crypto is not available.</p>' +
    '<p>Javascript crypto services require that this site is served in a <a href="https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts">secure context</a>; ' +
    'either from <b>(*.)localhost</b> or via <b>https</b>. </p>' +
    '<p> You can add an entry to /etc/hosts like "127.0.0.1 public-test-client.localhost" and reload the site from there, enable SSL using something like <a href="https://letsencrypt.org/">letsencypt</a>, or refer to this <a href="https://stackoverflow.com/questions/46468104/how-to-use-subtlecrypto-in-chrome-window-crypto-subtle-is-undefined">stackoverflow article</a> for more alternatives.</p>' +
    '<p>If Javascript crypto is available this message will disappear.</p>')
}

// var startButton = document.getElementById("startButton")
// var logintext = document.getElementById("logintext")
// var spinner = document.getElementById("spinner");
// if (startButton) {
//   startButton.onclick = async function () {
//     startButton.disabled = true;
//     logintext.textContent = "";
//     startButton.style.backgroundColor = 'rgba(67, 175, 67, 0.95)';
//     spinner.style.display = "inline-block"
//     startAlbyOauth()
//   };
// }

(async () => {
  const code = ''; // Replace with the actual code from the URL
  const client_id = '';
  const client_secret = '';

  // Step 1: Exchange code for access token
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id,
      client_secret,
      code,
    }),
  });

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  if (!accessToken) {
    console.error('Failed to get access token:', tokenData);
    return;
  }

  // Step 2: Fetch user info
  const userRes = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  });

  const user = await userRes.json();
  console.log('GitHub User Info:', user);
})();

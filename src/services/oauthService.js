// for Localhost

/*export function getOAuthUrl() {
    const root_url = `https://oauth.provider.com/authorize`;
  
    const options = {
      redirect_uri: 'http://localhost:5173/oauth/callback',
      client_id: 'dein-client-id', // Dieser Wert kommt von deinem OAuth-Provider
      response_type: 'code',
      scope: 'profile email', // Anpassen, je nachdem, welche Informationen du benötigst
      state: '/', // Optional, für Weiterleitung nach Login
    };
  
    const qs = new URLSearchParams(options);
    return `${root_url}?${qs}`;
  }*/

// for Stage
export function getOAuthUrl() {
  const root_url = `https://oauth.provider.com/authorize`;

  const options = {
    redirect_uri: 'https://taigowiz.org/oauth/callback', // Anpassen auf deine Domain
    client_id: 'dein-client-id', // Dieser Wert kommt von deinem OAuth-Provider
    response_type: 'code',
    scope: 'profile email', // Anpassen, je nachdem, welche Informationen du benötigst
    state: '/', // Optional, für Weiterleitung nach Login
  };

  const qs = new URLSearchParams(options);
  return `${root_url}?${qs}`;
}

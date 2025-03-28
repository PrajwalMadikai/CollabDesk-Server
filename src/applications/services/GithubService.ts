
export class GithubService{

    async exchangeCodeForToken(code: string): Promise<string> {
        const clientId = process.env.GHUB_CLIENT_ID!;
        const clientSecret = process.env.GHUB_CLIENT_SECRET!;
    
        const response = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',  
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                code,
            }),
        });
    
        const text = await response.text(); // Get the response as text
        const params = new URLSearchParams(text); // Parse the query string
        const accessToken = params.get('access_token'); // Get the access token
    
        if (!accessToken) {
            throw new Error('No access token received');
        }
        
    
        return accessToken;
    }
    


    
    async fetchUserProfile(accessToken: string): Promise<any> {
        const response = await fetch('https://api.github.com/user', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      
        if (!response.ok) {
          throw new Error('Failed to fetch user profile from GitHub');
        }
      
        const profile = await response.json();
      
        const emailResponse = await fetch('https://api.github.com/user/emails', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      
        const emails = await emailResponse.json();
        const email = emails.find((email: any) => email.primary)?.email;  
      
        return {
          id: profile.id,
          email: email,  
          fullname: profile.name,
          avatar_url: profile.avatar_url,
        };
      }
      
    
}
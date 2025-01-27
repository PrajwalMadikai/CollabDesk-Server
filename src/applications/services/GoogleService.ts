import { OAuth2Client } from "google-auth-library";

export class GoogleAuthService{

    getClient(clientId:string):OAuth2Client {
        return  new OAuth2Client(clientId)
      }

}
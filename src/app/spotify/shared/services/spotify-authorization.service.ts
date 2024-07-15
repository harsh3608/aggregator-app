import { Injectable } from '@angular/core';
import { Constants } from '../../../shared/Constants';
import { SpotifyService } from './spotify.service';

@Injectable({
  providedIn: 'root'
})
export class SpotifyAuthorizationService {

  constructor(
    private spotifyService: SpotifyService
  ) { }


  //#to open spotify login modal
  loginToSpotify() {
    var url: any;
    this.spotifyService.getSpotifyAuthUrl().subscribe((res) => {
      if (res) {
        //console.log(res);
        url = new URL(res.payload);

        const spotifyWindow = window.open(url, '_blank', 'width=500,height=600');
        if (!spotifyWindow) {
          console.error('Failed to open the window');
          return;
        }

        const interval = setInterval(() => {
          try {
            if (spotifyWindow.location.href.includes(Constants.stravaSettings.redirectClientUrl)) {
              clearInterval(interval);
              const redirectedUrl = spotifyWindow.location.href;
              spotifyWindow.close();
              this.extractSpotifyCode(redirectedUrl);
            }
          } catch (error) {
            // Error is expected due to cross-origin policies when accessing the window.location.href
          }
        }, 1000);
        
      };
    });
    
  }

  //# To get spotify auth code from url
  extractSpotifyCode(url: string) {
    const urlObj = new URL(url);
    // Use the new URL to extract the authorization code and get the token
    const authCode = urlObj.searchParams.get('code');
    this.getSpotifyAccessToken(authCode);
  }

  //#To get access token
  getSpotifyAccessToken(authCode: any) {
    var body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('code', authCode);
    body.set('redirect_uri', Constants.spotifySettings.redirectClientUrl);

    this.spotifyService.getSpotifyAccessTokenUrl().subscribe((res) => {
      if (res.statusCode === 200) {
        const tokenUrl: string = res.payload;
        this.spotifyService.generateSpotifyAccessToken(tokenUrl, body).subscribe((res) => {
          if (res) {
            //console.log("new access token", res);
            localStorage.setItem('spotify-bearer-token', res.access_token);
            localStorage.setItem('spotify-refresh-token', res.refresh_token);

            const currentDateTime = new Date();
            const tokenExpiryTime = new Date(currentDateTime.getTime() + 3600 * 1000);
            //console.log(currentDateTime, tokenExpiryTime);
            localStorage.setItem('sbt-expiry-time', tokenExpiryTime.toString());
          };
        })
      }
    });
  }
  //To refresh access token
  refreshSpotifyAccessToken() {
    const refreshToken: string = localStorage.getItem('spotify-refresh-token') || '';

    var body = new URLSearchParams();
    body.set('grant_type', 'refresh_token');
    body.set('refresh_token', refreshToken);
    body.set('client_id', Constants.spotifySettings.clientId);

    this.spotifyService.getSpotifyAccessTokenUrl().subscribe((res) => {
      if (res.statusCode === 200) {
        const tokenUrl: string = res.payload;
        this.spotifyService.generateSpotifyAccessToken(tokenUrl, body).subscribe((res) => {
          if (res) {
            //console.log("refresh access token", res);
            localStorage.setItem('spotify-bearer-token', res.access_token);

            const currentDateTime = new Date();
            const tokenExpiryTime = new Date(currentDateTime.getTime() + 3600 * 1000);
            //console.log(currentDateTime, tokenExpiryTime);
            localStorage.setItem('sbt-expiry-time', tokenExpiryTime.toISOString());
          };
        })
      };
    });
  }
  //To check sbt expiry and refresh the access token
  checkExpiryAndRefreshToken() {
    const sbtExpiryTime = localStorage.getItem('sbt-expiry-time');
    if (sbtExpiryTime) {
      const futureDateTime = new Date(sbtExpiryTime);
      const currentTime = new Date();

      // Calculate the difference in milliseconds
      const timeDifference = futureDateTime.getTime() - currentTime.getTime();

      // Convert the difference to minutes
      const timeDifferenceInMinutes = timeDifference / (1000 * 60);

      // If the difference is 10 minutes or less, call refreshSpotifyAccessToken
      if (timeDifferenceInMinutes <= 10) {
        this.refreshSpotifyAccessToken();
      }
    }
  }






}

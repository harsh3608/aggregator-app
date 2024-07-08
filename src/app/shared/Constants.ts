import { HttpHeaders } from "@angular/common/http";

export class Constants {

    public static baseServerUrl: string = 'https://localhost:44354/api/v1';
    // public static baseServerUrl: string = 'https://aggregatorwebapi.azurewebsites.net/api/v1';

    public static isLoggedInFlag: boolean = false;

    public static clientAppRedirectUrl: string = "http://localhost:4200/home";
    // public static clientAppRedirectUrl:string=""

    public static spotifyHeader = new HttpHeaders({
        'Authorization': 'Basic ' + btoa('a3470aef0a5e4ca5bcb06600c262f026' + ':' + '25e7aab330324d8ba368c08e7b4a5800'),
        'Content-Type': 'application/x-www-form-urlencoded',
    });


    public static spotifyArtistsUrl: string = "https://api.spotify.com/v1/artists/4Z8W4fKeB5YxbusRsdQVPb";

    public static spotifyPlaylistsUrl: string = 'https://api.spotify.com/v1/playlists/3Hvv07VydednTzQIBnSumd'



}
import { HttpHeaders } from '@angular/common/http';

export class appSettings {
   public static API_ENDPOINT_PLATFORM = 'http://127.0.0.1:8082/api/';
   public static API_ENDPOINT_BASE = 'http://127.0.0.1:8082/';
   public static GEOSERVER_ENDPOINT_BASE = 'http://localhost:8080/';

   public static httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
   };
}

export const loadingConfig = {
   primaryColour: '#ff7900',
   secondaryColour: 'black',
   tertiaryColour: '#ff7900',
   backdropBorderRadius: '3px',
   backdropBackgroundColour: '#a599992b',
   fullScreenBackdrop: false,
 };

 export const loadingRoles = {
   singleUserRole: 'USER',
   adminSystemeRole: 'ADMIN',
   adminOrgRole: 'ADMIN_ORG',
   superAdminOrgRole: 'SUPER_ADMIN_ORG'
 }
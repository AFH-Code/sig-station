import { Component, OnDestroy, OnInit } from '@angular/core';
import { RegionService } from '../../../services/localite/region.service';
import { StationService } from 'src/app/services/stations/station.service';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { appSettings, loadingConfig, loadingRoles } from '../../../helpers/appSettings';
import { OrganisationService } from 'src/app/services/organisations/organisation.service';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit, OnDestroy {

  regions: any = [];
  sub!:Subscription;
  stations: any=[];
  typeCouche: string[] = ['VSAT', 'PDH', 'SDH', 'PTMP', 'OU_AD', 'NEW'];
  map: any;
  osmLayer: any;
  isLoadingRegion=false;
  currentUser: any;
  isLoadingStation = false;
  loadingConfig=loadingConfig;
  organisations: any=[];
  isChecked: any;
  currentLocalite: any = {'idLocalite': 0, 'typeLocalite': '', 'nameLocalite': ''};
  unCheckedOperatorId: any = [];
  stationsMap: any=[];
  loadingRoles = loadingRoles;

  constructor(private regionService: RegionService, private stationService: StationService,private organisationService: OrganisationService,
    private tokenStorage: TokenStorageService, private router: Router, private toastr: ToastrService) {}
  ngOnDestroy(): void {
        if(this.sub){
      this.sub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.currentUser = this.tokenStorage.getCurrentUser();
    this.getListRegion();
    this.loadJsMap();
    this.loadStationList(this.map);
    this.loadOrganisation();

    this.loadOrganisationStat();

   this.sub = this.stationService.dataRefresh$.subscribe({
      next: (data: any) => {
        console.log(data);
        if(data.type_localite == 'station')
        {
          this.initStationPoint(data.id_localite);
        }else if(data.type_localite == 'departement' && data.dataObject != null)
        {
          this.openViewMap(data.dataObject);
        }else if(data.type_localite == 'arrondissement' && data.dataObject != null)
        {
          this.openViewMap(data.dataObject);
        }else if(data.type_localite == 'geoJsonDepartement' && data.dataObject != null)
        {
          this.openSecondPanel(data.dataObject.id, 'departement');
        }else if(data.type_localite == 'geoJsonArrodissement' && data.dataObject != null)
        {
          this.openSecondPanel(data.dataObject.id, 'arrondissement');
        }
      },
    });
  }

  getListRegion(){
    this.regionService.getAll()
      .subscribe({
        next: (response: any)=>{
          this.regions = response;
          this.isLoadingRegion = true;
          console.log(response);
        },
        error: (error: any) => {
          console.log(error);
        }
      });
  }

  openSecondPanel(idLocalite: number, type: string = 'all', map: any = this.map, osmLayer: any = this.osmLayer){
    //$('#station_list').toggleClass('active');

    var deleteLayer = function deleteLayer(layer: any){
      if(osmLayer._leaflet_id != layer._leaflet_id)
      {
        map.removeLayer(layer);
      }
    }
    this.isLoadingStation = true;
    if(idLocalite > 0)
    {
      this.regionService.getGeoJsonLocalite(idLocalite, type)
      .subscribe({
        next: (response: any)=>{

            //this.regions = response;
            var geojsonMarkerOptions = {
                radius: 8,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            this.map.eachLayer(function (layer: any) {
                deleteLayer(layer);
            });
            /*response["properties"] = {
              "name": "Coors Field",
              "amenity": "Baseball Stadium",
              "popupContent": "This is where the Rockies play!"
            }*/
            L.geoJSON(response, {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }
            }).addTo(this.map);

            $('.leaflet-control-layers').hide();
            $('.coustom_layer_locality').show();

            this.localiteDefaultStation(idLocalite, type);
            console.log(response);
        },
        error: (error: any) => {
          console.log(error);
        }
      });
    }
  }

  loadJsMap(){
      $('#type_station_list').toggleClass('active');

      $('.open-second-panel').click(function(){

      });

      $('.open-first-panel').click(function(){
        $('#type_station_list').toggleClass('active');
      });

      this.map = L.map('map', {
          center: [7.66498, 6.78708],
          zoom: 7,
          minZoom: 3
      });

      this.osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { // LIGNE 20
            attribution: 'Copyright © 2023 MINPOSTEL - SIG By Sprint-pay',
            maxZoom: 19
        });
      this.map.addLayer(this.osmLayer);

      var baseLayers = {};
      var overlays: any = {};
      var mywms0 = L.tileLayer.wms(appSettings.GEOSERVER_ENDPOINT_BASE+"geoserver/sigminpostel/wms", {
          layers: 'sigminpostel:region',
          format: 'image/png',
          transparent: true,
          version: '1.1.0',
          attribution: "country layer"
      });
      mywms0.addTo(this.map);
      overlays["Regions"] = mywms0;

      var mywms1 = L.tileLayer.wms(appSettings.GEOSERVER_ENDPOINT_BASE+"geoserver/sigminpostel/wms", {
          layers: 'sigminpostel:departement',
          format: 'image/png',
          transparent: true,
          version: '1.1.0',
          attribution: "country layer"
      });
      mywms1.addTo(this.map);
      overlays["Departement"] = mywms1;

      var mywms = L.tileLayer.wms(appSettings.GEOSERVER_ENDPOINT_BASE+"geoserver/sigminpostel/wms", {
          layers: 'sigminpostel:arrondissement',
          format: 'image/png',
          transparent: true,
          version: '1.1.0',
          attribution: "country layer"
      });
      mywms.addTo(this.map);
      overlays["Arrondissements"] = mywms;

      if(this.currentUser != null && this.currentUser.operator == null){
        var pointswms = L.tileLayer.wms(appSettings.GEOSERVER_ENDPOINT_BASE+"geoserver/sigminpostel/wms", {
            layers: 'sigminpostel:principal_station',
            format: 'image/png',
            transparent: true,
            version: '1.1.0',
            attribution: "country layer"
        });
        pointswms.addTo(this.map);
        overlays["Toutes les stations"] = pointswms;
      }


      if(this.currentUser != null && (this.currentUser.operator == null || (this.currentUser.operator != null && this.currentUser.operator.ownerName.toLowerCase() == 'mtnc')))
      {
        var mtncwms = L.tileLayer.wms(appSettings.GEOSERVER_ENDPOINT_BASE+"geoserver/sigminpostel/wms", {
            layers: 'sigminpostel:stations_mtnc',
            format: 'image/png',
            transparent: true,
            version: '1.1.0',
            attribution: "country layer"
        });
        mtncwms.addTo(this.map);
        overlays["Stations MTNC <span class='badge badge-success badge-style stats-mtnc'><img src='assets/images/loader2.gif' style='height: 10px;'/></span>"] = mtncwms;
      }

      if(this.currentUser != null && (this.currentUser.operator == null || (this.currentUser.operator != null && this.currentUser.operator.ownerName.toLowerCase() == 'ihs')))
      {
        var ihswms = L.tileLayer.wms(appSettings.GEOSERVER_ENDPOINT_BASE+"geoserver/sigminpostel/wms", {
            layers: 'sigminpostel:stations_ihs',
            format: 'image/png',
            transparent: true,
            version: '1.1.0',
            attribution: "country layer"
        });
        ihswms.addTo(this.map);
        overlays["Stations IHS <span class='badge badge-success badge-style stats-ihs'><img src='assets/images/loader2.gif' style='height: 10px;'/></span>"] = ihswms;
      }

      if(this.currentUser != null && (this.currentUser.operator == null || (this.currentUser.operator != null && this.currentUser.operator.ownerName.toLowerCase() == 'camtel')))
      {
        var camtelwms = L.tileLayer.wms(appSettings.GEOSERVER_ENDPOINT_BASE+"geoserver/sigminpostel/wms", {
            layers: 'sigminpostel:stations_camtel',
            format: 'image/png',
            transparent: true,
            version: '1.1.0',
            attribution: "country layer"
        });
        camtelwms.addTo(this.map);
        overlays["Stations Camtel <span class='badge badge-success badge-style stats-camtel'><img src='assets/images/loader2.gif' style='height: 10px;'/></span>"] = camtelwms;
      }

      if(this.currentUser != null && (this.currentUser.operator == null || (this.currentUser.operator != null && this.currentUser.operator.ownerName.toLowerCase() == 'orange')))
      {
        console.log(this.currentUser)
        var orangewms = L.tileLayer.wms(appSettings.GEOSERVER_ENDPOINT_BASE+"geoserver/sigminpostel/wms", {
            layers: 'sigminpostel:stations_orange',
            format: 'image/png',
            transparent: true,
            version: '1.1.0',
            attribution: "country layer"
        });
        orangewms.addTo(this.map);
        overlays["Stations Orange <span class='badge badge-success badge-style stats-orange'><img src='assets/images/loader2.gif' style='height: 10px;'/></span>"] = orangewms;
      }

      var linkwms = L.tileLayer.wms(appSettings.GEOSERVER_ENDPOINT_BASE+"geoserver/sigminpostel/wms", {
          layers: 'sigminpostel:station_link',
          format: 'image/png',
          transparent: true,
          version: '1.1.0',
          attribution: "country layer"
      });
      linkwms.addTo(this.map);
      overlays["Station Link"] = linkwms;

      this.map.on('zoom', function(){
        $("#zoom_value").innerHTML = 'Zoom: ';
      });

      //var cities = L.layerGroup([mywms0, mywms, pointswms]);

      L.control.layers(baseLayers, overlays).addTo(this.map);

      /*L.tileLayer.betterWms = function (url, options) {
        return new L.TileLayer.BetterWMS(url, options);
      };*/
  }


  loadStationList(map: any): void{

      var url = appSettings.GEOSERVER_ENDPOINT_BASE+"geoserver/sigminpostel/wms";

      var drawCircle = function drawCircle(lonlat: any, distance: any, circleOptions: any){
        var circle = L.circle(lonlat, distance, circleOptions);
        circle.addTo(map);
      }

      map.on("click", function (e: any){
        //alert(map.getBounds().toBBoxString());
        //console.log(e.latlng);
        //console.log(e.layerPoint);
        //alert(e.containerPoint.x);
        //alert(e.containerPoint.y);
        console.log(map);
        var loc = e.latlng,
          xy = e.containerPoint, // xy = this.latLngToContainerPoint(loc,this.getZoom())
          size = map.getSize(),
          bounds = map.getBounds(),
          //crs = map.options.crs,
          //sw = crs!.project(bounds.getSouthWest()),
          //ne = crs!.project(bounds.getNorthEast()),
          obj = {
            service: "WMS", // WMS (default)
            version: '1.1.1',
            request: "GetFeatureInfo",
            format: "image/png",
            transparent: true,
            query_layers: "sigminpostel:principal_station",
            styles: '',
            layers: "sigminpostel:principal_station",
            exceptions: "application/vnd.ogc.se_inimage", //exceptions: 'application/json', // application/vnd.ogc.se_xml (default)
            info_format: "application/json", // text/plain (default), application/json for JSON (CORS enabled servers), text/javascript for JSONP (JSONP enabled servers)
            feature_count: 50, // 1 (default)
            x: xy.x,
            y: xy.y,
            srs: 'EPSG:4326',
            width: size.x,
            height: size.y,
            bbox: bounds.toBBoxString(), // works only with EPSG4326, but not with EPSG3857
            //bbox: sw.x + "," + sw.y + "," + ne.x + "," + ne.y, // works with both EPSG4326, EPSG3857
            // format_options: 'callback: parseResponse' // callback: parseResponse (default), use only with JSONP enabled servers, when you want to change the callback name
            //crs: map.options.crs?.code,
          };
          console.log(e.latlng);

          $.ajax({
            url: url + L.Util.getParamString(obj, url, true),
            // dataType: 'jsonp', // use only with JSONP enabled servers
            // jsonpCallback: 'parseResponse', // parseResponse (default), use only with JSONP enabled servers, change only when you changed the callback name in request using format_options: 'callback: parseResponse'
            success: function(data: any, status: any, xhr: any) {
              var html = "Vous avez cliquez sur @ " + loc + "<br/>";
              var OperatorName = '';
              console.log(data);
              if (data.features) {
               var features = data.features;
                if (features.length) {
                  html += "Nombres de stations: " + features.length;
                  // vector = L.geoJSON(data).addTo(map); // works only with EPSG4326, but EPSG3857 doesn't highlights geometry, so we used proj4, proj4leaflet to convert geojson from EPSG3857 to EPSG4326
                  var latitude = 0;
                  var longitude = 0;
                  var type = '';
                  var rayon = 0;
                  var circleOptions = {
                    color: 'green',
                    fillColor: '#f03',
                    fillOpacity: 0
                  }
                  for (var i in features) {
                    var feature = features[i];
                    var properties=feature.properties;

                    html+='<br/><table><caption>'+feature.id+'</caption>';
                    html+='<thead><tr><th>Property</th><th>Value</th></tr></thead><tbody>';


                    for (var x in properties) {
                      if(x!='bbox'){
                        html+='<tr><th>'+x+'</th><td>'+properties[x]+'</td></tr>';

                        if(x == 'latitude')
                        {
                          latitude = properties[x];
                        }
                        if(x == 'longitude')
                        {
                          longitude = properties[x];
                        }
                        if(x == 'type')
                        {
                          type = properties[x];
                        }
                        if(x == 'radius_of_service')
                        {
                          rayon = properties[x];
                        }
                        if(x == 'operator_name')
                        {
                          OperatorName = properties[x];
                        }
                      }
                    }
                    html+='</tbody></table>';

                    if(latitude > 0 && longitude > 0)
                    {
                      if(type == 'VSAT')
                      {
                        circleOptions.color = "#D28500";
                      }else if(type == 'PDH')
                      {
                        circleOptions.color = "#BA120A";
                      }else if(type == 'SDH'){
                        circleOptions.color = "#0055C6";
                      }else if(type == 'PTMP'){
                        circleOptions.color = "#00A870";
                      }else if(type == 'OU_AD'){
                        circleOptions.color = "#72297E";
                      }else if(type == 'NEW'){
                        circleOptions.color = "#D85092";
                      }else{
                        circleOptions.color = "#3D3D3D";
                      }

                      if(rayon > 0)
                      {
                        var distance = rayon * 1000;
                      }else{
                        var distance = 1000;
                      }
                      console.log([latitude, longitude]);
                      drawCircle([latitude, longitude], distance, circleOptions);
                    }
                  }

                } else {
                  html += "No Features Found.";
                }
              } else {
                html += "Failed to Read the Feature(s).";
              }
              if(html.length > 100)
              {
                console.log(loc);
                var popup = map.openPopup(html, loc, {maxHeight: 550, className: OperatorName.toLocaleLowerCase()+'-bg'});
              }

            },
            error: function(xhr: any, status: any, err: any) {
              console.log('error');
            }
          });
      });


    /*this.stationService.getStationCountry(0,5000, this.typeCouche).subscribe({
      next: (data: any) => {

        console.log(data);
        var response = data.principalStation.body;
        var circleOptions = {
          color: 'green',
          fillColor: '#f03',
          fillOpacity: 0
        }
        var tailmax = response.length - 1;
        for(var i=0; i < tailmax; i++){
          var distanceObj = this.parseValue(response[i]['radiusOfService']);
          if(distanceObj != null && distanceObj.value >= 1)
          {
            //console.log(distanceObj.unit);
            var distance = distanceObj.value * 1000;
          }else{
            var distance = 1000;
          }

          //['VSAT', 'PDH', 'SDH', 'PTMP', 'OU_AD', 'NEW']

          if(response[i]['type'] == 'VSAT')
          {
            circleOptions.color = "#D28500";
          }else if(response[i]['type'] == 'PDH')
          {
            circleOptions.color = "#BA120A";
          }else if(response[i]['type'] == 'SDH'){
            circleOptions.color = "#0055C6";
          }else if(response[i]['type'] == 'PTMP'){
            circleOptions.color = "#00A870";
          }else if(response[i]['type'] == 'OU_AD'){
            circleOptions.color = "#72297E";
          }else if(response[i]['type'] == 'NEW'){
            circleOptions.color = "#D85092";
          }else{
            circleOptions.color = "#3D3D3D";
          }

          var circle = L.circle([response[i]['latitude'], response[i]['longitude']], distance, circleOptions);
          circle.addTo(this.map);
        }
      },
      error: err => console.log(err),
      complete: () => console.log('complete')
    })*/
  }

  parseValue(val: string): any {
    var v = parseFloat(val);
    return {
      'value': v,
      'unit': val.replace(v+'', '')
    }
  }

  initStationPoint(idStation: number)
  {
    this.isLoadingStation = true;
    this.stationService.getStationInfo(idStation).subscribe({
      next: (response: any) => {

        var OperatorName = response.operatorName;
        console.log(response);
        var html = this.getPresentation(response);

        this.map.openPopup(html, {'lat': response.latitude, 'lng': response.longitude},{maxHeight:550 , className: OperatorName.toLocaleLowerCase()+'-bg'});

        this.map.setView({'lat': response.latitude, 'lng': response.longitude}, 10);

        this.markerRadius(response);

        this.isLoadingStation = false;
        /*var circleOptions = {
          color: 'green',
          fillColor: '#f03',
          fillOpacity: 0
        }
        this.drawCircle([response.latitude, response.longitude], 1000, circleOptions)*/
      },
      error: err => console.log(err),
      complete: () => console.log('complete')
    })
  }

  openViewMap(station: any): void{
    this.map.setView({'lat': station.latitude, 'lng': station.longitude}, 10);
  }

  markerRadius(response: any)
  {
    var rayon = response.radiusOfService;
    var circleOptions = {
      color: 'green',
      fillColor: '#f03',
      fillOpacity: 0
    }
    if(rayon > 0)
    {
      var distance = rayon * 1000;
    }else{
      var distance = 1000;
    }
    if(response.type == 'VSAT')
    {
      circleOptions.color = "#D28500";
    }else if(response.type == 'PDH')
    {
      circleOptions.color = "#BA120A";
    }else if(response.type == 'SDH'){
      circleOptions.color = "#0055C6";
    }else if(response.type == 'PTMP'){
      circleOptions.color = "#00A870";
    }else if(response.type == 'OU_AD'){
      circleOptions.color = "#72297E";
    }else if(response.type == 'NEW'){
      circleOptions.color = "#D85092";
    }else{
      circleOptions.color = "#3D3D3D";
    }

    var circle = L.circle([response.latitude, response.longitude], distance, circleOptions);
    circle.addTo(this.map);
  }

  logout():void{
    this.tokenStorage.signOut();
    this.toastr.success('Avec succès', 'Déconnexion effectuée');
    this.router.navigate(['/public/h']);
  }

  localiteDefaultStation(idLocalite: number, typeLocalite: string)
  {
    this.currentLocalite.idLocalite = idLocalite;
    this.currentLocalite.typeLocalite = typeLocalite;
    for(var j = 0; j < this.organisations.length; j++)//Initialiser l'effectif des opérateurs
    {
        this.organisations[j].effectif = 0;
    }
    $('input[name="operator"]').prop("checked", true);
    this.unCheckedOperatorId = [];
    if(typeLocalite == 'region')
    {
      this.stationService.getStationRegion(0,5000, this.typeCouche,idLocalite).subscribe({
        next: (data: any) => {

          console.log(data);
          var response = data.principalStation.body;
          this.stationsMap = data.principalStation.body;
          var firstStation = null;
          var tailmax = response.length - 1;

          for(var i=0; i <= tailmax; i++){

            if(i == 1)
            {
              firstStation = response[i];
            }
            var html = this.getPresentation(response[i]);
            var OperatorName = response[i]['operatorName'];
            if(OperatorName == null)
            {
              OperatorName = '';
            }

            var myIcon = L.icon({
                iconUrl: "assets/images/"+response[i]['type']+".svg",
                iconSize: [30, 30],
                className: 'redIcon'
            });

            for(var j = 0; j < this.organisations.length; j++)
            {
              if(((this.organisations[j].name != null && response[i].operatorName != null) && this.organisations[j].name.toLowerCase() == response[i].operatorName.toLowerCase()) || (response[i].operator != null && response[i].operator.id == this.organisations[j].id))
              {
                console.log(this.organisations[j].effectif);
                this.organisations[j].effectif = this.organisations[j].effectif + 1;
                break;
              }
            }

            var marker = L.marker([response[i]['latitude'], response[i]['longitude']], {icon: myIcon}).addTo(this.map);
            var popup = marker.bindPopup(html, {maxHeight:550 , className: OperatorName.toLocaleLowerCase()+'-bg'});
          }

          if(firstStation != null)
          {
            this.currentLocalite.nameLocalite = firstStation.arrondissement.name_1;
            this.openViewMap(firstStation);
          }
          this.isLoadingStation = false;

        },
        error: err => console.log(err),
        complete: () => console.log('complete')
      })
    }else if(typeLocalite == 'departement')
    {
      this.stationService.getStationDepartement(0,5000, this.typeCouche,idLocalite).subscribe({
        next: (data: any) => {

          console.log(data);
          var response = data.principalStation.body;
          this.stationsMap = data.principalStation.body;
          var firstStation = null;
          var tailmax = response.length - 1;
          for(var i=0; i <= tailmax; i++){

            if(i == 1)
            {
              firstStation = response[i];
            }
            var html = this.getPresentation(response[i]);
            var OperatorName = response[i]['operatorName'];

            if(OperatorName == null)
            {
              OperatorName = '';
            }

            var myIcon = L.icon({
                iconUrl: "assets/images/"+response[i]['type']+".svg",
                iconSize: [30, 30],
                className: 'redIcon'
             });

            for(var j = 0; j < this.organisations.length; j++)
            {
              if(((this.organisations[j].name != null && response[i].operatorName != null) && this.organisations[j].name.toLowerCase() == response[i].operatorName.toLowerCase()) || (response[i].operator != null && response[i].operator.id == this.organisations[j].id))
              {
                console.log(this.organisations[j].effectif);
                this.organisations[j].effectif = this.organisations[j].effectif + 1;
                break;
              }
            }

            var marker = L.marker([response[i]['latitude'], response[i]['longitude']], {icon: myIcon}).addTo(this.map);
            var popup = marker.bindPopup(html, {maxHeight:550 , className: OperatorName.toLocaleLowerCase()+'-bg'});

          }

          if(firstStation != null)
          {
            this.currentLocalite.nameLocalite = firstStation.arrondissement.name_2;
            this.openViewMap(firstStation);
          }
          this.isLoadingStation = false;

        },
        error: err => console.log(err),
        complete: () => console.log('complete')
      })
    }else if(typeLocalite == 'arrondissement' )
    {
      this.stationService.getStationArrondissement(0,5000, this.typeCouche,idLocalite).subscribe({
        next: (data: any) => {

          console.log(data);
          var response = data.principalStation.body;
          this.stationsMap = data.principalStation.body;
          var firstStation = null;
          var tailmax = response.length - 1;
          for(var i=0; i <= tailmax; i++){

            if(i == 1)
            {
              firstStation = response[i];
            }
            var html = this.getPresentation(response[i]);
            var OperatorName = response[i]['operatorName'];

            if(OperatorName == null)
            {
              OperatorName = '';
            }

            var myIcon = L.icon({
                iconUrl: "assets/images/"+response[i]['type']+".svg",
                iconSize: [30, 30],
                className: 'redIcon'
             });

            for(var j = 0; j < this.organisations.length; j++)
            {
              if(((this.organisations[j].name != null && response[i].operatorName != null) &&  this.organisations[j].name.toLowerCase() == response[i].operatorName.toLowerCase()) || (response[i].operator != null && response[i].operator.id == this.organisations[j].id))
              {
                console.log(this.organisations[j].effectif);
                this.organisations[j].effectif = this.organisations[j].effectif + 1;
                break;
              }
            }
            var marker = L.marker([response[i]['latitude'], response[i]['longitude']], {icon: myIcon}).addTo(this.map);
            var popup = marker.bindPopup(html, {maxHeight:550 , className: OperatorName.toLocaleLowerCase()+'-bg'});

          }

          if(firstStation != null)
          {
            this.currentLocalite.nameLocalite = firstStation.arrondissement.name_3;
            this.openViewMap(firstStation);
          }
          this.isLoadingStation = false;

        },
        error: err => console.log(err),
        complete: () => console.log('complete')
      })
    }
  }

  getPresentation(response: any)
  {
      var html = "Feature(s) Found: ";
      html+='<br/><table>';
      html+='<thead><tr><th>Property</th><th>Value</th></tr></thead><tbody>';
      html+='<tr><th>Nom de la station</th><td>'+response.stationName+'</td></tr>';
      html+='<tr><th>Fréquence</th><td>'+response.assignedFreq+'</td></tr>';
      html+='<tr><th>Nom d\'opérateur</th><td>'+response.operatorName+'</td></tr>';
      html+='<tr><th>Type station</th><td>'+response.typeStation+'</td></tr>';
      html+='<tr><th>Auteur ASL</th><td>'+response.heightASL+'</td></tr>';
      html+='<tr><th>Largeur bande passante</th><td>'+response.bandWidth+'</td></tr>';
      html+='<tr><th>canaux</th><td>'+response.channelSeparation+'</td></tr>';
      html+='<tr><th>Fréquence rendue</th><td>'+response.responseFreq+'</td></tr>';
      html+='<tr><th>Rayon portée</th><td>'+response.radiusOfService+'</td></tr>';
      html+='<tr><th>Type</th><td>'+response.type+'</td></tr>';
      html+='<tr><th>Type Station</th><td>'+response.freqRange+'</td></tr>';
      html+='<tr><th>fieldName</th><td>'+response.fieldName+'</td></tr>';
      html+='<tr><th>linkName</th><td>'+response.linkName+'</td></tr>';
      html+='<tr><th>Latitude</th><td>'+response.latitude+'</td></tr>';
      html+='<tr><th>Longitude</th><td>'+response.longitude+'</td></tr>';
      html+='</tbody></table>';

      return html;
  }

  loadOrganisation(): any{
    this.organisationService.getOrganisations(0,500, '').subscribe({
      next: (response) => {
        console.log(response);
        response = response.operator.body;
        this.organisations = [];
        for(var i = 0; i < response.length; i++)
        {
          var currentOperator = response[i];
          var organisation = {'id': currentOperator.id, 'name': currentOperator.ownerName, 'effectif': 0, 'status': 0}
          if(this.organisations.length < 7)
          {
            this.organisations.push(organisation);
          }
        }
      },
      error: err => console.log(err),
      complete: () => console.log('complete')
    })
  }

  loadOrganisationStat(): any{
    this.organisationService.getOrganisationsStats(0,500, '').subscribe({
      next: (response) => {
        console.log(response);
        for(var i = 0; i < response.length; i++)
        {
          if(response[i].ownerName != null && response[i].ownerName.toLowerCase() == 'orange')
          {
            $('.stats-orange').html(response[i].nombrePrincipalStation);
          }else if(response[i].ownerName != null && response[i].ownerName.toLowerCase() == 'ihs'){
            $('.stats-ihs').html(response[i].nombrePrincipalStation);
          }else if(response[i].ownerName != null && response[i].ownerName.toLowerCase() == 'camtel'){
            $('.stats-camtel').html(response[i].nombrePrincipalStation);
          }else if(response[i].ownerName != null && response[i].ownerName.toLowerCase() == 'mtnc'){
            $('.stats-mtnc').html(response[i].nombrePrincipalStation);
          }
        }
      },
      error: err => console.log(err),
      complete: () => console.log('complete')
    })
  }

  checkValue(event: any, map: any){
    console.log(event);

    this.map.eachLayer(function(layer: any){
      if(layer._latlng != null)
      {
        map.removeLayer(layer);
      }
    });
    console.log(event.target)
    if(event.target.checked == true)
    {
      //if(!this.unCheckedOperatorId.includes())
      if(this.unCheckedOperatorId.includes(event.target.defaultValue.toLowerCase()))
      {
        var index = this.unCheckedOperatorId.indexOf(event.target.defaultValue.toLowerCase());
        console.log(index)
        delete this.unCheckedOperatorId[index];
      }
    }else{
      if(!this.unCheckedOperatorId.includes(event.target.defaultValue.toLowerCase()))
      {
        this.unCheckedOperatorId.push(event.target.defaultValue.toLowerCase());
      }
    }
    console.log(this.unCheckedOperatorId);

    console.log('Checked'+event.target.id);
    console.log(this.currentLocalite);


    var response = this.stationsMap;
    var firstStation = null;
    var tailmax = response.length - 1;
    for(var i=0; i <= tailmax; i++){
      var OperatorName = response[i]['operatorName'];
      var operatorStationName = null;
      if(response[i].operator != null)
      {
        operatorStationName = response[i].operator.ownerName;
      }else{
        for(var k=0; k < this.organisations.length; k++)
        {
          if(((this.organisations[k].name != null && OperatorName != null) && this.organisations[k].name.toLowerCase() == OperatorName.toLowerCase()))
          {
            operatorStationName = this.organisations[k].name;
            break;
          }
        }
      }

      if(operatorStationName != null && !this.unCheckedOperatorId.includes(operatorStationName.toLowerCase()))
      {
        if(firstStation == null)
        {
          firstStation = response[i];
        }
        var html = this.getPresentation(response[i]);

        if(OperatorName == null)
        {
          OperatorName = '';
        }

        var myIcon = L.icon({
            iconUrl: "assets/images/"+response[i]['type']+".svg",
            iconSize: [30, 30],
            className: 'redIcon'
          });

        for(var j = 0; j < this.organisations.length; j++)
        {
          if(((this.organisations[j].name != null && response[i].operatorName != null) && this.organisations[j].name.toLowerCase() == response[i].operatorName.toLowerCase()) || (response[i].operator != null && response[i].operator.id == this.organisations[j].id))
          {
            this.organisations[j].effectif = this.organisations[j].effectif + 1;
            break;
          }
        }

        var marker = L.marker([response[i]['latitude'], response[i]['longitude']], {icon: myIcon}).addTo(this.map);
        var popup = marker.bindPopup(html, {maxHeight:550 , className: OperatorName.toLocaleLowerCase()+'-bg'});
      }
    }

    if(firstStation != null)
    {
      this.currentLocalite.nameLocalite = firstStation.arrondissement.name_2;
      this.openViewMap(firstStation);
    }
  }
}

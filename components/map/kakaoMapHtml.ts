import type {
  FireStationMarker,
  MapCenter,
  RiskLabelMap,
} from '@/types/fire.types';

interface KakaoMapHtmlOptions {
  apiKey: string;
  initialMapCenter: MapCenter;
  stationMarkers: FireStationMarker[];
  riskLabels: RiskLabelMap;
}

const MOBILE_LOCATION_OFFSET = {
  latitude: 0.002,
  longitude: 0.0027,
};

export function createKakaoMapHtml({
  apiKey,
  initialMapCenter,
  stationMarkers,
  riskLabels,
}: KakaoMapHtmlOptions) {
  const markersJson = JSON.stringify(
    stationMarkers.map((station) => ({
      latitude: station.latitude,
      longitude: station.longitude,
      probability: station.probability,
      location: station.location,
      color: station.hexColor,
      risk: station.risk,
    })),
  );
  const riskLabelsJson = JSON.stringify(riskLabels);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; }
    #map { width: 100%; height: 100%; }
    #debug {
      position: fixed;
      top: 10px;
      left: 10px;
      background: white;
      padding: 10px;
      z-index: 9999;
      font-size: 10px;
      max-width: 80%;
    }
    #myLocationBtn {
      position: fixed;
      bottom: 24px;
      right: 12px;
      width: 44px;
      height: 44px;
      background: white;
      border: none;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      cursor: pointer;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    #myLocationBtn:active {
      transform: scale(0.95);
      background: #ebebeb;
    }
    #myLocationBtn.loading {
      pointer-events: none;
    }
    #myLocationBtn.loading svg {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div id="debug">Initializing...</div>
  <div id="map"></div>
  <button id="myLocationBtn" title="현재 위치">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" fill="#3B82F6"/>
      <circle cx="12" cy="12" r="8" stroke="#3B82F6" stroke-width="2" fill="none"/>
      <line x1="12" y1="2" x2="12" y2="5" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"/>
      <line x1="12" y1="19" x2="12" y2="22" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"/>
      <line x1="2" y1="12" x2="5" y2="12" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"/>
      <line x1="19" y1="12" x2="22" y2="12" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"/>
    </svg>
  </button>
  <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false"></script>
  <script>
    (function() {
      var debugElement = document.getElementById('debug');
      var myLocationButton = document.getElementById('myLocationBtn');
      var markers = ${markersJson};
      var riskLabels = ${riskLabelsJson};
      var map = null;
      var overlays = [];
      var clickOverlay = null;
      var userLocationOverlay = null;
      var userLocationMarker = null;
      var isMarkerClicked = false;
      var logs = [];

      function postMessage(payload) {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify(payload));
        }
      }

      function log(message) {
        logs.push(message);
        debugElement.innerHTML = logs.join('<br>');
        postMessage({ type: 'log', message: message });
      }

      function reportError(message) {
        logs.push('ERROR: ' + message);
        debugElement.innerHTML = logs.join('<br>');
        debugElement.style.color = 'red';
        postMessage({ type: 'error', message: message });
      }

      function removeLocationLoading() {
        myLocationButton.classList.remove('loading');
      }

      function createOverlayRoot(transformStyle, contentHtml) {
        var root = document.createElement('div');
        root.style.cssText = 'position: absolute; left: 50%; transform: ' + transformStyle + ';';
        root.innerHTML = contentHtml;
        return root;
      }

      function createStationOverlay(markerData) {
        return createOverlayRoot(
          'translate(-50%, calc(-100% - 45px))',
          '<div style="padding: 16px; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); min-width: 180px; font-family: sans-serif;">' +
            '<div style="font-size: 16px; font-weight: 600; color: #030213; margin-bottom: 12px;">' + markerData.location + '</div>' +
            '<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding: 8px 12px; background: #f9fafb; border-radius: 8px;">' +
              '<div style="width: 8px; height: 8px; border-radius: 50%; background: ' + markerData.color + ';"></div>' +
              '<span style="font-size: 14px; font-weight: 500; color: ' + markerData.color + ';">' + riskLabels[markerData.risk] + '</span>' +
            '</div>' +
            '<div style="padding: 12px; background: linear-gradient(135deg, ' + markerData.color + '15 0%, ' + markerData.color + '05 100%); border-radius: 8px;">' +
              '<div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">산불 발생 확률</div>' +
              '<div style="font-size: 24px; font-weight: 700; color: ' + markerData.color + ';">' + markerData.probability.toFixed(1) + '%</div>' +
            '</div>' +
          '</div>'
        );
      }

      function createNearestStationOverlay(markerData, title, transformStyle) {
        return createOverlayRoot(
          transformStyle,
          '<div style="padding: 16px; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); min-width: 180px; font-family: sans-serif;">' +
            '<div style="font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 8px;">' + title + '</div>' +
            '<div style="font-size: 16px; font-weight: 600; color: #030213; margin-bottom: 12px;">' + markerData.location + '</div>' +
            '<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding: 8px 12px; background: #f9fafb; border-radius: 8px;">' +
              '<div style="width: 8px; height: 8px; border-radius: 50%; background: ' + markerData.color + ';"></div>' +
              '<span style="font-size: 14px; font-weight: 500; color: ' + markerData.color + ';">' + riskLabels[markerData.risk] + '</span>' +
            '</div>' +
            '<div style="padding: 12px; background: linear-gradient(135deg, ' + markerData.color + '15 0%, ' + markerData.color + '05 100%); border-radius: 8px;">' +
              '<div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">산불 발생 확률</div>' +
              '<div style="font-size: 24px; font-weight: 700; color: ' + markerData.color + ';">' + markerData.probability.toFixed(1) + '%</div>' +
            '</div>' +
          '</div>'
        );
      }

      function createUserLocationMarker() {
        var markerContent = document.createElement('div');
        markerContent.innerHTML =
          '<div style="position: relative; width: 24px; height: 24px;">' +
            '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 24px; height: 24px; background: rgba(59, 130, 246, 0.2); border-radius: 50%; animation: locationPulse 2s ease-out infinite;"></div>' +
            '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 14px; height: 14px; background: #3B82F6; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>' +
          '</div>' +
          '<style>' +
            '@keyframes locationPulse {' +
              '0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }' +
              '100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }' +
            '}' +
          '</style>';
        return markerContent;
      }

      function closeAllOverlays() {
        overlays.forEach(function(overlay) { overlay.setMap(null); });

        if (clickOverlay) {
          clickOverlay.setMap(null);
          clickOverlay = null;
        }

        if (userLocationOverlay) {
          userLocationOverlay.setMap(null);
          userLocationOverlay = null;
        }
      }

      function getDistance(lat1, lng1, lat2, lng2) {
        var radius = 6371;
        var latitudeDelta = (lat2 - lat1) * Math.PI / 180;
        var longitudeDelta = (lng2 - lng1) * Math.PI / 180;
        var haversine =
          Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
          Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(longitudeDelta / 2) *
            Math.sin(longitudeDelta / 2);
        var arc = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

        return radius * arc;
      }

      function findNearestStation(lat, lng) {
        var nearest = null;
        var minimumDistance = Infinity;

        markers.forEach(function(station) {
          var distance = getDistance(lat, lng, station.latitude, station.longitude);

          if (distance < minimumDistance) {
            minimumDistance = distance;
            nearest = station;
          }
        });

        return nearest;
      }

      function setUserLocation(lat, lng) {
        if (!map) {
          return;
        }

        var centerPosition = new kakao.maps.LatLng(
          lat + ${MOBILE_LOCATION_OFFSET.latitude},
          lng + ${MOBILE_LOCATION_OFFSET.longitude}
        );

        map.setCenter(centerPosition);
        map.setLevel(4);

        var userPosition = new kakao.maps.LatLng(lat, lng);

        if (userLocationMarker) {
          userLocationMarker.setPosition(userPosition);
        } else {
          userLocationMarker = new kakao.maps.CustomOverlay({
            position: userPosition,
            content: createUserLocationMarker(),
            yAnchor: 0.5,
            xAnchor: 0.5
          });
          userLocationMarker.setMap(map);
        }

        var nearest = findNearestStation(lat, lng);

        if (nearest) {
          if (userLocationOverlay) {
            userLocationOverlay.setMap(null);
          }

          userLocationOverlay = new kakao.maps.CustomOverlay({
            position: userPosition,
            content: createNearestStationOverlay(
              nearest,
              '현재 위치 기준',
              'translate(-50%, calc(-100% - 5px))'
            ),
            yAnchor: 1
          });

          userLocationOverlay.setMap(map);
        }

        removeLocationLoading();
      }

      function handleMessage(event) {
        try {
          var data = JSON.parse(event.data);

          if (data.type === 'setUserLocation') {
            setUserLocation(data.latitude, data.longitude);
          }
        } catch (messageError) {
          log('Message parse error: ' + messageError.message);
        }
      }

      function requestLocation() {
        myLocationButton.classList.add('loading');
        postMessage({ type: 'requestLocation' });

        setTimeout(function() {
          removeLocationLoading();
        }, 3000);
      }

      window.onerror = function(message, url, line) {
        reportError('JS Error: ' + message + ' at line ' + line);
        return false;
      };

      log('Script started');

      setTimeout(function() {
        if (!window.kakao || !window.kakao.maps) {
          reportError('Kakao SDK not loaded');
          return;
        }

        window.kakao.maps.load(function() {
          try {
            var mapContainer = document.getElementById('map');
            var mapOption = {
              center: new kakao.maps.LatLng(${initialMapCenter.latitude}, ${initialMapCenter.longitude}),
              level: ${initialMapCenter.level}
            };

            map = new kakao.maps.Map(mapContainer, mapOption);

            var zoomControl = new kakao.maps.ZoomControl();
            map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

            markers.forEach(function(markerData) {
              var markerPosition = new kakao.maps.LatLng(markerData.latitude, markerData.longitude);
              var markerSvg =
                '<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
                  '<path d="M20 5 C13 5 8 10 8 17 C8 25 20 35 20 35 C20 35 32 25 32 17 C32 10 27 5 20 5 Z" fill="' + markerData.color + '" stroke="white" stroke-width="2"/>' +
                  '<circle cx="20" cy="17" r="5" fill="white" opacity="0.9"/>' +
                '</svg>';

              var markerImage = new kakao.maps.MarkerImage(
                'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(markerSvg),
                new kakao.maps.Size(40, 40),
                { offset: new kakao.maps.Point(20, 40) }
              );

              var marker = new kakao.maps.Marker({
                position: markerPosition,
                image: markerImage,
                title: markerData.location
              });

              marker.setMap(map);

              var customOverlay = new kakao.maps.CustomOverlay({
                position: markerPosition,
                content: createStationOverlay(markerData)
              });

              overlays.push(customOverlay);

              kakao.maps.event.addListener(marker, 'click', function() {
                isMarkerClicked = true;
                closeAllOverlays();
                customOverlay.setMap(map);

                setTimeout(function() {
                  isMarkerClicked = false;
                }, 0);
              });
            });

            kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
              if (isMarkerClicked) {
                return;
              }

              closeAllOverlays();

              var latlng = mouseEvent.latLng;
              var nearest = findNearestStation(latlng.getLat(), latlng.getLng());

              if (!nearest) {
                return;
              }

              clickOverlay = new kakao.maps.CustomOverlay({
                position: latlng,
                content: createNearestStationOverlay(
                  nearest,
                  '클릭 위치에서 가장 가까운 관측소',
                  'translate(-50%, -100%)'
                )
              });

              clickOverlay.setMap(map);
            });

            kakao.maps.event.addListener(map, 'zoom_changed', function() {
              closeAllOverlays();
            });

            document.addEventListener('message', handleMessage);
            window.addEventListener('message', handleMessage);
            myLocationButton.addEventListener('click', requestLocation);

            postMessage({ type: 'mapReady' });
            log('Map ready');

            setTimeout(function() {
              debugElement.style.display = 'none';
            }, 3000);
          } catch (mapError) {
            reportError('Map creation failed: ' + mapError.message);
          }
        });
      }, 500);
    })();
  </script>
</body>
</html>`;
}

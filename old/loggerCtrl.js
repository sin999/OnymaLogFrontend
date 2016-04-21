app.controller("loggerCtrl", function($scope) {
    var maxMessages=100;
    var messageBox=null;
    $scope.userName="*";
    $scope.clientMac="*";
    $scope.circuitId="*";
    $scope.subscribtion=null;
    $scope.messages  = [{"User-Name":"One"},{"User-Name":"Two"}]; 
    $scope.addMessage = function(msg){
	msg=JSON.parse(msg);
	if($scope.messages.length > maxMessages){
	    $scope.messages.pop();
	}
	$scope.messages.unshift(msg);
	$scope.$apply()
    };

    $scope.clearLog = function(){
	$scope.messages=[];
    }
    $scope.subscribe = function(){	    
	var userNamePat=(($scope.userName=="*")?"*":Base64.encode($scope.userName));
	var cirquitIdPat=(($scope.circuitId=="*")?"*":Base64.encode($scope.circuitId));
	var MacPat=(($scope.clientMac=="*")?"*":$scope.clientMac.toLowerCase().replace(/[^0-9a-f]/g, ''));
        var routingKey="*.*.*."+userNamePat+".*."+MacPat+"."+cirquitIdPat;
	var topic="AUTH_LOG";
	if(messageBox!=null){
	    if($scope.subscribtion!=null){
		$scope.subscribtion.unsubscribe();
		$scope.subscribtion=null;
	    }
	    $scope.subscribtion = messageBox.subscribe("/exchange/"+topic+"/"+routingKey, 
            	    function(d) { $scope.addMessage(d.body);});
	}
    };
    
    
    $scope.start = function(){
        var url = "http://10.200.5.207:61614/stomp";
        var ws = new SockJS(url);
        var topic="AUTH_LOG";
        var routingKey=$scope.userName+".*.*";
        var client = Stomp.over(ws);
        // RabbitMQ SockJS does not support heartbeats so disable them
        client.heartbeat.outgoing = 0;
        client.heartbeat.incoming = 0;
        var on_connect = function() {
        	messageBox = client;
        	$scope.$apply();
//               var id = client.subscribe("/exchange/"+topic+"/"+routingKey, 
//            	    function(d) { $scope.addMessage(d.body);});
		$scope.subscribe();
        };
        var on_error =  function() {
            console.log('error');
        };
        client.connect('guest', 'guest', on_connect, on_error, '/');
    };

/**
 *
 * Base64 encode/decode
 * http://www.webtoolkit.info
 *
 **/ 
 
var Base64 = {
   _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
   //метод для кодировки в base64 на javascript
  encode : function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0
    input = Base64._utf8_encode(input);
       while (i < input.length) {
       chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
       enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
       if( isNaN(chr2) ) {
         enc3 = enc4 = 64;
      }else if( isNaN(chr3) ){
        enc4 = 64;
      }
       output = output +
      this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
      this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
     }
    return output;
  },
 
   //метод для раскодировки из base64
  decode : function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
     input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
     while (i < input.length) {
       enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));
       chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
       output = output + String.fromCharCode(chr1);
       if( enc3 != 64 ){
        output = output + String.fromCharCode(chr2);
      }
      if( enc4 != 64 ) {
        output = output + String.fromCharCode(chr3);
      }
   }
   output = Base64._utf8_decode(output);
     return output;
   },
   // метод для кодировки в utf8
  _utf8_encode : function (string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
       if( c < 128 ){
        utftext += String.fromCharCode(c);
      }else if( (c > 127) && (c < 2048) ){
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      }else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
     }
    return utftext;
 
  },
 
  //метод для раскодировки из urf8
  _utf8_decode : function (utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;
    while( i < utftext.length ){
      c = utftext.charCodeAt(i);
       if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      }else if( (c > 191) && (c < 224) ) {
        c2 = utftext.charCodeAt(i+1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      }else {
        c2 = utftext.charCodeAt(i+1);
        c3 = utftext.charCodeAt(i+2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
     }
     return string;
  }
 }

    $scope.start();


});

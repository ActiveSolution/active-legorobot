var config = require('config');
var ffi = require('ffi');
var signalR = require('signalr-client');
var os = require('os');

var LEFT_ENGINE = 1;
var RIGHT_ENGINE = 2;

var legoEngine = ffi.Library('./LegoCLib/libLegoEngine', {
  'init': [ 'int', [  ] ],
  'forward': ['void', ['int', 'int', 'int']],
  'back': ['void', ['int', 'int', 'int']],
  'resetAllEngines': ['void', []],
  'stop': ['void', []]
});

var ListenToMessages = function(){

	var robotId = os.hostname();
	var url = config.signalRUrl;

	console.log('Robot ' + robotId + ' connecting to ' + url + ' (with ping)');

	var client  = new signalR.client(

		//signalR service URL
		url,

		// array of hubs to be supported in the connection
		['robot']
	);

	client.on(
		// Hub Name (case insensitive)
		'robot',	

		// Method Name (case insensitive)
		'controlRobot',	

		// Callback function with parameters matching call from hub
		function(message) { 

		if(!message)
			return;

		var msg = JSON.parse(message);

		if(msg.RobotId != robotId) {
			return;
		}

		console.log('Received message: ', message);

		var cmd = msg.Command;
		var speed = -1 * msg.Speed;			// The engines are turned backwards on the lego car so we have to invert the speed
		var runTime = msg.EngineRunTime;	
		
		if(cmd == "forward"){
			legoEngine.forward(speed, LEFT_ENGINE, runTime);
			legoEngine.forward(speed, RIGHT_ENGINE, runTime);
		}
		else if(cmd == "back"){
			legoEngine.back(speed, LEFT_ENGINE, runTime);
			legoEngine.back(speed, RIGHT_ENGINE, runTime);
		}
		else if(cmd == "right"){
			legoEngine.forward(speed, LEFT_ENGINE, runTime);
			legoEngine.back(speed, RIGHT_ENGINE, runTime);
		}
		else if(cmd == "left"){
			legoEngine.back(speed, LEFT_ENGINE, runTime);
			legoEngine.forward(speed, RIGHT_ENGINE, runTime);
		}
		else if(cmd == "forward left"){
			legoEngine.forward(speed/2, LEFT_ENGINE, runTime);
			legoEngine.forward(speed, RIGHT_ENGINE, runTime);
		}
		else if(cmd == "right forward"){
			legoEngine.forward(speed, LEFT_ENGINE, runTime);
			legoEngine.forward(speed/2, RIGHT_ENGINE, runTime);
		}
		else if(cmd == "left back"){
			legoEngine.back(speed/2, LEFT_ENGINE, runTime);
			legoEngine.back(speed, RIGHT_ENGINE, runTime);
		}
		else if(cmd == "right back"){
			legoEngine.back(speed/2, LEFT_ENGINE, runTime);
			legoEngine.back(speed, RIGHT_ENGINE, runTime);
		}
		else if(cmd == "stop"){
			legoEngine.stop();
		}
	

	});
	
	client.on('robot', 'ping', function() { 
		console.log('Received ping');
	});

	var sendPing = function()
	{
		console.log('Skickar ping');
		client.invoke('robot', 'ping');
		setTimeout(sendPing, 5 * 1000);
	}
	
	sendPing();
}


legoEngine.init();
ListenToMessages();

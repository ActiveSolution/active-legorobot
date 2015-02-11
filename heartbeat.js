var os = require('os');
var diskspace = require('diskspace');
var azurePubSub = require('./AzurePubSub');
var config = require('config');

var pubSub = new azurePubSub.AzurePubSub();

var startHeartbeat = function(){
	console.log("Heartbeat timeout:", config.heartbeatTimeout);
	heartbeat();
}

var heartbeat = function() {	

	diskspace.check('/', function (err, total, free, status) {

		var robotId = os.hostname();

		var message = {
				date: new Date()
				,hostname: robotId
				,ipAdresses: new Array()
				,uptime: os.uptime()
			};
				
			var interfaces = os.networkInterfaces();
			for (var device in interfaces) {
				interfaces[device].forEach(function(details) {
					if(details.family == 'IPv4' && !details.internal)			
						message.ipAdresses.push(details.address);
				});		
			}
			
			var jsonMsg = { brokerProperties : { RobotId: robotId }, body : JSON.stringify(message) };

			console.log("Publishing heartbeat", jsonMsg);
			
			pubSub.publish(jsonMsg, 'heartbeat', function(error) {
				if(error){
					console.log('heartbeat error', error);
				}
				setTimeout(heartbeat, config.heartbeatTimeout * 1000);
			});	
	});
};

startHeartbeat();

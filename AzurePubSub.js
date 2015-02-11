var config = require('config');
var azure = require('azure');

function AzurePubSub() {
	console.log('AzurePubSub constructor called');
	this.serviceBusClient = azure.createServiceBusService(config.azureConnectionString);	
}

AzurePubSub.prototype.publish = function (message, topicName, callback) {
	this.serviceBusClient.sendTopicMessage(topicName, message, function(error) {
		if(error)
			console.log("Error sending message: ", error);
		if(callback)
			callback(error);
	});
}

AzurePubSub.prototype.receive = function (topicName, callback) {
	var self = this;
	if(!self.subscription){
		console.log('Trying to receive messages without defining a subscription. Use AzurePubSub("mySubscription").');
		return;
	}

	if(!self.timeoutIntervalInS)
		self.timeoutIntervalInS = 30;	// default long pulling request time

	console.log('topic : ' + topicName);
	console.log('subscription: ' + this.subscription);

	self.serviceBusClient.receiveSubscriptionMessage(topicName, self.subscription, {timeoutIntervalInS: self.timeoutIntervalInS},
		function (error, message) {
			if(!error){
				callback(message)				
			}
			else
			{
				console.log('receive error: ', error);
			}
			self.receive(topicName, callback);
		});
}

exports.AzurePubSub = AzurePubSub;

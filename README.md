# Active Solution - Lego Robot

Code for integrating Node.js running in a Raspberry Pi using BrickPi to control Lego Mindstorms Robot. Control messages are sent to the robot through SignalR  from an Azure Web Site.

More detailed description how to set up Node.js and the Raspberry Pi is available (right now in Swedish only) here: https://github.com/ActiveSolution/LegoRobot/blob/master/README.txt 

![2014-TechDays-Monter-3](https://user-images.githubusercontent.com/1662918/158613648-12f316b3-011b-4973-a4b2-23a18787c63a.png)
_When the Lego Roborts were initially displayed at TechDays 2014_


## Getting started

Här är koden som körs på Raspberry PI

Koden är avsedd att ligga i '/home/pi/lego_robot' och startas av användaren 'pi' med kodens katalog som aktuell katalog. Typ:
cd /home/pi/lego_robot
su pi
node ./start_lego_robot

Koden kan autostartas genom att lägga till följande i /etc/rc.local
	(cd /home/pi/lego_robot;sudo -u pi ./start_lego_robot) &

Scriptet 'start_lego_robot' väntar på att få en wlan-koppling, loggar lite statusinformation och startar därefter två node-skript.
'receiveLegoMsg.js' tar emot kommandon från en SignalR-hub och styr robotens motorer därefter.
'heartbeat.js' skickar varje minut statusinformation till Azure

Scriptet behöver ha exekveringsrättigheter satta (sudo chmod 755 start_lego_robot).
Loggning sker till filen 'lego_robot.log'.

För att fungera behöver node vara installerat på Raspberry PI:n.
	wget http://node-arm.herokuapp.com/node_latest_armhf.deb
	sudo dpkg -i node_latest_armhf.deb
samt några node-moduler
	npm install config
	npm install azure
	npm install ffi
	npm install signalr-client

Därutöver behövs kod för BrickPI. Den skaffas via Dexter industries.

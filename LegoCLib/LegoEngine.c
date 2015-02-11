#include <stdio.h>
#include <math.h>
#include <time.h>
#include "tick.h"
#include <wiringPi.h>
#include "BrickPi.h"
#include <linux/i2c-dev.h>  
#include <fcntl.h>
// How to compile this stuff
// gcc -shared -fpic LegoEngine.c -o libLegoEngine.so -lwiringPi

#undef DEBUG

int init(){
	int result;
	ClearTick();
	result = BrickPiSetup();

	if(result)		// Already setup, go on...
		return 0;

	BrickPi.Address[0] = 1;		// Communication addresses
	BrickPi.Address[1] = 2;
	BrickPi.Address[2] = 3;

	BrickPi.MotorEnable[PORT_B] = 1;
	BrickPi.MotorEnable[PORT_C] = 1;
	BrickPi.MotorEnable[PORT_A] = 1;

	return 0;
}

// The motors are defined in BrickPi.h
// motor A = 0
// motor B = 1
// motor C = 2
// motor D = 3
// speed from -255 to 255

void resetAllEngines(){
	int i;
	for(i = 0; i < 4; i++){
		BrickPi.MotorSpeed[i] = 0;
	}
}

void forward(int speed, int motor, int runForMs)
{
	int i;

	//Set timeout value for the time till which to run the motors after the last command is sent (ms)
	BrickPi.Timeout=runForMs;	// set the time to run the engine
	BrickPiSetTimeout();		// apply the time

	BrickPi.MotorSpeed[motor] = speed;
	BrickPiUpdateValues();		//Update the motor values
}

void back(int speed, int motor, int runForMs)
{
	forward(-1 * speed, motor, runForMs);
}
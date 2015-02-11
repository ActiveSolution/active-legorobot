#include "LegoEngine.h"

// gcc -o trylegoengine tryLegoEngine.c -lrt -lm -L/usr/local/lib -lwiringPi

int main(void) 
{
	init();
	forward(200, 1);
	forward(200, 2);
	return 0;
}
DEPENDENCY = ./orebar

all:
	npm --prefix ./orebar run build
test:
	npm --prefix ./orebar run test
clean:
	npm --prefix ./orebar run clean
	npm --prefix ./build run clean
run:
	npm --prefix ./orebar run build
	npm --prefix ./orebar start

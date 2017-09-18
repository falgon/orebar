DEPENDENCY = ./oreblr

all:
	npm --prefix ./oreblr run build
test:
	npm --prefix ./oreblr run test
clean:
	npm --prefix ./oreblr run clean
	npm --prefix ./build run clean
run:
	npm --prefix ./oreblr run build
	npm --prefix ./oreblr start

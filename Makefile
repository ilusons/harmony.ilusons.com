
build: node_modules
    node build.js production

node_modules: package.json
	npm install

.PHONY: build
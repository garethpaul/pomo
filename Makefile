.PHONY: check lint test build verify

check: verify

lint:
	npm run lint

test:
	npm test

build:
	npm run build

verify:
	npm run verify

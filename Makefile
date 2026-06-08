.PHONY: check test verify

check: verify

test:
	npm test

verify:
	npm run verify

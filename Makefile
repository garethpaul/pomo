.PHONY: check lint test build verify

override REPO_ROOT := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))

check: verify

lint:
	cd "$(REPO_ROOT)" && npm run lint

test:
	cd "$(REPO_ROOT)" && npm test

build:
	cd "$(REPO_ROOT)" && npm run build

verify:
	cd "$(REPO_ROOT)" && npm run verify

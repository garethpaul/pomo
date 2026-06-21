.PHONY: check lint test build root-test verify

override SHELL := /bin/sh
override .SHELLFLAGS := -c

ifneq ($(origin MAKEFILE_LIST),file)
$(error MAKEFILE_LIST must not be overridden)
endif
ifneq ($(strip $(MAKEFILES)),)
$(error MAKEFILES must not be set)
endif
override REPO_ROOT := $(shell path='$(subst ','"'"',$(MAKEFILE_LIST))'; path=$$(printf '%s' "$$path" | /usr/bin/sed 's/^ //'); directory=$$(/usr/bin/dirname -- "$$path"); CDPATH= cd -- "$$directory" && /bin/pwd -P)
export REPO_ROOT

check: verify

lint:
	cd "$$REPO_ROOT" && npm run lint

test:
	cd "$$REPO_ROOT" && npm test

build:
	cd "$$REPO_ROOT" && npm run build

root-test:
	cd "$$REPO_ROOT" && scripts/test-makefile-root.sh

verify: root-test
	cd "$$REPO_ROOT" && npm run verify

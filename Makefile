# Makefile for MPLADS AI Audit Pipeline (Regulatory Knowledge Base + Data + ML Engine)
PYTHON=.venv/bin/python

.PHONY: all ingest-regulatory extract-rules normalize-regulatory validate-regulatory generate-data validate-data build-features check-leakage train evaluate predict test

all: ingest-regulatory normalize-regulatory validate-regulatory generate-data validate-data build-features check-leakage train evaluate predict

ingest-regulatory:
	$(PYTHON) -m regulatory.ingest

extract-rules:
	$(PYTHON) -m regulatory.rule_extractor

normalize-regulatory:
	$(PYTHON) -m regulatory.normalize

validate-regulatory:
	$(PYTHON) -m regulatory.validate

generate-data:
	$(PYTHON) -m data.generate --projects 100000 --seed 42

validate-data:
	$(PYTHON) -m data.validate

build-features:
	$(PYTHON) -m ml.features

check-leakage:
	$(PYTHON) -m scripts.check_leakage

train:
	$(PYTHON) -m ml.train

evaluate:
	$(PYTHON) -m ml.evaluate

predict:
	$(PYTHON) -m ml.predict --project-id MPLADS-000001

test:
	PYTHONPATH=. $(PYTHON) -m pytest backend/tests/test_ml_pipeline.py
	cd backend && PYTHONPATH=. ../.venv/bin/pytest tests/unit/

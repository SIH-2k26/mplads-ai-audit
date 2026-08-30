# Makefile for MPLADS AI Audit (Unified End-to-End ML + RAG + API + UI Pipeline)
PYTHON=.venv/bin/python
NPM=npm

.PHONY: all install data validate leakage train evaluate pipeline-test benchmark ood-test rag test frontend backend dev clean help

all: validate leakage test frontend
	@echo "======================================================="
	@echo "[AGASTYA / MPLADS AI AUDIT] Full Pipeline Ready"
	@echo "======================================================="

install:
	pip install -r requirements.txt
	$(NPM) install

data:
	$(PYTHON) data/generate.py --projects 25000 --seed 42 --fraud-rate 0.20 --hard-negative-rate 0.10

validate:
	$(PYTHON) data/validate.py --strict

leakage:
	$(PYTHON) scripts/check_leakage.py

train:
	$(PYTHON) -m ml.train

evaluate:
	$(PYTHON) -m ml.evaluate

pipeline-test:
	$(PYTHON) scripts/test_pipeline.py --projects 5000 --seed 42

benchmark:
	$(PYTHON) scripts/benchmark_pipeline.py --quick

ood-test:
	$(PYTHON) scripts/test_ood_evaluation.py --train-projects 4000 --ood-projects 1500

rag:
	$(PYTHON) -c "from backend.rag.regulatory_retriever import RegulatoryRAGRetriever; print('RAG Knowledge Base Loaded:', len(RegulatoryRAGRetriever().knowledge_base), 'statutory source rules.')"

test:
	$(PYTHON) -m pytest -q

frontend:
	$(NPM) run build

backend:
	cd backend && PYTHONPATH=. ../$(PYTHON) -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

dev:
	$(NPM) run dev

clean:
	rm -rf dist/ build/ __pycache__/ .pytest_cache/

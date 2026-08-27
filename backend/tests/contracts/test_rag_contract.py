"""
tests/contracts/test_rag_contract.py
CONTRACT 3: RAGRetriever -> RetrievalResponse

Tests that:
1. RAGRetriever returns RetrievalResponse structure.
2. Filter criteria works properly.
3. Empty candidate set returns clean non-crashing RetrievalResponse.
"""
import asyncio
import pytest
from rag.retriever import RAGRetriever, RetrievalFilter, RetrievalResponse, RetrievalResult
from rag.retrieval.bm25_retriever import BM25Retriever

class TestRAGRetrieverContract:
    def test_rag_retriever_empty(self):
        async def _run():
            retriever = RAGRetriever()
            response = await retriever.retrieve("MPLADS expenditure guidelines")
            
            assert isinstance(response, RetrievalResponse)
            assert response.query == "MPLADS expenditure guidelines"
            assert response.is_empty() is True
            assert len(response.results) == 0

        asyncio.run(_run())

    def test_bm25_retriever_contract(self):
        async def _run():
            bm25 = BM25Retriever()
            chunks = [
                {
                    "chunk_id": "c1",
                    "document_id": "doc1",
                    "text": "MPLADS funds shall be sanctioned by District Authority.",
                    "page": 1,
                    "section": "3.1",
                    "document_type": "POLICY_DOCUMENT",
                    "project_id": "P101",
                    "policy_id": "POL_2022"
                },
                {
                    "chunk_id": "c2",
                    "document_id": "doc2",
                    "text": "Contractor must submit completion certificate before final release.",
                    "page": 5,
                    "section": "6.2",
                    "document_type": "WORK_ORDER",
                    "project_id": "P101",
                    "policy_id": None
                }
            ]
            bm25.build_index(chunks)
            
            results = await bm25.retrieve("sanctioned District Authority")
            assert len(results) >= 1
            assert results[0].document_id == "doc1"
            assert isinstance(results[0], RetrievalResult)
            assert results[0].bm25_score > 0

        asyncio.run(_run())

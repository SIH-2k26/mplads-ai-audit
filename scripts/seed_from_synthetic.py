"""
scripts/seed_from_synthetic.py
Seeding script that loads data/synthetic/relational/01_projects.csv through the production IngestionPipeline
(Validation -> Normalization -> Entity Resolution -> Deduplication -> Digital Twin)
and persists the resulting records into PostgreSQL using ProjectRepository.upsert_from_twin().
"""
from __future__ import annotations
import asyncio
import os
import sys
import time

# Ensure project root & backend are in sys.path
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
backend_dir = os.path.join(root_dir, "backend")
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from data.pipeline import IngestionPipeline
from app.database.postgres import check_connection, AsyncSessionFactory
from db.repositories.project_repo import ProjectRepository
from sqlalchemy import text


async def main():
    print("=" * 60)
    print(" [STEP 1 SEEDING] Ingesting Synthetic Dataset via IngestionPipeline")
    print("=" * 60)

    # 1. Verify PostgreSQL Connectivity
    print("\n1. Checking PostgreSQL Connectivity...")
    pg_online = await check_connection()
    print(f"   PostgreSQL status: {'ONLINE' if pg_online else 'OFFLINE'}")

    csv_path = os.path.join(root_dir, "data", "synthetic", "relational", "01_projects.csv")
    if not os.path.exists(csv_path):
        print(f"   [ERROR] CSV dataset file not found at: {csv_path}")
        return

    # 2. Process synthetic CSV through production IngestionPipeline
    print(f"\n2. Executing IngestionPipeline on: {csv_path}...")
    t0 = time.time()
    pipeline = IngestionPipeline()
    result = pipeline.process_csv(csv_path)
    elapsed = time.time() - t0

    print(f"   ✓ Batch ID:            {result.batch_id}")
    print(f"   ✓ Total Records:       {result.total_records:,}")
    print(f"   ✓ Valid Records:       {result.valid_records:,}")
    print(f"   ✓ Invalid Records:     {result.invalid_records:,}")
    print(f"   ✓ Duplicates Flagged:  {result.duplicates_detected:,}")
    print(f"   ✓ Digital Twins Built: {len(result.twins_created):,}")
    print(f"   ✓ Processing Time:     {elapsed:.2f} seconds")

    if not pg_online:
        print("\n   [WARNING] PostgreSQL is offline — skipping DB persistence step.")
        print("   Synthesized digital twins were generated in memory successfully.")
        return

    # 3. Persist Digital Twins into PostgreSQL via ProjectRepository.upsert_from_twin
    print(f"\n3. Persisting {len(result.twins_created):,} Digital Twins to PostgreSQL (projects table)...")
    t1 = time.time()
    upserted_count = 0

    async with AsyncSessionFactory() as session:
        repo = ProjectRepository(session)
        # Batch in chunks of 500
        chunk_size = 500
        twins = result.twins_created
        for i in range(0, len(twins), chunk_size):
            chunk = twins[i : i + chunk_size]
            for twin in chunk:
                await repo.upsert_from_twin(twin)
            await session.commit()
            upserted_count += len(chunk)
            print(f"   ... Saved {upserted_count:,} / {len(twins):,} records")

    db_elapsed = time.time() - t1
    print(f"   ✓ Database persistence complete in {db_elapsed:.2f} seconds")

    # 4. Confirm Database Row Counts
    print("\n4. Confirming Database Row Counts...")
    async with AsyncSessionFactory() as session:
        res = await session.execute(text("SELECT COUNT(*) FROM projects"))
        proj_count = res.scalar()
        res_exp = await session.execute(text("SELECT SUM(sanctioned_amount), SUM(total_expenditure) FROM projects"))
        total_sanc, total_exp = res_exp.fetchone() or (0, 0)

    print(f"   ✓ PostgreSQL projects table row count: {proj_count:,}")
    print(f"   ✓ Total Sanctioned Outlay:            ₹{float(total_sanc or 0):,.2f}")
    print(f"   ✓ Total Expenditure Incurred:         ₹{float(total_exp or 0):,.2f}")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())

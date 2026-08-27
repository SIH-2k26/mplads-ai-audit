"""
fix_utcnow.py
Replaces all `datetime.utcnow()` with `datetime.now(UTC)` in Python source files.
Also ensures `from datetime import datetime, timezone` imports are updated.
"""
import re
import os

# Files to fix (production code - not test files)
TARGET_FILES = [
    "agents/deterministic/data_quality.py",
    "agents/deterministic/deadline.py",
    "agents/part_b/deterministic/payment_agent.py",
    "agents/part_b/ml/delay_prediction_agent.py",
    "agents/part_b/ml/fraud_archetype_agent.py",
    "api/v1/endpoints/cases.py",
    "engine/evidence_fusion.py",
    "investigation/audit.py",
    "investigation/service.py",
    "models/agent.py",
    "models/digital_twin.py",
    "models/document.py",
    "models/event.py",
    "models/evidence.py",
    "models/investigation.py",
    "models/policy.py",
    "models/project.py",
    "models/provenance.py",
    "models/risk.py",
    "simulation/what_if.py",
]

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Replace datetime.utcnow() with datetime.now(UTC)
    content = content.replace('datetime.utcnow()', 'datetime.now(UTC)')

    # Ensure UTC is imported
    # Pattern: from datetime import datetime[, ...]
    if 'datetime.now(UTC)' in content and 'UTC' not in content.split('from datetime import')[0] if 'from datetime import' in content else True:
        # Check if timezone is already imported
        if 'from datetime import' in content:
            # Add UTC to imports if not present
            def add_utc_to_import(m):
                imports_str = m.group(1)
                imports = [i.strip() for i in imports_str.split(',')]
                if 'timezone' not in imports and 'UTC' not in imports:
                    imports.append('timezone')
                    return f'from datetime import {", ".join(imports)}'
                return m.group(0)
            content = re.sub(r'from datetime import ([^\n]+)', add_utc_to_import, content)

        # Add UTC alias if timezone is imported but UTC is not defined
        if 'timezone' in content and 'UTC = timezone.utc' not in content and 'UTC' not in content.split('from datetime import')[0]:
            # Add UTC alias after the datetime imports
            content = re.sub(
                r'(from datetime import [^\n]+\n)',
                r'\1UTC = timezone.utc\n',
                content,
                count=1
            )

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False


fixed = []
errors = []
for rel_path in TARGET_FILES:
    abs_path = os.path.join(os.path.dirname(__file__), '..', rel_path)
    abs_path = os.path.normpath(abs_path)
    if not os.path.exists(abs_path):
        print(f"SKIP (not found): {rel_path}")
        continue
    try:
        if fix_file(abs_path):
            fixed.append(rel_path)
            print(f"FIXED: {rel_path}")
        else:
            print(f"OK (no change): {rel_path}")
    except Exception as e:
        errors.append((rel_path, str(e)))
        print(f"ERROR: {rel_path}: {e}")

print(f"\nSummary: {len(fixed)} files fixed, {len(errors)} errors")

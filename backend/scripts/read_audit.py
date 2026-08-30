import json
with open('reports/audit_results.json', encoding='utf-8') as f:
    r = json.load(f)
broken = [x for x in r['results'] if x['status'] == 'BROKEN']
partial = [x for x in r['results'] if x['status'] == 'PARTIAL']
print(f'BROKEN ({len(broken)}):')
for b in broken:
    print(f"  [{b['component']}]")
    print(f"    {b['detail'][:200]}")
print(f'\nPARTIAL ({len(partial)}):')
for p in partial:
    print(f"  [{p['component']}]: {p['detail'][:150]}")

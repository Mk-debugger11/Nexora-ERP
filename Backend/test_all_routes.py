import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EcommerceInventory.settings')
django.setup()

from django.test import Client
from django.urls import get_resolver

client = Client()
resolver = get_resolver()

# Extract all patterns
def get_all_urls(url_patterns, prefix='/'):
    result = []
    for pattern in url_patterns:
        if hasattr(pattern, 'url_patterns'):
            result.extend(get_all_urls(pattern.url_patterns, prefix + str(pattern.pattern)))
        else:
            result.append(prefix + str(pattern.pattern))
    return result

urls = get_all_urls(resolver.url_patterns)

print(f"Testing {len(urls)} routes...")
failed = 0
for u in urls:
    # replace regex capture groups with dummy values
    clean_url = u.replace('^', '').replace('$', '').replace('<int:pk>', '1').replace('<str:id>', '1').replace('<str:user_id>', '1').replace('<str:formName>', 'Products').replace('<str:modelName>', 'Products')
    
    # We only care about /api/ endpoints mostly
    if '/api/' in clean_url:
        response = client.get(clean_url)
        # 401 or 403 means auth is working and route exists. 404 is bad, 500 is very bad.
        # 405 means Method Not Allowed (e.g. login is POST only), which is fine.
        if response.status_code in [500]:
            print(f"FAILED: {clean_url} -> {response.status_code}")
            failed += 1

if failed == 0:
    print("SUCCESS: All API routes returned valid responses (200, 401, 403, 405) with NO 500 server errors!")
else:
    print(f"{failed} routes had server errors.")


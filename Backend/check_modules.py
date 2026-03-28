import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EcommerceInventory.settings')
django.setup()

from UserServices.models import Modules
for m in Modules.objects.all():
    print(f"ID: {m.id}, Name: {m.name}, URL: {m.module_url}, Parent: {m.parent_id_id}")

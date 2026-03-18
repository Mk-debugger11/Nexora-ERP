import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EcommerceInventory.settings')
django.setup()

from ProductServices.models import Categories
from django.db.models.fields import NOT_PROVIDED

fields_info = Categories._meta.fields
for field in fields_info:
    print(f"Field: {field.name}, Null: {field.null}, Default: {field.default}, Is NOT_PROVIDED: {field.default == NOT_PROVIDED}")


import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EcommerceInventory.settings')
django.setup()

from ProductServices.models import Categories
Categories.objects.filter(name="Test Category").delete()

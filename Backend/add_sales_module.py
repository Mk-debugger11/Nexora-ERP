import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EcommerceInventory.settings')
django.setup()

from UserServices.models import Modules

so_parent = Modules.objects.filter(module_name="Sales Orders").first()
if not so_parent:
    so_parent = Modules.objects.create(module_name="Sales Orders", module_url="#", module_icon="Store")

manage_so = Modules.objects.filter(module_name="Manage Sales Orders").first()
if not manage_so:
    Modules.objects.create(module_name="Manage Sales Orders", module_url="/manage/salesorder", module_icon="Store", parent_id=so_parent)

create_so = Modules.objects.filter(module_name="Create Sales Order").first()
if not create_so:
    Modules.objects.create(module_name="Create Sales Order", module_url="/create/so", module_icon="Add", parent_id=so_parent)

print("Sales Order modules added successfully.")

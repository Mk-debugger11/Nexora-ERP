import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EcommerceInventory.settings')
django.setup()

from UserServices.models import Modules, UserPermissions, Users

# Check if Inventory module exists
inventory_module = Modules.objects.filter(module_name='Inventory').first()
if not inventory_module:
    # Find the Warehouse parent module (it's under a parent group)
    warehouse_module = Modules.objects.filter(module_name='Warehouse').first()
    parent = warehouse_module.parent_id if warehouse_module else None
    
    inventory_module = Modules.objects.create(
        module_name='Inventory',
        module_icon='Inventory',
        is_menu=True,
        is_active=True,
        module_url='/manage/inventory',
        parent_id=parent,
        display_order=6,
        module_description='Manage Inventory across warehouses'
    )
    print(f"Created Inventory module with id={inventory_module.id}")
    
    # Grant permissions to all Admin users
    admins = Users.objects.filter(role='Admin')
    for admin in admins:
        perm, created = UserPermissions.objects.get_or_create(
            user=admin,
            module=inventory_module,
            defaults={
                'is_permission': True,
                'domain_user_id': admin.domain_user_id or admin
            }
        )
        if created:
            print(f"  Granted permission to admin: {admin.username}")
else:
    print(f"Inventory module already exists with id={inventory_module.id}")

print("Done!")

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EcommerceInventory.settings')
django.setup()

from UserServices.models import Modules, ModuleUrls, UserPermissions, Users

# Dashboard Module
dashboard_module, created = Modules.objects.get_or_create(
    module_name='Dashboard',
    defaults={
        'module_icon': 'Dashboard',
        'is_menu': True,
        'is_active': True,
        'module_url': '/',
        'display_order': 0,
    }
)

if not created:
    dashboard_module.module_url = '/'
    dashboard_module.display_order = 0
    dashboard_module.module_icon = 'Dashboard'
    dashboard_module.save()

# Add URL mapping
ModuleUrls.objects.get_or_create(
    module=dashboard_module,
    url='/api/auth/dashboard/'
)

# Grant permission to superadmin or all existing admins
admins = Users.objects.filter(role='Admin')
for admin in admins:
    UserPermissions.objects.get_or_create(
        user=admin,
        module=dashboard_module,
        defaults={'is_permission': True}
    )

print("Dashboard module added successfully.")

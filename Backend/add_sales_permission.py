import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EcommerceInventory.settings')
django.setup()

from UserServices.models import Users, Modules, UserPermissions

superadmin = Users.objects.filter(is_superuser=True).first()
if superadmin:
    sales_modules = Modules.objects.filter(module_name__in=["Sales Orders", "Manage Sales Orders", "Create Sales Order"])
    for module in sales_modules:
        if not UserPermissions.objects.filter(user=superadmin, module=module).exists():
            UserPermissions.objects.create(user=superadmin, module=module, is_permission=True, domain_user_id=superadmin.domain_user_id or superadmin)
            print(f"Granted permission for {module.module_name}")

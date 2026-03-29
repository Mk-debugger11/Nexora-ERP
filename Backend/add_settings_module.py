import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EcommerceInventory.settings')
django.setup()

from UserServices.models import Users, Modules, UserPermissions

superadmin = Users.objects.filter(is_superuser=True).first()
if superadmin:
    settings_module = Modules.objects.filter(module_name="Settings").first()
    if not settings_module:
        settings_module = Modules.objects.create(module_name="Settings", module_url="/manage/settings", module_icon="Settings")

    if not UserPermissions.objects.filter(user=superadmin, module=settings_module).exists():
        UserPermissions.objects.create(user=superadmin, module=settings_module, is_permission=True, domain_user_id=superadmin.domain_user_id or superadmin)
        print(f"Granted permission for {settings_module.module_name}")

print("Settings module and permissions added successfully.")

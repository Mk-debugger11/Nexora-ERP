import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EcommerceInventory.settings')
django.setup()

from UserServices.models import Users, Modules, UserPermissions

superadmin = Users.objects.filter(is_superuser=True).first()
if superadmin:
    reports_module = Modules.objects.filter(module_name="Reports").first()
    if not reports_module:
        reports_module = Modules.objects.create(module_name="Reports", module_url="/manage/reports", module_icon="InsertChart")

    if not UserPermissions.objects.filter(user=superadmin, module=reports_module).exists():
        UserPermissions.objects.create(user=superadmin, module=reports_module, is_permission=True, domain_user_id=superadmin.domain_user_id or superadmin)
        print(f"Granted permission for {reports_module.module_name}")

print("Reports module and permissions added successfully.")

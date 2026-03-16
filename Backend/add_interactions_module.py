import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EcommerceInventory.settings')
django.setup()

from UserServices.models import Users, Modules, UserPermissions

superadmin = Users.objects.filter(is_superuser=True).first()
if superadmin:
    interaction_parent = Modules.objects.filter(module_name="Product Interactions").first()
    if not interaction_parent:
        interaction_parent = Modules.objects.create(module_name="Product Interactions", module_url="#", module_icon="Forum")

    manage_reviews = Modules.objects.filter(module_name="Manage Reviews").first()
    if not manage_reviews:
        manage_reviews = Modules.objects.create(module_name="Manage Reviews", module_url="/manage/productreviews", module_icon="Star", parent_id=interaction_parent)

    manage_questions = Modules.objects.filter(module_name="Manage Questions").first()
    if not manage_questions:
        manage_questions = Modules.objects.create(module_name="Manage Questions", module_url="/manage/productquestions", module_icon="QuestionAnswer", parent_id=interaction_parent)

    interaction_modules = Modules.objects.filter(module_name__in=["Product Interactions", "Manage Reviews", "Manage Questions"])
    for module in interaction_modules:
        if not UserPermissions.objects.filter(user=superadmin, module=module).exists():
            UserPermissions.objects.create(user=superadmin, module=module, is_permission=True, domain_user_id=superadmin.domain_user_id or superadmin)
            print(f"Granted permission for {module.module_name}")

print("Product Interactions modules and permissions added successfully.")

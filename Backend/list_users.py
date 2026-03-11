import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EcommerceInventory.settings')
django.setup()

from UserServices.models import Users
for u in Users.objects.all():
    print(f"ID: {u.id}, Username: {u.username}, Role: {u.role}, DomainUser: {u.domain_user_id.id if u.domain_user_id else 'None'}")

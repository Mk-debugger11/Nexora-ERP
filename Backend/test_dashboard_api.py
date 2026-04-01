import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EcommerceInventory.settings')
django.setup()

from django.test import Client
from UserServices.models import Users
from rest_framework_simplejwt.tokens import RefreshToken

client = Client()
user = Users.objects.filter(role='Admin').first()
refresh = RefreshToken.for_user(user)
token = str(refresh.access_token)

response = client.get('/api/auth/dashboard/', HTTP_AUTHORIZATION=f'Bearer {token}')
print("Status Code:", response.status_code)
print("Response Data:", response.content.decode('utf-8'))

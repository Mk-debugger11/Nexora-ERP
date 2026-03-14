import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EcommerceInventory.settings')
django.setup()

from django.test import Client
from UserServices.models import Users
from ProductServices.models import Categories
from rest_framework_simplejwt.tokens import RefreshToken
import json

client = Client()
user = Users.objects.filter(role='Admin').first()
refresh = RefreshToken.for_user(user)
token = str(refresh.access_token)

data = {
    "name": "Test Category",
    "description": "Test description",
    "display_order": 1,
}

response = client.post('/api/getForm/category/', data=json.dumps(data), content_type='application/json', HTTP_AUTHORIZATION=f'Bearer {token}')
print("Status Code:", response.status_code)
print("Response Data:", response.content.decode('utf-8'))

# Check if it's in DB
count = Categories.objects.filter(name="Test Category").count()
print("Categories with name 'Test Category' in DB:", count)

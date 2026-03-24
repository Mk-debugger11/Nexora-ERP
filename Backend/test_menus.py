import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EcommerceInventory.settings')
django.setup()

from UserServices.controller.AuthController import UserMenusView
from rest_framework.test import APIRequestFactory
from UserServices.models import Users
from rest_framework_simplejwt.tokens import RefreshToken

factory = APIRequestFactory()
request = factory.get('/api/getMenus/')
user = Users.objects.filter(is_superuser=True).first()
if user:
    from rest_framework.request import Request
    from rest_framework_simplejwt.authentication import JWTAuthentication
    from django.test import RequestFactory
    rf = RequestFactory()
    req = rf.get('/api/getMenus/')
    req.user = user
    view = UserMenusView.as_view()
    response = view(req)
    print(response.data)
else:
    print("No user")

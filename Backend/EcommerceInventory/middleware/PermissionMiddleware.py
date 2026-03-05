from django.http import JsonResponse
from UserServices.models import ModuleUrls, UserPermissions
from rest_framework_simplejwt.authentication import JWTAuthentication
import re
from django.db.models import Q

class PermissionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        current_url = request.path
        
        # Hardcode paths that shouldn't require auth to prevent locking out login/signup
        skip_paths = ['/api/auth/login/', '/api/auth/signup/', '/admin/', '/api/auth/publicApi/']
        if any(current_url.startswith(path) for path in skip_paths):
            return self.get_response(request)

        if current_url in urlToSkip():
            return self.get_response(request)
        
        jwt_auth=JWTAuthentication()
        try:
            user,token=jwt_auth.authenticate(request)
            if not user:
                return JsonResponse({'message':'Unauthorized'},status=401)
        except:
            return JsonResponse({'message':'Unauthorized'},status=401)
        
        # Skip Permission Logic entirely
        return self.get_response(request)
    

def urlToSkip():
    modules=ModuleUrls.objects.filter(module__isnull=True).values_list('url',flat=True)
    return modules

def find_matching_module(url):
    regex_pattern=re.sub(r'\d+','[^\/]+',url.replace('/','\/'))

    match_patter=ModuleUrls.objects.filter(Q(url__iregex=f'^{regex_pattern}$')).first()
    return match_patter
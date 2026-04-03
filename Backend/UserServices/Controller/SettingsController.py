from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from UserServices.models import CompanySettings
from EcommerceInventory.Helpers import renderResponse

class SettingsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        domain_user_id = request.user.domain_user_id if request.user.domain_user_id else request.user
        settings_obj = CompanySettings.objects.all().first()
        
        if settings_obj:
            data = {
                'id': settings_obj.id,
                'company_name': settings_obj.company_name,
                'company_email': settings_obj.company_email,
                'gst_number': settings_obj.gst_number,
                'currency': settings_obj.currency,
                'timezone': settings_obj.timezone
            }
        else:
            # Default empty structure if not set
            data = {
                'company_name': '',
                'company_email': '',
                'gst_number': '',
                'currency': 'USD',
                'timezone': 'UTC'
            }
            
        return renderResponse(data=data, message="Settings Fetched Successfully", status=200)

    def post(self, request):
        domain_user_id = request.user.domain_user_id if request.user.domain_user_id else request.user
        
        company_name = request.data.get('company_name', '')
        company_email = request.data.get('company_email', '')
        gst_number = request.data.get('gst_number', '')
        currency = request.data.get('currency', 'USD')
        timezone = request.data.get('timezone', 'UTC')
        
        settings_obj = CompanySettings.objects.all().first()
        
        if settings_obj:
            settings_obj.company_name = company_name
            settings_obj.company_email = company_email
            settings_obj.gst_number = gst_number
            settings_obj.currency = currency
            settings_obj.timezone = timezone
            settings_obj.save()
            msg = "Settings Updated Successfully"
        else:
            settings_obj = CompanySettings.objects.create(
                company_name=company_name,
                company_email=company_email,
                gst_number=gst_number,
                currency=currency,
                timezone=timezone,
                
            )
            msg = "Settings Created Successfully"

        data = {
            'id': settings_obj.id,
            'company_name': settings_obj.company_name,
            'company_email': settings_obj.company_email,
            'gst_number': settings_obj.gst_number,
            'currency': settings_obj.currency,
            'timezone': settings_obj.timezone
        }
        
        return renderResponse(data=data, message=msg, status=200)

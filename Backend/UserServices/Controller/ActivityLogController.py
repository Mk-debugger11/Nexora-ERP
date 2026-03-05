from rest_framework import serializers, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from EcommerceInventory.Helpers import CommonListAPIMixin, CustomPageNumberPagination
from UserServices.models import ActivityLog

class ActivityLogSerializer(serializers.ModelSerializer):
    activity_date = serializers.DateTimeField(format="%dth %B %Y, %H:%M", read_only=True)
    class Meta:
        model = ActivityLog
        fields = '__all__'

class UserActivityLogListView(generics.ListAPIView):
    serializer_class = ActivityLogSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return ActivityLog.objects.filter( user_id=user_id).order_by('-id')

    @CommonListAPIMixin.common_list_decorator(ActivityLogSerializer)
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

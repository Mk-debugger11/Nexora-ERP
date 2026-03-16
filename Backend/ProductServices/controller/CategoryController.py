from EcommerceInventory.Helpers import CommonListAPIMixin, CustomPageNumberPagination, createParsedCreatedAtUpdatedAt, renderResponse
from ProductServices.models import Categories
from rest_framework import generics
from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Q
from django.db import models

@createParsedCreatedAtUpdatedAt
class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    domain_user_id=serializers.SerializerMethodField()
    added_by_user_id=serializers.SerializerMethodField()
    parent_id=serializers.SerializerMethodField()
    products_count=serializers.SerializerMethodField()

    class Meta:
        model = Categories
        fields = '__all__'

    def get_children(self, obj):
        children = Categories.objects.filter(parent_id=obj.id)
        return CategorySerializer(children, many=True).data

    def get_domain_user_id(self,obj):
        if obj.domain_user_id:
            return "#"+str(obj.domain_user_id.id)+" "+obj.domain_user_id.username
        return ""
    
    def get_added_by_user_id(self,obj):
        if obj.added_by_user_id:
            return "#"+str(obj.added_by_user_id.id)+" "+obj.added_by_user_id.username
        return ""
    
    def get_parent_id(self,obj):
        return "#"+str(obj.parent_id.id)+" "+obj.parent_id.name if obj.parent_id else None
        
    def get_products_count(self,obj):
        from ProductServices.models import Products
        # Count products in this category and its subcategories
        return Products.objects.filter(category_id=obj).count()

class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


    def get_queryset(self):
        queryset=Categories.objects.filter(parent_id__isnull=True).all()
        return queryset

    @CommonListAPIMixin.common_list_decorator(CategorySerializer)
    def list(self,request,*args,**kwargs):
        return super().list(request,*args,**kwargs)

from rest_framework.views import APIView

class CategoryDeleteView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            category = Categories.objects.get(id=pk, )
            # Check if category has products or subcategories to prevent orphaned records or delete cascade issues
            from ProductServices.models import Products
            if Products.objects.filter(category_id=category).exists() or Categories.objects.filter(parent_id=category).exists():
                return renderResponse(data='Cannot delete category because it contains products or subcategories', message='Cannot delete category', status=400)
            
            category.delete()
            return renderResponse(data='Category deleted successfully', message='Category deleted successfully', status=200)
        except Categories.DoesNotExist:
            return renderResponse(data='Category not found', message='Category not found', status=404)

class CategoryStatusToggleView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            category = Categories.objects.get(id=pk, )
            if category.status == 'ACTIVE':
                category.status = 'INACTIVE'
            else:
                category.status = 'ACTIVE'
            category.save()
            return renderResponse(data='Status updated successfully', message='Status updated successfully', status=200)
        except Categories.DoesNotExist:
            return renderResponse(data='Category not found', message='Category not found', status=404)
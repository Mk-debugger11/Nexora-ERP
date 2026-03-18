from UserServices.models import Users
from EcommerceInventory.Helpers import CommonListAPIMixin, CustomPageNumberPagination, createParsedCreatedAtUpdatedAt, renderResponse
from ProductServices.models import ProductQuestions, ProductReviews, Products
from rest_framework import generics
from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Q, Sum
from django.db import models
from InventoryServices.models import Inventory

@createParsedCreatedAtUpdatedAt
class ProductReviewSerializer(serializers.ModelSerializer):
    review_user_id=serializers.SerializerMethodField()
    class Meta:
        model=ProductReviews
        fields='__all__'
    
    def get_review_user_id(self,obj):
        return "#"+str(obj.review_user_id.id)+" "+obj.review_user_id.username

@createParsedCreatedAtUpdatedAt
class ProductQuestionSerializer(serializers.ModelSerializer):
    question_user_id=serializers.SerializerMethodField()
    answer_user_id=serializers.SerializerMethodField()
    class Meta:
        model=ProductQuestions
        fields='__all__'

    def get_question_user_id(self,obj):
        return "#"+str(obj.question_user_id.id)+" "+obj.question_user_id.username
    
    def get_answer_user_id(self,obj):
        return "#"+str(obj.answer_user_id.id)+" "+obj.answer_user_id.username
@createParsedCreatedAtUpdatedAt
class ProductSerializer(serializers.ModelSerializer):
    category_id=serializers.SerializerMethodField()
    domain_user_id=serializers.SerializerMethodField()
    added_by_user_id=serializers.SerializerMethodField()
    supplier_id=serializers.SerializerMethodField()
    current_stock=serializers.SerializerMethodField()
    class Meta:
        model = Products
        fields = '__all__'

    def get_category_id(self,obj):
        if obj.category_id:
            return "#"+str(obj.category_id.id)+" "+obj.category_id.name
        return ""
    
    def get_domain_user_id(self,obj):
        if obj.domain_user_id:
            return "#"+str(obj.domain_user_id.id)+" "+obj.domain_user_id.username
        return ""
    
    def get_added_by_user_id(self,obj):
        if obj.added_by_user_id:
            return "#"+str(obj.added_by_user_id.id)+" "+obj.added_by_user_id.username
        return ""

    def get_supplier_id(self,obj):
        if obj.supplier_id:
            return "#"+str(obj.supplier_id.id)+" "+obj.supplier_id.username
        return ""

    def get_current_stock(self,obj):
        stock = Inventory.objects.filter(product_id=obj.id).aggregate(Sum('quantity'))['quantity__sum']
        return stock if stock else 0


class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        queryset=Products.objects.all()
        return queryset
    
    @CommonListAPIMixin.common_list_decorator(ProductSerializer)
    def list(self,request,*args,**kwargs):
        return super().list(request,*args,**kwargs)


class ProductReviewListView(generics.ListAPIView):
    serializer_class = ProductReviewSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        queryset=ProductReviews.objects.filter(product_id=self.kwargs['product_id'])
        return queryset
    
    @CommonListAPIMixin.common_list_decorator(ProductReviewSerializer)
    def list(self,request,*args,**kwargs):
        return super().list(request,*args,**kwargs)
    
class ProductQuestionsListView(generics.ListAPIView):
    serializer_class = ProductQuestionSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        queryset=ProductQuestions.objects.filter(product_id=self.kwargs['product_id'])
        return queryset
    
    @CommonListAPIMixin.common_list_decorator(ProductQuestionSerializer)
    def list(self,request,*args,**kwargs):
        return super().list(request,*args,**kwargs)


class CreateProductReviewView(generics.CreateAPIView):
    serializer_class = ProductReviewSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self,serializer):
        if self.request.data.get('review_user_id'):
            serializer.save(review_user_id=Users.objects.get(id=int(self.request.data.get('review_user_id'))),product_id=Products.objects.get(id=self.kwargs['product_id']))
        else:
            serializer.save(product_id=Products.objects.get(id=self.kwargs['product_id']),review_user_id=self.request.user)

class CreateProductQuestionsView(generics.CreateAPIView):
    serializer_class = ProductQuestionSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self,serializer):
        if self.request.data.get('question_user_id') and self.request.data.get('answer_user_id'):
            serializer.save(question_user_id=Users.objects.get(id=int(self.request.data.get('question_user_id'))),answer_user_id=Users.objects.get(id=int(self.request.data.get('answer_user_id'))),product_id=Products.objects.get(id=self.kwargs['product_id']))
        else:
            serializer.save(product_id=Products.objects.get(id=self.kwargs['product_id']),question_user_id=self.request.user,answer_user_id=self.request.user)



class UpdateProductReviewView(generics.UpdateAPIView):
    serializer_class = ProductReviewSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ProductReviews.objects.filter(product_id=self.kwargs['product_id'],id=self.kwargs['pk'])

    def perform_update(self,serializer):
        serializer.save()


class UpdateProductQuestionsView(generics.UpdateAPIView):
    serializer_class = ProductQuestionSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ProductQuestions.objects.filter(product_id=self.kwargs['product_id'],id=self.kwargs['pk'])

    def perform_update(self,serializer):
        if self.request.data.get('answer'):
            if self.request.data.get('answer_user_id'):
                serializer.save(answer_user_id=Users.objects.get(id=int(self.request.data.get('answer_user_id'))))
            else:
                serializer.save(answer_user_id=self.request.user)
        else:
            serializer.save()

from rest_framework.views import APIView
from OrderService.models import SalesOrderOrderItems, PurchaseOrderItems

class ProductDeleteView(generics.DestroyAPIView):
    queryset = Products.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.domain_user_id != request.user.domain_user_id:
            return renderResponse(data='Permission denied', message='Error', status=403)
        if Inventory.objects.filter(product_id=instance).exists():
            return renderResponse(data='Cannot delete product with existing inventory', message='Cannot delete product', status=400)
        if SalesOrderOrderItems.objects.filter(product_id=instance).exists():
            return renderResponse(data='Cannot delete product with existing sales orders', message='Cannot delete product', status=400)
        if PurchaseOrderItems.objects.filter(product_id=instance).exists():
            return renderResponse(data='Cannot delete product with existing purchase orders', message='Cannot delete product', status=400)
        self.perform_destroy(instance)
        return renderResponse(data={}, message='Product deleted successfully', status=200)

class ProductStatusToggleView(generics.UpdateAPIView):
    queryset = Products.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.domain_user_id != request.user.domain_user_id:
            return renderResponse(data='Permission denied', message='Error', status=403)
        if instance.status == 'ACTIVE':
            instance.status = 'INACTIVE'
        else:
            instance.status = 'ACTIVE'
        instance.save()
        return renderResponse(data={}, message='Product status toggled successfully', status=200)

class ProductDetailedView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            product = Products.objects.get(id=pk, )
            serializer = ProductSerializer(product)
            data = serializer.data

            data['reviews_count'] = ProductReviews.objects.filter(product_id=product).count()
            data['questions_count'] = ProductQuestions.objects.filter(product_id=product).count()

            inventory = Inventory.objects.filter(product_id=product).values(
                'warehouse_id__name', 'rack_shelf_floor_id__name', 'quantity', 'stock_status'
            )
            data['inventory_summary'] = list(inventory)

            purchases = PurchaseOrderItems.objects.filter(product_id=product).order_by('-created_at')[:5].values(
                'purchase_order_id__id', 'quantity', 'buy_price', 'created_at'
            )
            data['purchase_history'] = list(purchases)

            sales = SalesOrderOrderItems.objects.filter(product_id=product).order_by('-created_at')[:5].values(
                'so_id__id', 'quantity_ordered', 'amount_ordered', 'created_at'
            )
            data['sales_history'] = list(sales)

            return renderResponse(data=data, message='Product details retrieved successfully', status=200)
        except Products.DoesNotExist:
            return renderResponse(data='Product not found', message='Error', status=404)

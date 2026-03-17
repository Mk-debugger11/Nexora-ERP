from ProductServices.models import ProductReviews, ProductQuestions
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from EcommerceInventory.Helpers import CommonListAPIMixin, CustomPageNumberPagination
from ProductServices.controller.ProductController import ProductReviewSerializer, ProductQuestionSerializer

class GlobalProductReviewListView(generics.ListAPIView):
    serializer_class = ProductReviewSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        return ProductReviews.objects.all()
    
    @CommonListAPIMixin.common_list_decorator(ProductReviewSerializer)
    def list(self,request,*args,**kwargs):
        return super().list(request,*args,**kwargs)

class GlobalProductQuestionsListView(generics.ListAPIView):
    serializer_class = ProductQuestionSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        return ProductQuestions.objects.all()
    
    @CommonListAPIMixin.common_list_decorator(ProductQuestionSerializer)
    def list(self,request,*args,**kwargs):
        return super().list(request,*args,**kwargs)

class GlobalProductReviewUpdateView(generics.UpdateAPIView):
    serializer_class = ProductReviewSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return ProductReviews.objects.all()

class GlobalProductReviewDeleteView(generics.DestroyAPIView):
    serializer_class = ProductReviewSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return ProductReviews.objects.all()

class GlobalProductQuestionsUpdateView(generics.UpdateAPIView):
    serializer_class = ProductQuestionSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return ProductQuestions.objects.all()

class GlobalProductQuestionsDeleteView(generics.DestroyAPIView):
    serializer_class = ProductQuestionSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return ProductQuestions.objects.all()


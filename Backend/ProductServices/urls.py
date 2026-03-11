from .controller.CategoryController import CategoryListView, CategoryDeleteView, CategoryStatusToggleView
from .controller.ProductController import ProductListView,ProductReviewListView,CreateProductReviewView,UpdateProductReviewView,ProductQuestionsListView,CreateProductQuestionsView,UpdateProductQuestionsView,ProductDeleteView,ProductStatusToggleView,ProductDetailedView
from .controller.GlobalReviewsController import GlobalProductReviewListView, GlobalProductQuestionsListView, GlobalProductReviewUpdateView, GlobalProductReviewDeleteView, GlobalProductQuestionsUpdateView, GlobalProductQuestionsDeleteView
from django.urls import path

urlpatterns = [
    #Category API List,Create,Update
    path('category/',CategoryListView.as_view(),name='category_list'),
    path('category/delete/<str:pk>/',CategoryDeleteView.as_view(),name='category_delete'),
    path('category/toggle-status/<str:pk>/',CategoryStatusToggleView.as_view(),name='category_toggle_status'),

    #Product API List,Create,Update
    path('',ProductListView.as_view(),name='product_list'),
    path('details/<str:pk>/',ProductDetailedView.as_view(),name='product_details'),
    path('delete/<str:pk>/',ProductDeleteView.as_view(),name='product_delete'),
    path('toggle-status/<str:pk>/',ProductStatusToggleView.as_view(),name='product_toggle_status'),

    # Product Review API List,Create,Update
    path('productReviews/<str:product_id>/',ProductReviewListView.as_view(),name='product_review_list'),
    path('createProductReview/<str:product_id>/',CreateProductReviewView.as_view(),name='product_review_create'),
    path('updateProductReview/<str:product_id>/<pk>/',UpdateProductReviewView.as_view(),name='product_review_update'),

    #Product Question API List,Create,Update
    path('productQuestions/<str:product_id>/',ProductQuestionsListView.as_view(),name='product_question_list'),
    path('createProductQuestion/<str:product_id>/',CreateProductQuestionsView.as_view(),name='product_question_create'),
    path('updateProductQuestion/<str:product_id>/<pk>/',UpdateProductQuestionsView.as_view(),name='product_question_update'),
    
    # Global endpoints for standalone pages
    path('reviews/',GlobalProductReviewListView.as_view(),name='global_product_reviews'),
    path('reviews/<str:pk>/',GlobalProductReviewUpdateView.as_view(),name='global_product_reviews_update'),
    path('reviews/delete/<str:pk>/',GlobalProductReviewDeleteView.as_view(),name='global_product_reviews_delete'),
    
    path('questions/',GlobalProductQuestionsListView.as_view(),name='global_product_questions'),
    path('questions/<str:pk>/',GlobalProductQuestionsUpdateView.as_view(),name='global_product_questions_update'),
    path('questions/delete/<str:pk>/',GlobalProductQuestionsDeleteView.as_view(),name='global_product_questions_delete'),
]
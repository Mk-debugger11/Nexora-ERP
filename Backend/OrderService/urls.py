from OrderService.controller.PurchaseOrderController import (
    CreatePurchaseOrderView, PurchaseOrderListView, PurchaseOrderDeleteView,
    PurchaseOrderStatusUpdateView, PurchaseOrderReceiveView, PurchaseOrderDetailedView,
    PurchaseOrderLogsListView
)
from OrderService.controller.SalesOrderController import (
    CreateSalesOrderView, SalesOrderListView, SalesOrderDeleteView,
    SalesOrderStatusUpdateView, SalesOrderDeliverView, SalesOrderDetailedView, InvoiceGenerationView
)
from OrderService.controller import ReportsController
from django.urls import path

urlpatterns=[
    path('purchaseOrder/', CreatePurchaseOrderView.as_view(), name='purchase_order'),
    path('purchaseOrder/<str:id>/', CreatePurchaseOrderView.as_view(), name='purchase_order_draft_detail'),
    path('purchaseOrderList/', PurchaseOrderListView.as_view(), name='purchase_order_list'),
    path('purchaseOrder/delete/<str:pk>/', PurchaseOrderDeleteView.as_view(), name='purchase_order_delete'),
    path('purchaseOrder/status/<str:id>/', PurchaseOrderStatusUpdateView.as_view(), name='purchase_order_status'),
    path('purchaseOrder/receive/<str:id>/', PurchaseOrderReceiveView.as_view(), name='purchase_order_receive'),
    path('purchaseOrder/details/<str:id>/', PurchaseOrderDetailedView.as_view(), name='purchase_order_detailed'),
    path('purchaseOrder/logs/<str:id>/', PurchaseOrderLogsListView.as_view(), name='purchase_order_logs'),
    
    # Sales Order Endpoints
    path('salesOrder/', CreateSalesOrderView.as_view(), name='sales_order'),
    path('salesOrder/<str:id>/', CreateSalesOrderView.as_view(), name='sales_order_draft_detail'),
    path('salesOrderList/', SalesOrderListView.as_view(), name='sales_order_list'),
    path('salesOrder/delete/<str:pk>/', SalesOrderDeleteView.as_view(), name='sales_order_delete'),
    path('salesOrder/status/<str:id>/', SalesOrderStatusUpdateView.as_view(), name='sales_order_status'),
    path('salesOrder/deliver/<str:id>/', SalesOrderDeliverView.as_view(), name='sales_order_deliver'),
    path('salesOrder/details/<str:id>/', SalesOrderDetailedView.as_view(), name='sales_order_detailed'),
    
    # Invoice Endpoints
    path('invoice/<str:id>/', InvoiceGenerationView.as_view(), name='invoice_generation'),

    # Reports Endpoints
    path('reports/sales/', ReportsController.SalesReportAPIView.as_view(), name='reports_sales'),
    path('reports/purchases/', ReportsController.PurchaseReportAPIView.as_view(), name='reports_purchases'),
    path('reports/inventory/', ReportsController.InventoryReportAPIView.as_view(), name='reports_inventory'),
]
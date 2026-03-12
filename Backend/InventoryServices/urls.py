from django.urls import path
from .Controller.WarehouseController import WarehouseListView, UpdateWarehouseView, WarehouseDeleteView, RackShelfFloorDeleteView
from .Controller.InventoryController import InventoryListView, LowStockView, InventoryLogListView, InventoryAdjustmentView, InventorySummaryView

urlpatterns=[
    path('warehouse/', WarehouseListView.as_view(), name='warehouse_list'),
    path('toggleWarehouse/<pk>/', UpdateWarehouseView.as_view(), name='update_warehouse'),
    path('deleteWarehouse/<pk>/', WarehouseDeleteView.as_view(), name='delete_warehouse'),
    path('deleteRackShelfFloor/<pk>/', RackShelfFloorDeleteView.as_view(), name='delete_rack_shelf_floor'),
    path('inventory/', InventoryListView.as_view(), name='inventory_list'),
    path('inventory/low-stock/', LowStockView.as_view(), name='low_stock'),
    path('inventory/logs/<str:inventory_id>/', InventoryLogListView.as_view(), name='inventory_logs'),
    path('inventory/logs/', InventoryLogListView.as_view(), name='inventory_logs_all'),
    path('inventory/adjust/', InventoryAdjustmentView.as_view(), name='inventory_adjust'),
    path('inventory/summary/', InventorySummaryView.as_view(), name='inventory_summary'),
]
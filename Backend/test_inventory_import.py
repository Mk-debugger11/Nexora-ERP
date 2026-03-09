import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EcommerceInventory.settings')
django.setup()

from InventoryServices.Controller.InventoryController import InventoryListView, LowStockView, InventoryAdjustmentView, InventorySummaryView
from InventoryServices.Controller.WarehouseController import WarehouseDeleteView, RackShelfFloorDeleteView
print("All imports successful!")

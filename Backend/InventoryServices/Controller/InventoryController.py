from EcommerceInventory.Helpers import CommonListAPIMixinWithFilter, CustomPageNumberPagination, createParsedCreatedAtUpdatedAt, renderResponse
from InventoryServices.models import Inventory, InventoryLog, Warehouse, RackAndShelvesAndFloor
from ProductServices.models import Products
from rest_framework import generics, serializers
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Sum, Q, F
from django.db import models


@createParsedCreatedAtUpdatedAt
class InventorySerializer(serializers.ModelSerializer):
    product_name = serializers.SerializerMethodField()
    product_sku = serializers.SerializerMethodField()
    warehouse_name = serializers.SerializerMethodField()
    rack_shelf_floor_name = serializers.SerializerMethodField()

    class Meta:
        model = Inventory
        fields = '__all__'

    def get_product_name(self, obj):
        if obj.product_id:
            return obj.product_id.name
        return ""

    def get_product_sku(self, obj):
        if obj.product_id:
            return obj.product_id.sku
        return ""

    def get_warehouse_name(self, obj):
        if obj.warehouse_id:
            return obj.warehouse_id.name
        return ""

    def get_rack_shelf_floor_name(self, obj):
        if obj.rack_shelf_floor_id:
            return obj.rack_shelf_floor_id.name
        return ""


class InventoryListView(generics.ListAPIView):
    serializer_class = InventorySerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        queryset = Inventory.objects.all()
        return queryset

    @CommonListAPIMixinWithFilter.common_list_decorator(InventorySerializer)
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class LowStockView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        domain_id = request.user.domain_user_id.id
        products = Products.objects.filter(domain_user_id=domain_id, status='ACTIVE')
        low_stock_items = []
        for product in products:
            total_qty = Inventory.objects.filter(
                product_id=product, domain_user_id=domain_id
            ).aggregate(total=Sum('quantity'))['total'] or 0
            if total_qty <= product.stock_alert_quantity:
                low_stock_items.append({
                    'id': product.id,
                    'name': product.name,
                    'sku': product.sku,
                    'current_stock': total_qty,
                    'alert_quantity': product.stock_alert_quantity,
                    'status': 'OUT_OF_STOCK' if total_qty == 0 else 'LOW_STOCK'
                })
        return renderResponse(data=low_stock_items, message='Low stock items retrieved', status=200)


@createParsedCreatedAtUpdatedAt
class InventoryLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryLog
        fields = '__all__'


class InventoryLogListView(generics.ListAPIView):
    serializer_class = InventoryLogSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        queryset = InventoryLog.objects.all()
        inventory_id = self.kwargs.get('inventory_id')
        if inventory_id:
            queryset = queryset.filter(inventory_id=inventory_id)
        return queryset.order_by('-created_at')

    @CommonListAPIMixinWithFilter.common_list_decorator(InventoryLogSerializer)
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class InventoryAdjustmentView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        inventory_id = request.data.get('inventory_id')
        adjustment_qty = request.data.get('quantity')
        reason = request.data.get('reason', 'Manual Adjustment')
        status = request.data.get('status', 'ADJUSTMENT')

        if not inventory_id or adjustment_qty is None:
            return renderResponse(data='inventory_id and quantity are required', message='Validation Error', status=400)

        try:
            inventory = Inventory.objects.get(
                id=inventory_id,
                
            )
        except Inventory.DoesNotExist:
            return renderResponse(data='Inventory item not found', message='Error', status=404)

        old_qty = inventory.quantity
        inventory.quantity = int(adjustment_qty)
        inventory.save()

        InventoryLog.objects.create(
            inventory_id=inventory,
            warehouse_id=inventory.warehouse_id,
            rack_shelf_floor_id=inventory.rack_shelf_floor_id,
            quantity=int(adjustment_qty) - old_qty,
            status=status,
            additional_details=[{'key': 'reason', 'value': reason}, {'key': 'old_qty', 'value': str(old_qty)}, {'key': 'new_qty', 'value': str(adjustment_qty)}],
            
            added_by_user_id=request.user
        )

        return renderResponse(data={}, message=f'Inventory adjusted from {old_qty} to {adjustment_qty}', status=200)


class InventorySummaryView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        domain_id = request.user.domain_user_id.id
        total_products = Products.objects.filter(domain_user_id=domain_id, status='ACTIVE').count()
        total_warehouses = Warehouse.objects.filter(domain_user_id=domain_id, status='ACTIVE').count()
        total_stock = Inventory.objects.filter(domain_user_id=domain_id).aggregate(total=Sum('quantity'))['total'] or 0
        in_stock = Inventory.objects.filter(domain_user_id=domain_id, stock_status='IN_STOCK').aggregate(total=Sum('quantity'))['total'] or 0
        damaged = Inventory.objects.filter(domain_user_id=domain_id, stock_status='DAMAGED').aggregate(total=Sum('quantity'))['total'] or 0
        out_of_stock = Inventory.objects.filter(domain_user_id=domain_id, stock_status='OUT_OF_STOCK').aggregate(total=Sum('quantity'))['total'] or 0

        # Per-warehouse breakdown
        warehouse_breakdown = Inventory.objects.filter(
            domain_user_id=domain_id
        ).values('warehouse_id__name').annotate(
            total_qty=Sum('quantity')
        ).order_by('-total_qty')

        return renderResponse(data={
            'total_products': total_products,
            'total_warehouses': total_warehouses,
            'total_stock': total_stock,
            'in_stock': in_stock,
            'damaged': damaged,
            'out_of_stock': out_of_stock,
            'warehouse_breakdown': list(warehouse_breakdown)
        }, message='Inventory summary', status=200)

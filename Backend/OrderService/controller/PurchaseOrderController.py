from OrderService.models import PurchaseOrder, PurchaseOrderItems, PurchaseOrderLogs, PurchaseOrderInwardedLog, PurchaseOrderItemInwardedLog
from InventoryServices.models import Inventory, InventoryLog
from EcommerceInventory.Helpers import CommonListAPIMixin, CustomPageNumberPagination, getDynamicFormFields, renderResponse
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import serializers
from django.utils import timezone
from django.db.models import Sum

class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    sku=serializers.CharField(source='product_id.sku',read_only=True)
    product_name=serializers.CharField(source='product_id.name',read_only=True)
    class Meta:
        model=PurchaseOrderItems
        fields="__all__"

class PurchaseOrderListSerializer(serializers.ModelSerializer):
    warehouse_id=serializers.CharField(source='warehouse_id.name',read_only=True)
    supplier_id=serializers.CharField(source='supplier_id.email',read_only=True)
    last_updated_by_user_id=serializers.CharField(source='last_updated_by_user_id.username',read_only=True)
    created_by_user_id=serializers.CharField(source='created_by_user_id.username',read_only=True)
    domain_user_id=serializers.CharField(source='domain_user_id.username',read_only=True)
    approved_by_user_id=serializers.CharField(source='approved_by_user_id.username',read_only=True)
    cancelled_by_user_id=serializers.CharField(source='cancelled_by_user_id.username',read_only=True)
    received_by_user_id=serializers.CharField(source='received_by_user_id.username',read_only=True)
    returned_by_user_id=serializers.CharField(source='returned_by_user_id.username',read_only=True)
    class Meta:
        model=PurchaseOrder
        fields="__all__"

class PurchaseOrderSerializer(serializers.ModelSerializer):
    items=PurchaseOrderItemSerializer(many=True,source='po_id_purchase_order_items')
    class Meta:
        model=PurchaseOrder
        fields="__all__"
    
    def create(self,validated_data):
        items_data=validated_data.pop('po_id_purchase_order_items')
        purchaseOrder=PurchaseOrder.objects.create(**validated_data)
        for item_data in items_data:
            item_data.update({'domain_user_id':validated_data.get('domain_user_id')})
            PurchaseOrderItems.objects.create(po_id=purchaseOrder,**item_data)

        purchaseOrderLog=PurchaseOrderLogs(po_id=purchaseOrder,additional_details=[{"key":"STATUS","value":validated_data.get("status")}],comment='Purchase Order Created with Status '+validated_data.get('status'),created_by_user_id=validated_data.get('created_by_user_id'),domain_user_id=validated_data.get('domain_user_id'))
        purchaseOrderLog.save()
        return purchaseOrder
    
    def update(self,instance,validated_data):
        items_data=validated_data.pop('po_id_purchase_order_items')
        instance=super().update(instance,validated_data)
        items=[item_data.get('id') for item_data in items_data if 'id' in item_data]
        PurchaseOrderItems.objects.filter(po_id=instance).exclude(id__in=items).delete()

        for item_data in items_data:
            item_data.update({'domain_user_id':validated_data.get('domain_user_id')})

            if 'po_id' in item_data:
                item_data.pop('po_id')

            if 'id' in item_data:
                poItem=PurchaseOrderItems.objects.filter(id=item_data.get('id'))
                po_item_serializer=PurchaseOrderItemSerializer(poItem.first(),data=item_data)
                if po_item_serializer.is_valid():
                    po_item_serializer.save()
            else:
                PurchaseOrderItems.objects.create(po_id=instance,**item_data)

        purchaseOrderLog=PurchaseOrderLogs(po_id=instance,additional_details=[{"key":"STATUS","value":validated_data.get("status")}],comment='Purchase Order Created with Status '+validated_data.get('status'),created_by_user_id=validated_data.get('created_by_user_id'),domain_user_id=validated_data.get('domain_user_id'))
        purchaseOrderLog.save()
        return instance

class CreatePurchaseOrderView(generics.CreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self,request,id=None):
        po=PurchaseOrder.objects.filter(id=id).first() if id else PurchaseOrder()
        poItems=PurchaseOrderItems.objects.filter(po_id=id) if id else []
        poItems=PurchaseOrderItemSerializer(poItems,many=True).data
        try:
            poData={'supplier_id':po.supplier_id.id,'supplier_email':po.supplier_id.email} if po.supplier_id else {}
        except:
            poData={}
        poFields=getDynamicFormFields(po,request.user.domain_user_id.id,skip_related=['supplier_id'],skip_fields=['shipping_cancelled_amount','shipping_cancelled_tax_amount','approved_at','cancelled_at','received_at','returned_at','last_updated_by_user_id','status','approved_by_user_id','cancelled_by_user_id','received_by_user_id','returned_by_user_id','cancelled_reason'])
        poItemFields=getDynamicFormFields(PurchaseOrderItems(),request.user.domain_user_id.id,skip_related=['product_id'],skip_fields=['quantity_received','quantity_cancelled','quantity_returned','amount_returned','amount_cancelled','shipping_cancelled_amount','shipping_cancelled_tax_amount','approved_at','cancelled_at','received_at','returned_at','po_id','status','approved_by_user_id','cancelled_by_user_id','received_by_user_id','returned_by_user_id','cancelled_reason'])
        return renderResponse(data={'poData':poData,'poItems':poItems,'poFields':poFields,'poItemFields':poItemFields},message='Purchase Order Fields',status=200)

    def post(self,request,id=None):
        data=request.data
        data.update({'created_by_user_id':request.user.id})
        data.update({'domain_user_id':request.user.domain_user_id.id})
        data.update({'last_updated_by_user_id':request.user.id})
        if id:
            po=PurchaseOrder.objects.filter(id=id).first()
            if po:
                serializer=PurchaseOrderSerializer(po,data=data)
            else:
                return renderResponse(data={},message='Purchase Order Not Found',status=404)
        else:
            serializer=PurchaseOrderSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return renderResponse(data=serializer.data,message='Purchase Order Created',status=201)
        return renderResponse(data=serializer.errors,message='Error Creating Purchase Order',status=400)
    

class PurchaseOrderListView(generics.ListAPIView):
    serializer_class = PurchaseOrderListSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        queryset=PurchaseOrder.objects.all()
        return queryset
    
    @CommonListAPIMixin.common_list_decorator(PurchaseOrderListSerializer)
    def list(self,request,*args,**kwargs):
        return super().list(request,*args,**kwargs)

class PurchaseOrderDeleteView(generics.DestroyAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PurchaseOrder.objects.all()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.domain_user_id != request.user.domain_user_id:
            return renderResponse(data='Permission denied', message='Error', status=403)
        if instance.status not in ['DRAFT', 'CREATED']:
            return renderResponse(data=f'Cannot delete PO in {instance.status} status', message='Cannot delete', status=400)
        self.perform_destroy(instance)
        return renderResponse(data={}, message='Purchase Order deleted successfully', status=200)

class PurchaseOrderStatusUpdateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        status = request.data.get('status')
        if status not in ['APPROVED', 'CANCELLED']:
            return renderResponse(data='Invalid status update', message='Error', status=400)
            
        po = PurchaseOrder.objects.filter( id=id).first()
        if not po:
            return renderResponse(data='Purchase Order Not Found', message='Error', status=404)
            
        po.status = status
        if status == 'APPROVED':
            po.approved_by_user_id = request.user
            po.approved_at = timezone.now()
        elif status == 'CANCELLED':
            po.cancelled_by_user_id = request.user
            po.cancelled_at = timezone.now()
            po.cancelled_reason = request.data.get('reason', 'Manual Cancellation')
        
        po.updated_by_user_id = request.user
        po.save()
        
        PurchaseOrderLogs.objects.create(
            po_id=po,
            comment=f'Purchase Order {status}',
            additional_details=[{"key": "STATUS", "value": status}],
            created_by_user_id=request.user,
            
        )
        
        return renderResponse(data=PurchaseOrderListSerializer(po).data, message=f'PO Status updated to {status}', status=200)

class PurchaseOrderReceiveView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        po = PurchaseOrder.objects.filter( id=id).first()
        if not po:
            return renderResponse(data='Purchase Order Not Found', message='Error', status=404)
            
        if po.status not in ['APPROVED', 'PARTIAL RECEIVED']:
            return renderResponse(data=f'Cannot receive goods for PO in {po.status} status', message='Error', status=400)
            
        items_received = request.data.get('items', [])
        invoice_number = request.data.get('invoice_number', '')
        notes = request.data.get('notes', '')
        
        if not items_received:
            return renderResponse(data='No items provided', message='Error', status=400)
            
        # Create Inward Log
        inward_log = PurchaseOrderInwardedLog.objects.create(
            po_id=po,
            invoice_number=invoice_number,
            notes=notes,
            invoice_path=[],
            inwarded_by_user_id=request.user,
            inwarded_at=timezone.now(),
            status='RECEIVED',
            
            additional_details=[],
            received_by_user_id=request.user,
            received_at=timezone.now()
        )
        
        total_inwarded_qty = 0
        total_po_qty = sum([item.quantity_ordered for item in PurchaseOrderItems.objects.filter(po_id=po)])
        
        for item_data in items_received:
            po_item_id = item_data.get('po_item_id')
            qty_received = int(item_data.get('quantity_received', 0))
            warehouse_id = item_data.get('warehouse_id')
            rack_shelf_floor_id = item_data.get('rack_shelf_floor_id')
            
            if qty_received <= 0:
                continue
                
            po_item = PurchaseOrderItems.objects.filter(id=po_item_id, po_id=po).first()
            if not po_item:
                continue
                
            po_item.quantity_received += qty_received
            po_item.save()
            
            total_inwarded_qty += qty_received
            
            # Create PO Item Inward Log
            item_inward_log = PurchaseOrderItemInwardedLog.objects.create(
                po_item_id=po_item,
                po_inward_id=inward_log,
                inwarded_quantity=qty_received,
                buy_price=po_item.buying_price,
                sell_price=po_item.selling_price,
                tax_percentage=po_item.tax_percentage,
                discount_amount=po_item.discount_amount,
                discount_type=po_item.discount_type,
                shipping_amount=0,
                shipping_tax_percentage=0,
                status='RECEIVED',
                
                additional_details=[]
            )
            
            # Update or Create Inventory
            if warehouse_id:
                from InventoryServices.models import Warehouse, RackAndShelvesAndFloor
                wh = Warehouse.objects.filter(id=warehouse_id).first()
                rack = RackAndShelvesAndFloor.objects.filter(id=rack_shelf_floor_id).first() if rack_shelf_floor_id else None
                
                inventory, created = Inventory.objects.get_or_create(
                    product_id=po_item.product_id,
                    warehouse_id=wh,
                    rack_shelf_floor_id=rack,
                    
                    defaults={
                        'quantity': 0,
                        'discount_amout': po_item.discount_amount,
                        'uom': 'pcs',
                        'quantity_inwarded': 0,
                        'buy_price': po_item.buying_price,
                        'sell_price': po_item.selling_price,
                        'tax_percentage': po_item.tax_percentage,
                        'stock_status': 'IN_STOCK',
                        'inward_type': 'PURCHASE',
                        'additional_details': {},
                        'added_by_user_id': request.user
                    }
                )
                
                inventory.quantity += qty_received
                inventory.quantity_inwarded += qty_received
                if inventory.quantity > 0:
                    inventory.stock_status = 'IN_STOCK'
                inventory.save()
                
                # Create Inventory Log
                InventoryLog.objects.create(
                    po_id=po,
                    inventory_id=inventory,
                    warehouse_id=wh,
                    rack_shelf_floor_id=rack,
                    quantity=qty_received,
                    status='INWARD',
                    additional_details=[{"key": "source", "value": "Purchase Order"}],
                    
                    added_by_user_id=request.user
                )

        current_total_received = sum([item.quantity_received for item in PurchaseOrderItems.objects.filter(po_id=po)])
        
        if current_total_received >= total_po_qty:
            po.status = 'RECEIVED'
        else:
            po.status = 'PARTIAL RECEIVED'
            
        po.updated_by_user_id = request.user
        po.save()
        
        PurchaseOrderLogs.objects.create(
            po_id=po,
            comment=f'Goods Received (GRN). Status: {po.status}',
            additional_details=[{"key": "STATUS", "value": po.status}, {"key": "Invoice", "value": invoice_number}],
            created_by_user_id=request.user,
            
        )
        
        return renderResponse(data={}, message='Goods Received successfully', status=200)

class PurchaseOrderDetailedView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        po = PurchaseOrder.objects.filter( id=id).first()
        if not po:
            return renderResponse(data='Purchase Order Not Found', message='Error', status=404)
            
        po_data = PurchaseOrderListSerializer(po).data
        items = PurchaseOrderItems.objects.filter(po_id=po)
        items_data = PurchaseOrderItemSerializer(items, many=True).data
        
        logs = PurchaseOrderLogs.objects.filter(po_id=po).order_by('-created_at')
        logs_data = []
        for log in logs:
            logs_data.append({
                'id': log.id,
                'comment': log.comment,
                'created_at': log.created_at,
                'created_by': log.created_by_user_id.username if log.created_by_user_id else '',
                'additional_details': log.additional_details
            })
            
        inwards = PurchaseOrderInwardedLog.objects.filter(po_id=po).order_by('-created_at')
        inwards_data = []
        for inv in inwards:
            inv_items = PurchaseOrderItemInwardedLog.objects.filter(po_inward_id=inv)
            inwards_data.append({
                'id': inv.id,
                'invoice_number': inv.invoice_number,
                'inwarded_at': inv.inwarded_at,
                'status': inv.status,
                'items_count': inv_items.count(),
                'total_qty': inv_items.aggregate(total=Sum('inwarded_quantity'))['total'] or 0
            })
            
        return renderResponse(data={
            'po': po_data,
            'items': items_data,
            'logs': logs_data,
            'inwards': inwards_data
        }, message='PO Details', status=200)

class PurchaseOrderLogsListView(generics.ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, id):
        logs = PurchaseOrderLogs.objects.filter( po_id=id).order_by('-created_at')
        logs_data = []
        for log in logs:
            logs_data.append({
                'id': log.id,
                'comment': log.comment,
                'created_at': log.created_at,
                'created_by': log.created_by_user_id.username if log.created_by_user_id else '',
                'additional_details': log.additional_details
            })
        return renderResponse(data=logs_data, message='PO Logs', status=200)


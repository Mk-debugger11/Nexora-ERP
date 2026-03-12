from OrderService.models import SalesOrder, SalesOrderOrderItems, SalesOrderLogs, SalesOrderOutWardedLog, SalesOrderItemOutwardedLog
from InventoryServices.models import Inventory, InventoryLog
from EcommerceInventory.Helpers import CommonListAPIMixin, CustomPageNumberPagination, getDynamicFormFields, renderResponse
from rest_framework import generics, serializers
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils import timezone
from django.db.models import Sum

class SalesOrderItemSerializer(serializers.ModelSerializer):
    sku=serializers.CharField(source='product_id.sku',read_only=True)
    product_name=serializers.CharField(source='product_id.name',read_only=True)
    class Meta:
        model=SalesOrderOrderItems
        fields="__all__"

class SalesOrderListSerializer(serializers.ModelSerializer):
    customer_name=serializers.CharField(source='customer_id.username',read_only=True)
    customer_email=serializers.CharField(source='customer_id.email',read_only=True)
    class Meta:
        model=SalesOrder
        fields="__all__"

class SalesOrderSerializer(serializers.ModelSerializer):
    items=SalesOrderItemSerializer(many=True,source='so_id_so_order_items')
    class Meta:
        model=SalesOrder
        fields="__all__"
    
    def create(self,validated_data):
        items_data=validated_data.pop('so_id_so_order_items')
        salesOrder=SalesOrder.objects.create(**validated_data)
        for item_data in items_data:
            item_data.update({'domain_user_id':validated_data.get('domain_user_id')})
            SalesOrderOrderItems.objects.create(so_id=salesOrder,**item_data)

        log=SalesOrderLogs(so_id=salesOrder,additional_details=[{"key":"STATUS","value":validated_data.get("status")}],comment='Sales Order Created with Status '+validated_data.get('status'),created_by_user_id=validated_data.get('created_by_user_id'),domain_user_id=validated_data.get('domain_user_id'))
        log.save()
        return salesOrder
    
    def update(self,instance,validated_data):
        items_data=validated_data.pop('so_id_so_order_items')
        instance=super().update(instance,validated_data)
        items=[item_data.get('id') for item_data in items_data if 'id' in item_data]
        SalesOrderOrderItems.objects.filter(so_id=instance).exclude(id__in=items).delete()

        for item_data in items_data:
            item_data.update({'domain_user_id':validated_data.get('domain_user_id')})
            if 'so_id' in item_data:
                item_data.pop('so_id')
            if 'id' in item_data:
                poItem=SalesOrderOrderItems.objects.filter(id=item_data.get('id'))
                po_item_serializer=SalesOrderItemSerializer(poItem.first(),data=item_data)
                if po_item_serializer.is_valid():
                    po_item_serializer.save()
            else:
                SalesOrderOrderItems.objects.create(so_id=instance,**item_data)

        log=SalesOrderLogs(so_id=instance,additional_details=[{"key":"STATUS","value":validated_data.get("status")}],comment='Sales Order Updated with Status '+validated_data.get('status'),created_by_user_id=validated_data.get('created_by_user_id'),domain_user_id=validated_data.get('domain_user_id'))
        log.save()
        return instance

class CreateSalesOrderView(generics.CreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self,request,id=None):
        so=SalesOrder.objects.filter(id=id).first() if id else SalesOrder()
        soItems=SalesOrderOrderItems.objects.filter(so_id=id) if id else []
        soItems=SalesOrderItemSerializer(soItems,many=True).data
        try:
            soData={'customer_id':so.customer_id.id,'customer_email':so.customer_id.email} if so.customer_id else {}
        except:
            soData={}
        soFields=getDynamicFormFields(so,request.user.domain_user_id.id,skip_related=['customer_id'],skip_fields=['shipping_cancelled_amount','shipping_cancelled_tax_amount','approved_at','cancelled_at','received_at','returned_at','last_updated_by_user_id','status','approved_by_user_id','cancelled_by_user_id','received_by_user_id','returned_by_user_id','cancelled_reason'])
        soItemFields=getDynamicFormFields(SalesOrderOrderItems(),request.user.domain_user_id.id,skip_related=['product_id'],skip_fields=['quantity_delivered','quantity_shipped','quantity_cancelled','quantity_returned','amount_returned','amount_cancelled','shipping_cancelled_amount','shipping_cancelled_tax_amount','so_id','status','approved_by_user_id','cancelled_by_user_id'])
        return renderResponse(data={'soData':soData,'soItems':soItems,'soFields':soFields,'soItemFields':soItemFields},message='Sales Order Fields',status=200)

    def post(self,request,id=None):
        data=request.data
        data.update({'created_by_user_id':request.user.id})
        data.update({'domain_user_id':request.user.domain_user_id.id})
        data.update({'last_updated_by_user_id':request.user.id})
        if id:
            so=SalesOrder.objects.filter(id=id).first()
            if so:
                serializer=SalesOrderSerializer(so,data=data)
            else:
                return renderResponse(data={},message='Sales Order Not Found',status=404)
        else:
            serializer=SalesOrderSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return renderResponse(data=serializer.data,message='Sales Order Saved',status=201)
        return renderResponse(data=serializer.errors,message='Error Saving Sales Order',status=400)

class SalesOrderListView(generics.ListAPIView):
    serializer_class = SalesOrderListSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        return SalesOrder.objects.all()
    
    @CommonListAPIMixin.common_list_decorator(SalesOrderListSerializer)
    def list(self,request,*args,**kwargs):
        return super().list(request,*args,**kwargs)

class SalesOrderDeleteView(generics.DestroyAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SalesOrder.objects.all()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.domain_user_id != request.user.domain_user_id:
            return renderResponse(data='Permission denied', message='Error', status=403)
        if instance.status not in ['DRAFT']:
            return renderResponse(data=f'Cannot delete SO in {instance.status} status', message='Cannot delete', status=400)
        self.perform_destroy(instance)
        return renderResponse(data={}, message='Sales Order deleted successfully', status=200)

class SalesOrderStatusUpdateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        status = request.data.get('status')
        so = SalesOrder.objects.filter( id=id).first()
        if not so:
            return renderResponse(data='Sales Order Not Found', message='Error', status=404)
            
        so.status = status
        if status == 'SENT':
            so.approved_by_user_id = request.user
            so.approved_at = timezone.now()
        elif status == 'CANCELLED':
            so.cancelled_by_user_id = request.user
            so.cancelled_at = timezone.now()
            so.cancelled_reason = request.data.get('reason', 'Manual Cancellation')
        
        so.updated_by_user_id = request.user
        so.save()
        
        SalesOrderLogs.objects.create(
            so_id=so,
            comment=f'Sales Order Status: {status}',
            additional_details=[{"key": "STATUS", "value": status}],
            created_by_user_id=request.user,
            
        )
        return renderResponse(data=SalesOrderListSerializer(so).data, message=f'SO Status updated to {status}', status=200)

class SalesOrderDetailedView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        so = SalesOrder.objects.filter( id=id).first()
        if not so:
            return renderResponse(data='Sales Order Not Found', message='Error', status=404)
            
        so_data = SalesOrderListSerializer(so).data
        items = SalesOrderOrderItems.objects.filter(so_id=so)
        items_data = SalesOrderItemSerializer(items, many=True).data
        
        logs = SalesOrderLogs.objects.filter(so_id=so).order_by('-created_at')
        logs_data = [{'id': l.id, 'comment': l.comment, 'created_at': l.created_at, 'created_by': l.created_by_user_id.username if l.created_by_user_id else '', 'additional_details': l.additional_details} for l in logs]
            
        outwards = SalesOrderOutWardedLog.objects.filter(so_id=so).order_by('-created_at')
        outwards_data = []
        for inv in outwards:
            inv_items = SalesOrderItemOutwardedLog.objects.filter(so_outwarded_id=inv)
            outwards_data.append({
                'id': inv.id,
                'invoice_number': inv.invoice_number,
                'outwarded_at': inv.outwared_at,
                'status': inv.status,
                'items_count': inv_items.count(),
                'total_qty': inv_items.aggregate(total=Sum('outwarded_quantity'))['total'] or 0
            })
            
        return renderResponse(data={'so': so_data, 'items': items_data, 'logs': logs_data, 'outwards': outwards_data}, message='SO Details', status=200)

class SalesOrderDeliverView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        so = SalesOrder.objects.filter( id=id).first()
        if not so:
            return renderResponse(data='Sales Order Not Found', message='Error', status=404)
            
        items_delivered = request.data.get('items', [])
        invoice_number = request.data.get('invoice_number', '')
        notes = request.data.get('notes', '')
        
        if not items_delivered:
            return renderResponse(data='No items provided', message='Error', status=400)
            
        outward_log = SalesOrderOutWardedLog.objects.create(
            so_id=so, invoice_number=invoice_number, notes=notes, invoice_path=[],
            outwarded_by_user_id=request.user, outwared_at=timezone.now(), status='DELIVERED',
             additional_details=[], send_by_user_id=request.user, send_at=timezone.now()
        )
        
        total_so_qty = sum([item.quantity_ordered for item in SalesOrderOrderItems.objects.filter(so_id=so)])
        
        for item_data in items_delivered:
            so_item_id = item_data.get('so_item_id')
            qty_delivered = int(item_data.get('quantity_delivered', 0))
            inventory_id = item_data.get('inventory_id') # User must select which inventory to pull from
            
            if qty_delivered <= 0: continue
            so_item = SalesOrderOrderItems.objects.filter(id=so_item_id, so_id=so).first()
            if not so_item: continue
                
            so_item.quantity_delivered += qty_delivered
            so_item.save()
            
            SalesOrderItemOutwardedLog.objects.create(
                so_item_id=so_item, so_outwarded_id=outward_log, outwarded_quantity=qty_delivered,
                buy_price=so_item.purchase_price, sell_price=so_item.purchase_price,
                tax_percentage=so_item.tax_percentage, discount_amount=so_item.discount_amount,
                discount_type=so_item.discount_type, shipping_amount=0, shipping_tax_percentage=0,
                status='DELIVERED',  additional_details=[]
            )
            
            # Deduct Inventory
            qty_to_deduct = qty_delivered
            if inventory_id:
                inventories = Inventory.objects.filter(id=inventory_id)
            else:
                inventories = Inventory.objects.filter(product_id=so_item.product_id, quantity__gt=0).order_by('created_at')
                
            for inventory in inventories:
                if qty_to_deduct <= 0: break
                deduct = min(inventory.quantity, qty_to_deduct)
                inventory.quantity -= deduct
                qty_to_deduct -= deduct
                if inventory.quantity <= 0:
                    inventory.stock_status = 'OUT_OF_STOCK'
                inventory.save()
                InventoryLog.objects.create(
                    so_id=so, inventory_id=inventory, warehouse_id=inventory.warehouse_id, rack_shelf_floor_id=inventory.rack_shelf_floor_id,
                    quantity=deduct, status='OUTWARD', additional_details=[{"key": "source", "value": "Sales Order"}],
                     added_by_user_id=request.user
                )

        current_total_delivered = sum([item.quantity_delivered for item in SalesOrderOrderItems.objects.filter(so_id=so)])
        
        if current_total_delivered >= total_so_qty:
            so.status = 'DELIVERED'
        else:
            so.status = 'PARTIAL DELIVERED'
            
        so.updated_by_user_id = request.user
        so.save()
        
        SalesOrderLogs.objects.create(so_id=so, comment=f'Goods Delivered. Status: {so.status}', additional_details=[{"key": "STATUS", "value": so.status}, {"key": "Invoice", "value": invoice_number}], created_by_user_id=request.user, )
        
        return renderResponse(data={}, message='Goods Delivered successfully', status=200)

class InvoiceGenerationView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, id):
        outward = SalesOrderOutWardedLog.objects.filter( id=id).first()
        if not outward: return renderResponse(data='Invoice Not Found', message='Error', status=404)
        so = outward.so_id
        items = SalesOrderItemOutwardedLog.objects.filter(so_outwarded_id=outward)
        
        invoice_data = {
            "invoice_number": outward.invoice_number,
            "date": outward.outwared_at,
            "customer": so.customer_id.username if so.customer_id else 'Walk-in',
            "customer_email": so.customer_id.email if so.customer_id else '',
            "so_code": so.so_code,
            "items": [],
            "subtotal": 0,
            "tax_total": 0,
            "grand_total": 0
        }
        
        for item in items:
            line_total = float(item.sell_price) * item.outwarded_quantity
            invoice_data["items"].append({
                "product": item.so_item_id.product_id.name if item.so_item_id.product_id else 'Item',
                "qty": item.outwarded_quantity,
                "price": float(item.sell_price),
                "total": line_total
            })
            invoice_data["subtotal"] += line_total
            
        invoice_data["grand_total"] = invoice_data["subtotal"]
        
        return renderResponse(data=invoice_data, message='Invoice Data', status=200)

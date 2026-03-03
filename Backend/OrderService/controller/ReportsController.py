from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Sum, Count, F
from django.db.models.functions import TruncMonth, TruncDate
from OrderService.models import SalesOrder, PurchaseOrder, SalesOrderOrderItems, PurchaseOrderItems
from InventoryServices.models import Inventory
from EcommerceInventory.Helpers import renderResponse

class SalesReportAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        domain_user_id = request.user.domain_user_id.id
        group_by = request.GET.get('group_by', 'month') # 'month' or 'date'

        trunc_func = TruncMonth if group_by == 'month' else TruncDate

        sales_data = SalesOrderOrderItems.objects.all().annotate(
            period=trunc_func('created_at')
        ).values('period').annotate(
            total_sales=Sum('amount_ordered'),
            total_qty=Sum('quantity_ordered'),
            order_count=Count('sales_order_id', distinct=True)
        ).order_by('period')

        formatted_data = []
        for s in sales_data:
            period_str = s['period'].strftime('%Y-%m') if group_by == 'month' else s['period'].strftime('%Y-%m-%d')
            formatted_data.append({
                'period': period_str,
                'total_sales': s['total_sales'] or 0,
                'total_qty': s['total_qty'] or 0,
                'order_count': s['order_count'] or 0
            })

        return renderResponse(data=formatted_data, message="Sales Report", status=200)

class PurchaseReportAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        domain_user_id = request.user.domain_user_id.id
        group_by = request.GET.get('group_by', 'month') # 'month' or 'date'

        trunc_func = TruncMonth if group_by == 'month' else TruncDate

        purchase_data = PurchaseOrderItems.objects.all().annotate(
            period=trunc_func('created_at')
        ).values('period').annotate(
            total_purchases=Sum('amount_ordered'),
            total_qty=Sum('quantity_ordered'),
            order_count=Count('purchase_order_id', distinct=True)
        ).order_by('period')

        formatted_data = []
        for p in purchase_data:
            period_str = p['period'].strftime('%Y-%m') if group_by == 'month' else p['period'].strftime('%Y-%m-%d')
            formatted_data.append({
                'period': period_str,
                'total_purchases': p['total_purchases'] or 0,
                'total_qty': p['total_qty'] or 0,
                'order_count': p['order_count'] or 0
            })

        return renderResponse(data=formatted_data, message="Purchase Report", status=200)

class InventoryReportAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        domain_user_id = request.user.domain_user_id.id
        
        inventory_data = Inventory.objects.all().select_related('product_id').values(
            'product_id__name', 'product_id__sku', 'product_id__initial_buying_price', 'product_id__initial_selling_price'
        ).annotate(
            total_qty=Sum('quantity')
        )

        formatted_data = []
        total_valuation = 0

        for item in inventory_data:
            buying_price = item['product_id__initial_buying_price'] or 0
            selling_price = item['product_id__initial_selling_price'] or 0
            qty = item['total_qty'] or 0
            valuation = qty * buying_price
            total_valuation += valuation

            formatted_data.append({
                'product_name': item['product_id__name'],
                'sku': item['product_id__sku'],
                'quantity': qty,
                'buying_price': buying_price,
                'selling_price': selling_price,
                'valuation': valuation
            })

        return renderResponse(data={
            'items': formatted_data,
            'total_valuation': total_valuation
        }, message="Inventory Report", status=200)


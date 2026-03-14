from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from UserServices.models import Users
from ProductServices.models import Products, Categories
from InventoryServices.models import Warehouse, Inventory
from OrderService.models import PurchaseOrder, SalesOrder
from django.db.models import Sum, F

class DashboardAnalyticsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # We assume the user is an admin for a domain, or we fetch based on domain_user_id
        domain_user_id = request.user.domain_user_id if request.user.domain_user_id else request.user
        
        # Totals
        total_products = Products.objects.all().count()
        total_categories = Categories.objects.all().count()
        total_warehouses = Warehouse.objects.all().count()
        total_suppliers = Users.objects.filter(role='Supplier', ).count()
        total_customers = Users.objects.filter(role='Customer', ).count()
        total_purchase_orders = PurchaseOrder.objects.all().count()
        total_sales_orders = SalesOrder.objects.all().count()
        
        # Inventory Value & Total Inventory Qty
        inventory_stats = Inventory.objects.all().aggregate(
            total_qty=Sum('quantity'),
        )
        total_inventory = inventory_stats['total_qty'] or 0
        
        # Calculate Revenue (from Sales Order Items)
        from OrderService.models import SalesOrderOrderItems
        sales_stats = SalesOrderOrderItems.objects.all().aggregate(
            total_revenue=Sum('amount_ordered')
        )
        total_revenue = sales_stats['total_revenue'] or 0

        # Low Stock Products
        low_stock_products = Inventory.objects.filter(
            
            quantity__lt=10,
            quantity__gt=0
        ).count()

        out_of_stock_products = Inventory.objects.filter(
            
            quantity=0
        ).count()
        
        # Recent Purchase Orders (last 5)
        recent_pos = PurchaseOrder.objects.all().order_by('-created_at')[:5].values(
            'id', 'supplier_id__username', 'status', 'created_at', 'po_code'
        )

        from django.db.models.functions import TruncMonth
        from django.db.models import Count

        # Monthly Sales
        monthly_sales = SalesOrderOrderItems.objects.all().annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(total=Sum('amount_ordered')).order_by('month')
        
        # Monthly Purchases
        # Monthly Purchases
        from OrderService.models import PurchaseOrderItems
        monthly_purchases = PurchaseOrderItems.objects.all().annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(total=Sum('amount_ordered')).order_by('month')

        # Format chart data
        chart_data = {}
        for s in monthly_sales:
            m = s['month'].strftime('%b %Y')
            chart_data[m] = {'name': m, 'sales': s['total'] or 0, 'purchases': 0}
        
        for p in monthly_purchases:
            m = p['month'].strftime('%b %Y')
            if m not in chart_data:
                chart_data[m] = {'name': m, 'sales': 0, 'purchases': 0}
            chart_data[m]['purchases'] = p['total'] or 0

        formatted_chart_data = list(chart_data.values())

        return Response({
            'total_products': total_products,
            'total_categories': total_categories,
            'total_warehouses': total_warehouses,
            'total_inventory': total_inventory,
            'total_suppliers': total_suppliers,
            'total_customers': total_customers,
            'total_purchase_orders': total_purchase_orders,
            'total_sales_orders': total_sales_orders,
            'total_revenue': total_revenue,
            'low_stock_products': low_stock_products,
            'out_of_stock_products': out_of_stock_products,
            'recent_purchase_orders': list(recent_pos),
            'monthly_chart_data': formatted_chart_data
        })

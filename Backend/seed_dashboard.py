import os
import django
import random
from datetime import timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EcommerceInventory.settings')
django.setup()

from UserServices.models import Users
from ProductServices.models import Products, Categories
from InventoryServices.models import Warehouse, Inventory
from OrderService.models import PurchaseOrder, PurchaseOrderItems, SalesOrder, SalesOrderOrderItems

def seed_data():
    admins = Users.objects.filter(role='Admin')
    if not admins.exists():
        print("No Admin user found. Skipping seed.")
        return
    
    for admin in admins:
        domain_user = admin

        print(f"Seeding data for domain user: {domain_user.username}...")

        # Seed Suppliers
        for i in range(3):
            supplier, _ = Users.objects.get_or_create(
                username=f'supplier_{i}_{domain_user.id}',
                defaults={'email': f'supplier{i}_{domain_user.id}@test.com', 'role': 'Supplier', 'domain_user_id': domain_user}
            )

        # Seed Customers
        for i in range(5):
            customer, _ = Users.objects.get_or_create(
                username=f'customer_{i}_{domain_user.id}',
                defaults={'email': f'customer{i}_{domain_user.id}@test.com', 'role': 'Customer', 'domain_user_id': domain_user}
            )
        
        # Seed Categories
        cat1, _ = Categories.objects.get_or_create(name='Electronics', domain_user_id=domain_user)
        cat2, _ = Categories.objects.get_or_create(name='Furniture', domain_user_id=domain_user)

        product_defaults = {
            'image': [], 'description': 'desc', 'specifications': {}, 'html_description': 'desc',
            'highlights': [], 'sku': 'SKU-001', 'initial_buying_price': 100, 'initial_selling_price': 150,
            'weight': 1.0, 'dimensions': '10x10x10', 'uom': 'pcs', 'color': 'black', 'tax_percentage': 18,
            'brand': 'Generic', 'brand_model': 'Model1', 'status': 'ACTIVE', 'seo_title': 'title',
            'seo_description': 'desc', 'seo_keywords': [], 'addition_details': {}
        }

        # Seed Products
        prod1, _ = Products.objects.get_or_create(name='Laptop', domain_user_id=domain_user, defaults={'category_id': cat1, **product_defaults, 'sku': f'SKU-LAP-{domain_user.id}'})
        prod2, _ = Products.objects.get_or_create(name='Smartphone', domain_user_id=domain_user, defaults={'category_id': cat1, **product_defaults, 'sku': f'SKU-PHO-{domain_user.id}'})
        prod3, _ = Products.objects.get_or_create(name='Office Chair', domain_user_id=domain_user, defaults={'category_id': cat2, **product_defaults, 'sku': f'SKU-CHA-{domain_user.id}'})

        # Seed Warehouse
        wh1, _ = Warehouse.objects.get_or_create(
            name='Main Warehouse',
            domain_user_id=domain_user,
            defaults={
                'address': '123 Tech Park', 'city': 'Bangalore', 'state': 'KA', 
                'country': 'India', 'pincode': '560001',
                'phone': '1234567890', 'email': f'wh_{domain_user.id}@test.com', 'additional_details': {}
            }
        )

        # Seed Inventory
        Inventory.objects.get_or_create(
            product_id=prod1, warehouse_id=wh1, domain_user_id=domain_user,
            defaults={'quantity': 50, 'quantity_inwarded': 50, 'buy_price': 800, 'sell_price': 1000, 'tax_percentage': 18, 'additional_details': {}, 'discount_amout': 0}
        )
        Inventory.objects.get_or_create(
            product_id=prod2, warehouse_id=wh1, domain_user_id=domain_user,
            defaults={'quantity': 5, 'quantity_inwarded': 20, 'buy_price': 400, 'sell_price': 600, 'tax_percentage': 18, 'additional_details': {}, 'discount_amout': 0}
        )
        Inventory.objects.get_or_create(
            product_id=prod3, warehouse_id=wh1, domain_user_id=domain_user,
            defaults={'quantity': 0, 'quantity_inwarded': 10, 'buy_price': 100, 'sell_price': 150, 'tax_percentage': 12, 'additional_details': {}, 'discount_amout': 0}
        )

        # Seed Purchase Orders
        supplier = Users.objects.filter(role='Supplier', domain_user_id=domain_user).first()
        for i in range(1, 4):
            date = timezone.now() - timedelta(days=i*10)
            po, created = PurchaseOrder.objects.get_or_create(
                po_code=f'PO-2026-{domain_user.id}-{i}',
                defaults={
                    'warehouse_id': wh1, 'supplier_id': supplier, 'po_date': date, 
                    'expected_delivery_date': date + timedelta(days=5),
                    'status': 'RECEIVED', 'domain_user_id': domain_user, 'additional_details': {},
                    'discount_amount': 0
                }
            )
            if created:
                po.created_at = date # Hack for aggregation
                po.save()
                PurchaseOrderItems.objects.create(
                    po_id=po, product_id=prod1, quantity_ordered=10, 
                    amount_ordered=8000, domain_user_id=domain_user, additional_details={},
                    discount_amount=0, amount_paid=8000, amount_returned=0, amount_cancelled=0,
                    tax_percentage=18, tax_amount=1440
                )

        # Seed Sales Orders
        customer = Users.objects.filter(role='Customer', domain_user_id=domain_user).first()
        for i in range(1, 6):
            date = timezone.now() - timedelta(days=i*5)
            so, created = SalesOrder.objects.get_or_create(
                so_code=f'SO-2026-{domain_user.id}-{i}',
                defaults={
                    'customer_id': customer, 'so_date': date, 
                    'expected_delivery_date': date + timedelta(days=3),
                    'status': 'COMPLETED', 'domain_user_id': domain_user, 'additional_details': {},
                    'discount_amount': 0, 'shipping_amount': 0, 'shipping_tax_percentage': 0,
                    'shipping_cancelled_amount': 0, 'shipping_cancelled_tax_amount': 0,
                    'approved_at': date, 'cancelled_at': date, 'cancelled_reason': ''
                }
            )
            if created:
                so.created_at = date
                so.save()
                # To fix TruncMonth grouping, we need to create SalesOrderOrderItems
                from OrderService.models import SalesOrderOrderItems
                SalesOrderOrderItems.objects.create(
                    so_id=so, product_id=prod1, quantity_ordered=2, 
                    quantity_delivered=2, quantity_shipped=2, quantity_cancelled=0, quantity_returned=0,
                    purchase_price=800, tax_percentage=18, discount_amount=0, amount_paid=2000,
                    amount_returned=0, amount_cancelled=0, amount_ordered=2000, tax_amount=360,
                    domain_user_id=domain_user, additional_details={}
                )

    print("Seed complete! Data populated for dashboard charts and metrics.")

if __name__ == '__main__':
    seed_data()

import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EcommerceInventory.settings')
django.setup()

from UserServices.models import Users, UserPermissions, Modules
from ProductServices.models import Categories, Products
from InventoryServices.models import Warehouse
from OrderService.models import PurchaseOrder, PurchaseOrderItems

def run_seed():
    # 1. Create Users
    supplier, _ = Users.objects.get_or_create(username='supplier1', email='supplier@example.com', defaults={'role': 'Supplier'})
    if not supplier.password.startswith('pbkdf2_'):
        supplier.set_password('password123')
        supplier.save()

    customer, _ = Users.objects.get_or_create(username='customer1', email='customer@example.com', defaults={'role': 'Customer'})
    if not customer.password.startswith('pbkdf2_'):
        customer.set_password('password123')
        customer.save()
        
    admin = Users.objects.filter(is_superuser=True).first()

    # Create permissions for all Admin users
    admin_users = Users.objects.filter(role='Admin')
    all_modules = Modules.objects.all()
    for user in admin_users:
        for module in all_modules:
            UserPermissions.objects.get_or_create(user=user, module=module, defaults={'is_permission': True})

    # 2. Create Categories
    cat_electronics, _ = Categories.objects.get_or_create(name='Electronics', defaults={'description': 'Electronic gadgets', 'image': [], 'domain_user_id': admin})
    cat_clothing, _ = Categories.objects.get_or_create(name='Clothing', defaults={'description': 'Apparel and accessories', 'image': [], 'domain_user_id': admin})
    cat_home, _ = Categories.objects.get_or_create(name='Home Appliances', defaults={'description': 'Appliances for home', 'image': [], 'domain_user_id': admin})

    # 3. Create Products
    p1, _ = Products.objects.get_or_create(sku='SKU-ELEC-001', defaults={
        'name': 'Smartphone X', 'description': 'Latest smartphone', 'html_description': '<p>Latest smartphone</p>',
        'initial_buying_price': 500.0, 'initial_selling_price': 799.0, 'weight': 0.2, 'dimensions': '15x7x1',
        'uom': 'PCS', 'color': 'Black', 'tax_percentage': 18.0, 'brand': 'TechCorp', 'brand_model': 'X-1',
        'category_id': cat_electronics, 'domain_user_id': admin,
        'image': ['https://via.placeholder.com/150'], 'specifications': {}, 'highlights': {}, 'addition_details': {}, 'seo_keywords': {}
    })
    
    p2, _ = Products.objects.get_or_create(sku='SKU-ELEC-002', defaults={
        'name': 'Laptop Pro', 'description': 'High performance laptop', 'html_description': '<p>High performance laptop</p>',
        'initial_buying_price': 1000.0, 'initial_selling_price': 1499.0, 'weight': 1.5, 'dimensions': '30x20x2',
        'uom': 'PCS', 'color': 'Silver', 'tax_percentage': 18.0, 'brand': 'TechCorp', 'brand_model': 'Pro-2023',
        'category_id': cat_electronics, 'domain_user_id': admin,
        'image': ['https://via.placeholder.com/150'], 'specifications': {}, 'highlights': {}, 'addition_details': {}, 'seo_keywords': {}
    })

    p3, _ = Products.objects.get_or_create(sku='SKU-CLOT-001', defaults={
        'name': 'Cotton T-Shirt', 'description': '100% Cotton T-Shirt', 'html_description': '<p>100% Cotton</p>',
        'initial_buying_price': 5.0, 'initial_selling_price': 15.0, 'weight': 0.1, 'dimensions': '0x0x0',
        'uom': 'PCS', 'color': 'White', 'tax_percentage': 5.0, 'brand': 'ApparelCo', 'brand_model': 'Basic',
        'category_id': cat_clothing, 'domain_user_id': admin,
        'image': ['https://via.placeholder.com/150'], 'specifications': {}, 'highlights': {}, 'addition_details': {}, 'seo_keywords': {}
    })

    # 4. Create Warehouses
    wh1, _ = Warehouse.objects.get_or_create(name='Central Warehouse', defaults={
        'address': '123 Main St', 'city': 'New York', 'state': 'NY', 'country': 'USA', 'pincode': '10001',
        'phone': '1234567890', 'email': 'central@example.com', 'warehouse_manager': admin,
        'size': 'LARGE', 'capacity': 'HIGH', 'warehouse_type': 'OWNED', 'additional_details': {}, 'domain_user_id': admin
    })
    
    wh2, _ = Warehouse.objects.get_or_create(name='Regional Hub West', defaults={
        'address': '456 West Ave', 'city': 'Los Angeles', 'state': 'CA', 'country': 'USA', 'pincode': '90001',
        'phone': '0987654321', 'email': 'west@example.com', 'warehouse_manager': admin,
        'size': 'MEDIUM', 'capacity': 'MEDIUM', 'warehouse_type': 'LEASED', 'additional_details': {}, 'domain_user_id': admin
    })

    # 5. Create Purchase Order
    po, created = PurchaseOrder.objects.get_or_create(po_code='PO-2023-001', defaults={
        'supplier_id': supplier, 'warehouse_id': wh1, 'discount_amount': 0.0,
        'additional_details': {}, 'domain_user_id': admin,
        'created_by_user_id': admin, 'status': 'DRAFT', 'po_date': '2023-10-01', 'expected_delivery_date': '2023-10-10',
        'cancelled_reason': ''
    })

    if created:
        PurchaseOrderItems.objects.create(
            po_id=po, product_id=p1, quantity_ordered=100, quantity_received=0,
            quantity_cancelled=0, quantity_returned=0, buying_price=500.0, selling_price=799.0, tax_percentage=18.0,
            discount_amount=0.0, amount_paid=0.0, amount_returned=0.0, amount_cancelled=0.0,
            amount_ordered=50000.0, tax_amount=9000.0, additional_details={}, domain_user_id=admin
        )

    print("Seed executed successfully!")

if __name__ == '__main__':
    run_seed()

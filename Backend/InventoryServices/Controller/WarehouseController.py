from EcommerceInventory.Helpers import CommonListAPIMixin, CustomPageNumberPagination, createParsedCreatedAtUpdatedAt
from InventoryServices.models import RackAndShelvesAndFloor, Warehouse
from rest_framework import serializers
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

@createParsedCreatedAtUpdatedAt
class RackShelfFloorSerializer(serializers.ModelSerializer):
    added_by_user_id=serializers.SerializerMethodField()
    domain_user_id=serializers.SerializerMethodField()
    warehouse_id=serializers.SerializerMethodField()

    class Meta:
        model = RackAndShelvesAndFloor
        fields = '__all__'

    def get_added_by_user_id(self,obj):
        return "#"+str(obj.added_by_user_id.id)+" "+obj.added_by_user_id.username
    
    def get_domain_user_id(self,obj):
        return "#"+str(obj.domain_user_id.id)+" "+obj.domain_user_id.username
    
    def get_warehouse_id(self,obj):
        return "#"+str(obj.warehouse_id.id)+" "+obj.warehouse_id.name

@createParsedCreatedAtUpdatedAt
class WarehouseSerializer(serializers.ModelSerializer):
    added_by_user_id=serializers.SerializerMethodField()
    domain_user_id=serializers.SerializerMethodField()
    warehouse_manager=serializers.SerializerMethodField()
    rack_shelf_floor=serializers.SerializerMethodField()

    class Meta:
        model = Warehouse
        fields = '__all__'

    def get_added_by_user_id(self,obj):
        return "#"+str(obj.added_by_user_id.id)+" "+obj.added_by_user_id.username
    
    def get_domain_user_id(self,obj):
        return "#"+str(obj.domain_user_id.id)+" "+obj.domain_user_id.username
    
    def get_warehouse_manager(self,obj):
        if obj.warehouse_manager:
            return "#"+str(obj.warehouse_manager.id)+" "+obj.warehouse_manager.username
        return ""
    
    def get_rack_shelf_floor(self,obj):
        queryset=RackAndShelvesAndFloor.objects.filter(warehouse_id=obj.id)
        return RackShelfFloorSerializer(queryset,many=True).data


class WarehouseListView(generics.ListAPIView):
    serializer_class = WarehouseSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        queryset=Warehouse.objects.all()
        return queryset
    
    @CommonListAPIMixin.common_list_decorator(WarehouseSerializer)
    def list(self,request,*args,**kwargs):
        return super().list(request,*args,**kwargs)


class UpdateWarehouseView(generics.UpdateAPIView):
    serializer_class = WarehouseSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Warehouse.objects.filter(id=self.kwargs['pk'])

    def perform_update(self,serializer):
        serializer.save()


class WarehouseDeleteView(generics.DestroyAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Warehouse.objects.all()

    def destroy(self, request, *args, **kwargs):
        from EcommerceInventory.Helpers import renderResponse
        from InventoryServices.models import Inventory
        instance = self.get_object()
        if instance.domain_user_id != request.user.domain_user_id:
            return renderResponse(data='Permission denied', message='Error', status=403)
        if Inventory.objects.filter(warehouse_id=instance).exists():
            return renderResponse(data='Cannot delete warehouse with existing inventory', message='Cannot delete warehouse', status=400)
        if RackAndShelvesAndFloor.objects.filter(warehouse_id=instance).exists():
            return renderResponse(data='Cannot delete warehouse with existing racks/shelves. Remove them first.', message='Cannot delete warehouse', status=400)
        self.perform_destroy(instance)
        return renderResponse(data={}, message='Warehouse deleted successfully', status=200)


class RackShelfFloorDeleteView(generics.DestroyAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RackAndShelvesAndFloor.objects.all()

    def destroy(self, request, *args, **kwargs):
        from EcommerceInventory.Helpers import renderResponse
        from InventoryServices.models import Inventory
        instance = self.get_object()
        if instance.domain_user_id != request.user.domain_user_id:
            return renderResponse(data='Permission denied', message='Error', status=403)
        if Inventory.objects.filter(rack_shelf_floor_id=instance).exists():
            return renderResponse(data='Cannot delete rack/shelf with existing inventory', message='Cannot delete', status=400)
        self.perform_destroy(instance)
        return renderResponse(data={}, message='Rack/Shelf/Floor deleted successfully', status=200)

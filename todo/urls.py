from . import views
from django.urls import path

urlpatterns = [
    path('', views.Overview.as_view(), name='home'),
    path('lists/<int:list_id>/', views.SingleListView.as_view(), name='list_view'),
    path('lists/create/', views.ListCreateView.as_view(), name='list_create'),
    path('lists/<int:list_id>/update/', views.ListUpdateView.as_view(), name='list_update'),
    path('lists/<int:list_id>/delete/', views.ListDeleteView.as_view(), name='list_delete'),
    path('items/edit/<int:item_id>/', views.ItemUpdateView.as_view(), name='edit_item'),
    path('items/delete/<int:item_id>/', views.ItemDeleteView.as_view(), name='delete_item'),
]

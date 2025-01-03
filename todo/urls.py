from . import views
from django.urls import path

urlpatterns = [
    path('', views.Overview.as_view(), name='home'),
    path('lists/<int:list_id>/', views.SingleListView.as_view(), name='list_view'),
]

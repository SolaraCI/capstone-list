from django import forms
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.views import generic
from .models import List, Item


class Overview(generic.ListView):
    queryset = List.objects.all()
    template_name = "todo/index.html"
    
    
class SingleListView(generic.ListView):
    template_name = '/workspace/capstone-list/todo/templates/todo/view_list.html'
    
    def get_queryset(self):
        self.parent_list = get_object_or_404(List, id=self.kwargs.get('list_id'))
        return Item.objects.filter(parent_list=self.parent_list)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['parent_list'] = self.parent_list
        return context
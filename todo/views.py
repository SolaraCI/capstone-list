from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db import transaction
from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse_lazy
from django.views import generic
from django.views.generic.edit import CreateView, DeleteView, UpdateView
from .forms import ListForm, ItemForm, ItemFormSet
from .models import List, Item


# Displays all lists belonging to the authenticated user
class Overview(generic.ListView):
    queryset = List.objects.all()
    template_name = "todo/index.html"
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return List.objects.filter(creator=self.request.user)
        else:
            return 


class SingleListView(generic.ListView):
    template_name = "/workspace/capstone-list/todo/templates/todo/view_list.html"

    def get_queryset(self):
        self.parent_list = get_object_or_404(List, id=self.kwargs.get("list_id"))
        return Item.objects.filter(parent_list=self.parent_list)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["parent_list"] = self.parent_list
        return context


# Views involved in doing stuff with a list

# class ListFormView(generic.edit.FormView):
#     template_name = "todo/create_list.html"
#     form_class = ListForm
#     success_url = '/'

#     def form_valid(self, form):
#         form.create_list(self.request.user)
#         return super().form_valid(form)


class ListCreateView(CreateView):
    template_name = "todo/create_list.html"
    model = List
    form_class = ListForm
    success_url = "/"

    def form_valid(self, form):
        form.instance.creator = self.request.user
        return super().form_valid(form)


class ListUpdateView(UpdateView):
    model = List
    fields = ["title", "description"]


class ListDeleteView(DeleteView):
    model = List
    success_url = reverse_lazy("home")


# Views involved in doing stuff with items

class ItemCreateView(CreateView):
    model = Item
    template_name = '/workspace/capstone-list/todo/templates/todo/create_item.html'
    form_class = ItemForm
    success_url = None
    
    def get_context_data(self, **kwargs):
        data = super(ItemCreateView, self).get_context_data(**kwargs)
        if self.request.POST:
            data['item_names'] = ItemFormSet(self.request.POST)
        else:
            data["item_names"] = ItemFormSet()
        return data
    
    
    def form_valid(self, form):
        context = self.get_context_data()
        item_names = context['item_names']
        with transaction.atomic():
            self.object = form.save()
            if item_names.is_valid():
                item_names.instance = self.object
                item_names.save()
        return super(ItemCreateView, self).form_valid(form)
        
    
    def get_success_url(self):
        return reverse_lazy('list_view', kwargs={'parent_list': self.object.parent_list})
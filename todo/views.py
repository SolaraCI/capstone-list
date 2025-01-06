from django import forms
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse_lazy
from django.views import generic
from django.views.generic.edit import CreateView, DeleteView, UpdateView
from .forms import ListForm
from .models import List, Item


# Displays all lists belonging to the authenticated user
class Overview(generic.ListView):
    template_name = "todo/index.html"
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return List.objects.filter(creator=self.user.username)
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

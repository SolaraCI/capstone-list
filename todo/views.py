from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db import transaction
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import get_object_or_404
from django.urls import reverse_lazy
from django.views import generic, View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic.edit import CreateView, DeleteView, UpdateView
from .forms import ListForm, ItemForm, ItemFormSet
from .models import List, Item
import json


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
        context["item_form"] = ItemForm()
        context["item_id"] = get_object_or_404(Item, id=self.kwargs.get("item_id")) if self.kwargs.get("item_id") else None
        return context
    
    def post(self, request, *args, **kwargs):
        self.parent_list = get_object_or_404(List, id=self.kwargs.get("list_id"))
        form = ItemForm(request.POST)
        if form.is_valid():
            item = form.save(commit=False)
            item.parent_list = self.parent_list
            item.save()
        return HttpResponseRedirect(reverse_lazy("list_view", kwargs={"list_id": self.parent_list.id}))
    
class ItemUpdateView(View):
    @method_decorator(csrf_exempt)
    def post(self, request, item_id):
        try:
            item = get_object_or_404(Item, id=item_id)
            data = json.loads(request.body)
            item.item_name = data.get('item_name', item.item_name)
            item.save()
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})


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
            data['item_name'] = ItemFormSet(self.request.POST)
        else:
            data["item_name"] = ItemFormSet()
        return data
    
    
    def form_valid(self, form):
        context = self.get_context_data()
        item_name = context['item_name']
        with transaction.atomic():
            self.object = form.save()
            if item_name.is_valid():
                item_name.instance = self.object
                item_name.save()
        return super(ItemCreateView, self).form_valid(form)
        
    
    def get_success_url(self):
        return reverse_lazy('list_view', kwargs={'parent_list': self.object.parent_list})
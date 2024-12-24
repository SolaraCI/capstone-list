from django import forms
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import TemplateView, ListView, FormView
from .models import List, Item
from .forms import ListForm, ItemForm



# Create your views here.

class OverView(ListView):
    model = List
    template_name = '/workspace/capstone/todo/templates/todo/home.html'



class SingleListView(ListView):
    model = Item
    template_name = '/workspace/capstone/todo/templates/todo/view_list.html'


    def view_list(request, list_id):
        global current_list_id
        global todo_list
        global item_sig_list
        global item_names
        global item_ids
        current_list_id = list_id
        todo_list = get_object_or_404(List, id=current_list_id)
        item_sig_list = todo_list.items.values_list('name', 'id', named=True)
        item_name_list = todo_list.items.values_list('name', flat=True)
        item_id_list = todo_list.items.values_list('id', flat=True)

        
        print("-----------------------")
        print(f"current_list_id: { current_list_id }")
        print(f"todo_list: { todo_list }")
        print(f"parent list: { todo_list.items.values_list('parent_list', flat=True) }")
        print(f"item_sig_list: { item_sig_list }")
        print(f"request: {request}")
        print("-----------------------")

        # if request.method == 'POST':
        #     task = request.POST.get('task')
        #     if task.strip():
        #         new_item = Item(name=task, parent_list=todo_list)
        #         new_item.save()

        context = {
            'current_list_id' : current_list_id,
            'list': todo_list,
            'item_sig_list': todo_list.items.values_list('name', 'id', named=True),
            'item_names': todo_list.items.values_list('name', flat=True),
        }

        return render(request, 'todo/view_list.html', context)   


    def add_item(request, current_list_id):
        print("!!!add_item called!!!")
        new_item = Item(name="new", parent_list=todo_list)
        new_item.save()
        return redirect('view_list', list_id=current_list_id)
    

    def delete_item(request, current_list_id, name, id):
        print(f"Delete item called with list_id: {current_list_id}, name: {name}")
        item_to_delete = get_object_or_404(Item, name=name, parent_list_id=current_list_id, id=id)
        print(f"item_to_delete.id: {item_to_delete.id}")
        item_to_delete.delete()
        print(f"Deleted item: {name} from list {current_list_id}")
        return redirect('view_list', list_id=current_list_id)


    def edit_item(request, current_list_id, name, id):
        print(f"Edit item called with list_id: {current_list_id}, name: {name}")
        item_to_edit = get_object_or_404(Item, name=name, parent_list_id=current_list_id, id=id)
        print(f"item_to_edit.id: {item_to_edit.id}")
        # item_to_edit.
        print(f"Edited item: {name} from list {current_list_id}")
        return redirect('view_list', list_id=current_list_id)

    

class CreateListFormView(FormView):
    template_name = 'todo/create_list.html'
    form_class = ListForm

    def create_list(request):
        if request.method == "POST":
            form = ListForm(request.POST)
            if form.is_valid():
                form.save()
                messages.success(request, "List created successfully.")
                return redirect('home')
            else:
                messages.error(request, "ERROR: Could not create list.") 
                return redirect('home')
        else:
            form = ListForm()
            context = {
                "form": form,
            }
            return render(request, 'todo/create_list.html', context)


class RegisterFormView(FormView):
    def register(request):
        if request.method == 'POST':
            username = request.POST.get('username')
            email = request.POST.get('email')
            password = request.POST.get('password')

            if len(password) < 4:
                messages.error(request, 'Password must be at least 4 characters')
                return redirect('register')
            
            get_all_user_names = User.objects.filter(username=username)
            if get_all_user_names:
                messages.error(request, 'Username must be unique. Please choose another.')
                return redirect('register')
            
            get_all_user_emails = User.objects.filter(email=email)
            if get_all_user_emails:
                messages.error(request, 'Email address already in use. Please use another.')
                return redirect('register')

            new_user = User.objects.create_user(username=username, email=email, password=password)
            new_user.save()
            messages.success(request, 'User created successfully. Please login now.')
            return redirect('login')
        return render(request,'todo/register.html', {})


class LoginFormView(FormView):
    def login_page(request):
        if request.method == 'POST':
            username = request.POST.get('username')
            password = request.POST.get('password')

            validate_user = authenticate(username=username, password=password)
            if validate_user:
                login(request, validate_user)
                return redirect('home')
            else:
                messages.error(request, 'Invalid username or password.')

        return render(request, 'todo/login.html', {})


# def all_lists(request):
#     """Retrieves all existing lists to display on home page"""
#     all_lists = List.objects.filter(creator=request.user)

#     context = {
#         'lists': all_lists,
#     }

#     return render(request, 'todo/home.html', context)


# def create_list(request):
#     if request.method == "POST":
#         form = ListForm(request.POST)
#         if form.is_valid():
#             form.save()
#             messages.success(request, "List created successfully.")
#             return redirect('home')
#         else:
#             messages.error(request, "ERROR: Could not create list.") 
#             return redirect('home')
#     else:
#         form = ListForm()
#         context = {
#             "form": form,
#         }
#         return render(request, 'todo/create_list.html', context)


 


# def delete_item(request, name):
#     item_to_delete = Item.objects.get(name=name)
#     print(item_to_delete)
#     item_to_delete.delete()
#     return redirect()    


# def register(request):
#     if request.method == 'POST':
#         username = request.POST.get('username')
#         email = request.POST.get('email')
#         password = request.POST.get('password')

#         if len(password) < 4:
#             messages.error(request, 'Password must be at least 4 characters')
#             return redirect('register')
        
#         get_all_user_names = User.objects.filter(username=username)
#         if get_all_user_names:
#             messages.error(request, 'Username must be unique. Please choose another.')
#             return redirect('register')
        
#         get_all_user_emails = User.objects.filter(email=email)
#         if get_all_user_emails:
#             messages.error(request, 'Email address already in use. Please use another.')
#             return redirect('register')

#         new_user = User.objects.create_user(username=username, email=email, password=password)
#         new_user.save()
#         messages.success(request, 'User created successfully. Please login now.')
#         return redirect('login')
#     return render(request,'todo/register.html', {})


# def login_page(request):
#     if request.method == 'POST':
#         username = request.POST.get('username')
#         password = request.POST.get('password')

#         validate_user = authenticate(username=username, password=password)
#         if validate_user:
#             login(request, validate_user)
#             return redirect('home')
#         else:
#             messages.error(request, 'Invalid username or password.')

#     return render(request, 'todo/login.html', {})


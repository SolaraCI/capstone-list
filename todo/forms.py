from django import forms
from .models import List, Item
from django.db import models
from django.contrib.auth.models import User

class ListForm(forms.ModelForm):    
    
    class Meta:
        model = List
        fields = ['title', 'description']
        initial = {
            'creator': models.ForeignKey(User, on_delete=models.CASCADE)
        }
        widgets = {
            'creator': forms.HiddenInput()
        }


# class ItemForm(forms.ModelForm):
#     class Meta:
#         model = Item
#         fields = ['name', 'parent_list', 'complete', 'has_sub_items']
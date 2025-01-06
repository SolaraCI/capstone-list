from django import forms
from django.db import models
from django.contrib.auth.models import User
from django.forms.models import inlineformset_factory
from .models import List, Item


class ListForm(forms.ModelForm):
    class Meta:
        model = List
        fields = ["title", "description"]
        initial = {"creator": models.ForeignKey(User, on_delete=models.CASCADE)}
        widgets = {"creator": forms.HiddenInput()}


class ItemForm(forms.ModelForm):
    class Meta:
        model = Item
        fields = ['item_name']
        
ItemFormSet = inlineformset_factory(
    List,
    Item, 
    form=ItemForm, 
    fields=['item_name'], 
    extra=1, 
    can_delete=True)

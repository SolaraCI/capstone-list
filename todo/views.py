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
    template_name = "todo/home.html"
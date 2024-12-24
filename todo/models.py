from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class List(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField()
    creator = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="lists"
    )
    ordered = models.BooleanField(default=False)


    def __str__(self):
        return self.name


class Item(models.Model):
    name = models.CharField(max_length=500, default='new')
    parent_list = models.ForeignKey(
        List, on_delete=models.CASCADE, related_name="items"
    )
    complete = models.BooleanField(default=False)
    has_sub_items = models.BooleanField(default=False)
    

    def __str__(self):
        return self.name
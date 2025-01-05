from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse

STATUS = ((0, "Not Started"), (1, "In Progress"), (2, "Complete"))

# Create your models here.


class List(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField()
    creator = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="owned_lists"
    )

    def get_absolute_url(self):
        return reverse("list_view", kwargs={"list_id": self.pk})

    def __str__(self):
        return self.title


class Item(models.Model):
    item_name = models.CharField(max_length=500, default="new")
    parent_list = models.ForeignKey(
        List, on_delete=models.CASCADE, related_name="items"
    )
    status = models.IntegerField(choices=STATUS, default=0)
    created_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_on"]

    def __str__(self):
        return self.item_name

# Generated by Django 5.1.4 on 2025-01-11 00:31

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='List',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=150)),
                ('description', models.TextField()),
                ('creator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='owned_lists', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Item',
            fields=[
                ('item_id', models.AutoField(primary_key=True, serialize=False)),
                ('item_name', models.CharField(blank=True, max_length=500)),
                ('status', models.IntegerField(choices=[(0, 'Not Started'), (1, 'In Progress'), (2, 'Complete')], default=0)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('parent_list', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='todo.list')),
            ],
            options={
                'ordering': ['-created_on'],
            },
        ),
    ]

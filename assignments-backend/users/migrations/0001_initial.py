# Generated by Django 5.1.6 on 2025-02-07 20:14

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('password', models.CharField(max_length=255)),
                ('college_name', models.CharField(max_length=255)),
                ('mobile_number', models.CharField(max_length=10)),
            ],
        ),
    ]

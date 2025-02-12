from django.db import models
from django.utils import timezone


class User(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    college_name = models.CharField(max_length=255)
    mobile_number = models.CharField(max_length=10)
    last_login = models.DateTimeField(null=True, blank=True)

    def update_last_login(self):
        self.last_login = timezone.now()
        self.save(update_fields=['last_login'])

    def __str__(self):
        return self.email

class Assignment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assignments')
    subject = models.CharField(max_length=255)
    num_pages = models.IntegerField()
    college_or_school = models.CharField(max_length=255)
    locations = models.JSONField()
    min_bid = models.DecimalField(max_digits=10, decimal_places=2)
    max_bid = models.DecimalField(max_digits=10, decimal_places=2)
    resource_file = models.FileField(upload_to='resources/')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.subject
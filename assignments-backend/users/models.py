from django.db import models

# Create your models here.
from django.db import models

class User(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    college_name = models.CharField(max_length=255)
    mobile_number = models.CharField(max_length=10)

    def __str__(self):
        return self.email

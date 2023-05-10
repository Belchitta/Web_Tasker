from django.contrib.auth.hashers import make_password
from django.db import models
from django.contrib.auth.models import AbstractUser
from uuid import uuid4


class User(AbstractUser):
    id = models.UUIDField(default=uuid4, primary_key=True)
    email = models.EmailField(unique=True)

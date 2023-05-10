from django.contrib.auth.admin import UserAdmin, admin
from .models import User


admin.site.register(User, UserAdmin)

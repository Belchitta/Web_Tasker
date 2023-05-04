from rest_framework.generics import mixins
from rest_framework.viewsets import GenericViewSet
from .models import User
from .serializers import UserSerializer


class UserViewSet(
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    mixins.UpdateModelMixin,
    GenericViewSet,
):
    serializer_class = UserSerializer
    queryset = User.objects.filter(is_active=True)

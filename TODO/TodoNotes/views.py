from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet
from .serializers import ProjectSerializer, ToDoSerializer, ProjectReadSerializer, ToDoReadSerializer
from rest_framework.response import Response
from rest_framework import status
from .models import Project, ToDo
from .filters import TodoFilter


class ToDoPagination(PageNumberPagination):
    page_size = 20


class ProjectPagination(PageNumberPagination):
    page_size = 20


class ProjectViewSet(ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Project.objects.all()
    # serializer_class = ProjectSerializer
    pagination_class = ProjectPagination

    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return ProjectReadSerializer
        return ProjectSerializer

    def get_queryset(self):
        queryset = Project.objects.all()
        name = self.request.query_params.get('name', None)
        if name:
            queryset = queryset.filter(name__contains=name)
        return queryset


class ToDoViewSet(ModelViewSet):
    queryset = ToDo.objects.all()
    serializer_class = ToDoSerializer
    pagination_class = ToDoPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = TodoFilter

    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return ToDoReadSerializer
        return ToDoSerializer

    def destroy(self, request, pk=None):
        try:
            instance = self.get_object()
            instance.is_active = False
            instance.save()
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(status=status.HTTP_204_NO_CONTENT)

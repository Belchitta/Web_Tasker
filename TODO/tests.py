import json
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate, APIClient, APISimpleTestCase, APITestCase
from mixer.backend.django import mixer
from django.contrib.auth.models import User
from TodoNotes.views import ToDoViewSet
from userapp.models import User
from TodoNotes.models import Project, ToDo


class TestTODOModelViewSet(TestCase):
    # APIRequestFactory. Неавторизованный пользователь не должен иметь доступа.
    def test_get_list_unauthorized(self):
        factory = APIRequestFactory()
        request = factory.get('/api/todo/')
        view = ToDoViewSet.as_view({'get': 'list'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # APIRequestFactory. Проверка доступности данных авторизированному пользователю.
    def test_get_list(self):
        factory = APIRequestFactory()
        admin = User.objects.create_superuser('admin', 'admin@mail.ru', '123123Xz')
        request = factory.get('/api/todo/')
        force_authenticate(request, admin)
        view = ToDoViewSet.as_view({'get': 'list'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TestUserModel(TestCase):
    # APIClient. Тест редактирования, использую права администратора.
    def test_edit(self):
        user = mixer.blend(User)
        client = APIClient()
        admin = User.objects.create_superuser('admin', 'admin@mail.ru', '123123Xz')
        client.login(username='admin', password='123123Xz')
        response = client.put(f'/api/users/{user.id}/', {'firstname': 'John', 'lastname': 'Lenon',
                                                         'id': '6d3ecdea-072b-4861-93f2-8970ec98c96d'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TestNumPy(APISimpleTestCase):
    # APISimpleTestCase. Тест работы библиотеки Numpy.
    def test_sin(self):
        import numpy as np
        self.assertEqual(np.sin(np.pi / 2.), 1.0)


class TestToDoAdd(APITestCase):
    # APITestCase. Тест добавления новой задачи.
    def test_add_todo_to_project(self):
        project = mixer.blend(Project)
        user = mixer.blend(User)
        todo = mixer.blend(ToDo)

        admin = User.objects.create_superuser('admin', 'admin@mail.ru', '123123Xz')
        self.client.login(username='admin', password='123123Xz')
        response = self.client.put(f'/api/todos/{todo.id}/', {'id': '11911416-c86d-4dce-827a-71f8f4504d34',
                                    'project': project.id, 'text': 'SampleText', 'creator': user.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

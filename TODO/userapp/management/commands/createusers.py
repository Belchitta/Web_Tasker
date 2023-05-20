from django.core.management.base import BaseCommand
from userapp.models import User


class Command(BaseCommand):
    help = 'Create Superuser and some test users'

    def handle(self, *args, **options):
        # Удаляем все пользоватлелей
        User.objects.all().delete()

        users = [
            {'username': 'fedor', 'first_name': 'Fedor', 'last_name': 'Ivanov', 'email': 'fedor@gmail.com'},
            {'username': 'elon', 'first_name': 'John', 'last_name': 'Elton', 'email': 'elton@gmail.com'},
            {'username': 'venom', 'first_name': 'Veniamin', 'last_name': 'Li', 'email': 'venom@mail.com'}
        ]
        # Создаем суперпользователя
        User.objects.create_superuser('leo', 'leo@test.com', 'qwerty123456')
        # Создаем тестовых пользователей
        for item in users:
            User.objects.create(**item)

        print('done')

# Generated by Django 3.1 on 2023-05-10 14:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TodoNotes', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='todo',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]

import graphene
from graphene_django import DjangoObjectType
from TodoNotes.models import ToDo, Project
from userapp.models import User


class ToDoType(DjangoObjectType):
    class Meta:
        model = ToDo
        fields = '__all__'


class ProjectType(DjangoObjectType):
    class Meta:
        model = Project
        fields = '__all__'


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = '__all__'


class Query(graphene.ObjectType):
    todos = graphene.List(ToDoType)
    projects = graphene.List(ProjectType)
    users = graphene.List(UserType)
    todo_by_project_name = graphene.List(ToDoType,
                                         name=graphene.String(required=False))

    def resolve_todos(self, info):
        return ToDo.objects.all()

    def resolve_projects(self, info):
        return Project.objects.all()

    def resolve_users(self, info):
        return User.objects.all()

    def resolve_todo_by_project_name(self, info, name=None):
        todo = ToDo.objects.all()
        if name:
            todo = todo.filter(project__project_name=name)
        return todo


class TODOMutation(graphene.Mutation):
    class Arguments:
        id = graphene.UUID(required=True)
        project = graphene.UUID()
        title = graphene.String()
        description = graphene.String()
        creator = graphene.UUID()
        create_date = graphene.DateTime(required=False)
        active = graphene.Boolean()

    todo = graphene.Field(ToDoType)

    @classmethod
    def mutate(cls, root, info, id, title, description, active):
        todo = ToDo.objects.get(pk=id)
        todo.title = title
        todo.description = description
        todo.active = active
        todo.save()
        return TODOMutation(todo=todo)


class Mutation(graphene.ObjectType):
    update_todo = TODOMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)

from rest_framework import viewsets
from .models import User, Assignment
from .serializers import UserSerializer, AssignmentSerializer
from django.http import HttpResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import LoginSerializer
from django.contrib.auth.hashers import make_password

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        serializer.save(password=make_password(serializer.validated_data['password']))

class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(user=user)

def home(request):
    return HttpResponse("Welcome to the Assignments Project!")

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            return Response({"message": "Login successful", "user_id": user.id}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
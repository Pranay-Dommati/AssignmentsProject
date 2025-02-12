from rest_framework import viewsets
from .models import User, Assignment
from .serializers import UserSerializer, AssignmentSerializer
from django.http import HttpResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import LoginSerializer
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers
from django.utils import timezone

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        serializer.save(password=make_password(serializer.validated_data['password']))

class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    
    def perform_create(self, serializer):
        email = self.request.data.get('email')
        try:
            user = User.objects.get(email=email)
            serializer.save(user=user)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")

def home(request):
    return HttpResponse("Welcome to the Assignments Project!")

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            # Update last_login without using django.contrib.auth
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])
            
            return Response({
                'user_id': user.id,
                'user': UserSerializer(user).data,
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_current_user(request):
    if request.user.is_authenticated:
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def get_user_assignments(request, user_email):
    try:
        user = User.objects.get(email=user_email)
        assignments = Assignment.objects.filter(user=user).order_by('-timestamp')
        serializer = AssignmentSerializer(assignments, many=True)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
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
        email = request.data.get('email')
        password = request.data.get('password')
        print(f"Login attempt with email: {email} and password: {password}")  # Debugging log
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            return Response({
                'user_id': user.id,
                'user': UserSerializer(user).data,
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_current_user(request):
    user = request.user
    if user.is_authenticated:
        serializer = UserSerializer(user)
        return Response(serializer.data)
    else:
        return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
    
    

@api_view(['GET'])
def get_user_assignments(request, user_email):
    try:
        # Get the user first
        user = User.objects.get(email=user_email)
        # Then get their assignments
        assignments = Assignment.objects.filter(user=user).order_by('-timestamp')
        serializer = AssignmentSerializer(assignments, many=True)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
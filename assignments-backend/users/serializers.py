from rest_framework import serializers
from .models import User, Assignment
from django.contrib.auth.hashers import check_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

# class AssignmentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Assignment
#         fields = '__all__'


class AssignmentSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    class Meta:
        model = Assignment
        fields = '__all__'
        fields = ['id', 'subject', 'num_pages', 'college_or_school', 'locations', 
                 'min_bid', 'max_bid', 'resource_file', 'timestamp', 'user', 'user_email']
        read_only_fields = ('user',)  # Make user field read-only

    def create(self, validated_data):
        # Get the user from the email provided in the request
        email = self.context['request'].data.get('email')
        try:
            user = User.objects.get(email=email)
            validated_data['user'] = user
            return super().create(validated_data)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
    
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            raise serializers.ValidationError("Email and password are required.")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password.")

        if not check_password(password, user.password):
            raise serializers.ValidationError("Invalid email or password.")

        data['user'] = user
        return data
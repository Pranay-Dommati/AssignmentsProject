from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, LoginView, AssignmentViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'assignments', AssignmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
]
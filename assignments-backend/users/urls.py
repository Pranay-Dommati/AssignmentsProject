# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views import UserViewSet, LoginView, AssignmentViewSet, get_current_user, get_user_assignments

# router = DefaultRouter()
# router.register(r'users', UserViewSet)
# router.register(r'assignments', AssignmentViewSet)

# urlpatterns = [
#     path('', include(router.urls)),
#     path('login/', LoginView.as_view(), name='login'),
#     path('users/me/', get_current_user, name='current-user'),  # Add this line
#     path('user-assignments/<str:user_email>/', get_user_assignments, name='user-assignments'),
# ]



from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, LoginView, AssignmentViewSet, get_current_user, get_user_assignments, get_csrf_token

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'assignments', AssignmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path('csrf/', get_csrf_token, name='csrf'),  # Add this line
    path('users/me/', get_current_user, name='current-user'),
    path('user-assignments/<str:user_email>/', get_user_assignments, name='user-assignments'),
]
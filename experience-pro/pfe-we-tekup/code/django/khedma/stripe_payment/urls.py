from django.urls import path
from .views import AbonnementPreview, CreateCheckOutSession, stripe_webhook_view
from django.views.decorators.csrf import csrf_exempt
urlpatterns = [
    # Your existing URL pattern for AbonnementPreview
    path('abonnement/<int:pk>/', AbonnementPreview.as_view(), name="abonnement"),

    # Add the URL pattern for CreateCheckOutSession if needed
    path('create-checkout-session/<pk>/', csrf_exempt(CreateCheckOutSession.as_view()), name='checkout_session'),
    path('stripe-webhook/', stripe_webhook_view, name='stripe-webhook'),


]

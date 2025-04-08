from django.urls import path
from . import views

urlpatterns = [
    path("", views.apiOverview, name="api-overview"),
    path("List/", views.list, name="List"),
    path("Detail/", views.AbonnementDetailView.as_view(), name="Detail"),
    path("Create/", views.Create, name="Create"),
    path("abonementbyuser/<int:user_id>", views.abonementbyuser,name="abonementbyuser"),
    path("CreateA/",views.AbonnementCreateView.as_view(),
        name="Create",
    ),
    path("payementSuccess/<int:aid>", views.stripePaiement, name="stripePayement"),
    
    path("CheckA/", views.check_abonnement.as_view(), name="Check",),
    #path('payment/<str:id>/', views.get_classique_or_iapremium, name='payment-detail'),

]
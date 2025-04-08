from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from users.views import updateStatusSociete, PersonneCreateView, SocieteCreateView,EnregistrerCandidatRatingView,UserActivationView, PersonneDetailView,SocieteDetailView,getSocietesView,getCandidatsView, ModifierPersonneView, ModifierSocieteView
from users.views import PersonneCreateView, SocieteCreateView,EnregistrerCandidatRatingView,UserActivationView, PersonneDetailView,SocieteDetailView,getSocietesView, ModifierPersonneView, ModifierSocieteView, AdminView,AdminDetailView
from django.contrib.staticfiles.views import serve as staticfiles_serve
from users.views import get_rating_categories,get_moyennerating_societe,CompetenceCreateView,CompetencesByPersonneView,ModifierStatutRatingView,EnregistrerSocieteRatingView,get_moyennerating_candidat, add_competences_to_profile,delete_competence_from_profile
from users.views import ModifierStatutSocieteRatingView,change_password
from django.urls import re_path
from django.conf import settings
from django.conf.urls.static import static
from emploi.views import *
#from emploi.views import EmploiPlusViewSet
from emploi.views import toggle_favoris, check_favoris, get_user_favorites, supprimer_favoris, apply_to_job, has_user_applied, count_applications_for_job, get_applications_for_job, get_application_details, update_application_status, get_all_applications, get_candidat_applications,get_all_applications_admin
from Event.views import event_list, event_create, event_detail, event_update, event_delete, confirm_participation, check_participation, cancel_participation, PublieEvent, archiver_event, create_secteur, list_secteurs, update_secteur, delete_secteur

from emploi.views import EmploisParRecruteurView


from emploi import views
from Reclamation.views import *




from chat.views import CreateChatView,find_chat,user_chats ,GetMessagesView,AddMessageView,getUserChat,UserChats,FindChat


from rest_framework.routers import DefaultRouter
# router=DefaultRouter()
# router.register(r'emploi', EmploisViewset)

urlpatterns = [
    # Other URL patterns
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('personne/', PersonneCreateView.as_view(), name='personne-create'),
    path('get_rating_categories/', get_rating_categories, name='get_rating_categories'),
    path('ajoutercompetenceaucandidat/',add_competences_to_profile,name='ajoutercompetencesaucandidat'),
    path('competence/',CompetenceCreateView.as_view(),name='competence'),
    path('listcandidats/',getCandidatsView.as_view(),name='liste-candidats'),
    path('listsocietes/',getSocietesView.as_view(),name='liste-societes'),
    path('personne/<int:pk>/competences/',CompetencesByPersonneView.as_view(),name='getCompetencesbypersonne'),
    path('donnerratingcandidat/',EnregistrerCandidatRatingView.as_view(),name='donnerratingcandidat'),
    path('donnerratingausociete/',EnregistrerSocieteRatingView.as_view(),name='donnerratingausociete'),
    path('auth/passwordchange/<int:user_id>/', change_password, name='change_password'),
   
    path('societe/', SocieteCreateView.as_view(), name='societe-create'),
    path('activate/<str:uid>/<str:token>/', UserActivationView.as_view(), name='user-activation'),
    path('personne/<int:pk>/', PersonneDetailView.as_view(), name='personne-detail'),
    path('societe/<int:pk>/', SocieteDetailView.as_view(), name='societe-detail'),
    path('modifierPersonne/<int:pk>/', ModifierPersonneView.as_view(), name='personne-modifier'),
    path('supprimercompetencecandidat/',delete_competence_from_profile,name='supprimercompetencecandidat'),
    path('societe/modifierSociete/<int:pk>/', ModifierSocieteView.as_view(), name='societe-modifier'),
    path('post-emploi',PublierEmploiView,name='poster-emploi'),
    path('archive-emploi/<int:eid>/', ArchiveEmploi, name='archive-emploi'),
    path('publie-emploi/<int:eid>/', PublieEmploi, name='publie-emploi'),
    path('societe-best/<int:sid>/', updateStatusSociete, name='societe-best'),
    path('get-emploi/<int:eid>/', GetEmplois, name='get-emploi'),
    path('put-emploi/<int:eid>/', PutEmplois, name='put-emploi'),
    path('get-emplois',EmploisViewset.as_view(),name='get-emplois'),
    path('get-categories', getCategoriesView.as_view(),name='getcategories'),
    path('delete-emploi/<int:emploi_id>/',delete_emploi, name='delete_emploi'),
    #path('',include(router.urls)),

    path('get_moyennerating_candidat/<int:idcandidat>/', get_moyennerating_candidat, name='get_moyennerating_candidat'),
    path('getmoyenneratingsociete/<int:idsociete>/',get_moyennerating_societe,name='getmoyenneratingsociete'),
    path('modifier-statut-rating/<int:rating_id>/', ModifierStatutRatingView.as_view(), name='modifier-statut-rating'),
    path('modifier-statutsociete-rating/<int:rating_id>/', ModifierStatutSocieteRatingView.as_view(), name='modifier-statutsociete-rating'),
    re_path(r'^static/(?P<path>.*)$', staticfiles_serve),
    path('api/', include("stripe_payment.urls")),
    #admin urls
    path('admin/users/', AdminView.as_view(), name='admin_views'),
    path('admin/users/<int:uid>/', AdminDetailView.as_view(), name='admin_detail_views'),
    path("Abonnement/", include("Abonnement.urls")),
    


    #chat url
   
    path('userChats/<int:user_id>/',UserChats.as_view(), name='userC'),
    path('find_chat/<int:first_id>/<int:second_id>/', FindChat.as_view(), name='find-chat'),
    path('getUserChat',getUserChat.as_view(), name='userChats'),
    path('api/chats/<int:userId>/',user_chats, name='user_chats'),
    path('chat/find/<int:firstId>/<int:secondId>/', find_chat, name='find_chat'),
    path('CreateChat/',CreateChatView.as_view(), name='CreateChat'),
    
    path('add-message/', AddMessageView.as_view(), name='add_message'),
    path('get-messages/<int:chat_id>/', GetMessagesView.as_view(), name='get_messages'),
   
    

    
     #Favoris  URL

    path('toggle-favoris/', toggle_favoris, name='toggle-favoris'),
    path('check-favoris/', check_favoris, name='check-favoris'),

    path('api/favoris/', get_user_favorites, name='user-favorites'),
    path('api/supprimer-favoris/<int:emploi_id>/<int:user_id>/', supprimer_favoris, name='supprimer-favoris'),
    
     #Event URL

    path('event-list/', event_list, name='event-list'),
    path('event-create/', event_create, name='event-create'),
    path('get-event/<int:pk>/', event_detail, name='get-event'),
    path('update-event/<int:pk>/', event_update, name='update-event'),
    path('delete-event/<int:event_id>/',event_delete, name='delete-event'),
    path('publie-event/<int:eid>/', PublieEvent, name='publie-event'),
    path('archiver-event/<int:eid>/', archiver_event, name='archiver-event'),

     #Event_Secteur_Crud

    path('secteurs/create/', create_secteur, name='create_secteur'),
    path('secteurs/', list_secteurs, name='list_secteurs'),
    path('secteurs/update/<int:pk>/', update_secteur, name='update_secteur'),
    path('secteurs/delete/<int:pk>/', delete_secteur, name='delete_secteur'),
    
          
    #participate Event
    path('confirm-participation/', confirm_participation, name='confirm_participation'),
    path('check-participation/<int:event_id>/<int:user_id>/', check_participation, name='check_participation'),
    path('cancel-participation/<int:event_id>/<int:user_id>/', cancel_participation, name='cancel_participation'),

    # Apply Job
    path('apply/', apply_to_job, name='apply-to-job'),
    path('has-user-applied/<int:user_id>/<int:emploi_id>/', has_user_applied, name='has-user-applied'),
    # Apply Favourite Job
    # path('apply_to_favorite_job/',apply_to_favorite_job, name='apply_to_favorite_job'),
    # path('has-user-applied-to-favorite/<int:user_id>/<int:emploi_id>/', has_user_applied_to_favorite, name='has_user_applied_to_favorite'),


    # Interface Ai (Espace Recruteur)

    path('api/emplois-par-recruteur/', EmploisParRecruteurView.as_view(), name='emplois_par_recruteur'),
    path('emploi/<int:emploi_id>/applications/count/', count_applications_for_job, name='count_applications_for_job'),
    path('emploi/<int:emploi_id>/applications/', get_applications_for_job, name='get_applications_for_job'),

    path('application/<int:application_id>/details/', get_application_details, name='get_application_details'),
    path('application/<int:application_id>/status/', update_application_status, name='update-application-status'),
    path('applications/', get_all_applications, name='get_all_applications'),
    
    path('api/candidat/applications/', views.get_candidat_applications, name='get_candidat_applications'),
    path('api/applications_over_time/', views.applications_over_time, name='applications_over_time'),
    path('api/applications_over_time_admin/', views.applications_over_time_admin, name='applications_over_time_admin'),


    path('api/applications_by_status/', views.applications_by_status, name='applications_by_status'),
    path('api/applications_by_job_title/', views.applications_by_job_title, name='applications_by_job_title'),
    path('api/offer_acceptance_rate/', views.offer_acceptance_rate, name='offer_acceptance_rate'),
    path('api/offer_acceptance_rate_admin/', views.offer_acceptance_rate_admin, name='offer_acceptance_rate_admin'),
    path('api/favorites_per_job/', views.favorites_per_job, name='favorites_per_job'),
    path('api/summary_metrics/', views.summary_metrics, name='summary_metrics'),
        # Réclamation URLs
    path('reclamations/', reclamation_create, name='reclamation-create'),
    path('reclamations/list/', reclamation_list, name='reclamation-list'),
    path('api/reclamations/list/', reclamation_list_admin, name='reclamation-list'),

    path('reclamations/<int:pk>/', reclamation_detail, name='reclamation-detail'),
    path('reclamations/<int:pk>/update/', reclamation_update, name='reclamation-update'),
    path('reclamations/<int:pk>/delete/', reclamation_delete, name='reclamation-delete'),
       # Admin Candidature URLs
    path('api/applications/', get_all_applications_admin, name='get_all_applications_admin'),
    # urls.py
    path('send-email/', send_email, name='send_email'),




]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]




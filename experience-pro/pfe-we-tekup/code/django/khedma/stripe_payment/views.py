from django.shortcuts import render, HttpResponseRedirect  # Import HttpResponseRedirect
from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView
from rest_framework import permissions
from Abonnement.models import classique,Iapremium,Abonnement
from Abonnement.serializers import classiqueSerializer,IapremiumSerializer
from rest_framework.response import Response
from django.conf import settings
import stripe
import json
from rest_framework import generics
from django.http import JsonResponse
from rest_framework import status
from django.views import View
from django.http import HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt



class AbonnementPreview(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]

    def retrieve(self, request, pk=None):
        try:
            abonnement = Abonnement.objects.get(pk=pk)
            if abonnement.typeAbon == 'classic':
                classique_abonnement = classique.objects.get(key=abonnement)
                serializer = classiqueSerializer(classique_abonnement)
            elif abonnement.typeAbon == 'iapremium':
                iapremium_abonnement = Iapremium.objects.get(key=abonnement)
                serializer = IapremiumSerializer(iapremium_abonnement)
            else:
                return Response({'error': 'Invalid Abonnement type'})
            return Response(serializer.data)
        except Abonnement.DoesNotExist:
            return Response({'error': 'Abonnement not found'})


stripe.api_key=settings.STRIPE_SECRET_KEY
@csrf_exempt
def stripe_webhook_view(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    event = None

    try:
        event = stripe.Webhook.construct_event(
        payload, sig_header, settings.STRIPE_SECRET_WEBHOOK
        )
    except ValueError as e:
        # Invalid payload
        return Response(status=400)
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return Response(status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']

        print(session)
        customer_email=session['customer_details']['email']
        prod_id=session['metadata']['product_id']
        product=Abonnement.objects.get(id=prod_id)
        #sending confimation mail
        send_mail(
            subject="payment sucessful",
            message=f"thank for your purchase your order is ready. ",
            recipient_list=[customer_email],
            from_email="zaghouani.ahlem@esprit.tn"
        )
        #creating payment history
        # user=User.objects.get(email=customer_email) or None

        PaymentHistory.objects.create(product=product, payment_status=True)
    # Passed signature verification
    return HttpResponse(status=200)


class CreateCheckOutSession(APIView):
    def post(self, request, *args, **kwargs):
        abonnement_id = self.kwargs["pk"]
        try:
            # Retrieve the Abonnement object based on the provided abonnement_id
            abonnement = Abonnement.objects.get(id=abonnement_id)

            # Initialize variables for product data
            product_data = {
                'name': "",
                'images': [],
            }

            # Initialize variable for price in cents
            unit_amount = 0

            # Determine the type of abonnement and retrieve the corresponding data
            if abonnement.typeAbon == 'classic':
                classic = classique.objects.get(key=abonnement)
                product_data['name'] = classic.Classictype
                unit_amount = int(classic.prix) * 100
            elif abonnement.typeAbon == 'iapremium':
                iapremium = Iapremium.objects.get(key=abonnement)
                product_data['name'] = iapremium.Classictype
                unit_amount = int(iapremium.prix) * 100
            else:
                return JsonResponse({'error': 'Invalid Abonnement type'}, status=status.HTTP_400_BAD_REQUEST)

            # Create a Stripe checkout session
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[
                    {
                        'price_data': {
                            'currency': 'usd',
                            'unit_amount': unit_amount,  # Price in cents
                            'product_data': product_data,
                        },
                        'quantity': 1,
                    },
                ],
                success_url=f"http://localhost:8000/success/{abonnement.id}",
                cancel_url=f'http://localhost:8000/payement/{abonnement.id}/?canceled=true',
                metadata={
                    "abonnement_id": abonnement.id
                },
                mode='payment',
            )
            # Use HttpResponseRedirect to redirect the user to the Stripe checkout page
            return HttpResponseRedirect(checkout_session.url)

        except Abonnement.DoesNotExist:
            return JsonResponse({'error': 'Abonnement not found'}, status=status.HTTP_404_NOT_FOUND)

        except (classique.DoesNotExist, Iapremium.DoesNotExist):
            return JsonResponse({'error': 'Classique or Iapremium not found'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'msg': 'something went wrong while creating stripe session', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



   





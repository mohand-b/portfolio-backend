from django.urls import path
from .views import submit_question, get_question, get_answered_questions

urlpatterns = [
    path('questions/submit', submit_question, name='submit-question'),
    path('questions/<str:unique_id>', get_question, name='get-question'),
    path('questions/answered', get_answered_questions, name='get-answered-questions'),
]

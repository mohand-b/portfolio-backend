from django.urls import path
from .views import submit_question, get_question, get_answered_questions, delete_pending_question, answer_question, \
    reject_question, get_pending_questions

urlpatterns = [
    path('questions/submit', submit_question, name='submit-question'),
    path('questions/<str:unique_id>', get_question, name='get-question'),
    path('questions/answered/', get_answered_questions, name='get-answered-questions'),
    path('questions/pending/', get_pending_questions, name='get-pending-questions'),
    path('questions/delete/<int:pk>', delete_pending_question, name='delete-pending-question'),
    path('questions/<str:unique_id>/answer', answer_question, name='answer-question'),
    path('questions/<str:unique_id>/reject', reject_question, name='reject-question'),
]

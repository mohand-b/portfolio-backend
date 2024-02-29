from django.shortcuts import get_object_or_404, get_list_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Question
from .serializers import QuestionSerializer


@api_view(['POST'])
def submit_question(request):
    serializer = QuestionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_BAD_REQUEST)


@api_view(['GET'])
def get_question(request, unique_id):
    question = get_object_or_404(Question, unique_id=unique_id)
    serializer = QuestionSerializer(question)
    return Response(serializer.data)


@api_view(['GET'])
def get_answered_questions(request):
    questions = Question.objects.exclude(response_or_reason__isnull=True).exclude(response_or_reason__exact='')
    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)

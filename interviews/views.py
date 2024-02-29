from django.shortcuts import get_object_or_404, get_list_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Question
from .serializers import QuestionSerializer
from .utils import convert_dict_keys_to_camel_case


@api_view(['POST'])
def submit_question(request):
    serializer = QuestionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        data = convert_dict_keys_to_camel_case(serializer.data)
        return Response(data, status=status.HTTP_201_CREATED)
    errors = convert_dict_keys_to_camel_case(serializer.errors)
    return Response(errors, status=status.HTTP_400_BAD_BAD_REQUEST)


@api_view(['GET'])
def get_question(request, unique_id):
    question = get_object_or_404(Question, unique_id=unique_id)
    serializer = QuestionSerializer(question)
    data = convert_dict_keys_to_camel_case(serializer.data)
    return Response(data)


@api_view(['GET'])
def get_answered_questions(request):
    questions = Question.objects.exclude(response_or_reason__isnull=True).exclude(response_or_reason__exact='')
    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)

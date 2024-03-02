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
    questions = Question.objects.filter(status='answered')
    serializer = QuestionSerializer(questions, many=True)
    data = convert_dict_keys_to_camel_case(serializer.data)
    return Response(data)


@api_view(['GET'])
def get_pending_questions(request):
    questions = Question.objects.filter(status='pending')
    serializer = QuestionSerializer(questions, many=True)
    data = convert_dict_keys_to_camel_case(serializer.data)
    return Response(data)


@api_view(['DELETE'])
def delete_pending_question(request, pk):
    try:
        question = Question.objects.get(pk=pk, status='pending')
    except Question.DoesNotExist:
        return Response({'detail': 'Question not found or not in pending status.'}, status=status.HTTP_404_NOT_FOUND)

    question.delete()
    return Response({'detail': 'Question deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['PATCH'])
def answer_question(request, unique_id):
    try:
        question = get_object_or_404(Question, unique_id=unique_id)
    except Question.DoesNotExist:
        return Response({'detail': 'Question not found.'}, status=status.HTTP_404_NOT_FOUND)

    question.status = 'answered'
    question.response_or_reason = request.data.get('response', question.response_or_reason)
    question.save()

    return Response({'detail': 'Question answered successfully.'})


@api_view(['PATCH'])
def reject_question(request, unique_id):
    try:
        question = get_object_or_404(Question, unique_id=unique_id)
    except Question.DoesNotExist:
        return Response({'detail': 'Question not found.'}, status=status.HTTP_404_NOT_FOUND)

    question.status = 'rejected'
    question.response_or_reason = request.data.get('reason', question.response_or_reason)
    question.save()

    return Response({'detail': 'Question rejected successfully.'})

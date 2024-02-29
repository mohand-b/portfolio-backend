from django.db import models
import random

ANIMAL_NAMES = ['LION', 'TIGER', 'BEAR', 'WOLF', 'EAGLE', 'CAT', 'DOG', 'FOX', 'GOAT', 'DEER']


class Question(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('rejected', 'Rejected'),
        ('answered', 'Answered'),
    ]
    unique_id = models.CharField(max_length=10, unique=True, blank=True)
    question_text = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    response_or_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.unique_id:
            while True:
                animal = random.choice(ANIMAL_NAMES)
                number = random.randint(100, 999)
                self.unique_id = f'{animal}{number}'
                if not Question.objects.filter(unique_id=self.unique_id).exists():
                    break
        super(Question, self).save(*args, **kwargs)

from django.core.exceptions import ValidationError
from django.db import models
from django.contrib.auth.models import User
from users.models import UserAccount

class TwoNumberArrayField(models.TextField):
    def __init__(self, *args, **kwargs):
        kwargs['default'] = '[]'
        super().__init__(*args, **kwargs)

    def from_db_value(self, value, expression, connection):
        if value is None:
            return []
        return [int(val) for val in value.strip('[]').split(',')]

    def to_python(self, value):
        if isinstance(value, list):
            return value
        if value is None:
            return []
        return [int(val) for val in value.strip('[]').split(',')]

    def get_prep_value(self, value):
        if value is None:
            return '[]'
        return f"[{','.join(str(val) for val in value)}]"
    
class Chat(models.Model):
    members = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'chat'

    def __str__(self):
        return f'Chat {self.id}'

    def clean(self):
        # Ensure that none of the numbers in the 'members' list are None
        if None in self.members:
            raise ValidationError("Members list cannot contain None values.")

    def save(self, *args, **kwargs):
        self.full_clean()  # Validate the model instance
        super().save(*args, **kwargs)




class Message(models.Model):
  
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    sender = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    text = models.TextField(blank=True) 
    file = models.FileField(upload_to='message_files/', null=True, blank=True)  # Add this field for file uploads
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'message'

    def __str__(self):
        return f'Message {self.id}'



  
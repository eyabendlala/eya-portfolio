from django.db import models
from users.models import UserAccount

class Reclamation(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)  
    subject = models.CharField(max_length=200)
    description = models.TextField()    
    status = models.CharField(max_length=50, choices=[('open', 'Open'), ('in_progress', 'In Progress'), ('resolved', 'Resolved')])
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        db_table = 'reclamation'
    def __str__(self):
        return self.subject


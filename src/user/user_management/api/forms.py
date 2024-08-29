from django import forms
from .models import CustomUser
from django.contrib.auth.forms import UserCreationForm

class CustomUserCreationForm(UserCreationForm):
    password = forms.CharField(widget=forms.PasswordInput)
    # confirm_password = forms.CharField(widget=forms.PasswordInput, label='Confirm Password')

    class Meta:
        model = CustomUser
        fields = ['username',
                    'password1',
                    'password2',]

    def clean_password(self):
        password = self.cleaned_data.get('password')
        # Ajouter des validations supplémentaires ici si nécessaire
        return password
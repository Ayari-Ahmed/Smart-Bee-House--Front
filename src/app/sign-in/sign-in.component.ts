import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  standalone: false,
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;

  onSubmit() {
    console.log('Sign in attempt:', {
      email: this.email,
      password: this.password,
      rememberMe: this.rememberMe
    });
    // Add your authentication logic here (e.g., call an AuthService)
    // Example:
    // this.authService.signIn(this.email, this.password, this.rememberMe)
    //   .subscribe({
    //     next: (response) => console.log('Login successful', response),
    //     error: (err) => console.error('Login failed', err)
    //   });
  }
}

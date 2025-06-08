import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../service/user.service';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { ErrorService } from '../service/error.service';
import { CommonModule } from '@angular/common';
import { UserInfo } from '../model/user-info';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.css'
})
export class DeleteModalComponent {

  @Input() UserInfo: UserInfo = {
    username: '',
    tester: false,
    creator: false,
    exercises: []
  };
  @Input() isHeader: boolean = false;
  @Input() userPage: boolean = false;
  @Output() EmitterClose = new EventEmitter();
  

  constructor(
    private userservice: UserService,
    private authservice: AuthService,
    private router: Router,
    private errorService: ErrorService
  ) 
  {}

  deleteThisUser(): void {
    this.userservice.deleteLoggedUser().subscribe({
      next: (response) => {
        sessionStorage.clear();
        console.log("Deleted user:", response);
        this.authservice.setLoggedIn(true);
        this.closeModal();
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error("Can't delete the user:", error);
        this.errorService.changeData({code: error.status, message: "Your user could not be deleted"});
        this.closeModal();
        this.router.navigate(['/error']);
      }
    });
  }

  deleteUser(): void {
      this.userservice.deleteUser(this.UserInfo.username).subscribe({
        next: (response) => {
          console.log("Deleted user:", response);
          this.closeModal();
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error("Can't delete the user:", error);
          this.errorService.changeData({code: error.status, message: "You can't delete the user"});
          this.closeModal();
          this.router.navigate(['/error']);
        }
      });
    }

  closeModal(): void {
    this.EmitterClose.emit();
  }
}

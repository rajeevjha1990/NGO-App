import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user/user.service';
import { User } from '../data-types/user';
import { map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  user: User = new User();

  constructor(
    private router: Router,
    private userServ: UserService
  ) { }

  canActivate(): Observable<boolean> {
    return this.userServ.user.pipe(
      take(1),
      map(u => {
        if (u && u.loggedIn) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { UserService } from '../services/user/user.service';
import { Volenteer } from '../data-types/volenteer';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private userServ: UserService
  ) { }

  canActivate(): Observable<boolean> {
    return this.userServ.volenteer.pipe(
      take(1),
      map((u: Volenteer) => {
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

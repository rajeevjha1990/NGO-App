import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [

  // 🔐 Public Routes
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then(m => m.HomePage),
  },
  {
    path: 'onboarding',
    loadComponent: () =>
      import('./pages/onboarding/onboarding.page').then(m => m.OnboardingPage)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/signup/signup.page').then(m => m.SignupPage)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage)
  },
  // 🔐 Protected Routes
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/profile/profile.page').then(m => m.ProfilePage)
  },
  {
    path: 'groups',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/groups/groups.page').then(m => m.GroupsPage)
  },
  {
    path: 'new-group',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/new-group/new-group.page').then(m => m.NewGroupPage)
  },
  {
    path: 'edit-group/:groupId',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/new-group/new-group.page').then(m => m.NewGroupPage)
  },
  {
    path: 'members/:groupId',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/members/members.page').then(m => m.MembersPage)
  },
  {
    path: 'distributed-saintries',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/distributed-saintries/distributed-saintries.page')
        .then(m => m.DistributedSaintriesPage)
  },
  {
    path: 'new-distribution',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/new-distribution/new-distribution.page')
        .then(m => m.NewDistributionPage)
  },
  {
    path: 'statefilter',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/statefilter/statefilter.page')
        .then(m => m.StatefilterPage)
  },
  {
    path: 'cityfilter',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/cityfilter/cityfilter.page')
        .then(m => m.CityfilterPage)
  },

  // ✅ Default Route (Only for ROOT)
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // ✅ Fallback (404 Safe)
  { path: '**', redirectTo: 'home' },
  {
    path: 'blockfilter',
    loadComponent: () => import('./pages/blockfilter/blockfilter.page').then( m => m.BlockfilterPage)
  },
  {
    path: 'villagefilter',
    loadComponent: () => import('./pages/villagefilter/villagefilter.page').then( m => m.VillagefilterPage)
  },
];

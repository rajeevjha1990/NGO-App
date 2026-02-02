import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';
import { FootertabComponent } from './components/footertab/footertab.component';

export const routes: Routes = [
  // 1. Default Route (Sabse upar)
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 🔐 Public Routes
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'onboarding',
    loadComponent: () =>
      import('./pages/onboarding/onboarding.page').then(
        (m) => m.OnboardingPage
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/signup/signup.page').then((m) => m.SignupPage),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password.page').then(
        (m) => m.ForgotPasswordPage
      ),
  },

  // 🛡️ Protected Routes (AuthGuard ke saath)
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/profile/profile.page').then((m) => m.ProfilePage),
  },
  {
    path: 'personal-info',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/personal-info/personal-info.page').then(
        (m) => m.PersonalInfoPage
      ),
  },
  {
    path: 'groups',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/groups/groups.page').then((m) => m.GroupsPage),
  },
  {
    path: 'about',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/about/about.page').then((m) => m.AboutPage),
  },
  {
    path: 'new-group',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/new-group/new-group.page').then((m) => m.NewGroupPage),
  },
  {
    path: 'edit-group/:groupId',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/new-group/new-group.page').then((m) => m.NewGroupPage),
  },
  {
    path: 'members/:groupId',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/members/members.page').then((m) => m.MembersPage),
  },
  {
    path: 'distributed-saintries',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/distributed-saintries/distributed-saintries.page').then(
        (m) => m.DistributedSaintriesPage
      ),
  },
  {
    path: 'new-distribution',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/new-distribution/new-distribution.page').then(
        (m) => m.NewDistributionPage
      ),
  },
  {
    path: 'edit-distribution/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/new-distribution/new-distribution.page').then(
        (m) => m.NewDistributionPage
      ),
  },
  {
    path: 'notifications',
    loadComponent: () =>
      import('./pages/notifications/notifications.page').then(
        (m) => m.NotificationsPage
      ),
  },
  {
    path: 'assigned-orders',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/assigned-orders/assigned-orders.page').then(
        (m) => m.AssignedOrdersPage
      ),
  },

  // 🔍 Filter Routes
  {
    path: 'statefilter',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/statefilter/statefilter.page').then(
        (m) => m.StatefilterPage
      ),
  },
  {
    path: 'cityfilter',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/cityfilter/cityfilter.page').then(
        (m) => m.CityfilterPage
      ),
  },
  {
    path: 'blockfilter',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/blockfilter/blockfilter.page').then(
        (m) => m.BlockfilterPage
      ),
  },
  {
    path: 'villagefilter',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/villagefilter/villagefilter.page').then(
        (m) => m.VillagefilterPage
      ),
  },
  {
    path: 'program-view/:programId',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/program-view/program-view.page').then(
        (m) => m.ProgramViewPage
      ),
  },
  {
    path: 'example',
    component: FootertabComponent,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/notifications/notifications.page').then(
            (m) => m.NotificationsPage
          ),
      },

      {
        path: '',
        redirectTo: '/example/home',
        pathMatch: 'full',
      },
    ],
  },

  { path: '**', redirectTo: 'home' },
  {
    path: 'message',
    loadComponent: () => import('./pages/message/message.page').then( m => m.MessagePage)
  },
  {
    path: 'news',
    loadComponent: () => import('./pages/news/news.page').then( m => m.NewsPage)
  },
];

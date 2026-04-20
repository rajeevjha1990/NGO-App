import { Routes } from '@angular/router';
// import { AuthGuard } from './guards/auth-guard';
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
    //////canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/profile/profile.page').then((m) => m.ProfilePage),
  },
  {
    path: 'personal-info',
    ////canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/personal-info/personal-info.page').then(
        (m) => m.PersonalInfoPage
      ),
  },
  {
    path: 'groups',
    ////canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/groups/groups.page').then((m) => m.GroupsPage),
  },
  {
    path: 'about',
    ////canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/about/about.page').then((m) => m.AboutPage),
  },
  {
    path: 'new-group/:programId',
    ////canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/new-group/new-group.page').then((m) => m.NewGroupPage),
  },
  {
    path: 'edit-group/:groupId',
    ////canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/new-group/new-group.page').then((m) => m.NewGroupPage),
  },
  {
    path: 'members/:groupId',
    ////canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/members/members.page').then((m) => m.MembersPage),
  },
  {
    path: 'distributed-saintries',
    ////canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/distributed-saintries/distributed-saintries.page').then(
        (m) => m.DistributedSaintriesPage
      ),
  },
  {
    path: 'new-distribution/:programId',
    loadComponent: () =>
      import('./pages/new-distribution/new-distribution.page').then(
        (m) => m.NewDistributionPage
      ),
  },
  {
    path: 'edit-distribution/:distributionId',
    loadComponent: () =>
      import('./pages/new-distribution/new-distribution.page').then(
        (m) => m.NewDistributionPage
      ),
  },
  {
    path: 'program-vermi',
    ////canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/program-vermi/program-vermi.page').then(
        (m) => m.ProgramVermiPage
      ),
  },
  {
    path: 'program-seed',
    ////canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/program-seed/program-seed.page').then(
        (m) => m.ProgramSeedPage
      ),
  },
  {
    path: 'program-skill',
    ////canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/program-skill/program-skill.page').then(
        (m) => m.ProgramSkillPage
      ),
  },
  {
    path: 'program-employment',
    ////canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/program-employment/program-employment.page').then(
        (m) => m.ProgramEmploymentPage
      ),
  },
  {
    path: 'program-dmit',
    ////canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/program-dmit/program-dmit.page').then(
        (m) => m.ProgramDmitPage
      ),
  },
  {
    path: 'program-machinery',
    ////canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/program-machinery/program-machinery.page').then(
        (m) => m.ProgramMachineryPage
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
    path: 'message',
    loadComponent: () =>
      import('./pages/message/message.page').then((m) => m.MessagePage),
  },
  {
    path: 'conversactions/:threadId',
    loadComponent: () =>
      import('./pages/conversactions/conversactions.page').then(
        (m) => m.ConversactionsPage
      ),
  },
  {
    path: 'news',
    loadComponent: () =>
      import('./pages/news/news.page').then((m) => m.NewsPage),
  },
  {
    path: 'gallery',
    loadComponent: () =>
      import('./pages/gallery/gallery.page').then((m) => m.GalleryPage),
  },
  {
    path: 'image-upload',
    loadComponent: () =>
      import('./pages/image-upload/image-upload.page').then(
        (m) => m.ImageUploadPage
      ),
  },
  {
    path: 'scaner',
    loadComponent: () =>
      import('./pages/scaner/scaner.page').then((m) => m.ScanerPage),
  },
  {
    path: 'assigned-orders',
    ////canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/assigned-orders/assigned-orders.page').then(
        (m) => m.AssignedOrdersPage
      ),
  },

  // 🔍 Filter Routes
  {
    path: 'statefilter',
    ////canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/statefilter/statefilter.page').then(
        (m) => m.StatefilterPage
      ),
  },
  {
    path: 'cityfilter',
    ////canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/cityfilter/cityfilter.page').then(
        (m) => m.CityfilterPage
      ),
  },
  {
    path: 'blockfilter',
    ////canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/blockfilter/blockfilter.page').then(
        (m) => m.BlockfilterPage
      ),
  },
  {
    path: 'villagefilter',
    ////canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/villagefilter/villagefilter.page').then(
        (m) => m.VillagefilterPage
      ),
  },
  {
    path: 'program-view/:programId',
    ////canActivate: [AuthGuard],
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

  {
    path: 'payment',
    loadComponent: () =>
      import('./pages/payment/payment.page').then((m) => m.PaymentPage),
  },
  { path: '**', redirectTo: 'home' },
];

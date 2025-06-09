import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fermier-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <!-- Honeycomb Background -->
      <div class="honeycomb-bg"></div>

      <!-- Sidebar -->
      <nav class="sidebar" [ngClass]="{'collapsed': sidebarCollapsed}">
        <div class="sidebar-header">
          <svg class="bee-logo" width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 00-7.3 16.7l4.6 4.6a2 2 0 002.8 0l4.6-4.6A10 10 0 0012 2zm0 18.6l-4.6 4.6a1 1 0 01-1.4 0l-4.6-4.6a8 8 0 1112.8 0l-4.6 4.6a1 1 0 01-1.4 0zM12 6a4 4 0 100 8 4 4 0 000-8z"/>
          </svg>
          <span class="sidebar-title">Smart Bee House</span>
          
        </div>

        <div class="sidebar-profile">
          <div class="profile-avatar">
            <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 00-10 10 10 10 0 0020 0A10 10 0 0012 2zm0 4a4 4 0 110 8 4 4 0 010-8zm0 12a6 6 0 00-6 6h12a6 6 0 00-6-6z"/>
            </svg>
          </div>
          <div class="profile-info">
            <span class="profile-name">Fermier</span>
            <span class="profile-role">Beekeeper</span>
          </div>
        </div>

        <div class="sidebar-divider"></div>

        <ul class="nav">
          <li>
            <a class="nav-item" routerLink="/fermier/dashboard" routerLinkActive="active">
              <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
              <span class="nav-text">Dashboard</span>
            </a>
          </li>
          <li>
            <a class="nav-item" routerLink="/fermier/list" routerLinkActive="active">
              <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
              </svg>
              <span class="nav-text">Mes Fermes</span>
            </a>
          </li>
          <li>
            <a class="nav-item" routerLink="/fermier/ruches" routerLinkActive="active">
              <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
              <span class="nav-text">Mes Ruches</span>
            </a>
          </li>
          <li>
            <a class="nav-item" routerLink="/fermier/sites" routerLinkActive="active">
              <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span class="nav-text">Mes Sites</span>
            </a>
          </li>
          <li>
            <a class="nav-item" routerLink="/fermier/productionCol" routerLinkActive="active">
              <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/>
              </svg>
              <span class="nav-text">Production</span>
            </a>
          </li>
          <li>
            <a class="nav-item" routerLink="/fermier/desicion" routerLinkActive="active">
              <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/>
              </svg>
              <span class="nav-text">Décisions</span>
            </a>
          </li>
        </ul>

        <div class="sidebar-divider"></div>

        <div class="sidebar-footer">
          <button class="nav-item logout-btn" (click)="logout()">
            <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            <span class="nav-text">Déconnexion</span>
          </button>
          <div class="version">v1.0.0</div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="main-content" [ngClass]="{'expanded': sidebarCollapsed}">
        <header class="header">
          <button class="menu-toggle" (click)="toggleSidebar()">
            <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>
          <div class="header-title">
            <ng-content select="[headerTitle]"></ng-content>
          </div>
          <div class="header-actions">
            <ng-content select="[headerActions]"></ng-content>
          </div>
        </header>

        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    /* Import Roboto font */
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

    /* CSS Variables */
    :root {
      --primary-bg: #12161c;
      --card-bg: #1a1f26;
      --sidebar-bg: #161b22;
      --accent-gold: #ffd700;
      --accent-gold-dim: #cca300;
      --text-primary: #e0e0e0;
      --text-secondary: #a0a8b0;
      --alert-red: #ff4d4d;
      --alert-yellow: #ffaa00;
      --shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
      --transition: all 0.3s ease;
    }

    /* Reset and Base Styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Roboto', sans-serif;
      color: var(--text-primary);
    }

    /* Dashboard Container */
    .dashboard {
      display: flex;
      min-height: 100vh;
      position: relative;
      background: var(--primary-bg);
    }

    /* Honeycomb Background */
    .honeycomb-bg {
      position: absolute;
      inset: 0;
      background: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"%3E%3Cpath fill="%23ffd700" fill-opacity="0.1" d="M30 0C26.4 0 22.8 2.3 20.6 6.7L10.6 26.7C8.4 31.1 10.6 36.4 15 38.6L35 48.6C39.4 50.75 44.7 48.54 46.9 42.2L56.9 24.2C59.1 19.8 44.7 6.8 40 12.3L35 2.24C34 1.1 32.7 0 30 0z"/%3E%3C/svg%3E');
      background-size: 50px;
      opacity: 0.15;
      z-index: -1;
    }

    /* Sidebar */
    .sidebar {
      width: 260px;
      background: linear-gradient(180deg, var(--sidebar-bg), #0f141a);
      padding: 2rem 1.5rem;
      position: fixed;
      height: 100%;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      transition: var(--transition);
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
    }

    .sidebar.collapsed {
      width: 80px;
      padding: 2rem 1rem;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .bee-logo {
      color: var(--accent-gold);
      filter: drop-shadow(0 0 4px var(--accent-gold));
      transition: var(--transition);
    }

    .bee-logo:hover {
      filter: drop-shadow(0 0 8px var(--accent-gold));
      transform: scale(1.1);
    }

    .sidebar-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--accent-gold);
    }

    .sidebar.collapsed .sidebar-title {
      display: none;
    }

    .sidebar-toggle {
      background: var(--accent-gold);
      color: var(--primary-bg);
      border: none;
      padding: 0.5rem;
      border-radius: 6px;
      font-size: 1.2rem;
      transition: var(--transition);
      cursor: pointer;
    }

    .sidebar-toggle:hover {
      background: var(--accent-gold-dim);
    }

    .sidebar.collapsed .sidebar-toggle {
      width: 100%;
    }

    .sidebar-profile {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: rgba(255, 215, 0, 0.1);
      border-radius: 8px;
      margin-bottom: 1.5rem;
      transition: var(--transition);
    }

    .sidebar.collapsed .sidebar-profile {
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.5rem;
    }

    .profile-avatar {
      font-size: 2rem;
      color: var(--accent-gold);
      background: var(--primary-bg);
      border-radius: 50%;
      padding: 0.5rem;
    }

    .sidebar.collapsed .profile-avatar {
      font-size: 1.5rem;
    }

    .profile-info {
      display: flex;
      flex-direction: column;
    }

    .profile-name {
      font-size: 1rem;
      font-weight: 600;
    }

    .profile-role {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .sidebar.collapsed .profile-info {
      display: none;
    }

    .sidebar-divider {
      height: 1px;
      background: var(--accent-gold);
      opacity: 0.2;
      margin: 1.5rem 0;
    }

    .nav {
      list-style: none;
      flex: 1;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      text-decoration: none;
      font-size: 1rem;
      border-radius: 6px;
      cursor: pointer;
      transition: var(--transition);
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    .nav-item:hover,
    .nav-item.active {
      background: rgba(255, 215, 0, 0.2);
      color: var(--accent-gold);
      transform: translateX(4px);
    }

    .nav-item .icon {
      margin-right: 1rem;
      width: 24px;
      height: 24px;
    }

    .sidebar.collapsed .nav-item span {
      display: none;
    }

    .sidebar.collapsed .nav-item {
      justify-content: center;
      padding: 0.75rem;
    }

    .sidebar.collapsed .nav-item .icon {
      margin-right: 0;
    }

    .sidebar-footer {
      margin-top: auto;
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.85rem;
    }

    .logout-btn {
      width: 100%;
      margin-bottom: 1rem;
      background: rgba(255, 77, 77, 0.1);
      color: var(--alert-red);
    }

    .logout-btn:hover {
      background: rgba(255, 77, 77, 0.2);
      color: var(--alert-red);
    }

    .version {
      opacity: 0.7;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      padding-left: 260px;
      transition: var(--transition);
    }

    .main-content.expanded {
      padding-left: 80px;
    }

    /* Header */
    .header {
      background: var(--sidebar-bg);
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      position: sticky;
      top: 0;
      z-index: 999;
      box-shadow: var(--shadow);
    }

    .menu-toggle {
      background: none;
      border: none;
      color: var(--text-primary);
      cursor: pointer;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transition: var(--transition);
    }

    .menu-toggle:hover {
      background: rgba(255, 215, 0, 0.1);
      color: var(--accent-gold);
    }

    .header-title {
      flex: 1;
      font-size: 1.5rem;
      font-weight: 500;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    /* Content */
    .content {
      padding: 1.5rem;
      min-height: calc(100vh - 64px);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
      }

      .sidebar.collapsed {
        transform: translateX(0);
        width: 260px;
      }

      .sidebar.collapsed .sidebar-title,
      .sidebar.collapsed .profile-info,
      .sidebar.collapsed .nav-item span {
        display: block;
      }

      .sidebar.collapsed .nav-item {
        justify-content: flex-start;
        padding: 0.75rem 1rem;
      }

      .sidebar.collapsed .nav-item .icon {
        margin-right: 1rem;
      }

      .main-content {
        padding-left: 0;
      }

      .main-content.expanded {
        padding-left: 0;
      }
    }
  `]
})
export class FermierLayoutComponent {
  sidebarCollapsed = false;

  constructor(private router: Router) {}

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/signin']);
  }
} 
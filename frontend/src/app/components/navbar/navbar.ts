import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent implements OnInit {
  private router = inject(Router);

  showProjectsLink: boolean = false;

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.showProjectsLink = this.router.url.startsWith('/projects/');
    });
  }
}

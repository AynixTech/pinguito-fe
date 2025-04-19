import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header-layout.component.html',
  styleUrls: ['./header-layout.component.scss'],
})
export class HeaderLayoutComponent implements OnInit {

  userName = 'Jordan';
  userFullName = 'Jordan Avila';
  userEmail = 'jordan@gmail.com';

  ngOnInit(): void {
  }

}

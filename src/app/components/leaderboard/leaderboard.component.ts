import { Component, OnInit } from '@angular/core';
import { ExperienceService, LeaderboardUser } from '../../services/experience.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  users: LeaderboardUser[] = [];
  isLoading: boolean = true;
  isVisible: boolean = false;

  private readonly visibilityKey = 'leaderboard-visibility';

  constructor(private experienceService: ExperienceService) { }

  ngOnInit(): void {
    const savedVisibility = localStorage.getItem(this.visibilityKey);
    if (savedVisibility !== null) {
      this.isVisible = savedVisibility === 'true';
    }

    this.loadLeaderboard();
  }

  toggleVisibility(): void {
    this.isVisible = !this.isVisible;
    localStorage.setItem(this.visibilityKey, this.isVisible.toString());
  }

  loadLeaderboard() {
    this.experienceService.getLeaderboard().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        // Gestione dell'errore
      }
    });
  }
}

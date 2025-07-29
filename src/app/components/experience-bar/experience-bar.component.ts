import { Component, Input, OnChanges } from '@angular/core';
import { ExperienceResponse, ExperienceService } from '../../services/experience.service';
import { AuthStoreService } from '../../services/auth-store.service';
import { User } from '../../services/user.service';
import { ExperienceStateService } from '../../services/experience-state.service';

@Component({
  selector: 'app-experience-bar',
  templateUrl: './experience-bar.component.html',
  styleUrls: ['./experience-bar.component.scss']
})
export class ExperienceBarComponent implements OnChanges {
  @Input() response: ExperienceResponse | null = null;

  currentXp: number = 0;
  currentLevel: number = 1;
  nextLevelXp: number = 0;
  xpProgressPercent: number = 0;
  xpToNextLevel: number = 0;
  levelUp: boolean = false;

  constructor(private expService: ExperienceService, private experienceStateService: ExperienceStateService, private authStore: AuthStoreService) { }
  currentUser: User | null = null;
  ngOnInit() {
    this.authStore.user$.subscribe((user: User | null) => {
      if (user && user.uuid !== this.currentUser?.uuid) {
        this.currentUser = user;
        this.expService.getExperienceByUserUuid(user.uuid).subscribe({
          next: (response) => { 
            this.experienceStateService.setExperience(response);
            this.response = response;
          },
          error: () => this.response = null,
        });
      }
    });
  }


  ngOnChanges(): void {
    if (this.response) {
      console.log('ExperienceBarComponent response:', this.response);
      this.currentXp = this.response.totalXp;
      this.currentLevel = this.response.newLevel;
      this.levelUp = this.response?.levelUp ?? false;

      const currentLevelXp = this.xpForLevel(this.currentLevel);
      this.nextLevelXp = this.response.nextLevelXp;
      this.xpToNextLevel = this.nextLevelXp - this.currentXp;

      const xpRange = this.nextLevelXp - currentLevelXp;
      this.xpProgressPercent = (this.currentXp * 100) / this.nextLevelXp;
      console.log('xpProgressPercent XP:', this.xpProgressPercent);
      console.log('xpToNextLevel:', this.xpToNextLevel);
      console.log('currentLevelXp:', currentLevelXp);
      console.log('nextLevelXp:', this.nextLevelXp);
    }
  }

  xpForLevel(level: number): number {
    return Math.floor(100 * level * 1.5); // stessa formula usata nel backend
  }
}

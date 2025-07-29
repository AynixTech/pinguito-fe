import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ExperienceResponse } from '../../services/experience.service';

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['response'] && this.response) {
      this.updateExperienceBar();
    }
  }

  private updateExperienceBar(): void {
    console.log('ExperienceBarComponent response:', this.response);

    this.currentXp = this.response?.totalXp ?? 0;
    this.currentLevel = this.response?.newLevel ?? 1;
    this.levelUp = this.response?.levelUp ?? false;

    const currentLevelXp = this.xpForLevel(this.currentLevel);
    this.nextLevelXp = this.response?.nextLevelXp ?? this.xpForLevel(this.currentLevel + 1);
    this.xpToNextLevel = this.nextLevelXp - this.currentXp;

    const xpRange = this.nextLevelXp - currentLevelXp;

    this.xpProgressPercent = xpRange > 0
      ? ((this.currentXp - currentLevelXp) * 100) / xpRange
      : 0;

    // Debug
    console.log('XP progress %:', this.xpProgressPercent);
  }

  xpForLevel(level: number): number {
    return Math.floor(100 * level * 1.5); // stessa formula del backend
  }
}

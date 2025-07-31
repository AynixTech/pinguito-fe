import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ExperienceResponse } from '@services/experience.service';

@Component({
  selector: 'app-experience-bar',
  templateUrl: './experience-bar.component.html',
  styleUrls: ['./experience-bar.component.scss']
})
export class ExperienceBarComponent implements OnInit, OnChanges {
  @Input() response: ExperienceResponse | null = null;

  currentXp: number = 0;
  currentLevel: number = 1;
  nextLevelXp: number = 0;
  xpProgressPercent: number = 0;
  xpToNextLevel: number = 0;
  levelUp: boolean = false;

  isVisible: boolean = false;
  private readonly visibilityKey = 'experience-bar-visibility';
  private levelUpTimeoutId: any;

  ngOnInit(): void {
    const savedVisibility = localStorage.getItem(this.visibilityKey);
    if (savedVisibility !== null) {
      this.isVisible = savedVisibility === 'true';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['response'] && this.response) {
      this.updateExperienceBar();

      if (this.levelUp) {
        clearTimeout(this.levelUpTimeoutId);
        this.levelUpTimeoutId = setTimeout(() => {
          this.levelUp = false;
        }, 10000);
      }
    }
  }

  toggleVisibility(): void {
    this.isVisible = !this.isVisible;
    localStorage.setItem(this.visibilityKey, this.isVisible.toString());
  }

  private updateExperienceBar(): void {
    this.currentXp = this.response?.totalXp ?? 0;
    this.currentLevel = this.getLevelFromXp(this.currentXp);
    this.levelUp = this.response?.levelUp ?? false;

    const currentLevelXp = this.xpForLevel(this.currentLevel);
    const nextLevelXp = this.xpForLevel(this.currentLevel + 1);

    this.nextLevelXp = nextLevelXp;
    this.xpToNextLevel = nextLevelXp - this.currentXp;

    const xpRange = nextLevelXp - currentLevelXp;

    this.xpProgressPercent = xpRange > 0
      ? ((this.currentXp - currentLevelXp) * 100) / xpRange
      : 0;
  }

  getLevelFromXp(xp: number): number {
    let level = 1;
    while (xp >= this.xpForLevel(level + 1)) {
      level++;
    }
    return level;
  }

  xpForLevel(level: number): number {
    return Math.floor(100 * Math.pow(level - 1, 1.5));
  }
}

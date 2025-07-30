import { Component, OnInit } from '@angular/core';
import { User, UserService } from '../../../../services/user.service';
import { AuthStoreService } from '../../../../services/auth-store.service';
import { Company } from '../../../../services/company.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  user!: User;
  companies: Company[] = []; // Assuming companies is an array of objects
  loading = true;

  // Avatar Modal Handling
  showAvatarModal = false;
  selectedAvatar: string = '';
  availableAvatars: string[] = [
    'penguin_default', 'penguin_girl', 'penguin_rapper', 'penguin_programmer', 'penguin_business', 'penguin_hero',
    'penguin_robot','penguin_jedi','penguin_gandalf','penguin_onepiece','penguin_zombie'
  ]; // aggiungi gli avatar disponibili

  constructor(
    private userService: UserService,
    private authStoreService: AuthStoreService
  ) { }

  ngOnInit(): void {
    this.authStoreService.user$.subscribe((currentUser: any) => {
      if (currentUser?.uuid) {
        this.userService.getMyProfile(currentUser.uuid).subscribe({
          next: (profile: User) => {
            this.user = profile;
            this.companies= this.user.companies || [];
            this.loading = false;
          },
          error: (err) => {
            console.error('Errore nel recupero del profilo:', err);
            this.loading = false;
          }
        });
      }
    });
  }

  get fullName(): string {
    return `${this.user?.name || ''} ${this.user?.surname || ''}`;
  }

  openAvatarModal(): void {
    this.selectedAvatar = this.user.avatar || 'penguin_default';
    this.showAvatarModal = true;
  }

  closeAvatarModal(): void {
    this.showAvatarModal = false;
  }

  selectAvatar(avatar: string): void {
    this.selectedAvatar = avatar;
  }

  saveAvatar(): void {
    if (!this.selectedAvatar || this.selectedAvatar === this.user.avatar) {
      this.closeAvatarModal();
      return;
    }

    this.userService.updateAvatar(this.user.uuid, this.selectedAvatar).subscribe({
      next: (response) => {
        this.user.avatar = this.selectedAvatar;
        console.log('Avatar aggiornato con successo:', response);
        this.authStoreService.setUser(response); // Aggiorna lo store dell'utente
        this.closeAvatarModal();
      },
      error: (err) => {
        console.error('Errore durante l\'aggiornamento dell\'avatar:', err);
      }
    });
  }
}

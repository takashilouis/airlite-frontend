import { Component, OnInit, inject} from '@angular/core';
import { ButtonModule} from 'primeng/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MenuModule} from "primeng/menu";
import { ToolbarModule } from 'primeng/toolbar';
import { DialogService } from 'primeng/dynamicdialog';
import { CategoryComponent } from './category/category.component';
import { AvatarComponent } from './avatar/avatar.component';
import { MenuItem } from 'primeng/api';
import { ToastService } from '../toast.service';
import { MessageService} from "primeng/api";
import { AuthService } from '../../core/auth/auth.service';
import { effect } from '@angular/core';
import { User } from '../../core/model/user.model';
import { State } from '../../core/model/state.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ButtonModule,FontAwesomeModule,ToolbarModule, MenuModule,CategoryComponent,AvatarComponent],
  providers: [DialogService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent implements OnInit {
  location = "Anywhere";
  guests = "Add guests";
  dates = "Any weeks";
  connectedUser: User | undefined;

  login() { 
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  currentMenuItems: MenuItem[] | undefined = [];
  toastService = inject(ToastService);
  authService = inject(AuthService);
  
  constructor() {
    effect(() => {
      const userState = this.authService.fetchUser()();
      if(userState.status === 'OK' && userState.value) {
        this.connectedUser = userState.value;
        this.currentMenuItems = this.fetchMenu();
      }
    })
  }
  
  ngOnInit(): void{
    //this.currentMenuItems = this.fetchMenu();
    this.authService.fetch(false);
    //this.toastService.send({severity: "info", summary: "Welcome to Airbnb"});
  }

  private fetchMenu():MenuItem[]{
    if(this.authService.isAuthenticated()){
      return [
        {
          label: "My properties",
          routerLink: "landlord/properties",
          visible: this.hasToBeLandlord()
        },
        {
          label: "My booking",
          routerLink: "booking"
        },
        { 
          label: "My reservation",
          routerLink: "reservation",
          visible: this.hasToBeLandlord()
        },
        {
          label: "Log out",
          command: () => this.logout()
        } 
      ]
    } else {
     return [
      { 
        label: "Sign up",
        styleClass: "font-bold",
        command: () => this.login()
      },
      {
        label: "Log in",
        command: () => this.login()
      }
     ]
    }
  }

  hasToBeLandlord(): boolean{
    return this.authService.hasAnyAuthority(["ROLE_LANDLORD"]);
  }
}

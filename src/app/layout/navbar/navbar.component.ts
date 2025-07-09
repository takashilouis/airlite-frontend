import { Component, OnInit, inject, effect} from '@angular/core';
import { ButtonModule} from 'primeng/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MenuModule} from "primeng/menu";
import { ToolbarModule } from 'primeng/toolbar';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CategoryComponent } from './category/category.component';
import { AvatarComponent } from './avatar/avatar.component';
import { MenuItem } from 'primeng/api';
import { ToastService } from '../toast.service';
import { MessageService} from "primeng/api";
import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../core/model/user.model';
import { State } from '../../core/model/state.model';
import {PropertiesCreateComponent} from "../../landlord/properties-create/properties-create.component";

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
  //onnectedUser: User | undefined;

  login() { 
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  currentMenuItems: MenuItem[] | undefined = [];
  
  toastService = inject(ToastService);
  authService = inject(AuthService);
  dialogService = inject(DialogService);
  ref: DynamicDialogRef | undefined;

  public connectedUser: User = {email: this.authService.notConnected};
  constructor() {
    effect(() => {
      const userState = this.authService.fetchUser()();
      if(userState.status === "OK") {
        this.connectedUser = userState.value!;
        this.currentMenuItems = this.fetchMenu();
      }
    });
  }
  
  ngOnInit(): void{
    // Debug authentication state
    console.log('Initial auth state:', {
      isAuthenticated: this.authService.isAuthenticated(),
      currentUser: this.authService.fetchUser()(),
      connectedUser: this.connectedUser
    });
    
    // Force a sync to ensure we have the latest data
    this.authService.fetch(false);
    
    // Check the menu that's being shown
    console.log('Initial menu:', this.fetchMenu());
  }

  private fetchMenu():MenuItem[]{
    const isAuth = this.authService.isAuthenticated();
    console.log("Authentication check:", {
      isAuthenticated: isAuth,
      userState: this.authService.fetchUser()(),
      userEmail: this.authService.fetchUser()().value?.email,
      notConnected: this.authService.notConnected
    });
    
    if(isAuth){
      console.log("User is authenticated, showing authenticated menu");
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
      console.log("iNotsAuthenticated");
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

  openNewListing(): void{
    this.ref = this.dialogService.open(PropertiesCreateComponent,
     { 
        width:"60%",
        header: "Airbnb your home",
        closable: true,
        focusOnShow: true,
        modal: true,
        showHeader: true
     })
  }
}

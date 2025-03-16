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

  //login() => this.authService.login();
  currentMenuItems: MenuItem[] | undefined = [];
  toastService = inject(ToastService);
  
  ngOnInit(): void{
    this.currentMenuItems = this.fetchMenu();
    this.toastService.send({severity: "info", summary: "Welcome to Airbnb"});
  }

  private fetchMenu():MenuItem[]{
     return [
      { 
        label: "Sign up",
        styleClass: "font-bold"
      },
      {
        label: "Log in"
      }
     ]
  }
}

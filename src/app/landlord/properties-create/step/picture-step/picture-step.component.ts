import {Component, EventEmitter, input, Output} from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {NewListingPicture} from "../../../model/picture.model";

@Component({
  selector: 'app-picture-step',
  standalone: true,
  imports: [FontAwesomeModule, InputTextModule, ButtonModule],
  templateUrl: './picture-step.component.html',
  styleUrl: './picture-step.component.scss'
})
export class PictureStepComponent {

  pictures = input.required<Array<NewListingPicture>>();

  @Output()
  picturesChange = new EventEmitter<Array<NewListingPicture>>();

  @Output()
  stepValidityChange = new EventEmitter<boolean>();

  extractFileFromTarget(target: EventTarget | null) {
    const htmlInputTarget = target as HTMLInputElement;
    if (target === null || htmlInputTarget.files === null) {
      return null;
    }
    return htmlInputTarget.files;
  }

  onUploadNewPicture(target: EventTarget | null) {
    console.log('Upload new picture triggered');
    const picturesFileList = this.extractFileFromTarget(target);
    console.log('Pictures file list:', picturesFileList);
    
    if(picturesFileList !== null) {
      const newPictures = [...this.pictures()]; // Create a copy of the array
      console.log('Current pictures count:', newPictures.length);
      
      for(let i = 0 ; i < picturesFileList.length; i++) {
        const picture = picturesFileList.item(i);
        if (picture !== null) {
          const displayPicture: NewListingPicture = {
            file: picture,
            urlDisplay: URL.createObjectURL(picture)
          }
          console.log('Created display picture:', displayPicture);
          //newPictures.push(displayPicture);
          this.pictures().push(displayPicture)  
        }
      }
      
      console.log('New pictures array:', newPictures);
      //this.picturesChange.emit(newPictures); // Emit the new array
      this.picturesChange.emit(this.pictures())
      this.validatePictures();
    }
  }

  private validatePictures() {
    if (this.pictures().length >= 5) {
      this.stepValidityChange.emit(true);
    } else {
      this.stepValidityChange.emit(false);
    }
  }

  onTrashPicture(pictureToDelete: NewListingPicture) {
    //const newPictures = this.pictures().filter(picture => picture.file.name !== pictureToDelete.file.name);
    //this.picturesChange.emit(newPictures);
    const indexToDelete = this.pictures().findIndex(picture => picture.file.name === pictureToDelete.file.name);
    this.pictures().splice(indexToDelete, 1);

    this.validatePictures();
  }
}
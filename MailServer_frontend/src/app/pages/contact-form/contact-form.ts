import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule
  ],
  templateUrl: './contact-form.html'
})
export class ContactFormComponent implements OnInit {
  contactForm: FormGroup;
  isEditMode = false;
  contactId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      phoneNumber: ['', [Validators.pattern(/^\d+$/)]], // Digits only
      notes: [''],
      starred: [false],
      
      emailAddresses: this.fb.array([
        this.fb.control('', [Validators.required, Validators.email])
      ])
    });
  }

  ngOnInit(): void {
    
    this.contactId = this.route.snapshot.paramMap.get('id');
    if (this.contactId) {
      this.isEditMode = true;
      this.loadContactData(this.contactId);
    }
  }

  
  get emailControls() {
    return (this.contactForm.get('emailAddresses') as FormArray).controls;
  }

  addEmailField() {
    (this.contactForm.get('emailAddresses') as FormArray).push(
      this.fb.control('', [Validators.required, Validators.email])
    );
  }

  removeEmailField(index: number) {
    (this.contactForm.get('emailAddresses') as FormArray).removeAt(index);
  }

  loadContactData(id: string) {
    
    // this.contactService.getById(id).subscribe(data => ...)
  }

  onSubmit() {
    if (this.contactForm.invalid) return;

    const formValue = this.contactForm.value;
    
    
    if (this.isEditMode) {
        console.log('Updating...', formValue);
    } else {
        console.log('Creating...', formValue);
    }
    
    
    this.router.navigate(['/contacts']);
  }
}
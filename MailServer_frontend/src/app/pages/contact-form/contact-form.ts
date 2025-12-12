import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; 
import { ContactService } from '../../services/contact.services'; 
import { ContactDto } from '../../Dtos/ContactDto';

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
    private router: Router,
    private contactService: ContactService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      phoneNumber: ['', [Validators.pattern(/^\d+$/)]],
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
    
    this.contactService.getContacts().subscribe({
        next: (contacts : any ) => {
            const contact = contacts.find( (c : any )  => c.contactId === id);
            if (contact) {
                this.patchForm(contact);
            }
        },
        error: (err : any ) => console.error('Failed to load contact', err)
    });
  }

  
  patchForm(contact: ContactDto) {
    this.contactForm.patchValue({
        name: contact.name,
        phoneNumber: contact.phoneNumber,
        notes: contact.notes,
        starred: contact.starred
    });

    
    const emailArray = this.contactForm.get('emailAddresses') as FormArray;
    emailArray.clear();
    contact.emailAddresses.forEach(email => {
        emailArray.push(this.fb.control(email, [Validators.required, Validators.email]));
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) return;

    const formValue: ContactDto = this.contactForm.value;

    if (this.isEditMode && this.contactId) {
        
        this.contactService.editContact(this.contactId, formValue).subscribe({
            next: () => {
                console.log('Contact Updated');
                this.router.navigate(['/contacts']);
            },
            error: (err : any ) => console.error('Update failed', err)
        });
    } else {
        
        this.contactService.createContact(formValue).subscribe({
            next: () => {
                console.log('Contact Created');
                this.router.navigate(['/contacts']);
            },
            error: (err : any ) => console.error('Creation failed', err)
        });
    }
  }
}
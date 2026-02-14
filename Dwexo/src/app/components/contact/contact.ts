import { Component, inject, OnInit } from '@angular/core';
import { Contacti } from '../../interfaces/contact';
import { Contactservices } from '../../services/contact';
import { JsonPipe } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  imports: [JsonPipe,RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact implements OnInit {
  readonly contactservice:Contactservices=inject(Contactservices);
tabContacts:Contacti[]=[];
filtredTable:Contacti[]=[];
  ngOnInit(){
    this.contactservice.getContact().subscribe(
    data=>{
      this.tabContacts=data;
      this.filtredTable=data;
    });
}
filterContacts(name:string) {
  const filterValue=name.toLowerCase();
  this.filtredTable=this.tabContacts.filter(contact =>
    contact.name.toLowerCase().includes(filterValue)
  );  
}
deleteContact(linkedinUrl:string,localId:string){
  this.filtredTable=this.filtredTable.filter(contact=>contact.localId!==localId);
  this.contactservice.deleteContact(linkedinUrl).then(()=>{
    console.log('Contact deleted successfully');
  }).catch(err=>{
    console.error('Error deleting contact',err);
  });
}
}
  
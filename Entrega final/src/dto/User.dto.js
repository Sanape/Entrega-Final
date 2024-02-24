export class UserDto {
  constructor(id, firstName, lastName, email, role, urlProfilePhoto) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.role = role;
    this.profilePhoto = urlProfilePhoto;
  }
}

export class User {

    constructor(
      public id: BigInteger,
      public firstname: string,
      public lastname: string,
      public username: string,
      public email: string,
      public password: string,
      public role: string,
      public enabled: boolean,
      public imgProfil: string
    ) {}
    
}
  
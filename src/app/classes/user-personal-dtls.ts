export class UserPersonalDtls {
    fullname : string;
    dateOfBirth: Date;
    email: string;
    address: string;
    country: string;
    state: string;
    city: string;
    pinCode: string;
    countryCode: string;
    phoneNum: string;
    profileImgFileId : string;
    profileImgFileName : string;

    constructor(nam: string, dob: Date, ml: string, add:string, cntry: string, st:string, cty: string, pin: string,
        mobCntry: string, phNum: string)
    {
        this.fullname = nam;
        this.dateOfBirth = dob;
        this.email = ml;
        this.address = add;
        this.country = cntry;
        this.state = st;
        this.city = cty;
        this.pinCode = pin;
        this.country = mobCntry;
        this.phoneNum = phNum;
    }
}


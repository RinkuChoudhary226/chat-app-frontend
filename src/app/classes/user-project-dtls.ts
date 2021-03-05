import { SafeUrl } from "@angular/platform-browser";

export class UserProjectDtls {
    name : string;
    description : string;
    type : string;
    category : string;
    skills : string[];
    start_date : Date;
    end_date : Date;
    relatedPDF : SafeUrl;
    url : SafeUrl;
    github_repo : SafeUrl;
    constructor(name : string, description : string, type : string, category : string, skills : string[], start_date : Date, end_date : Date,
        relatedPDF : SafeUrl, url : SafeUrl, github_repo : SafeUrl){
            this.name = name;
            this.description = description;
            this.type = type;
            this.category = category;
            this.skills = skills;
            this.start_date = start_date;
            this.end_date = end_date;
            this.relatedPDF = relatedPDF;
            this.url = url;
            this.github_repo = github_repo;
        }
}

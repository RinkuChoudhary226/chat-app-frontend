export class UserProfDtls {
    jobTitle: string;
    organization: string;
    totalExperience: number;
    jobDescription: string;
    languagesArr: string[] = [];
    // langKnown1: string;
    // langKnown2: string;
    skillsArr: string[] = [];
    // skills1: string;
    // skills2 : string;
    industryWork: string[] = [];
    jobRefNeeded: boolean;
    interestTopics: string[] = [];
    starRating: number;

    constructor(jobTit: string, org: string, totalExp: number, jobDesc: string, langs: string[], 
        skills: string[], indWorkIn: string[], jobRef: boolean )
    {
        this.jobTitle = jobTit;
        this.organization = org;
        this.totalExperience = totalExp;
        this.jobDescription = jobDesc;
        this.languagesArr = langs;
        this.skillsArr = skills;
        this.industryWork = indWorkIn;
        this.jobRefNeeded = jobRef;
    }
}

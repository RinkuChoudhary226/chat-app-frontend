import { SafeUrl } from '@angular/platform-browser';

export class Project {
    projectTitle: string;
    projectDescription: string;
    level: string; //project complexity
    // accountType: string;
    prerequisites: [];
    projectStartDate: string;
    projectEndDate: string;
    category : string;
    languages : string [] = [];
    projectDocuments : SafeUrl;
    projectDemoLink : SafeUrl;
    projectRepo : SafeUrl;

    constructor(projectTitle: string, projectDescription:string, level: string, prerequisites: [], projectStartDate: string, projectEndDate: string,
        category : string,
        languages :  [],
        projectDocuments : SafeUrl,
        projectDemoLink : SafeUrl,
        projectRepo : SafeUrl  )
    {
        this.projectTitle = projectTitle;
        this.projectDescription = projectDescription;
        this.level = level;
        this.projectStartDate = projectStartDate;
        this.prerequisites = prerequisites;
        this.projectEndDate = projectEndDate;
        this.category = category;
        this.languages = languages;
        this.projectDocuments = projectDocuments;
        this.projectDemoLink = projectDemoLink;
        this.projectRepo = projectRepo;
    }
}

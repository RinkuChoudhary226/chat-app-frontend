import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable} from 'rxjs';
import { Project } from '../classes/project';


@Injectable({
    providedIn: 'root'
})
export class ProjectDataService {
    private projectsDataSource = new BehaviorSubject(new Project("", "", "", [], "", "", "", [], "", "", ""))
}
